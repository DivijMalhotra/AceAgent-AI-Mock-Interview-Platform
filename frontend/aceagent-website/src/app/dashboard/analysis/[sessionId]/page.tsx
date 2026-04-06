'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertTriangle, BarChart2 } from 'lucide-react';
import { useDashboardCtx } from '../../layout';
import { getInterviewAnalysis } from '@/lib/api';
import type { AnalysisData } from '@/lib/analysisTypes';

import OverallScoreCard from './OverallScoreCard';
import SectionBreakdown from './SectionBreakdown';
import PerformanceInsights from './PerformanceInsights';
import ResponseAnalysis from './ResponseAnalysis';
import AnalysisFeedbackPanel from './AnalysisFeedbackPanel';
import QuestionBreakdown from './QuestionBreakdown';
import DownloadReport from './DownloadReport';

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { darkMode, isMobile, isTablet } = useDashboardCtx();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const response = await getInterviewAnalysis(sessionId);
        if (response.data) {
          setData(response.data as AnalysisData);
        } else {
          setError('No analysis data returned');
        }
      } catch (err: any) {
        console.error('Failed to fetch analysis:', err);
        setError(err.message || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [sessionId]);

  const dark = darkMode;
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  // ── Loading ──
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 20,
        }}
      >
        <div style={{ position: 'relative' }}>
          <Loader2
            size={48}
            style={{ color: '#8b5cf6' }}
            className="animate-spin"
          />
          <div
            style={{
              position: 'absolute',
              inset: -8,
              background: 'rgba(139,92,246,0.15)',
              borderRadius: '50%',
              filter: 'blur(12px)',
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: text,
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Generating AI Analysis
          </div>
          <div style={{ fontSize: 12, color: sub, textAlign: 'center' }}>
            Processing behavioral data and scoring metrics...
          </div>
        </div>

        {/* Skeleton cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: 16,
            width: '100%',
            marginTop: 20,
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: 120,
                borderRadius: 18,
                background: dark ? 'rgba(124,58,237,0.06)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${dark ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)'}`,
              }}
              className="animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !data) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 16,
        }}
      >
        <AlertTriangle size={48} style={{ color: '#f59e0b' }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: text }}>
          Analysis Unavailable
        </div>
        <div style={{ fontSize: 13, color: sub, textAlign: 'center', maxWidth: 400 }}>
          {error || 'Could not load analysis data for this session.'}
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            marginTop: 8,
            padding: '10px 24px',
            borderRadius: 10,
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#8b5cf6',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ── Main content ──
  const mainGrid = isMobile ? '1fr' : isTablet ? '1fr 1fr' : '280px 1fr';
  const bottomGrid = isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr';

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'transparent',
                border: `1px solid ${dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.08)'}`,
                color: sub,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <ArrowLeft size={14} />
              Dashboard
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.15)',
                borderRadius: 99,
              }}
            >
              <BarChart2 size={12} style={{ color: '#8b5cf6' }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#8b5cf6',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {data.topic} • {data.difficulty}
              </span>
            </div>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: isMobile ? 24 : 32,
              fontWeight: 800,
              color: text,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            AI Interview{' '}
            <span className="gradient-text-purple">Analysis</span>
          </motion.h1>
          <p style={{ color: sub, fontSize: 13, marginTop: 4, marginBottom: 0 }}>
            Session {sessionId.substring(0, 8)} •{' '}
            {data.total_questions} questions • {data.total_answers} answered
          </p>
        </div>

        <div style={{ width: isMobile ? '100%' : 220 }}>
          <DownloadReport reportRef={reportRef} sessionId={sessionId} dark={dark} />
        </div>
      </div>

      {/* Report content (captured for PDF) */}
      <div ref={reportRef}>
        {/* Row 1: Overall Score + Section Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mainGrid,
            gap: 20,
            marginBottom: 20,
          }}
        >
          <OverallScoreCard score={data.overall_score} label="Overall Score" dark={dark} />
          <SectionBreakdown
            confidence={data.confidence_score}
            communication={data.communication_score}
            relevance={data.content_analysis.relevance_score}
            dark={dark}
          />
        </div>

        {/* Row 2: Performance Insights (full width) */}
        <div style={{ marginBottom: 20 }}>
          <PerformanceInsights
            emotion={data.emotion_analysis}
            speech={data.speech_metrics}
            gesture={data.gesture_analysis}
            content={data.content_analysis}
            dark={dark}
          />
        </div>

        {/* Row 3: Response Analysis + AI Feedback */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: bottomGrid,
            gap: 20,
            marginBottom: 20,
          }}
        >
          <ResponseAnalysis transcripts={data.transcripts} dark={dark} />
          <AnalysisFeedbackPanel feedback={data.feedback} dark={dark} />
        </div>

        {/* Row 4: Question Breakdown (full width) */}
        <QuestionBreakdown questions={data.question_wise_analysis} dark={dark} />
      </div>
    </>
  );
}
