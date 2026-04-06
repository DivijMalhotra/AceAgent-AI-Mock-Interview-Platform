'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, BarChart2, ArrowRight } from 'lucide-react';
import { useDashboardCtx } from '../layout';
import { startInterview } from '@/lib/api';

export default function AnalysisLandingPage() {
  const router = useRouter();
  const { darkMode, isMobile } = useDashboardCtx();
  const [loading, setLoading] = useState(false);

  const dark = darkMode;
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await startInterview('General', 'medium');
      if (res.data?.session_id) {
        router.push(`/interview/${res.data.session_id}`);
      }
    } catch (err) {
      console.error('Failed to start:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 800,
            color: text,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Session Analysis
        </h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>
          View AI-generated analysis for completed interview sessions.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <BarChart2 size={28} style={{ color: '#8b5cf6' }} />
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: text,
            marginBottom: 8,
          }}
        >
          Complete an Interview to View Analysis
        </div>
        <div
          style={{
            fontSize: 13,
            color: sub,
            maxWidth: 440,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}
        >
          After completing a mock interview session, your AI-powered analysis
          will appear here with detailed scores, behavioral insights, speech
          metrics, and actionable feedback.
        </div>

        <motion.button
          suppressHydrationWarning
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStartInterview}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Start Interview
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
