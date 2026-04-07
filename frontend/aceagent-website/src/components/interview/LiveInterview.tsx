"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "./useInterview";
import {
  Mic,
  Camera,
  BrainCircuit,
  MessageSquareQuote,
  Loader2,
  ChevronRight,
  MonitorCheck,
  Zap,
  Target,
  Waves,
  Circle,
  Square,
  RotateCcw,
  LogOut,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Users,
  Activity,
  ShieldAlert,
  ShieldCheck,
  ScanFace,
} from "lucide-react";

// ── Helper: format seconds → MM:SS ──
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Helper: integrity score → color ──
function getIntegrityColor(score: number): string {
  if (score >= 0.8) return "from-emerald-400 via-emerald-500 to-cyan-400";
  if (score >= 0.6) return "from-amber-400 via-yellow-500 to-orange-400";
  return "from-red-500 via-red-600 to-rose-500";
}

function getIntegrityGlow(score: number): string {
  if (score >= 0.8) return "rgba(16,185,129,0.5)";
  if (score >= 0.6) return "rgba(245,158,11,0.5)";
  return "rgba(239,68,68,0.5)";
}

function getIntegrityTextColor(score: number): string {
  if (score >= 0.8) return "text-emerald-400";
  if (score >= 0.6) return "text-amber-400";
  return "text-red-400";
}

function getIntegrityLabel(score: number): string {
  if (score >= 0.9) return "Excellent";
  if (score >= 0.8) return "Good";
  if (score >= 0.6) return "Fair";
  if (score >= 0.4) return "Poor";
  return "Critical";
}

// ── Alert badge config ──
const ALERT_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string; borderColor: string }> = {
  MULTI_FACE: {
    icon: <Users size={12} />,
    label: "Multiple Faces",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    borderColor: "border-red-500/30",
  },
  LOOKING_AWAY: {
    icon: <Eye size={12} />,
    label: "Looking Away",
    color: "text-amber-400",
    bgColor: "bg-amber-500/15",
    borderColor: "border-amber-500/30",
  },
  EXCESSIVE_BLINKING: {
    icon: <Activity size={12} />,
    label: "Blink Anomaly",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15",
    borderColor: "border-yellow-500/30",
  },
  NO_FACE: {
    icon: <ScanFace size={12} />,
    label: "No Face Detected",
    color: "text-gray-400",
    bgColor: "bg-gray-500/15",
    borderColor: "border-gray-500/30",
  },
};

// ── Gaze direction → display ──
function getGazeDisplay(direction: string): { label: string; color: string } {
  switch (direction) {
    case "center": return { label: "Centered", color: "text-cyan-400" };
    case "left":   return { label: "Left", color: "text-amber-400" };
    case "right":  return { label: "Right", color: "text-amber-400" };
    case "up":     return { label: "Up", color: "text-amber-400" };
    case "down":   return { label: "Down", color: "text-amber-400" };
    default:       return { label: "Unknown", color: "text-gray-400" };
  }
}

export default function LiveInterview({ sessionId }: { sessionId: string }) {
  const {
    status,
    metrics,
    systemMessage,
    currentQuestion,
    isEvaluating,
    videoRef,
    startMedia,
    submitAnswer,
    // Recording
    isRecording,
    recordingTime,
    videoBlob,
    uploadProgress,
    startRecording,
    stopRecording,
    resetRecording,
    // End interview
    handleEndInterview,
    // 🔥 NEW: Integrity monitoring
    alertHistory,
    multiViolationCount,
    isCalibrating,
    cheatingDetected,
  } = useInterview(sessionId);

  const [userAnswer, setUserAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  // 🔥 Active alerts (deduplicated from current frame)
  const currentAlerts: string[] = metrics?.integrity?.alerts ?? [];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += transcript + " ";
            } else {
              interim += transcript;
            }
          }
          setUserAnswer(finalTranscriptRef.current + interim);
        };

        recognition.onerror = (e: any) =>
          console.error("Speech Recognition Error", e);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }

    // Cleanup TTS
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech for questions
  useEffect(() => {
    if (currentQuestion?.text && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentQuestion]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const baseText = userAnswer.trim();
      finalTranscriptRef.current = baseText ? baseText + " " : "";
      setUserAnswer(finalTranscriptRef.current);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition", e);
      }
    }
  };

  // ── CONNECTING STATE ──
  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-white">
        <div className="relative mb-8">
          <Loader2 className="w-16 h-16 text-violet-500 animate-spin" />
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
        </div>
        <p className="text-xl font-bold tracking-tight mb-2">
          Establishing Multi-Modal Connection
        </p>
        <p className="text-gray-500 text-sm animate-pulse">
          Initializing Neural Inference Engine...
        </p>
      </div>
    );
  }

  // ── ENDING / UPLOADING / REDIRECTING STATE ──
  if (
    status === "ending" ||
    status === "uploading" ||
    status === "redirecting"
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="relative mb-8">
          {status === "redirecting" ? (
            cheatingDetected ? (
              <ShieldAlert className="w-16 h-16 text-red-500" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            )
          ) : (
            <Loader2 className="w-16 h-16 text-violet-500 animate-spin" />
          )}
          <div
            className={`absolute inset-0 ${
              status === "redirecting"
                ? cheatingDetected
                  ? "bg-red-500/20"
                  : "bg-emerald-500/20"
                : "bg-violet-500/20"
            } blur-xl rounded-full`}
          />
        </div>
        <p className="text-xl font-bold tracking-tight mb-2">
          {status === "ending" && (cheatingDetected ? "Terminating Session..." : "Ending Interview...")}
          {status === "uploading" && "Uploading Recording..."}
          {status === "redirecting" && (cheatingDetected ? "Cheating Flagged" : "Analysis Ready!")}
        </p>
        <p className="text-gray-500 text-sm">
          {uploadProgress || systemMessage}
        </p>

        {/* Cheating alert details */}
        {cheatingDetected && status === "redirecting" && (
          <div className="mt-6 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl max-w-md">
            <p className="text-sm text-red-300 text-center">
              Multiple face violations detected ({multiViolationCount} occurrences).
              This session has been flagged for review.
            </p>
          </div>
        )}

        {/* Upload progress bar */}
        {status === "uploading" && (
          <div className="w-64 mt-6">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                initial={{ width: "10%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 8, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Upload size={12} className="text-violet-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Transmitting Data
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const eyeContact = metrics?.derived_scores?.eye_contact ?? 0;
  const integrityScore = metrics?.integrity?.score ?? eyeContact;
  const gazeDirection = metrics?.gaze_direction ?? "center";
  const blinkRate = metrics?.blink_rate ?? 0;
  const faceCount = metrics?.face_count ?? 0;
  const integrityCalibrated = metrics?.integrity?.calibrated ?? false;
  const gazeDisplay = getGazeDisplay(gazeDirection);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 1. LEFT COLUMN: VISUAL HUD */}
        <div className="space-y-6">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
            {/* VIDEO FEED */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1] opacity-90 transition-opacity group-hover:opacity-100"
            />

            {/* HUD SCANNING LINE */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
              <motion.div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent absolute top-0 left-0"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* 🔥 CALIBRATION OVERLAY */}
            <AnimatePresence>
              {isCalibrating && status === "active" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bottom-16 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md pointer-events-none"
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="w-20 h-20 rounded-full border-4 border-violet-500/30"
                      style={{ borderTopColor: "rgb(139, 92, 246)" }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <ScanFace
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400"
                      size={30}
                    />
                  </div>
                  <span className="text-sm font-black uppercase tracking-[0.3em] text-violet-400 mb-3">
                    Calibrating
                  </span>
                  <p className="text-xs text-gray-400 text-center max-w-[220px] leading-relaxed">
                    Look directly at the camera and blink naturally
                  </p>
                  <div className="flex gap-1.5 mt-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-violet-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔥 MULTI-FACE WARNING BADGE ON VIDEO */}
            <AnimatePresence>
              {currentAlerts.includes("MULTI_FACE") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-5 py-3 bg-red-500/20 backdrop-blur-xl border border-red-500/40 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                      }}
                    >
                      <Users size={16} className="text-red-400" />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 block">
                        Multiple Faces — Warning {multiViolationCount}/3
                      </span>
                      <span className="text-[9px] text-red-300/60">
                        Ensure only your face is visible
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TOP LEFT: Recording indicator with timer */}
            <div className="absolute top-5 left-5 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/10">
                {isRecording ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-red-400">
                      REC {formatTime(recordingTime)}
                    </span>
                  </>
                ) : videoBlob ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400">
                      Recorded {formatTime(recordingTime)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/60">
                      Ready
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="absolute top-5 right-5 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-lg">
              <MonitorCheck size={14} className="text-cyan-400" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400/90">
                Sync_Active
              </span>
            </div>

            {/* BOTTOM CONTROLS — recording + end session */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {/* Camera */}
              <button
                onClick={startMedia}
                className="p-3.5 bg-black/60 hover:bg-violet-600/20 backdrop-blur-2xl border border-white/10 hover:border-violet-500/40 rounded-xl transition-all group"
                title="Start Camera"
              >
                <Camera
                  className="text-white group-hover:scale-110 transition-transform"
                  size={20}
                />
              </button>

              {/* Mic */}
              <button
                onClick={toggleMic}
                className={`p-3.5 backdrop-blur-2xl border rounded-xl transition-all group ${
                  isListening
                    ? "bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"
                    : "bg-black/60 hover:bg-violet-600/20 border-white/10 hover:border-violet-500/40"
                }`}
                title={isListening ? "Stop Dictation" : "Start Dictation"}
              >
                <Mic
                  className={`${
                    isListening ? "text-red-400" : "text-white"
                  } group-hover:scale-110 transition-transform`}
                  size={20}
                />
              </button>

              {/* Record / Stop Record */}
              {!isRecording && !videoBlob && (
                <button
                  onClick={startRecording}
                  className="p-3.5 bg-black/60 hover:bg-red-600/20 backdrop-blur-2xl border border-white/10 hover:border-red-500/40 rounded-xl transition-all group"
                  title="Start Recording"
                >
                  <Circle
                    className="text-red-400 group-hover:scale-110 transition-transform"
                    size={20}
                    fill="currentColor"
                  />
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="p-3.5 bg-red-500/20 backdrop-blur-2xl border border-red-500/50 rounded-xl transition-all group shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  title="Stop Recording"
                >
                  <Square
                    className="text-red-400 group-hover:scale-110 transition-transform"
                    size={18}
                    fill="currentColor"
                  />
                </button>
              )}

              {/* Re-record (only if blob exists) */}
              {videoBlob && !isRecording && (
                <button
                  onClick={resetRecording}
                  className="p-3.5 bg-black/60 hover:bg-amber-600/20 backdrop-blur-2xl border border-white/10 hover:border-amber-500/40 rounded-xl transition-all group"
                  title="Re-record"
                >
                  <RotateCcw
                    className="text-amber-400 group-hover:scale-110 transition-transform"
                    size={18}
                  />
                </button>
              )}

              {/* End Session */}
              <button
                onClick={() => setShowEndConfirm(true)}
                className="px-6 py-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-2xl border border-red-400/30 rounded-xl transition-all text-white text-xs font-bold tracking-wide"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={14} />
                  End Session
                </div>
              </button>
            </div>
          </div>

          {/* SUSPICIOUS TRACK STATS — 🔥 ENHANCED */}
          <div className="bg-[#0c1032] p-5 rounded-2xl border border-[rgba(124,58,237,0.12)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600/10 rounded-lg">
                  <Target size={14} className="text-violet-400" />
                </div>
                <span className="text-[10px] uppercase text-gray-400 font-black tracking-[0.2em]">
                  Integrity Monitor
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                  integrityCalibrated
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    integrityCalibrated ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-wider ${
                    integrityCalibrated ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {integrityCalibrated ? "Calibrated" : "Calibrating..."}
                </span>
              </div>
            </div>

            {/* 🔥 INTEGRITY SCORE BAR — Dynamic color */}
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter whitespace-nowrap">
                Integrity Score
              </span>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getIntegrityColor(integrityScore)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${integrityScore * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    boxShadow: `0 0 10px ${getIntegrityGlow(integrityScore)}`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black font-mono tracking-tighter ${getIntegrityTextColor(integrityScore)}`}
                >
                  {Math.round(integrityScore * 100)}%
                </span>
                <span
                  className={`text-[8px] font-bold uppercase tracking-wide ${getIntegrityTextColor(integrityScore)}`}
                >
                  {getIntegrityLabel(integrityScore)}
                </span>
              </div>
            </div>

            {/* 🔥 DETAILED METRICS GRID */}
            <div className="grid grid-cols-4 gap-2">
              {/* Gaze Direction */}
              <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">
                  Gaze
                </span>
                <span className={`text-xs font-black uppercase ${gazeDisplay.color}`}>
                  {gazeDisplay.label}
                </span>
              </div>

              {/* Blink Rate */}
              <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">
                  Blinks
                </span>
                <span
                  className={`text-xs font-black ${
                    blinkRate > 40 || blinkRate < 5
                      ? "text-amber-400"
                      : "text-violet-400"
                  }`}
                >
                  {Math.round(blinkRate)}{" "}
                  <span className="text-[8px] font-bold text-gray-500">bpm</span>
                </span>
              </div>

              {/* Face Count */}
              <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">
                  Faces
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-black ${
                      faceCount > 1
                        ? "text-red-400"
                        : faceCount === 1
                        ? "text-cyan-400"
                        : "text-gray-500"
                    }`}
                  >
                    {faceCount}
                  </span>
                  {faceCount > 1 && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <AlertTriangle size={10} className="text-red-400" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Violations */}
              <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">
                  Alerts
                </span>
                <span
                  className={`text-xs font-black ${
                    multiViolationCount > 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {multiViolationCount}/3
                </span>
              </div>
            </div>

            {/* 🔥 ACTIVE ALERT BADGES */}
            <AnimatePresence>
              {currentAlerts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 overflow-hidden"
                >
                  {currentAlerts.map((alert) => {
                    const config = ALERT_CONFIG[alert];
                    if (!config) return null;
                    return (
                      <motion.div
                        key={alert}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                          className={config.color}
                        >
                          {config.icon}
                        </motion.div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COGNITIVE VECTOR OUTPUT */}
          <div className="bg-[#0c1032] p-5 rounded-2xl border border-[rgba(124,58,237,0.12)] flex items-start gap-4 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-2">
                Cognitive Vector Output
              </span>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {systemMessage ||
                  "Establishing baseline... The AI agent is scanning for behavioral markers. Ensure adequate lighting and centering for the neural engine."}
              </p>
            </div>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: AGENT PROMPT & INPUT */}
        <div className="flex flex-col gap-6">
          {/* PROMPT MODULE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?.id || "loading"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-[#0c1032] backdrop-blur-3xl p-8 rounded-2xl border border-[rgba(124,58,237,0.12)] shadow-2xl relative"
            >
              {/* AMBIENT HUD ACCENTS */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-[100px] rounded-full" />

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                    <BrainCircuit className="text-violet-400" size={24} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-1">
                      Module_Prompt_v3
                    </span>
                    <span className="block text-xs font-bold text-gray-500">
                      REF_TOKEN: {sessionId.substring(24)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                  <Waves
                    size={14}
                    className="text-violet-400 animate-pulse"
                  />
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                    Synthesizing
                  </span>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold leading-[1.3] mb-8 text-white tracking-tight">
                {currentQuestion?.text ||
                  "Synthesizing an adaptive inquiry sequence based on your unique behavioral baseline..."}
              </h3>

              {/* Dot animation for loading feel */}
              {!currentQuestion && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div
                    className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}

              {currentQuestion?.follow_up && (
                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 flex items-center gap-4 shadow-inner mt-4">
                  <div className="bg-cyan-500/10 p-2.5 rounded-lg">
                    <MessageSquareQuote size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">
                      Contextual Branch Engaged
                    </span>
                    <p className="text-xs text-cyan-200/50 font-semibold tracking-tight">
                      AI is drilling down into previous response vectors.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* UPCOMING TASK */}
          <div className="bg-[#0c1032] p-4 rounded-2xl border border-[rgba(124,58,237,0.12)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <BrainCircuit className="text-violet-400" size={20} />
            </div>
            <div className="flex-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">
                Upcoming Task
              </span>
              <span className="text-sm font-bold text-white">
                Logic Reasoning Phase
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </div>

          {/* INPUT HUB */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Synthesize your technical vector here..."
                disabled={isEvaluating}
                className="w-full bg-[#050816] backdrop-blur-2xl border border-[rgba(139,92,246,0.1)] rounded-2xl p-6 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-violet-500/40 focus:ring-4 focus:ring-violet-500/[0.05] min-h-[160px] resize-none transition-all disabled:opacity-40 disabled:scale-[0.98] font-medium text-sm leading-relaxed"
              />

              <AnimatePresence>
                {isEvaluating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl rounded-2xl z-20 border border-violet-500/20"
                  >
                    <div className="relative mb-6">
                      <Loader2 className="w-14 h-14 text-violet-500 animate-spin" />
                      <div className="absolute inset-0 bg-violet-600/30 blur-2xl rounded-full" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-violet-500">
                      Processing Intent
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons row */}
            <div className="flex gap-3">
              {/* Submit Answer */}
              <button
                onClick={() => {
                  submitAnswer(userAnswer);
                  setUserAnswer("");
                  finalTranscriptRef.current = "";
                }}
                disabled={!userAnswer.trim() || isEvaluating}
                className="group relative flex-1 py-4 rounded-xl font-bold text-white transition-all overflow-hidden active:scale-[0.98] border border-violet-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)",
                  boxShadow:
                    "0 6px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="relative flex items-center justify-center gap-3">
                  <Zap size={16} className="text-violet-200" />
                  <span className="uppercase tracking-[0.2em] text-[13px] font-extrabold">
                    Transmit Response
                  </span>
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform text-violet-200"
                  />
                </div>
              </button>

              {/* Submit & End (shortcut) */}
              <button
                onClick={async () => {
                  if (userAnswer.trim()) {
                    await submitAnswer(userAnswer);
                    setUserAnswer("");
                    finalTranscriptRef.current = "";
                  }
                  handleEndInterview();
                }}
                disabled={isEvaluating}
                className="group py-4 px-5 rounded-xl font-bold text-white transition-all overflow-hidden active:scale-[0.98] border border-amber-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #d97706, #b45309, #92400e)",
                  boxShadow:
                    "0 6px 24px rgba(217,119,6,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                title="Submit current answer and end interview"
              >
                <div className="relative flex items-center justify-center gap-2">
                  <Upload size={14} />
                  <span className="uppercase tracking-[0.15em] text-[11px] font-extrabold">
                    Submit & End
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* END SESSION CONFIRMATION MODAL */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            onClick={() => setShowEndConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0c1032] border border-[rgba(124,58,237,0.2)] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    End Interview Session?
                  </h3>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Your recording and all responses will be submitted for AI
                analysis. You'll be redirected to your detailed performance
                report.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-bold tracking-wide hover:bg-white/5 transition-all"
                >
                  Continue Interview
                </button>
                <button
                  onClick={() => {
                    setShowEndConfirm(false);
                    handleEndInterview();
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 border border-red-500/30 text-white text-sm font-bold tracking-wide transition-all shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogOut size={14} />
                    End & Analyze
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
