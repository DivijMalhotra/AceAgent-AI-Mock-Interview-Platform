from __future__ import annotations

import json
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Database ──
    database_url: str = "postgresql+asyncpg://postgres:postgre%402005@localhost:5432/ai_mock_interview"

    # ── OpenAI ──
    openai_api_key: str = "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"
    openai_model: str = "gpt-4o"
    openai_embedding_model: str = "text-embedding-3-small"

    # ── Redis ──
    redis_url: str = "redis://localhost:6379/0"

    # ── FAISS ──
    faiss_index_dir: str = "./data/faiss"

    # ── Whisper ──
    whisper_model_size: str = "base"

    # ── Server ──
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    cors_origins: str = '["http://localhost:3000"]'

    # ── Session ──
    session_ttl_seconds: int = 3600

    # ── Derived helpers ──
    @property
    def cors_origin_list(self) -> List[str]:
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000"]

    @property
    def faiss_index_path(self) -> Path:
        p = Path(self.faiss_index_dir)
        p.mkdir(parents=True, exist_ok=True)
        return p


settings = Settings()