"""
ACIE Backend — Multi-Agent Orchestrator.
Coordinates specialized agents to manage the interview flow.
"""
from __future__ import annotations

import json
from typing import Any

from app.models.schemas import (
    AgentRole,
    AnswerEvaluation,
    Difficulty,
    InterviewConfig,
    Question,
    SessionState,
)
from app.services.agents.base import BaseAgent
from app.services.agents.prompts import (
    EVALUATOR_PROMPT,
    FOLLOWUP_PROMPT,
    QUESTION_PROMPT,
    ROADMAP_PROMPT,
    STRATEGY_PROMPT,
)


class AgentOrchestrator:
    """Orchestrates interactions between all AI agents."""

    def __init__(self):
        self.strategy_agent = BaseAgent(AgentRole.STRATEGY)
        self.question_agent = BaseAgent(AgentRole.QUESTION)
        self.evaluator_agent = BaseAgent(AgentRole.EVALUATOR)
        self.followup_agent = BaseAgent(AgentRole.FOLLOWUP)
        self.roadmap_agent = BaseAgent(AgentRole.ROADMAP)

    async def generate_strategy(self, config: InterviewConfig) -> str:
        prompt = STRATEGY_PROMPT.format(
            focus_areas=", ".join(config.focus_areas),
            topic=config.topic,
            difficulty=config.difficulty.value,
        )
        return await self.strategy_agent.generate_response(prompt)

    async def generate_next_question(self, session: SessionState) -> Question:
        asked = [q.get("text", "") for q in session.questions_asked]
        prompt = QUESTION_PROMPT.format(
            topic=session.config.topic,
            difficulty=session.config.difficulty.value,
            asked_questions=json.dumps(asked) if asked else "None",
        )
        question_text = await self.question_agent.generate_response(prompt)
        
        return Question(
            text=question_text,
            difficulty=session.config.difficulty,
            topic=session.config.topic,
        )

    async def evaluate_answer(self, question: Question, transcript: str) -> AnswerEvaluation:
        prompt = EVALUATOR_PROMPT.format(
            question=question.text,
            answer=transcript,
        )
        result = await self.evaluator_agent.generate_json(prompt)
        
        # Fallback to defaults if JSON parse fails
        return AnswerEvaluation(
            question_id=question.id,
            score=result.get("score", 5.0),
            strengths=result.get("strengths", []),
            weaknesses=result.get("weaknesses", []),
            missing_concepts=result.get("missing_concepts", []),
            depth_rating=result.get("depth_rating", "adequate"),
            suggestion=result.get("suggestion", ""),
        )

    async def generate_followup(self, question: Question, transcript: str, evaluation: AnswerEvaluation) -> Question:
        prompt = FOLLOWUP_PROMPT.format(
            question=question.text,
            answer=transcript,
            weaknesses=json.dumps(evaluation.weaknesses),
        )
        followup_text = await self.followup_agent.generate_response(prompt)
        
        return Question(
            text=followup_text,
            difficulty=question.difficulty,
            topic=question.topic,
            follow_up=True,
        )

    async def generate_roadmap(self, session: SessionState, evaluations: list[AnswerEvaluation]) -> list[str]:
        if not evaluations:
            return ["Review fundamental concepts."]

        avg_score = sum(e.score for e in evaluations) / len(evaluations)
        all_strengths = []
        all_weaknesses = []
        for e in evaluations:
            all_strengths.extend(e.strengths)
            all_weaknesses.extend(e.weaknesses)

        prompt = ROADMAP_PROMPT.format(
            average_score=round(avg_score, 1),
            strengths=json.dumps(list(set(all_strengths))[:5]),
            weaknesses=json.dumps(list(set(all_weaknesses))[:5]),
        )
        response = await self.roadmap_agent.generate_response(prompt)
        
        return [point.strip("- *") for point in response.split("\n") if point.strip()]

orchestrator = AgentOrchestrator()
