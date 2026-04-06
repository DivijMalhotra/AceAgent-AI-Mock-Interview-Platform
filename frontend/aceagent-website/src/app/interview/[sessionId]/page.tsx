"use client";

import { useParams, useRouter } from "next/navigation";
import LiveInterview from "@/components/interview/LiveInterview";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Orbit } from "lucide-react";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#050110] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-500/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 bg-violet-500/10 blur-xl rounded-full" />
          </div>
          <p className="text-gray-400 font-bold tracking-widest text-xs uppercase animate-pulse">Syncing Neural Session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050110] text-gray-100 overflow-x-hidden selection:bg-violet-500/30">
      
      {/* 1. NON-FIXED INTEGRATED HEADER */}
      <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-6 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-[#0A0015] to-transparent">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group"
          >
            <ArrowLeft size={16} className="text-gray-500 group-hover:text-white transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Terminal</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Orbit size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none mb-1">AceAgent <span className="text-gray-500 font-bold ml-1">Assessment</span></h1>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">{sessionId.substring(0, 8)}:Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500/90">Multi_Modal_Stream_Healthy</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-violet-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Secure Environment</span>
              <span className="text-[8px] font-bold text-gray-600 uppercase">SHA-256 Protocol</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN TERMINAL VIEW */}
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        
        {/* INTRO HUD HEADER - ALIGNED WITH THE GRID */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-violet-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">Behavioral Matrix [V1.02]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
              AI-Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]">Baseline Check</span>
            </h2>
            <div className="max-w-3xl flex items-start gap-6">
              <p className="text-gray-400 leading-relaxed font-medium text-sm md:text-base border-l border-white/10 pl-6">
                The agent is performing structural analysis on your response vectors. 
                Focus on maintaining <span className="text-violet-400 font-bold">eye-contact stability</span> and 
                semantic <span className="text-cyan-400 font-bold">logical coherence</span> for optimal assessment results.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* THE INTEGRATED ASSESSMENT HUB */}
        <div className="relative">
          {/* Subtle frame accents */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-violet-500/20 rounded-tl-3xl pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-violet-500/20 rounded-br-3xl pointer-events-none" />
          
          <LiveInterview sessionId={sessionId} />
        </div>
      </div>
      
      {/* 4. GLOBAL HUD DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-violet-600/[0.03] blur-[100px] rotate-[-15deg]" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[40%] bg-blue-600/[0.03] blur-[100px] rotate-[15deg]" />
      </div>

    </main>
  );
}
