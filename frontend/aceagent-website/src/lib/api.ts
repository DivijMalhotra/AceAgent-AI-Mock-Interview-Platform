const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getSessionState(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch session state");
  }

  return response.json();
}

export async function submitAnswer(sessionId: string, answer: any) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answer");
  }

  return response.json();
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

  if (!response.ok) {
    throw new Error("Failed to start interview");
  }

  return response.json();
}

export async function getInterviewSummary(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/summary`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch summary");
  }

  return response.json();
}

export async function endInterview(sessionId: string) {
  const response = await fetch(`${API_URL}/interview/${sessionId}/end`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to end interview");
  }

  return response.json();
}
