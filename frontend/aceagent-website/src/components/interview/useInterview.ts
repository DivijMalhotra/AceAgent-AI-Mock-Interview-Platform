"use client";

import { useEffect, useRef, useState } from "react";

export function useInterview(sessionId: string) {
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [systemMessage, setSystemMessage] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state
  useEffect(() => {
    async function loadSession() {
      try {
        const { getSessionState } = await import("@/lib/api");
        const { data } = await getSessionState(sessionId);
        if (data?.questions_asked?.length > 0) {
          const lastIdx = data.questions_asked.length - 1;
          setCurrentQuestion(data.questions_asked[lastIdx]);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    }
    if (sessionId) loadSession();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    
    setStatus("connecting");
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
    
    ws.onopen = () => setStatus("active");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "live_metrics") {
          setMetrics(data.data);
        } else if (data.type === "system_event") {
          setSystemMessage(data.data);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };
    
    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("idle");
    
    wsRef.current = ws;

    return () => {
      ws.close();
      stopMedia();
    };
  }, [sessionId]);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      videoIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN && videoRef.current && ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              blob.arrayBuffer().then(buffer => {
                wsRef.current?.send(buffer);
              });
            }
          }, "image/jpeg", 0.6);
        }
      }, 250);

    } catch (e) {
      console.error("Failed to acquire media devices", e);
    }
  };

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
  };

  const submitAnswer = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsEvaluating(true);
    setSystemMessage("AI is analyzing your response...");
    
    try {
      const { submitAnswer: apiSubmitAnswer } = await import("@/lib/api");
      // We pass simulated metrics for now, or just let the backend handle it if we integrated the WS stream better
      // For this phase, we use the REST endpoint to get the structured response
      const response = await apiSubmitAnswer(sessionId, {
        question_id: currentQuestion?.id || "unknown",
        transcript: transcript,
        audio_metrics: metrics?.audio_metrics || {}, // In real scenario, tracked via client
        video_metrics: metrics || {} // Passing last captured live metrics
      });

      if (response.data?.next_question) {
        setCurrentQuestion(response.data.next_question);
        setSystemMessage("Excellent. Next question ready.");
      } else {
        setSystemMessage("Interview Complete. Redirecting to summary...");
        window.location.href = `/interview/${sessionId}/summary`;
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSystemMessage("Failed to evaluate answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    status,
    metrics,
    systemMessage,
    currentQuestion,
    isEvaluating,
    videoRef,
    startMedia,
    stopMedia,
    submitAnswer
  };
}
