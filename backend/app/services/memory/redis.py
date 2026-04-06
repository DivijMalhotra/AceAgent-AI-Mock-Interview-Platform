"""
ACIE Backend — Redis Memory Store.
Handles distributed session state management.
"""
from __future__ import annotations

import orjson
from redis.asyncio import Redis

from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import SessionState

redis_client = Redis.from_url(settings.redis_url, decode_responses=False)

class RedisStore:
    """Manages interview sessions in Redis using Pydantic models."""

    @staticmethod
    async def save_session(session: SessionState) -> None:
        """Serialize and save the session state."""
        try:
            key = f"session:{session.session_id}"
            data = orjson.dumps(session.model_dump())
            await redis_client.setex(key, settings.session_ttl_seconds, data)
        except Exception as e:
            logger.error("Failed to save session to Redis: %s", e)

    @staticmethod
    async def get_session(session_id: str) -> SessionState | None:
        """Fetch and deserialize a session object."""
        try:
            key = f"session:{session_id}"
            data = await redis_client.get(key)
            if not data:
                return None
            return SessionState(**orjson.loads(data))
        except Exception as e:
            logger.error("Failed to get session from Redis: %s", e)
            return None

    @staticmethod
    async def delete_session(session_id: str) -> None:
        try:
            key = f"session:{session_id}"
            await redis_client.delete(key)
        except Exception as e:
            logger.error("Failed to delete session: %s", e)

redis_store = RedisStore()
