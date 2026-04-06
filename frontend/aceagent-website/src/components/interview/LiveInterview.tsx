"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "./useInterview";
import { 
  Mic, 
  Camera, 
  Activity, 
  BrainCircuit, 
  MessageSquareQuote,
  Loader2,
  ChevronRight,
  MonitorCheck,
  Zap,
  Target,
  Waves
} from "lucide-react";

export default function LiveInterview({ sessionId }: { sessionId: string }) {
  const { 
    status, 
    metrics, 
    systemMessage, 
    currentQuestion, 
    isEvaluating, 
    videoRef, 
    startMedia, 
    submitAnswer 
  } = useInterview(sessionId);
  
  const [userAnswer, setUserAnswer] = useState("");

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-white">
        <div className="relative mb-8">
          <Loader2 className="w-16 h-16 text-violet-500 animate-spin" />
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
        </div>
        <p className="text-xl font-bold tracking-tight mb-2">Establishing Multi-Modal Connection</p>
        <p className="text-gray-500 text-sm animate-pulse">Initializing Neural Inference Engine...</p>
      </div>
    );
  }

  const eyeContact = metrics?.derived_scores?.eye_contact ?? 0;
  
  return (
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
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* TOP OVERLAYS */}
          <div className="absolute top-5 left-5 flex items-center gap-4">
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/90">Recording</span>
            </div>
          </div>

          <div className="absolute top-5 right-5 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-lg">
            <MonitorCheck size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400/90">Sync_Active</span>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button 
              onClick={startMedia} 
              className="p-3.5 bg-black/60 hover:bg-violet-600/20 backdrop-blur-2xl border border-white/10 hover:border-violet-500/40 rounded-xl transition-all group"
            >
              <Camera className="text-white group-hover:scale-110 transition-transform" size={20} />
            </button>
            <button className="p-3.5 bg-black/60 hover:bg-violet-600/20 backdrop-blur-2xl border border-white/10 hover:border-violet-500/40 rounded-xl transition-all group">
              <Mic className="text-white group-hover:scale-110 transition-transform" size={20} />
            </button>
            <button className="px-6 py-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-2xl border border-red-400/30 rounded-xl transition-all text-white text-xs font-bold tracking-wide">
              End Session
            </button>
          </div>
        </div>

        {/* SUSPICIOUS TRACK STATS */}
        <div className="bg-[#0c1032] p-5 rounded-2xl border border-[rgba(124,58,237,0.12)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600/10 rounded-lg">
                <Target size={14} className="text-violet-400" />
              </div>
              <span className="text-[10px] uppercase text-gray-400 font-black tracking-[0.2em]">Suspicious Track</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Calibration_Stable</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">
              Integrity Score
            </span>
            <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${eyeContact * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-black font-mono text-violet-400 tracking-tighter">
              {Math.round(eyeContact * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
              <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Eyes</span>
              <span className="text-xs font-black text-cyan-400 uppercase">Locked</span>
            </div>
            <div className="bg-[#050816] p-3 rounded-xl border border-[rgba(124,58,237,0.08)]">
              <span className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Audio</span>
              <span className="text-xs font-black text-violet-400 uppercase">Isolated</span>
            </div>
          </div>
        </div>

        {/* COGNITIVE VECTOR OUTPUT */}
        <div className="bg-[#0c1032] p-5 rounded-2xl border border-[rgba(124,58,237,0.12)] flex items-start gap-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-2">Cognitive Vector Output</span>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              {systemMessage || "Establishing baseline... The AI agent is scanning for behavioral markers. Ensure adequate lighting and centering for the neural engine."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: AGENT PROMPT & INPUT */}
      <div className="flex flex-col gap-6">
        
        {/* PROMPT MODULE */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion?.id || 'loading'}
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
                  <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-1">Module_Prompt_v3</span>
                  <span className="block text-xs font-bold text-gray-500">REF_TOKEN: {sessionId.substring(24)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                 <Waves size={14} className="text-violet-400 animate-pulse" />
                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Synthesizing</span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold leading-[1.3] mb-8 text-white tracking-tight">
              {currentQuestion?.text || "Synthesizing an adaptive inquiry sequence based on your unique behavioral baseline..."}
            </h3>

            {/* Dot animation for loading feel */}
            {!currentQuestion && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {currentQuestion?.follow_up && (
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 flex items-center gap-4 shadow-inner mt-4">
                <div className="bg-cyan-500/10 p-2.5 rounded-lg">
                  <MessageSquareQuote size={18} className="text-cyan-400" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Contextual Branch Engaged</span>
                  <p className="text-xs text-cyan-200/50 font-semibold tracking-tight">AI is drilling down into previous response vectors.</p>
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
            <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Upcoming Task</span>
            <span className="text-sm font-bold text-white">Logic Reasoning Phase</span>
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
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-violet-500">Processing Intent</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => {
              submitAnswer(userAnswer);
              setUserAnswer("");
            }}
            disabled={!userAnswer.trim() || isEvaluating}
            className="group relative w-full py-4 rounded-xl font-bold text-white transition-all overflow-hidden active:scale-[0.98] border border-violet-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="relative flex items-center justify-center gap-3">
              <Zap size={16} className="text-violet-200" />
              <span className="uppercase tracking-[0.2em] text-[13px] font-extrabold">Transmit Response</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-violet-200" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
