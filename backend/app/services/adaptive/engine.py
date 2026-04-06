"""
ACIE Backend — Adaptive Intelligence Engine.
Analyzes current performance metrics and directs the Orchestrator
to dynamically scale difficulty up, down, or initiate follow-ups.
"""
from __future__ import annotations

from app.core.logging import logger
from app.models.schemas import (
    AnswerEvaluation,
    ConfidenceScore,
    Difficulty,
    Question,
    SessionState,
)
from app.services.agents import orchestrator
from app.services.memory import faiss_store

class AdaptiveEngine:

    async def determine_next_step(self, session: SessionState, current_q: Question, transcript: str, evaluation: AnswerEvaluation, confidence: ConfidenceScore) -> Question:
        """
        Calculates the branching logic for the interview.
        Should we drill down (follow-up on weakness), ease up (lower difficulty),
        scale up (increase difficulty because they did great), or stay the course?
        """
        # 1. Evaluate drill-down priority (Follow-ups)
        # Avoid chaining follow-ups infinitely
        if not current_q.follow_up:
            if evaluation.score < 6.5 or len(evaluation.missing_concepts) > 0:
                logger.info("AdaptiveEngine: Initiating follow-up for missing concepts/low score.")
                # We pull recent context to provide better conversational flow
                past_context = await faiss_store.search_memory(transcript, session.session_id, top_k=2)
                # Pass off to orchestrator
                return await orchestrator.generate_followup(current_q, transcript, evaluation)

        # 2. Adjust Difficulty
        self._adjust_difficulty(session, evaluation, confidence)

        # 3. Request a standard new question at the new tuned difficulty
        logger.info("AdaptiveEngine: Moving to next top-level question at difficulty=%s", session.config.difficulty.value)
        return await orchestrator.generate_next_question(session)


    def _adjust_difficulty(self, session: SessionState, evaluation: AnswerEvaluation, confidence: ConfidenceScore):
        """State machine for scaling the overarching Difficulty Enum & internal tracker."""
        current_enum = session.config.difficulty
        current_float = session.difficulty_level # 0.0 to 1.0

        # Adjust float based on combined evaluation and confidence
        score_weight = evaluation.score / 10.0
        conf_weight = confidence.overall
        
        # Candidate performed highly well -> increment difficulty
        if score_weight > 0.8 and conf_weight > 0.7:
            current_float = min(1.0, current_float + 0.15)
        # Candidate struggled heavily -> decrement difficulty
        elif score_weight < 0.5 or conf_weight < 0.4:
            current_float = max(0.0, current_float - 0.20)

        # Update Session tracked float
        session.difficulty_level = round(current_float, 2)

        # Map float back to coarse Enum for the Prompts
        if current_float < 0.33:
            session.config.difficulty = Difficulty.EASY
        elif current_float > 0.66:
            session.config.difficulty = Difficulty.HARD
        else:
            session.config.difficulty = Difficulty.MEDIUM

        if current_enum != session.config.difficulty:
            logger.info("AdaptiveEngine: Live difficulty scaled from %s to %s", current_enum.value, session.config.difficulty.value)

adaptive_engine = AdaptiveEngine()
