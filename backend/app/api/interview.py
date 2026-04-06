"""
Interview lifecycle API endpoints.

- POST /interview/start  → create session, return first question
- POST /interview/{id}/answer → submit answer, get evaluation + next question
- GET  /interview/{id}/summary → get full session summary
- POST /interview/{id}/end → end session early
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

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
async def end_interview(session_id: str) -> APIResponse:
    """End an active session."""
    session = await redis_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = InterviewStatus.COMPLETED
    await redis_store.save_session(session)
    logger.info("Session %s ended | questions=%d", session_id, len(session.questions_asked))

    return APIResponse(data={"session_id": session_id, "status": "completed"})
