"""
ACIE Backend — WebSocket Real-Time Layer.
Handles persistent duplex connections for real-time video/audio streaming,
metrics calculation, integrity monitoring, and dynamic AI interaction.
"""
from __future__ import annotations

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import Question, SessionState
from app.services.audio import whisper_service
from app.services.video import video_processor
from app.services.video.face_analyzer import FaceAnalyzer
from app.services.video.integrity_engine import IntegrityEngine, IntegrityConfig

router = APIRouter(prefix="/ws", tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        # Per-session analysis engines
        self._face_analyzers: dict[str, FaceAnalyzer] = {}
        self._integrity_engines: dict[str, IntegrityEngine] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

        # Create per-session analysis instances
        self._face_analyzers[session_id] = FaceAnalyzer(
            smoothing_alpha=settings.integrity_smoothing_alpha
        )
        self._integrity_engines[session_id] = IntegrityEngine(
            IntegrityConfig(
                gaze_deviation_threshold=settings.integrity_gaze_deviation_threshold,
                looking_away_seconds=settings.integrity_looking_away_seconds,
                blink_rate_high=settings.integrity_blink_rate_high,
                blink_rate_low=settings.integrity_blink_rate_low,
                max_multi_face_violations=settings.integrity_max_multi_face_violations,
                calibration_frames=settings.integrity_calibration_frames,
            )
        )
        logger.info(f"WebSocket connected: {session_id}")

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
        # Cleanup per-session engines
        self._face_analyzers.pop(session_id, None)
        integrity = self._integrity_engines.pop(session_id, None)
        if integrity:
            history = integrity.get_alert_history()
            if history:
                logger.info(
                    f"Session {session_id} alert history ({len(history)} events): "
                    f"{history[:5]}{'...' if len(history) > 5 else ''}"
                )
        logger.info(f"WebSocket disconnected: {session_id}")

    def get_face_analyzer(self, session_id: str) -> FaceAnalyzer | None:
        return self._face_analyzers.get(session_id)

    def get_integrity_engine(self, session_id: str) -> IntegrityEngine | None:
        return self._integrity_engines.get(session_id)

    async def send_personal_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

    async def send_json(self, data: dict, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(data)

manager = ConnectionManager()


@router.websocket("/{session_id}")
async def interview_websocket(websocket: WebSocket, session_id: str):
    """
    Main WebSocket loop. 
    1. Client streams video frames and audio chunks.
    2. Server returns live tracking metrics + integrity scoring to overlay.
    3. Triggers standard answer evaluation when the candidate finishes speaking.
    """
    await manager.connect(websocket, session_id)
    
    # State tracking for this specific socket
    current_audio_buffer = bytearray()
    
    try:
        while True:
            # Receive either text (commands) or bytes (media) from the client
            message = await websocket.receive()
            
            if "bytes" in message:
                raw_bytes = message["bytes"]
                
                # Get per-session analyzers
                face_analyzer = manager.get_face_analyzer(session_id)
                integrity_engine = manager.get_integrity_engine(session_id)
                
                # Process frame through CV pipeline with per-session analyzer
                cv_metrics = video_processor.process_frame(
                    raw_bytes,
                    face_analyzer=face_analyzer,
                )
                
                # Calculate integrity score from CV metrics
                integrity_data = {}
                if integrity_engine:
                    integrity_data = integrity_engine.calculate_score(cv_metrics)
                
                # Merge integrity into the metrics payload
                cv_metrics["integrity"] = integrity_data
                
                # Stream the calculated metrics back to the frontend
                await manager.send_json(
                    {"type": "live_metrics", "data": cv_metrics},
                    session_id,
                )
                
                # Check for forced termination (3 multi-face violations)
                if integrity_data.get("should_terminate"):
                    alert_history = (
                        integrity_engine.get_alert_history()
                        if integrity_engine
                        else []
                    )
                    await manager.send_json(
                        {
                            "type": "force_end",
                            "data": {
                                "reason": "CHEATING_DETECTED",
                                "message": "Multiple faces detected repeatedly. Interview terminated.",
                                "violation_count": integrity_data.get("violation_count", 0),
                                "alert_history": alert_history,
                            },
                        },
                        session_id,
                    )
                    logger.warning(
                        f"Force-ending session {session_id}: "
                        f"{integrity_data.get('violation_count', 0)} multi-face violations"
                    )

            elif "text" in message:
                text_payload = message["text"]
                try:
                    command = json.loads(text_payload)
                    
                    if command.get("type") == "audio_chunk":
                        # Simulate receiving a base64 or raw array audio chunk
                        # and buffering it until the answer is complete.
                        pass # In production, append to current_audio_buffer

                    elif command.get("type") == "answer_complete":
                        # The client signals they have finished answering the question.
                        transcript = command.get("fallback_transcript", "")
                        
                        await manager.send_json({
                            "type": "system_event",
                            "data": "Evaluating answer..."
                        }, session_id)

                    elif command.get("type") == "get_alert_history":
                        # Client requests the full alert history for persistence
                        integrity_engine = manager.get_integrity_engine(session_id)
                        history = (
                            integrity_engine.get_alert_history()
                            if integrity_engine
                            else []
                        )
                        await manager.send_json(
                            {
                                "type": "alert_history",
                                "data": history,
                            },
                            session_id,
                        )

                except json.JSONDecodeError:
                    pass

    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        logger.error(f"WebSocket error for {session_id}: {e}")
        manager.disconnect(session_id)
