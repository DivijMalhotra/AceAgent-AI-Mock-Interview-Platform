"""
ACIE Backend — Shared Pydantic models (schemas).

These are used across multiple modules — API request/response shapes,
internal data objects, etc.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Enums ──

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class InterviewStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"


class AgentRole(str, Enum):
    STRATEGY = "strategy"
    QUESTION = "question"
    EVALUATOR = "evaluator"
    FOLLOWUP = "followup"
    ROADMAP = "roadmap"


# ── Interview Session ──

class InterviewConfig(BaseModel):
    """Sent by the frontend to start an interview."""
    topic: str
    difficulty: Difficulty = Difficulty.MEDIUM
    duration_minutes: int = Field(default=30, ge=5, le=120)
    focus_areas: List[str] = Field(default_factory=list)


class SessionState(BaseModel):
    """Internal session state stored in Redis."""
    session_id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    status: InterviewStatus = InterviewStatus.PENDING
    config: InterviewConfig
    current_question_index: int = 0
    difficulty_level: float = 0.5  # 0.0 = easiest, 1.0 = hardest
    questions_asked: List[Dict[str, Any]] = Field(default_factory=list)
    answers: List[Dict[str, Any]] = Field(default_factory=list)
    confidence_scores: List[Dict[str, Any]] = Field(default_factory=list)
    evaluations: List[Any] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ── Questions & Answers ──

class Question(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    text: str
    difficulty: Difficulty
    topic: str
    follow_up: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Answer(BaseModel):
    question_id: str
    transcript: str
    audio_metrics: Optional[Dict[str, Any]] = None
    video_metrics: Optional[Dict[str, Any]] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ── Confidence ──

class ConfidenceBreakdown(BaseModel):
    eye_contact: float = Field(default=0.0, ge=0.0, le=1.0)
    speech_clarity: float = Field(default=0.0, ge=0.0, le=1.0)
    speech_pace: float = Field(default=0.0, ge=0.0, le=1.0)
    facial_expression: float = Field(default=0.0, ge=0.0, le=1.0)
    filler_word_ratio: float = Field(default=0.0, ge=0.0, le=1.0)


class ConfidenceScore(BaseModel):
    overall: float = Field(default=0.0, ge=0.0, le=1.0)
    breakdown: ConfidenceBreakdown = Field(default_factory=ConfidenceBreakdown)
    feedback: str = ""


# ── Agent messages ──

class AgentMessage(BaseModel):
    role: AgentRole
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ── Evaluation ──

class AnswerEvaluation(BaseModel):
    question_id: str
    score: float = Field(ge=0.0, le=10.0)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_concepts: List[str] = Field(default_factory=list)
    depth_rating: str = ""
    suggestion: str = ""


# ── API response wrappers ──

class APIResponse(BaseModel):
    success: bool = True
    data: Any = None
    error: Optional[str] = None


class InterviewStartResponse(BaseModel):
    session_id: str
    first_question: Question
    status: InterviewStatus = InterviewStatus.ACTIVE


class InterviewAnswerResponse(BaseModel):
    evaluation: AnswerEvaluation
    confidence: ConfidenceScore
    next_question: Optional[Question] = None
    session_status: InterviewStatus


class InterviewSummary(BaseModel):
    session_id: str
    topic: str
    total_questions: int
    average_score: float
    average_confidence: float
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    roadmap: List[str] = Field(default_factory=list)
    evaluations: List[AnswerEvaluation] = Field(default_factory=list)
