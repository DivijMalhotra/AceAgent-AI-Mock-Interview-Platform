"""
ACIE Backend — Embeddings Pipeline.
Connects with OpenAI to get vector embeddings for search functionality.
"""
from __future__ import annotations

import httpx
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.logging import logger

client = AsyncOpenAI(api_key=settings.openai_api_key)

class EmbeddingsPipeline:
    def __init__(self, model: str = settings.openai_embedding_model):
        self.model = model

    async def get_embedding(self, text: str) -> list[float] | None:
        """Returns the vector embedding for a given string."""
        try:
            # We don't want empty strings
            if not text.strip():
                return None
                
            response = await client.embeddings.create(
                input=[text],
                model=self.model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error("Failed to generate embedding: %s", e)
            return None

embeddings_pipeline = EmbeddingsPipeline()
