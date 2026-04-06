from __future__ import annotations

import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from sqlalchemy import (
    Column, String, DateTime, Float, Integer, ForeignKey, Text, JSON, Enum, Boolean
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.schemas import Difficulty, InterviewStatus


def generate_uuid() -> str:
    return str(uuid.uuid4())


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Optional for guest sessions
    topic: Mapped[str] = mapped_column(String, nullable=False)
    difficulty: Mapped[str] = mapped_column(String, default="medium")
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    focus_areas: Mapped[Optional[List[str]]] = mapped_column(JSON, default=[])
    
    status: Mapped[str] = mapped_column(String, default="pending")
    current_question_index: Mapped[int] = mapped_column(Integer, default=0)
    difficulty_level: Mapped[float] = mapped_column(Float, default=0.5)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    questions: Mapped[List[SessionQuestion]] = relationship(
        "SessionQuestion", back_populates="session", cascade="all, delete-orphan"
    )
    answers: Mapped[List[SessionAnswer]] = relationship(
        "SessionAnswer", back_populates="session", cascade="all, delete-orphan"
    )

    def to_session_state(self):
        """Convert DB model to Pydantic SessionState for agent compatibility."""
        from app.models.schemas import SessionState, InterviewConfig
        return SessionState(
            session_id=self.id,
            status=InterviewStatus(self.status),
            config=InterviewConfig(
                topic=self.topic,
                difficulty=Difficulty(self.difficulty),
                duration_minutes=self.duration_minutes,
                focus_areas=self.focus_areas or []
            ),
            current_question_index=self.current_question_index,
            difficulty_level=self.difficulty_level,
            questions_asked=[q.to_question().model_dump() for q in sorted(self.questions, key=lambda x: x.index)],
            answers=[a.to_answer().model_dump() for a in sorted(self.answers, key=lambda x: x.timestamp)],
            confidence_scores=[a.confidence_score.model_dump() if a.confidence_score else {} for a in sorted(self.answers, key=lambda x: x.timestamp)],
            created_at=self.created_at.isoformat(),
            updated_at=self.updated_at.isoformat(),
        )


class SessionQuestion(Base):
    __tablename__ = "session_questions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    session_id: Mapped[str] = mapped_column(String, ForeignKey("interview_sessions.id"), nullable=False)
    index: Mapped[int] = mapped_column(Integer, nullable=False)
    
    text: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String, nullable=False)
    topic: Mapped[str] = mapped_column(String, nullable=False)
    follow_up: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default={})
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    session: Mapped[InterviewSession] = relationship("InterviewSession", back_populates="questions")

    def to_question(self):
        from app.models.schemas import Question, Difficulty
        return Question(
            id=self.id,
            text=self.text,
            difficulty=Difficulty(self.difficulty),
            topic=self.topic,
            follow_up=self.follow_up,
            metadata=self.metadata or {}
        )


class SessionAnswer(Base):
    __tablename__ = "session_answers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    session_id: Mapped[str] = mapped_column(String, ForeignKey("interview_sessions.id"), nullable=False)
    question_id: Mapped[str] = mapped_column(String, ForeignKey("session_questions.id"), nullable=False)
    
    transcript: Mapped[str] = mapped_column(Text, nullable=False)
    audio_metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default={})
    video_metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default={})
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    session: Mapped[InterviewSession] = relationship("InterviewSession", back_populates="answers")
    question: Mapped[SessionQuestion] = relationship("SessionQuestion")
    evaluation: Mapped[Optional[AnswerEvaluation]] = relationship("AnswerEvaluation", back_populates="answer", uselist=False, cascade="all, delete-orphan")
    confidence_score: Mapped[Optional[ConfidenceScore]] = relationship("ConfidenceScore", back_populates="answer", uselist=False, cascade="all, delete-orphan")

    def to_answer(self):
        from app.models.schemas import Answer
        return Answer(
            question_id=self.question_id,
            transcript=self.transcript,
            audio_metrics=self.audio_metrics,
            video_metrics=self.video_metrics,
            timestamp=self.timestamp.isoformat(),
        )


class AnswerEvaluation(Base):
    __tablename__ = "answer_evaluations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    answer_id: Mapped[str] = mapped_column(String, ForeignKey("session_answers.id"), nullable=False)
    
    score: Mapped[float] = mapped_column(Float, nullable=False)
    strengths: Mapped[List[str]] = mapped_column(JSON, default=[])
    weaknesses: Mapped[List[str]] = mapped_column(JSON, default=[])
    missing_concepts: Mapped[List[str]] = mapped_column(JSON, default=[])
    depth_rating: Mapped[str] = mapped_column(String, default="")
    suggestion: Mapped[str] = mapped_column(Text, default="")
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    answer: Mapped[SessionAnswer] = relationship("SessionAnswer", back_populates="evaluation")


class ConfidenceScore(Base):
    __tablename__ = "confidence_scores"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    answer_id: Mapped[str] = mapped_column(String, ForeignKey("session_answers.id"), nullable=False)
    
    overall: Mapped[float] = mapped_column(Float, nullable=False)
    eye_contact: Mapped[float] = mapped_column(Float, default=0.0)
    speech_clarity: Mapped[float] = mapped_column(Float, default=0.0)
    speech_pace: Mapped[float] = mapped_column(Float, default=0.0)
    facial_expression: Mapped[float] = mapped_column(Float, default=0.0)
    filler_word_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    feedback: Mapped[str] = mapped_column(Text, default="")
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    answer: Mapped[SessionAnswer] = relationship("SessionAnswer", back_populates="confidence_score")