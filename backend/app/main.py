"""
ACIE Backend — FastAPI Application Factory.

This is the single entry point for the entire backend.
Run with:  uvicorn app.main:app --reload
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import logger

# ── API Routers ──
from app.api.health import router as health_router
from app.api.interview import router as interview_router
from app.api.ws import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Startup / shutdown lifecycle hook.
    Phase 3 will add Redis + FAISS initialization here.
    """
    logger.info("═" * 50)
    logger.info("  ACIE Backend starting up")
    logger.info("  Debug mode: %s", settings.debug)
    logger.info("  CORS origins: %s", settings.cors_origin_list)
    logger.info("═" * 50)

    # Ensure data directories exist
    settings.faiss_index_path  # triggers mkdir

    yield  # ← app runs here

    logger.info("ACIE Backend shutting down")


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""

    app = FastAPI(
        title="ACIE — Adaptive Cognitive Interview Engine",
        description="AI-powered mock interview platform with multimodal intelligence.",
        version="0.1.0",
        lifespan=lifespan,
    )

    # ── CORS ──
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Mount routers ──
    app.include_router(health_router, prefix="/api")
    app.include_router(interview_router, prefix="/api")
    app.include_router(ws_router)

    # ── Root redirect ──
    @app.get("/", include_in_schema=False)
    async def root():
        return {"service": "acie-backend", "docs": "/docs"}

    return app


app = create_app()
