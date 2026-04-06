"""
ACIE Backend — Whisper Speech-to-Text Integration.
"""
from __future__ import annotations

import os
from pathlib import Path
from tempfile import NamedTemporaryFile

import whisper
from openai import AsyncOpenAI
from pydub import AudioSegment

from app.core.config import settings
from app.core.logging import logger

client = AsyncOpenAI(api_key=settings.openai_api_key)

class WhisperService:
    def __init__(self):
        # Local whisper model can also be used if preferred
        # self.local_model = whisper.load_model(settings.whisper_model_size)
        pass

    async def transcribe_audio_file(self, file_path: str) -> dict:
        """
        Transcribe audio using OpenAI's API.
        Returns the text and word-level timestamps (if verbose is supported/requested).
        """
        try:
            with open(file_path, "rb") as audio_file:
                # Using verbose_json to get segment level timestamps which helps with pacing
                response = await client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["word"]
                )
            
            return {
                "text": response.text,
                "words": response.words if hasattr(response, "words") else [],
                "duration": response.duration if hasattr(response, "duration") else 0.0
            }
        except Exception as e:
            logger.error("Failed to transcribe audio via OpenAI: %s", e)
            return {"text": "", "words": [], "duration": 0.0}

    async def transcribe_audio_bytes(self, audio_bytes: bytes, format: str = "webm") -> dict:
        """
        Takes raw audio bytes, saves them to a temp file, and transcribes them.
        """
        temp_file = NamedTemporaryFile(delete=False, suffix=f".{format}")
        try:
            temp_file.write(audio_bytes)
            temp_file.flush()
            
            # Ensure it's a valid format, if necessary convert it using pydub
            # (Skipping conversion here for simplicity assuming browser webm/mp3 is acceptable)
            
            return await self.transcribe_audio_file(temp_file.name)
        finally:
            temp_file.close()
            os.unlink(temp_file.name)

whisper_service = WhisperService()
