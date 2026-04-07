const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function handleResponse(response: Response, errorMessage: string) {
  if (!response.ok) {
    let detail = "";
    try {
      const data = await response.json();
      detail = data.detail || data.error || JSON.stringify(data);
    } catch (e) {
      detail = response.statusText;
    }
    throw new Error(`${errorMessage}: ${response.status} ${detail}`);
  }
  return response.json();
}

export async function getSessionState(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}`);
  return handleResponse(response, "Failed to fetch session state");
}

export async function submitAnswer(sessionId: string, answer: any) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });
  return handleResponse(response, "Failed to submit answer");
}

export async function startInterview(topic: string, difficulty: string = "medium") {
  const response = await fetch(`${API_URL}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      difficulty,
      duration_minutes: 30,
      focus_areas: []
    }),
  });
  return handleResponse(response, "Failed to start interview");
}

export async function getInterviewSummary(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/summary`);
  return handleResponse(response, "Failed to fetch summary");
}

export async function endInterview(sessionId: string, integrityData?: {
  cheating_detected?: boolean;
  integrity_score?: number;
  violation_count?: number;
  alert_history?: any[];
}) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/end`, {
    method: "POST",
    headers: integrityData ? { "Content-Type": "application/json" } : {},
    body: integrityData ? JSON.stringify(integrityData) : undefined,
  });
  return handleResponse(response, "Failed to end interview");
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/health/ready`);
    return await response.json();
  } catch (e) {
    return { success: false, error: "Backend unreachable" };
  }
}

export async function getInterviewAnalysis(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/analysis`);
  return handleResponse(response, "Failed to fetch analysis");
}

/**
 * Upload a video/audio recording blob to the backend.
 * Uses FormData (multipart) — no JSON Content-Type header.
 */
export async function uploadRecording(
  sessionId: string,
  videoBlob: Blob,
  filename: string = "recording.webm",
) {
  const formData = new FormData();
  formData.append("video_file", videoBlob, filename);

  const response = await fetch(`${API_URL}/interview/${sessionId}/upload`, {
    method: "POST",
    body: formData,
    // No Content-Type header — browser sets it with multipart boundary
  });
  return handleResponse(response, "Failed to upload recording");
}
