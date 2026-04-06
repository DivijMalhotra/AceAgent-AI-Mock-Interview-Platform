'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle } from 'lucide-react';
import type { TranscriptEntry } from '@/lib/analysisTypes';

interface Props {
  transcripts: TranscriptEntry[];
  dark: boolean;
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of', 'i mean'];

function highlightFillers(text: string): React.ReactNode[] {
  if (!text) return [text];
  const pattern = new RegExp(`\\b(${FILLER_WORDS.join('|')})\\b`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (FILLER_WORDS.includes(part.toLowerCase())) {
      return (
        <span
          key={i}
          style={{
            background: 'rgba(239,68,68,0.15)',
            color: '#f87171',
            padding: '1px 4px',
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ResponseAnalysis({ transcripts, dark }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  if (!transcripts || transcripts.length === 0) {
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
        <AlertTriangle size={32} style={{ color: sub, marginBottom: 12 }} />
        <div style={{ color: sub, fontSize: 14 }}>No transcript data available</div>
      </motion.div>
    );
  }

  const current = transcripts[selectedIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '24px',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <FileText size={16} style={{ color: '#8b5cf6' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: text }}>
          Response Analysis
        </span>
      </div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 20 }}>
        Transcript with filler word highlighting
      </div>

      {/* Question selector tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {transcripts.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            style={{
              padding: '6px 16px',
              borderRadius: 99,
              border: selectedIdx === i
                ? '1px solid rgba(139,92,246,0.4)'
                : `1px solid ${border}`,
              background: selectedIdx === i
                ? 'rgba(139,92,246,0.15)'
                : 'transparent',
              color: selectedIdx === i ? '#a78bfa' : sub,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Q{i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div
        style={{
          background: dark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
          border: '1px solid rgba(139,92,246,0.12)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#8b5cf6',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 6,
          }}
        >
          Question
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.5 }}>
          {current.question || 'No question text'}
        </div>
      </div>

      {/* Transcript */}
      <div
        style={{
          background: dark ? '#050816' : '#f8fafc',
          border: `1px solid ${dark ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)'}`,
          borderRadius: 12,
          padding: '16px',
          maxHeight: 240,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: sub,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 10,
          }}
        >
          Your Response
        </div>
        <div style={{ fontSize: 13, color: text, lineHeight: 1.7 }}>
          {current.answer
            ? highlightFillers(current.answer)
            : <span style={{ color: sub, fontStyle: 'italic' }}>No response recorded</span>}
        </div>
      </div>

      {current.timestamp && (
        <div style={{ fontSize: 10, color: sub, marginTop: 10, textAlign: 'right' }}>
          Recorded: {new Date(current.timestamp).toLocaleString()}
        </div>
      )}
    </motion.div>
  );
}
