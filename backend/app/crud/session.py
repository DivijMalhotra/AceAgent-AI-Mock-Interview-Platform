from __future__ import annotations

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func
from datetime import datetime

from app.models.db_models import (
    InterviewSession, SessionQuestion, SessionAnswer, 
    AnswerEvaluation, ConfidenceScore
)
from app.models.schemas import (
    InterviewConfig, Question, Answer, AnswerEvaluation as EvalSchema, ConfidenceScore as ConfSchema
)


async def create_session(db: AsyncSession, config: InterviewConfig, user_id: Optional[str] = None) -> InterviewSession:
    session = InterviewSession(
        user_id=user_id,
        topic=config.topic,
        difficulty=config.difficulty.value,
        duration_minutes=config.duration_minutes,
        focus_areas=config.focus_areas,
        status="pending",
    )
    db.add(session)
    await db.flush()
    return session


async def get_session(db: AsyncSession, session_id: str) -> Optional[InterviewSession]:
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.id == session_id)
    )
    return result.scalar_one_or_none()


async def add_question(db: AsyncSession, session_id: str, question: Question, index: int) -> SessionQuestion:
    sq = SessionQuestion(
        session_id=session_id,
        index=index,
        text=question.text,
        difficulty=question.difficulty.value,
        topic=question.topic,
        follow_up=question.follow_up,
        metadata=question.metadata,
    )
    db.add(sq)
    await db.flush()
    return sq


async def submit_answer(
    db: AsyncSession,
    session_id: str,
    question_id: str,
    answer: Answer,
    evaluation: EvalSchema,
    confidence: ConfSchema
) -> InterviewSession:
    # 1. Create answer
    new_answer = SessionAnswer(
        session_id=session_id,
        question_id=question_id,
        transcript=answer.transcript,
        audio_metrics=answer.audio_metrics,
        video_metrics=answer.video_metrics,
    )
    db.add(new_answer)
    await db.flush()

    # 2. Add evaluation
    eval_record = AnswerEvaluation(
        answer_id=new_answer.id,
        score=evaluation.score,
        strengths=evaluation.strengths,
        weaknesses=evaluation.weaknesses,
        missing_concepts=evaluation.missing_concepts,
        depth_rating=evaluation.depth_rating,
        suggestion=evaluation.suggestion,
    )
    db.add(eval_record)

    # 3. Add confidence
    conf_record = ConfidenceScore(
        answer_id=new_answer.id,
        overall=confidence.overall,
        eye_contact=confidence.breakdown.eye_contact,
        speech_clarity=confidence.breakdown.speech_clarity,
        speech_pace=confidence.breakdown.speech_pace,
        facial_expression=confidence.breakdown.facial_expression,
        filler_word_ratio=confidence.breakdown.filler_word_ratio,
        feedback=confidence.feedback,
    )
    db.add(conf_record)

    # 4. Update session state
    await db.execute(
        update(InterviewSession)
        .where(InterviewSession.id == session_id)
        .values(
            current_question_index=InterviewSession.current_question_index + 1,
            updated_at=func.now(),
        )
    )

    await db.flush()
    await db.refresh(new_answer.session)
    return new_answer.session


async def update_session_difficulty(db: AsyncSession, session_id: str, difficulty: str, difficulty_level: float):
    await db.execute(
        update(InterviewSession)
        .where(InterviewSession.id == session_id)
        .values(
            difficulty=difficulty,
            difficulty_level=difficulty_level,
            updated_at=func.now(),
        )
    )


async def end_session(db: AsyncSession, session_id: str):
    await db.execute(
        update(InterviewSession)
        .where(InterviewSession.id == session_id)
        .values(
            status="completed",
            ended_at=func.now(),
            updated_at=func.now(),
        )
    )