"""
ACIE Backend — Confidence Scoring Engine.
Combines audio pacing, filler ratios, and video-derived eye contact
into a unified ConfidenceScore.
"""
from __future__ import annotations

from app.models.schemas import ConfidenceBreakdown, ConfidenceScore

class ConfidenceEngine:
    
    @staticmethod
    def evaluate(audio_metrics: dict, video_metrics: dict) -> ConfidenceScore:
        """
        Takes raw dictionaries from SpeechMetricsExtractor and VideoProcessor
        and computes the unified Confidence breakdown.
        """
        # Fallback empty dictionaries
        audio = audio_metrics or {}
        video = video_metrics or {}
        
        # Audio scores
        a_scores = audio.get("derived_scores", {})
        speech_pace = a_scores.get("speech_pace", 0.5)
        speech_clarity = a_scores.get("speech_clarity", 0.5)
        filler_word_ratio = a_scores.get("filler_word_ratio", 0.5)
        
        # Video scores
        v_scores = video.get("derived_scores", {})
        eye_contact = v_scores.get("eye_contact", 0.5)
        facial_expression = v_scores.get("facial_expression", 0.5)

        # Base weighting logic for Overall Confidence
        # Vision matters significantly for "perceived confidence"
        overall_score = (
            (eye_contact * 0.35) +
            (speech_clarity * 0.25) +
            (speech_pace * 0.15) +
            (filler_word_ratio * 0.15) +
            (facial_expression * 0.10)
        )

        overall_score = max(0.0, min(1.0, overall_score))

        # Generate actionable feedback based on the lowest sub-score
        feedback = "Great overall confidence!"
        
        scores_map = {
            "eye contact": eye_contact,
            "speech clarity": speech_clarity,
            "speech pace": speech_pace,
            "filler word usage": filler_word_ratio
        }
        
        weakest_area = min(scores_map, key=scores_map.get)
        weakest_score = scores_map[weakest_area]

        if weakest_score < 0.6:
            if weakest_area == "eye contact":
                feedback = "Try to maintain more consistent eye contact with the camera."
            elif weakest_area == "speech clarity":
                feedback = "Work on speaking more clearly and pausing less frequently."
            elif weakest_area == "speech pace":
                feedback = "Your speech pace was a bit irregular. Keep a steady rhythm."
            elif weakest_area == "filler word usage":
                feedback = "Try to be mindful of filler words like 'um' and 'like'."

        breakdown = ConfidenceBreakdown(
            eye_contact=round(eye_contact, 2),
            speech_clarity=round(speech_clarity, 2),
            speech_pace=round(speech_pace, 2),
            facial_expression=round(facial_expression, 2),
            filler_word_ratio=round(filler_word_ratio, 2)
        )

        return ConfidenceScore(
            overall=round(overall_score, 2),
            breakdown=breakdown,
            feedback=feedback
        )

confidence_engine = ConfidenceEngine()
