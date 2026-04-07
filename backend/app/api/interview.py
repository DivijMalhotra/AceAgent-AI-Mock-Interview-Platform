"""
Interview lifecycle API endpoints.

- POST /interview/start  → create session, return first question
- POST /interview/{id}/answer → submit answer, get evaluation + next question
- GET  /interview/{id}/summary → get full session summary
- POST /interview/{id}/end → end session early
- POST /interview/{id}/upload → upload video/audio recording
"""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File, Body
from typing import Optional

from app.core.logging import logger
from app.models.schemas import (
    APIResponse,
    Answer,
    AnswerEvaluation,
    ConfidenceBreakdown,
    ConfidenceScore,
    InterviewAnswerResponse,
    InterviewConfig,
    InterviewStartResponse,
    InterviewStatus,
    InterviewSummary,
    Question,
    SessionState,
)
from app.services.agents import orchestrator
from app.services.memory import faiss_store, redis_store

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/start", response_model=APIResponse)
async def start_interview(config: InterviewConfig) -> APIResponse:
    """
    Start a new interview session.
    Wires in the AI agents for strategy and first question generation.
    Stores session globally in Redis.
    """
    session = SessionState(config=config)
    logger.info("Starting session %s | topic=%s difficulty=%s", session.session_id, config.topic, config.difficulty)

    # 1. Strategy Agent
    strategy = await orchestrator.generate_strategy(config)
    logger.debug("Generated strategy for %s: %s", session.session_id, strategy)

    # 2. Question Agent
    first_question = await orchestrator.generate_next_question(session)

    session.status = InterviewStatus.ACTIVE
    session.questions_asked.append(first_question.model_dump())
    
    # Save to Redis
    await redis_store.save_session(session)
    
    # Save first question context to FAISS
    await faiss_store.add_memory(session.session_id, first_question.text, "agent")

    return APIResponse(
        data=InterviewStartResponse(
            session_id=session.session_id,
            first_question=first_question,
            status=InterviewStatus.ACTIVE,
        ).model_dump()
    )


@router.get("/{session_id}", response_model=APIResponse)
async def get_session_state(session_id: str) -> APIResponse:
    """Fetch current session state from Redis."""
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return APIResponse(data=session.model_dump())


@router.post("/{session_id}/answer", response_model=APIResponse)
async def submit_answer(session_id: str, answer: Answer) -> APIResponse:
    """
    Submit an answer to the current question.
    """
    # Fetch from Redis
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != InterviewStatus.ACTIVE:
        raise HTTPException(status_code=400, detail=f"Session is {session.status.value}")

    logger.info("Answer received for session %s | question=%s", session_id, answer.question_id)

    session.answers.append(answer.model_dump())

    current_q_index = session.current_question_index
    question_data = session.questions_asked[current_q_index]
    question_obj = Question(**question_data)

    # Save user answer to FAISS memory
    await faiss_store.add_memory(session_id, answer.transcript, "user")

    # 1. Evaluator Agent
    evaluation = await orchestrator.evaluate_answer(question_obj, answer.transcript)

    from app.services.scoring import confidence_engine
    confidence = confidence_engine.evaluate(answer.audio_metrics, answer.video_metrics)
    session.confidence_scores.append(confidence.model_dump())

    from app.services.adaptive import adaptive_engine
    next_q = await adaptive_engine.determine_next_step(
        session=session,
        current_q=question_obj,
        transcript=answer.transcript,
        evaluation=evaluation,
        confidence=confidence
    )

    session.questions_asked.append(next_q.model_dump())
    session.current_question_index += 1

    # Store evaluation internally for the roadmap
    if not hasattr(session, "evaluations"):
        session.evaluations = []
    session.evaluations.append(evaluation)

    # Save next question to FAISS memory
    await faiss_store.add_memory(session_id, next_q.text, "agent")

    # Save updated state to Redis
    await redis_store.save_session(session)

    return APIResponse(
        data=InterviewAnswerResponse(
            evaluation=evaluation,
            confidence=confidence,
            next_question=next_q,
            session_status=InterviewStatus.ACTIVE,
        ).model_dump()
    )


@router.get("/{session_id}/summary", response_model=APIResponse)
async def get_summary(session_id: str) -> APIResponse:
    """Return the full interview summary."""
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    avg_confidence = 0.0
    if session.confidence_scores:
        avg_confidence = sum(c["overall"] for c in session.confidence_scores) / len(session.confidence_scores)

    evals = getattr(session, "evaluations", [])
    average_score = sum(e.score for e in evals) / len(evals) if evals else 0.0

    roadmap = await orchestrator.generate_roadmap(session, evals)

    summary = InterviewSummary(
        session_id=session_id,
        topic=session.config.topic,
        total_questions=len(session.questions_asked),
        average_score=round(average_score, 1),
        average_confidence=round(avg_confidence, 2),
        strengths=list(set(s for e in evals for s in e.strengths))[:5],
        weaknesses=list(set(w for e in evals for w in e.weaknesses))[:5],
        roadmap=roadmap,
    )

    return APIResponse(data=summary.model_dump())


@router.post("/{session_id}/end", response_model=APIResponse)
async def end_interview(
    session_id: str,
    body: Optional[dict] = Body(default=None),
) -> APIResponse:
    """End an active session. Optionally receives integrity/cheating data."""
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = InterviewStatus.COMPLETED

    # Store integrity metadata if provided
    if body:
        # Use a generic metadata dict on the session
        if not hasattr(session, 'metadata') or session.metadata is None:
            session.metadata = {}
        session.metadata["cheating_detected"] = body.get("cheating_detected", False)
        session.metadata["integrity_score"] = body.get("integrity_score", 1.0)
        session.metadata["violation_count"] = body.get("violation_count", 0)
        session.metadata["alert_history"] = body.get("alert_history", [])

    await redis_store.save_session(session)
    logger.info("Session %s ended | questions=%d | cheating=%s",
                session_id, len(session.questions_asked),
                body.get("cheating_detected", False) if body else False)

    return APIResponse(data={"session_id": session_id, "status": "completed"})


# 🔥 ADDED: Recording upload endpoint
UPLOAD_DIR = Path("uploads")

@router.post("/{session_id}/upload", response_model=APIResponse)
async def upload_recording(
    session_id: str,
    video_file: UploadFile = File(...),
) -> APIResponse:
    """
    Upload a video/audio recording for an interview session.
    Files are stored on local disk; only the URL is kept in session state.
    """
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Create directory for this session
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    ext = Path(video_file.filename or "recording.webm").suffix or ".webm"
    filename = f"{uuid.uuid4().hex[:12]}{ext}"
    file_path = session_dir / filename

    # Stream file to disk (not into memory/database)
    content = await video_file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    file_path.write_bytes(content)
    logger.info(
        "Recording saved for session %s | file=%s size=%d bytes",
        session_id, filename, len(content),
    )

    # Return the URL path (served by StaticFiles mount)
    video_url = f"/uploads/{session_id}/{filename}"

    return APIResponse(data={
        "video_url": video_url,
        "filename": filename,
        "size_bytes": len(content),
    })
