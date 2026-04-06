"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "./useInterview";
import { 
  Mic, 
  Camera, 
  Video, 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  MessageSquareQuote,
  Loader2,
  ChevronRight
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse">Establishing Secure AI Connection...</p>
      </div>
    );
  }

  const eyeContact = metrics?.derived_scores?.eye_contact ?? 0;
  
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      
      {/* LEFT COLUMN: VISUAL HUD & TRACKING */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="relative aspect-video bg-gray-950 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          {/* OVERLAY: SCANNING EFFECT */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-violet-500/5 to-transparent h-1/4 w-full animate-[scan_4s_linear_infinite]" />
          
          {/* HUD CORNERS */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">Rec_Active</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              Multi_Modal_Sync
            </div>
          </div>

          {/* REAL-TIME STATS HUD */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">Face Track</span>
                  <Activity size={12} className="text-cyan-400" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${eyeContact * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{Math.round(eyeContact * 100)}%</span>
                </div>
                <div className="mt-2 text-[9px] font-mono text-gray-500">
                  COORD: {metrics?.pitch_deg?.toFixed(1) || 0}, {metrics?.yaw_deg?.toFixed(1) || 0}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={startMedia} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl transition-all group">
                <Camera className="text-white group-hover:scale-110 transition-transform" size={20} />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl transition-all group">
                <Mic className="text-white group-hover:scale-110 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* SYSTEM MESSAGES / LOGS */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-start gap-4">
          <div className="bg-violet-500/20 p-2 rounded-lg">
            <ShieldCheck className="text-violet-400" size={18} />
          </div>
          <div>
            <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider mb-1">System Engine Status</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {systemMessage || "Ready to begin. Please answer clearly when ready."}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE AGENT */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* QUESTION CARD */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion?.id || 'loading'}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-violet-500/20 shadow-[0_0_40px_rgba(124,58,237,0.1)] relative overflow-hidden"
          >
            {/* AGENT AVATAR GLOW */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                <BrainCircuit className="text-violet-400" size={20} />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-violet-400">Inquiry_0{currentQuestion?.id ? 'x' : '0'}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-8 text-white/90">
              {currentQuestion?.text || "Generating next intelligent prompt..."}
            </h3>

            {currentQuestion?.follow_up && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-6 inline-flex items-center gap-2">
                <MessageSquareQuote size={14} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Contextual Follow-up</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* RESPONSE INPUT */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Articulate your response here..."
              disabled={isEvaluating}
              className="w-full bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 min-h-[200px] resize-none transition-all disabled:opacity-50"
            />
            {isEvaluating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-3xl">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              submitAnswer(userAnswer);
              setUserAnswer("");
            }}
            disabled={!userAnswer.trim() || isEvaluating}
            className="group relative w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl font-bold text-white shadow-lg hover:shadow-violet-500/20 transition-all disabled:hidden overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <span>Transmit Response</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
      
      {/* GLOBAL CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </div>
  );
}
