"""
ACIE Backend — Face Analysis Module.
Advanced eye tracking, gaze direction analysis, blink detection,
and multi-face monitoring using MediaPipe Face Mesh iris landmarks.
"""
from __future__ import annotations

import time
from collections import deque
from enum import Enum
from typing import Any

import numpy as np

from app.core.logging import logger


class _BlinkState(Enum):
    """State machine for robust blink detection."""
    OPEN = "open"
    CLOSING = "closing"
    CLOSED = "closed"


class FaceAnalyzer:
    """
    Stateful face analyzer maintaining rolling windows for temporal smoothing.
    One instance per session for accurate per-user tracking.
    """

    # ── MediaPipe Face Mesh landmark indices ──
    # Left eye contour
    LEFT_EYE = [33, 160, 158, 133, 153, 144]
    # Right eye contour
    RIGHT_EYE = [362, 385, 387, 263, 380, 373]
    # Left iris (available when refine_landmarks=True)
    LEFT_IRIS = [468, 469, 470, 471, 472]
    # Right iris
    RIGHT_IRIS = [473, 474, 475, 476, 477]
    # Eye corners for gaze ratio computation
    LEFT_EYE_INNER = 133
    LEFT_EYE_OUTER = 33
    RIGHT_EYE_INNER = 362
    RIGHT_EYE_OUTER = 263
    # Upper/lower eyelid midpoints for vertical gaze
    LEFT_EYE_TOP = 159
    LEFT_EYE_BOTTOM = 145
    RIGHT_EYE_TOP = 386
    RIGHT_EYE_BOTTOM = 374

    # ── Thresholds ──
    EAR_BLINK_THRESHOLD = 0.21
    GAZE_LEFT_THRESHOLD = 0.38
    GAZE_RIGHT_THRESHOLD = 0.62
    GAZE_UP_THRESHOLD = 0.35
    GAZE_DOWN_THRESHOLD = 0.65

    def __init__(self, smoothing_alpha: float = 0.3):
        self._alpha = smoothing_alpha

        # Rolling buffers
        self._gaze_deviation_buffer: deque[float] = deque(maxlen=30)
        self._ear_buffer: deque[float] = deque(maxlen=30)
        self._blink_timestamps: deque[float] = deque(maxlen=120)

        # Blink state machine
        self._blink_state = _BlinkState.OPEN
        self._total_blinks = 0
        self._session_start_time = time.monotonic()

        # Smoothed values
        self._smoothed_gaze_deviation = 0.0
        self._smoothed_ear = 0.28
        self._smoothed_blink_rate = 15.0

        # Last known good values (for partial face fallback)
        self._last_gaze_direction = "center"
        self._last_gaze_deviation = 0.0

    def analyze(
        self,
        landmarks: Any,
        frame_shape: tuple,
        face_count: int,
    ) -> dict:
        """
        Analyze face landmarks for gaze direction, blink detection, and
        multi-face violations.

        Args:
            landmarks: MediaPipe face landmarks (single face, the primary one).
            frame_shape: (height, width, channels) of the frame.
            face_count: Total number of faces detected in the frame.

        Returns:
            Dict with gaze_direction, gaze_deviation, eye_aspect_ratio,
            is_blinking, blink_rate, face_count, multi_face_violation.
        """
        try:
            h, w = frame_shape[0], frame_shape[1]

            # ── Iris-based gaze computation ──
            gaze_h_ratio, gaze_v_ratio = self._compute_iris_gaze(landmarks, w, h)
            gaze_direction = self._classify_gaze(gaze_h_ratio, gaze_v_ratio)
            gaze_deviation = self._compute_gaze_deviation(gaze_h_ratio, gaze_v_ratio)

            # ── Eye Aspect Ratio ──
            ear = self._compute_ear(landmarks, w, h)

            # ── Blink detection ──
            is_blinking = self._detect_blink(ear)
            blink_rate = self._compute_blink_rate()

            # ── Temporal smoothing ──
            self._smoothed_gaze_deviation = self._ema(
                self._smoothed_gaze_deviation, gaze_deviation
            )
            self._smoothed_ear = self._ema(self._smoothed_ear, ear)
            self._smoothed_blink_rate = self._ema(
                self._smoothed_blink_rate, blink_rate
            )

            # Store buffers
            self._gaze_deviation_buffer.append(gaze_deviation)
            self._ear_buffer.append(ear)

            # Cache last known good values
            self._last_gaze_direction = gaze_direction
            self._last_gaze_deviation = self._smoothed_gaze_deviation

            return {
                "gaze_direction": gaze_direction,
                "gaze_deviation": round(self._smoothed_gaze_deviation, 3),
                "eye_aspect_ratio": round(self._smoothed_ear, 3),
                "is_blinking": is_blinking,
                "blink_rate": round(self._smoothed_blink_rate, 1),
                "face_count": face_count,
                "multi_face_violation": face_count > 1,
            }

        except Exception as e:
            logger.warning("FaceAnalyzer.analyze error: %s", e)
            return self._fallback_metrics(face_count)

    # ──────────────────────────────────────────────
    #  IRIS GAZE TRACKING
    # ──────────────────────────────────────────────

    def _compute_iris_gaze(
        self, landmarks: Any, w: int, h: int
    ) -> tuple[float, float]:
        """
        Compute horizontal and vertical gaze ratios from iris landmarks.
        Returns (h_ratio, v_ratio) both in [0, 1].
          h_ratio: 0 = looking right, 0.5 = center, 1 = looking left
          v_ratio: 0 = looking up, 0.5 = center, 1 = looking down
        """
        lm = landmarks.landmark

        # ── Left eye iris center ──
        left_iris_x = np.mean([lm[i].x for i in self.LEFT_IRIS]) * w
        left_iris_y = np.mean([lm[i].y for i in self.LEFT_IRIS]) * h

        # ── Right eye iris center ──
        right_iris_x = np.mean([lm[i].x for i in self.RIGHT_IRIS]) * w
        right_iris_y = np.mean([lm[i].y for i in self.RIGHT_IRIS]) * h

        # ── Horizontal gaze ratio (average of both eyes) ──
        # Left eye horizontal
        left_inner_x = lm[self.LEFT_EYE_INNER].x * w
        left_outer_x = lm[self.LEFT_EYE_OUTER].x * w
        left_eye_width = abs(left_inner_x - left_outer_x)
        left_h_ratio = (
            (left_iris_x - min(left_inner_x, left_outer_x)) / left_eye_width
            if left_eye_width > 1
            else 0.5
        )

        # Right eye horizontal
        right_inner_x = lm[self.RIGHT_EYE_INNER].x * w
        right_outer_x = lm[self.RIGHT_EYE_OUTER].x * w
        right_eye_width = abs(right_inner_x - right_outer_x)
        right_h_ratio = (
            (right_iris_x - min(right_inner_x, right_outer_x)) / right_eye_width
            if right_eye_width > 1
            else 0.5
        )

        h_ratio = (left_h_ratio + right_h_ratio) / 2.0
        h_ratio = max(0.0, min(1.0, h_ratio))

        # ── Vertical gaze ratio (average of both eyes) ──
        left_top_y = lm[self.LEFT_EYE_TOP].y * h
        left_bot_y = lm[self.LEFT_EYE_BOTTOM].y * h
        left_eye_height = abs(left_bot_y - left_top_y)
        left_v_ratio = (
            (left_iris_y - min(left_top_y, left_bot_y)) / left_eye_height
            if left_eye_height > 1
            else 0.5
        )

        right_top_y = lm[self.RIGHT_EYE_TOP].y * h
        right_bot_y = lm[self.RIGHT_EYE_BOTTOM].y * h
        right_eye_height = abs(right_bot_y - right_top_y)
        right_v_ratio = (
            (right_iris_y - min(right_top_y, right_bot_y)) / right_eye_height
            if right_eye_height > 1
            else 0.5
        )

        v_ratio = (left_v_ratio + right_v_ratio) / 2.0
        v_ratio = max(0.0, min(1.0, v_ratio))

        return h_ratio, v_ratio

    def _classify_gaze(self, h_ratio: float, v_ratio: float) -> str:
        """Classify gaze direction from horizontal and vertical ratios."""
        # Vertical takes precedence for strong deviations
        if v_ratio < self.GAZE_UP_THRESHOLD:
            return "up"
        if v_ratio > self.GAZE_DOWN_THRESHOLD:
            return "down"
        if h_ratio < self.GAZE_LEFT_THRESHOLD:
            return "right"   # Mirrored: low ratio = looking right in mirrored camera
        if h_ratio > self.GAZE_RIGHT_THRESHOLD:
            return "left"
        return "center"

    def _compute_gaze_deviation(self, h_ratio: float, v_ratio: float) -> float:
        """
        Compute how far the gaze is from center (0.0 = center, 1.0 = extreme).
        Uses Euclidean distance from (0.5, 0.5).
        """
        dx = h_ratio - 0.5
        dy = v_ratio - 0.5
        deviation = min(1.0, (dx ** 2 + dy ** 2) ** 0.5 / 0.5)
        return deviation

    # ──────────────────────────────────────────────
    #  BLINK DETECTION (EAR-based)
    # ──────────────────────────────────────────────

    def _compute_ear(self, landmarks: Any, w: int, h: int) -> float:
        """
        Compute Eye Aspect Ratio (EAR) averaged over both eyes.
        EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
        """
        left_ear = self._single_eye_ear(landmarks, self.LEFT_EYE, w, h)
        right_ear = self._single_eye_ear(landmarks, self.RIGHT_EYE, w, h)
        return (left_ear + right_ear) / 2.0

    def _single_eye_ear(
        self, landmarks: Any, eye_indices: list[int], w: int, h: int
    ) -> float:
        """Compute EAR for a single eye given its 6 landmark indices."""
        lm = landmarks.landmark
        pts = [(lm[i].x * w, lm[i].y * h) for i in eye_indices]

        # p1=outer corner, p2=upper-outer, p3=upper-inner,
        # p4=inner corner, p5=lower-inner, p6=lower-outer
        p1, p2, p3, p4, p5, p6 = pts

        vertical_1 = ((p2[0] - p6[0]) ** 2 + (p2[1] - p6[1]) ** 2) ** 0.5
        vertical_2 = ((p3[0] - p5[0]) ** 2 + (p3[1] - p5[1]) ** 2) ** 0.5
        horizontal = ((p1[0] - p4[0]) ** 2 + (p1[1] - p4[1]) ** 2) ** 0.5

        if horizontal < 1e-6:
            return 0.3  # safe default

        return (vertical_1 + vertical_2) / (2.0 * horizontal)

    def _detect_blink(self, ear: float) -> bool:
        """
        Detect blinks using a state machine to avoid double-counting.
        Returns True on the frame a blink is confirmed (transition CLOSED → OPEN).
        """
        blinked = False

        if self._blink_state == _BlinkState.OPEN:
            if ear < self.EAR_BLINK_THRESHOLD:
                self._blink_state = _BlinkState.CLOSING

        elif self._blink_state == _BlinkState.CLOSING:
            if ear < self.EAR_BLINK_THRESHOLD:
                self._blink_state = _BlinkState.CLOSED
            else:
                # Very brief dip, still count it
                self._blink_state = _BlinkState.OPEN
                self._total_blinks += 1
                self._blink_timestamps.append(time.monotonic())
                blinked = True

        elif self._blink_state == _BlinkState.CLOSED:
            if ear >= self.EAR_BLINK_THRESHOLD:
                self._blink_state = _BlinkState.OPEN
                self._total_blinks += 1
                self._blink_timestamps.append(time.monotonic())
                blinked = True

        return blinked

    def _compute_blink_rate(self) -> float:
        """Compute blinks per minute over a rolling 60-second window."""
        now = time.monotonic()
        cutoff = now - 60.0

        # Prune old timestamps
        while self._blink_timestamps and self._blink_timestamps[0] < cutoff:
            self._blink_timestamps.popleft()

        elapsed = now - self._session_start_time
        if elapsed < 5.0:
            # Not enough data yet, return a reasonable default
            return 15.0

        window_duration = min(60.0, elapsed)
        count = len(self._blink_timestamps)
        return (count / window_duration) * 60.0

    # ──────────────────────────────────────────────
    #  UTILITIES
    # ──────────────────────────────────────────────

    def _ema(self, prev: float, new: float) -> float:
        """Exponential Moving Average for temporal smoothing."""
        return self._alpha * new + (1.0 - self._alpha) * prev

    def _fallback_metrics(self, face_count: int) -> dict:
        """Return last known / safe defaults when analysis fails."""
        return {
            "gaze_direction": self._last_gaze_direction,
            "gaze_deviation": round(self._last_gaze_deviation, 3),
            "eye_aspect_ratio": 0.28,
            "is_blinking": False,
            "blink_rate": round(self._smoothed_blink_rate, 1),
            "face_count": face_count,
            "multi_face_violation": face_count > 1,
        }

    def get_baseline_snapshot(self) -> dict:
        """
        Return current smoothed metrics as a calibration baseline.
        Called after calibration period completes.
        """
        return {
            "baseline_gaze_deviation": round(self._smoothed_gaze_deviation, 3),
            "baseline_blink_rate": round(self._smoothed_blink_rate, 1),
            "baseline_ear": round(self._smoothed_ear, 3),
        }

    def reset(self) -> None:
        """Clear all rolling buffers (for recalibration)."""
        self._gaze_deviation_buffer.clear()
        self._ear_buffer.clear()
        self._blink_timestamps.clear()
        self._blink_state = _BlinkState.OPEN
        self._total_blinks = 0
        self._session_start_time = time.monotonic()
        self._smoothed_gaze_deviation = 0.0
        self._smoothed_ear = 0.28
        self._smoothed_blink_rate = 15.0
        self._last_gaze_direction = "center"
        self._last_gaze_deviation = 0.0
