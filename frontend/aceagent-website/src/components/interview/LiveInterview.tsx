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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* 1. LEFT COLUMN: VISUAL HUD */}
      <div className="space-y-8">
        <div className="relative aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl glass-dark group">
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
          <div className="absolute top-10 left-10 flex items-center gap-4">
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/90">Recording</span>
            </div>
          </div>

          <div className="absolute top-10 right-10 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
            <MonitorCheck size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400/90">Sync_Active</span>
          </div>

          {/* LOWER HUD: STATS & CONTROLS */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 min-w-[280px] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-600/10 rounded-xl">
                    <Target size={16} className="text-violet-400" />
                  </div>
                  <span className="text-[10px] uppercase text-gray-400 font-black tracking-[0.2em]">Suspicious Track</span>
                </div>
                <Activity size={16} className="text-cyan-400" />
              </div>
              
              <div className="flex items-center gap-5">
                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${eyeContact * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-black font-mono text-cyan-400 tracking-tighter">
                  {Math.round(eyeContact * 100)}%
                </span>
              </div>
              
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500/30" />
                  COORD: <span className="text-gray-400">[{metrics?.pitch_deg?.toFixed(1) || 0}, {metrics?.yaw_deg?.toFixed(1) || 0}]</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Calibration_Stable</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={startMedia} 
                className="p-5 bg-black/60 hover:bg-violet-600/20 backdrop-blur-2xl border border-white/10 hover:border-violet-500/40 rounded-3xl transition-all group"
              >
                <Camera className="text-white group-hover:scale-110 transition-transform" size={24} />
              </button>
              <button className="p-5 bg-black/60 hover:bg-violet-600/20 backdrop-blur-2xl border border-white/10 hover:border-violet-500/40 rounded-3xl transition-all group">
                <Mic className="text-white group-hover:scale-110 transition-transform" size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* STATUS FOOTER */}
        <div className="bg-[#0A0D1E] p-8 rounded-[3rem] border border-white/5 flex items-start gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-4 rounded-2xl border border-violet-500/20">
            <Zap className="text-violet-400" size={24} />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-2">Cognitive Vector Output</span>
            <p className="text-base text-gray-400 leading-relaxed font-semibold">
              {systemMessage || "Establishing baseline... The AI agent is scanning for behavioral markers. Ensure adequate lighting and centering for the neural engine."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: AGENT PROMPT & INPUT */}
      <div className="flex flex-col gap-10">
        
        {/* PROMPT MODULE */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion?.id || 'loading'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-black/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* AMBIENT HUD ACCENTS */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-[100px] rounded-full" />
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[1.5rem] bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                  <BrainCircuit className="text-violet-400" size={30} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-1">Module_Prompt_v3</span>
                  <span className="block text-xs font-bold text-gray-500">REF_TOKEN: {sessionId.substring(24)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                 <Waves size={16} className="text-violet-400 animate-pulse" />
                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Synthesizing</span>
              </div>
            </div>

            <h3 className="text-2xl md:text-4xl font-extrabold leading-[1.25] mb-12 text-white tracking-tight">
              {currentQuestion?.text || "Synthesizing an adaptive inquiry sequence based on your unique behavioral baseline..."}
            </h3>

            {currentQuestion?.follow_up && (
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-3xl p-6 flex items-center gap-5 shadow-inner">
                <div className="bg-cyan-500/10 p-3 rounded-2xl">
                  <MessageSquareQuote size={20} className="text-cyan-400" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Contextual Branch Engaged</span>
                  <p className="text-xs text-cyan-200/50 font-semibold tracking-tight">AI is drilling down into previous response vectors.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* INPUT HUB */}
        <div className="space-y-6">
          <div className="relative">
            <textarea 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Synthesize your technical vector here..."
              disabled={isEvaluating}
              className="w-full bg-[#050816]/60 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-12 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-violet-500/40 focus:ring-8 focus:ring-violet-500/[0.03] min-h-[280px] resize-none transition-all disabled:opacity-40 disabled:scale-[0.98] font-bold text-xl leading-relaxed shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
            
            <AnimatePresence>
              {isEvaluating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl rounded-[3.5rem] z-20 border border-violet-500/20"
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
            className="group relative w-full py-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-800 rounded-[3rem] font-black text-white shadow-[0_30px_60px_-15px_rgba(124,58,237,0.4)] hover:shadow-[0_40px_80px_-15px_rgba(124,58,237,0.6)] transition-all disabled:opacity-0 disabled:translate-y-8 overflow-hidden active:scale-[0.98] border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-4">
              <span className="uppercase tracking-[0.2em] text-xs font-black">Transmit Vector Sequence</span>
              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
