"""
ACIE Backend — Base AI Agent implementation.
"""
from __future__ import annotations

from typing import Any, Optional

import orjson
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import AgentRole

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.openai_api_key,
)


class BaseAgent:
    """
    Base class for all discrete LLM agents.
    Provides standard async completion and JSON parsing methods.
    """
    def __init__(self, role: AgentRole, model: str = settings.openai_model):
        self.role = role
        self.model = model

    async def generate_response(self, prompt: str, temperature: float = 0.7) -> str:
        """Call the LLM and return the text response."""
        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=800,
            )
            content = response.choices[0].message.content or ""
            return content.strip()
        except Exception as e:
            logger.error("Error in %s agent: %s", self.role.value, e)
            return ""

    async def generate_json(self, prompt: str, temperature: float = 0.2) -> dict[str, Any]:
        """Call the LLM and parse the response as JSON (forced JSON mode if supported)."""
        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                response_format={"type": "json_object"},
                max_tokens=1500,
            )
            content = response.choices[0].message.content or "{}"
            return orjson.loads(content)
        except Exception as e:
            logger.error("JSON Error in %s agent: %s", self.role.value, e)
            return {}
