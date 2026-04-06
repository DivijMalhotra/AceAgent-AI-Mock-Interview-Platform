"""
ACIE Backend — Video Processing & Facial Tracking.
Integrates OpenCV and MediaPipe for eye-contact and head-pose tracking.
"""
from __future__ import annotations

import cv2
import mediapipe as mp
import numpy as np

from app.core.logging import logger

class VideoProcessor:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        # Initialize the FaceMesh model once per instance for performance
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process_frame(self, frame_bytes: bytes) -> dict:
        """
        Takes raw image bytes (e.g. JPEG from the webcam stream),
        processes the face mesh, and extracts behavioral metrics.
        """
        try:
            # Convert bytes to numpy array then to OpenCV format
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return self._default_metrics()

            # MediaPipe requires RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_frame)

            if not results.multi_face_landmarks:
                return {
                    **self._default_metrics(),
                    "face_detected": False
                }

            face_landmarks = results.multi_face_landmarks[0]
            
            # Compute eye contact and head movement heuristically
            metrics = self._calculate_metrics(face_landmarks, frame.shape)
            metrics["face_detected"] = True
            
            return metrics

        except Exception as e:
            logger.error("Error processing video frame: %s", e)
            return self._default_metrics()

    def _calculate_metrics(self, landmarks, frame_shape) -> dict:
        """
        Derives head pose (yaw, pitch, roll) to estimate eye contact
        and facial alignment with the webcam.
        """
        h, w, _ = frame_shape

        # Grab a few specific 3D landmarks for pose estimation
        # 33: left eye corner, 263: right eye corner, 1: nose tip, 152: chin, 61: left mouth, 291: right mouth
        face_3d = []
        face_2d = []
        
        target_indices = [33, 263, 1, 152, 61, 291]
        
        for idx, lm in enumerate(landmarks.landmark):
            if idx in target_indices:
                x, y = int(lm.x * w), int(lm.y * h)
                face_2d.append([x, y])
                face_3d.append([x, y, lm.z])

        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        # Camera internals (approximate)
        focal_length = 1 * w
        cam_matrix = np.array([
            [focal_length, 0, h / 2],
            [0, focal_length, w / 2],
            [0, 0, 1]
        ])
        dist_matrix = np.zeros((4, 1), dtype=np.float64)

        # Solve PnP (Perspective-n-Point) to get rotation vector
        success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
        
        if not success:
            return self._default_metrics()

        # Convert rotation vector to a rotation matrix
        rmat, _ = cv2.Rodrigues(rot_vec)
        
        # Get angles (yaw, pitch, roll)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
        pitch = angles[0] * 360
        yaw = angles[1] * 360
        roll = angles[2] * 360

        # Heuristic for Eye Contact:
        # If user is looking straight, pitch and yaw should be relatively close to 0
        # Tolerances depend on camera placement, but generally +/- 15 degrees is "looking at camera"
        looking_at_camera = abs(pitch) < 20 and abs(yaw) < 20

        # Normalize eye contact score
        eye_contact_score = 1.0 - (min(20, (abs(pitch) + abs(yaw))/2) / 20.0)

        # Ensure the score stays within bounds
        eye_contact_score = max(0.0, min(1.0, eye_contact_score))

        return {
            "pitch_deg": round(pitch, 2),
            "yaw_deg": round(yaw, 2),
            "roll_deg": round(roll, 2),
            "looking_at_camera": looking_at_camera,
            "derived_scores": {
                "eye_contact": round(eye_contact_score, 2),
                "facial_expression": 0.8  # Placeholder until advanced emotion model is added
            }
        }

    def _default_metrics(self) -> dict:
        return {
            "face_detected": False,
            "pitch_deg": 0.0,
            "yaw_deg": 0.0,
            "roll_deg": 0.0,
            "looking_at_camera": False,
            "derived_scores": {
                "eye_contact": 0.0,
                "facial_expression": 0.0
            }
        }
    
    def close(self):
        """Clean up Mediapipe resources."""
        self.face_mesh.close()

video_processor = VideoProcessor()
