"""
ACIE Backend — WebSocket Real-Time Layer.
Handles persistent duplex connections for real-time video/audio streaming,
metrics calculation, and dynamic AI interaction.
"""
from __future__ import annotations

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.logging import logger
from app.models.schemas import Question, SessionState
from app.services.audio import whisper_service
from app.services.video import video_processor

router = APIRouter(prefix="/ws", tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        logger.info(f"WebSocket connected: {session_id}")

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            logger.info(f"WebSocket disconnected: {session_id}")

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
    2. Server returns live tracking metrics to overlay.
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
                # Assuming raw bytes are incoming video frames for the vision ML pipeline
                # (In a production system, audio and video streams would likely be segregated or multiplexed)
                raw_bytes = message["bytes"]
                
                # We expect the payload size to dictate whether it's an audio chunk or a full video frame
                # For this demo, let's treat bytes generally as video frame
                metrics = video_processor.process_frame(raw_bytes)
                
                # Stream the calculated metrics back to the frontend immediately for UI overlay!
                await manager.send_json({"type": "live_metrics", "data": metrics}, session_id)

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
                        # In production, we'd fire the Whisper pipeline on current_audio_buffer here.
                        # For now, we mock the transcript to keep the demo clean.
                        transcript = command.get("fallback_transcript", "")
                        
                        await manager.send_json({
                            "type": "system_event",
                            "data": "Evaluating answer..."
                        }, session_id)
                        
                        # At this point, the standard REST API logic (/answer) runs,
                        # but we can optionally proxy it fully through WebSockets.

                except json.JSONDecodeError:
                    pass

    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        logger.error(f"WebSocket error for {session_id}: {e}")
        manager.disconnect(session_id)
