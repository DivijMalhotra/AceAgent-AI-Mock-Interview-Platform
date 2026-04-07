"""
ACIE Backend — Integrity Scoring Engine.
Computes a composite integrity score from multiple behavioural signals
and generates real-time alerts for suspicious activity.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any

from app.core.logging import logger


@dataclass
class IntegrityConfig:
    """Configurable thresholds for integrity scoring."""
    # Gaze
    gaze_deviation_threshold: float = 0.6
    looking_away_seconds: float = 2.0

    # Blink
    blink_rate_high: float = 40.0
    blink_rate_low: float = 5.0

    # Multi-face
    max_multi_face_violations: int = 3

    # Calibration
    calibration_frames: int = 20  # ~5 seconds at 4 FPS

    # Scoring weights
    eye_contact_weight: float = 0.35
    gaze_stability_weight: float = 0.30
    face_count_weight: float = 0.25
    blink_score_weight: float = 0.10

    # Smoothing
    score_smoothing_alpha: float = 0.25


class IntegrityEngine:
    """
    Per-session integrity scoring engine.
    Maintains state for calibration, violation tracking, and temporal smoothing.
    """

    def __init__(self, config: IntegrityConfig | None = None):
        self._config = config or IntegrityConfig()

        # ── Calibration state ──
        self._calibration_frames_collected = 0
        self._calibration_gaze_sum = 0.0
        self._calibration_blink_sum = 0.0
        self._calibrated = False
        self._baseline_gaze = 0.15  # default before calibration
        self._baseline_blink = 15.0

        # ── Effective thresholds (adjusted after calibration) ──
        self._eff_gaze_threshold = self._config.gaze_deviation_threshold
        self._eff_blink_high = self._config.blink_rate_high
        self._eff_blink_low = self._config.blink_rate_low

        # ── Violation tracking ──
        self._multi_face_violation_count = 0
        self._looking_away_start: float | None = None

        # ── Score smoothing ──
        self._smoothed_score = 1.0

        # ── Alert history (for persistence) ──
        self._alert_history: list[dict] = []

        # ── No-face decay ──
        self._no_face_streak = 0

    def calculate_score(self, metrics: dict) -> dict:
        """
        Compute composite integrity score from face analysis metrics.

        Args:
            metrics: Dict from VideoProcessor containing face_analyzer output
                     and derived_scores.

        Returns:
            Dict with integrity_score, alerts, breakdown, violation_count,
            should_terminate, calibrated.
        """
        try:
            face_detected = metrics.get("face_detected", False)
            face_count = metrics.get("face_count", 0)
            gaze_deviation = metrics.get("gaze_deviation", 0.0)
            gaze_direction = metrics.get("gaze_direction", "center")
            eye_contact = metrics.get("derived_scores", {}).get("eye_contact", 0.0)
            blink_rate = metrics.get("blink_rate", 15.0)
            is_blinking = metrics.get("is_blinking", False)

            alerts: list[str] = []

            # ── Handle calibration phase ──
            if not self._calibrated:
                return self._handle_calibration(metrics)

            # ── NO FACE ──
            if not face_detected or face_count == 0:
                self._no_face_streak += 1
                alerts.append("NO_FACE")
                # Decay score by 2% per frame
                decay = max(0.0, self._smoothed_score - 0.02)
                self._smoothed_score = decay
                result = self._build_result(alerts, face_count)
                self._record_alerts(alerts)
                return result

            self._no_face_streak = 0

            # ── MULTI-FACE DETECTION ──
            face_count_score = 1.0
            if face_count > 1:
                alerts.append("MULTI_FACE")
                face_count_score = 0.0
                self._multi_face_violation_count += 1

            # ── LOOKING AWAY detection (sustained gaze deviation) ──
            gaze_stability_score = max(0.0, 1.0 - (gaze_deviation / self._eff_gaze_threshold))
            gaze_stability_score = max(0.0, min(1.0, gaze_stability_score))

            if gaze_deviation > self._eff_gaze_threshold:
                if self._looking_away_start is None:
                    self._looking_away_start = time.monotonic()
                elif (time.monotonic() - self._looking_away_start) > self._config.looking_away_seconds:
                    alerts.append("LOOKING_AWAY")
            else:
                self._looking_away_start = None

            # ── BLINK ANOMALIES ──
            blink_score = 1.0
            if blink_rate > self._eff_blink_high:
                blink_score = max(0.0, 1.0 - ((blink_rate - self._eff_blink_high) / 30.0))
                alerts.append("EXCESSIVE_BLINKING")
            elif blink_rate < self._eff_blink_low:
                blink_score = max(0.0, blink_rate / self._eff_blink_low)
                alerts.append("EXCESSIVE_BLINKING")

            # ── EYE CONTACT score (from head-pose, already computed) ──
            eye_contact_score = max(0.0, min(1.0, eye_contact))

            # ── COMPOSITE SCORE ──
            cfg = self._config
            raw_score = (
                eye_contact_score * cfg.eye_contact_weight
                + gaze_stability_score * cfg.gaze_stability_weight
                + face_count_score * cfg.face_count_weight
                + blink_score * cfg.blink_score_weight
            )
            raw_score = max(0.0, min(1.0, raw_score))

            # Temporal smoothing on the final score
            alpha = cfg.score_smoothing_alpha
            self._smoothed_score = alpha * raw_score + (1.0 - alpha) * self._smoothed_score

            # Build result
            result = {
                "score": round(self._smoothed_score, 3),
                "alerts": alerts,
                "breakdown": {
                    "eye_contact": round(eye_contact_score, 3),
                    "gaze_stability": round(gaze_stability_score, 3),
                    "face_count_score": round(face_count_score, 3),
                    "blink_score": round(blink_score, 3),
                },
                "violation_count": self._multi_face_violation_count,
                "should_terminate": (
                    self._multi_face_violation_count >= self._config.max_multi_face_violations
                ),
                "calibrated": True,
            }

            self._record_alerts(alerts)
            return result

        except Exception as e:
            logger.error("IntegrityEngine.calculate_score error: %s", e)
            return self._safe_result()

    # ──────────────────────────────────────────────
    #  CALIBRATION
    # ──────────────────────────────────────────────

    def _handle_calibration(self, metrics: dict) -> dict:
        """
        Collect baseline metrics during calibration phase.
        After enough frames, compute effective thresholds.
        """
        face_detected = metrics.get("face_detected", False)

        if not face_detected:
            # Don't count frames without a face during calibration
            return {
                "score": 1.0,
                "alerts": [],
                "breakdown": {
                    "eye_contact": 1.0,
                    "gaze_stability": 1.0,
                    "face_count_score": 1.0,
                    "blink_score": 1.0,
                },
                "violation_count": 0,
                "should_terminate": False,
                "calibrated": False,
            }

        gaze_dev = metrics.get("gaze_deviation", 0.0)
        blink_rate = metrics.get("blink_rate", 15.0)

        self._calibration_gaze_sum += gaze_dev
        self._calibration_blink_sum += blink_rate
        self._calibration_frames_collected += 1

        if self._calibration_frames_collected >= self._config.calibration_frames:
            self._finalize_calibration()

        return {
            "score": 1.0,
            "alerts": [],
            "breakdown": {
                "eye_contact": 1.0,
                "gaze_stability": 1.0,
                "face_count_score": 1.0,
                "blink_score": 1.0,
            },
            "violation_count": 0,
            "should_terminate": False,
            "calibrated": self._calibrated,
        }

    def _finalize_calibration(self) -> None:
        """Compute personalized thresholds from collected baseline data."""
        n = self._calibration_frames_collected
        self._baseline_gaze = self._calibration_gaze_sum / n
        self._baseline_blink = self._calibration_blink_sum / n

        # Adjust thresholds: at least config defaults, but widen if user
        # naturally has higher baseline gaze deviation
        self._eff_gaze_threshold = max(
            self._config.gaze_deviation_threshold,
            self._baseline_gaze * 2.5,
        )
        self._eff_blink_high = max(
            self._config.blink_rate_high,
            self._baseline_blink * 2.0,
        )
        self._eff_blink_low = min(
            self._config.blink_rate_low,
            self._baseline_blink * 0.3,
        )

        self._calibrated = True
        logger.info(
            "Integrity calibration complete — baseline gaze=%.3f, blink=%.1f, "
            "eff_thresholds: gaze=%.3f, blink_hi=%.1f, blink_lo=%.1f",
            self._baseline_gaze,
            self._baseline_blink,
            self._eff_gaze_threshold,
            self._eff_blink_high,
            self._eff_blink_low,
        )

    # ──────────────────────────────────────────────
    #  HELPERS
    # ──────────────────────────────────────────────

    def _build_result(self, alerts: list[str], face_count: int) -> dict:
        """Build result dict with current smoothed score."""
        return {
            "score": round(self._smoothed_score, 3),
            "alerts": alerts,
            "breakdown": {
                "eye_contact": 0.0,
                "gaze_stability": 0.0,
                "face_count_score": 1.0 if face_count == 1 else 0.0,
                "blink_score": 0.5,
            },
            "violation_count": self._multi_face_violation_count,
            "should_terminate": (
                self._multi_face_violation_count >= self._config.max_multi_face_violations
            ),
            "calibrated": self._calibrated,
        }

    def _safe_result(self) -> dict:
        """Return a non-alarming result on internal errors."""
        return {
            "score": round(self._smoothed_score, 3),
            "alerts": [],
            "breakdown": {
                "eye_contact": 0.5,
                "gaze_stability": 0.5,
                "face_count_score": 1.0,
                "blink_score": 0.5,
            },
            "violation_count": self._multi_face_violation_count,
            "should_terminate": False,
            "calibrated": self._calibrated,
        }

    def _record_alerts(self, alerts: list[str]) -> None:
        """Append triggered alerts to the persistent alert history."""
        if alerts:
            ts = time.time()
            for alert in alerts:
                self._alert_history.append({"alert": alert, "timestamp": ts})

    def get_alert_history(self) -> list[dict]:
        """Return the full alert history for session persistence."""
        return list(self._alert_history)

    def reset(self) -> None:
        """Reset all engine state for a new session."""
        self._calibration_frames_collected = 0
        self._calibration_gaze_sum = 0.0
        self._calibration_blink_sum = 0.0
        self._calibrated = False
        self._multi_face_violation_count = 0
        self._looking_away_start = None
        self._smoothed_score = 1.0
        self._alert_history.clear()
        self._no_face_streak = 0
