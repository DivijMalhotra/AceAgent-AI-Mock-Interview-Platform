"""
ACIE Backend — Speech Metrics Extraction.
Calculates words per minute, pause ratios, and filler word detection.
"""
from __future__ import annotations

import re

class SpeechMetricsExtractor:
    # Common English filler words
    FILLER_WORDS = {
        "um", "uh", "like", "you know", "so", "actually", "basically", "literally", "right"
    }

    @staticmethod
    def analyze_transcript(text: str, duration_seconds: float, words_data: list[dict] = None) -> dict:
        """
        Analyzes transcript text and timestamps to generate confidence metrics.
        """
        # Basic cleanup
        clean_text = re.sub(r'[^\w\s]', '', text.lower())
        words = clean_text.split()
        
        total_words = len(words)
        
        # 1. Speech Rate (Words Per Minute)
        wpm = 0
        if duration_seconds > 0:
            wpm = (total_words / duration_seconds) * 60

        # 2. Filler words analysis
        filler_count = sum(1 for word in words if word in SpeechMetricsExtractor.FILLER_WORDS)
        filler_ratio = filler_count / total_words if total_words > 0 else 0.0

        # Calculate a normalized score for filler ratio (lower is better, cap at ~10% for passing)
        # 0.0 filler ratio = 1.0 score. 0.1 (10%) filler ratio = 0.0 score.
        normalized_filler_score = max(0.0, 1.0 - (filler_ratio * 10))

        # 3. Pauses Analysis (if word-level timestamps are provided by Whisper)
        total_pause_duration = 0.0
        significant_pauses = 0
        
        if words_data and len(words_data) > 1:
            for i in range(1, len(words_data)):
                prev_word = words_data[i-1]
                curr_word = words_data[i]
                
                # Gap between end of previous word and start of current word
                # (Assumes words_data has 'start' and 'end' float keys provided by Whisper verbose_json)
                if hasattr(prev_word, "end") and hasattr(curr_word, "start"):
                    gap = curr_word.start - prev_word.end
                    if gap > 1.0: # Pause > 1 second is "significant"
                        significant_pauses += 1
                        total_pause_duration += gap

        # Speech Pace Score: Ideal WPM is ~130-160 for an interview
        # Very slow (< 100) or very fast (> 190) gets lower score
        pace_score = 1.0
        if wpm < 100:
            pace_score = max(0.0, (wpm / 100))
        elif wpm > 190:
            pace_score = max(0.0, 1.0 - ((wpm - 190) / 100))

        # Clarity estimate (based inversely on fillers and long awkward pauses)
        clarity_score = 0.5 + (normalized_filler_score * 0.3)
        if significant_pauses > 3:
            clarity_score -= 0.2

        return {
            "wpm": round(wpm, 1),
            "filler_words_count": filler_count,
            "filler_ratio": round(filler_ratio, 3),
            "significant_pauses": significant_pauses,
            "derived_scores": {
                "speech_pace": round(min(1.0, pace_score), 2),
                "speech_clarity": round(min(1.0, max(0.0, clarity_score)), 2),
                "filler_word_ratio": round(normalized_filler_score, 2)
            }
        }

metrics_extractor = SpeechMetricsExtractor()
