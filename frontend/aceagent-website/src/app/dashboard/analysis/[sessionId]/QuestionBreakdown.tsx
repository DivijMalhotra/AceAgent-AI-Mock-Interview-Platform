'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle, Target } from 'lucide-react';
import type { QuestionWiseAnalysis } from '@/lib/analysisTypes';

interface Props {
  questions: QuestionWiseAnalysis[];
  dark: boolean;
}

export default function QuestionBreakdown({ questions, dark }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  if (!questions || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <Target size={32} style={{ color: sub, marginBottom: 12 }} />
        <div style={{ color: sub, fontSize: 14 }}>No question data available</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '24px',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Target size={16} style={{ color: '#8b5cf6' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: text }}>
          Question-Wise Breakdown
        </span>
      </div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 20 }}>
        Detailed analysis for each question
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {questions.map((q, i) => {
          const isOpen = openIdx === i;
          const scoreColor =
            q.score >= 75 ? '#22c55e' : q.score >= 50 ? '#f59e0b' : '#ef4444';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              style={{
                background: dark ? '#050816' : '#f8fafc',
                border: `1px solid ${dark ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {/* Header — always visible */}
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                {/* Question number badge */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: `${scoreColor}15`,
                    border: `1px solid ${scoreColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: scoreColor,
                    flexShrink: 0,
                  }}
                >
                  Q{i + 1}
                </div>

                {/* Question text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {q.question}
                  </div>
                </div>

                {/* Score */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: scoreColor,
                    fontFamily: "'Orbitron', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {Math.round(q.score)}
                </span>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} style={{ color: sub }} />
                </motion.div>
              </button>

              {/* Expandable body */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 16px 16px',
                        borderTop: `1px solid ${dark ? 'rgba(124,58,237,0.06)' : 'rgba(0,0,0,0.04)'}`,
                      }}
                    >
                      {/* Score bar */}
                      <div style={{ margin: '14px 0' }}>
                        <div
                          style={{
                            height: 6,
                            background: dark ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)',
                            borderRadius: 99,
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${q.score}%` }}
                            transition={{ duration: 0.6 }}
                            style={{
                              height: '100%',
                              background: scoreColor,
                              borderRadius: 99,
                            }}
                          />
                        </div>
                      </div>

                      {/* Feedback */}
                      <div
                        style={{
                          fontSize: 12,
                          color: text,
                          lineHeight: 1.6,
                          marginBottom: 14,
                          padding: '10px 12px',
                          background: dark ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.03)',
                          borderRadius: 8,
                          border: '1px solid rgba(139,92,246,0.08)',
                        }}
                      >
                        {q.feedback}
                      </div>

                      {/* Strengths */}
                      {q.strengths && q.strengths.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#22c55e',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              marginBottom: 6,
                            }}
                          >
                            Strengths
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {q.strengths.map((s, si) => (
                              <span
                                key={si}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  background: 'rgba(34,197,94,0.08)',
                                  border: '1px solid rgba(34,197,94,0.2)',
                                  color: '#22c55e',
                                  padding: '3px 10px',
                                  borderRadius: 99,
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                <CheckCircle2 size={10} />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {q.weaknesses && q.weaknesses.length > 0 && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#f59e0b',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              marginBottom: 6,
                            }}
                          >
                            Areas to Improve
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {q.weaknesses.map((w, wi) => (
                              <span
                                key={wi}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  background: 'rgba(245,158,11,0.08)',
                                  border: '1px solid rgba(245,158,11,0.2)',
                                  color: '#f59e0b',
                                  padding: '3px 10px',
                                  borderRadius: 99,
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                <AlertTriangle size={10} />
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
