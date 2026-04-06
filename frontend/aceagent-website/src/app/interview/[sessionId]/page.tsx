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
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
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
    <main
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "#f1f5f9",
        fontFamily: "'Space Grotesk', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* TOP HEADER BAR */}
      <div
        style={{
          height: 64,
          background: "rgba(12,16,50,0.65)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(124,58,237,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          gap: 16,
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "transparent",
            border: "1px solid rgba(124,58,237,0.12)",
            borderRadius: 10,
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
            }}
          >
            <Orbit size={16} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>
              AceAgent{" "}
              <span style={{ color: "#64748b", fontWeight: 600 }}>Assessment</span>
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {sessionId.substring(0, 8)}:Active
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 8px rgba(16,185,129,0.6)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "rgba(16,185,129,0.9)",
            }}
          >
            Stream Healthy
          </span>
        </div>

        <div style={{ width: 1, height: 28, background: "rgba(124,58,237,0.12)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={14} style={{ color: "#7c3aed" }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
              Secure
            </div>
            <div style={{ fontSize: 8, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>
              SHA-256
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "28px 28px 40px" }}>
        {/* Page Title */}
        <div style={{ marginBottom: 24 }}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 36,
              fontWeight: 900,
              margin: 0,
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            AI-Cognitive{" "}
            <span className="gradient-text-purple">Baseline Check</span>
          </motion.h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            Phase 1: Neural Signature Calibration
          </p>
        </div>

        <LiveInterview sessionId={sessionId} />
      </div>
    </main>
  );
}
