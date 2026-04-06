'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Props { dark: boolean; }

const METRICS = [
  {
    name:   'Communication',
    detail: 'Clear and concise, but watch for fillers.',
    status: 'Excellent',
    color:  '#16a34a',
    pct:    92,
    avatar: '🎯',
  },
  {
    name:   'Technical Depth',
    detail: 'Strong understanding of OOP concepts.',
    status: 'Improving',
    color:  '#2563eb',
    pct:    74,
    avatar: '⚙️',
  },
  {
    name:   'Confidence',
    detail: 'AI detected slight hesitation in Q4.',
    status: 'Neutral',
    color:  '#f59e0b',
    pct:    61,
    avatar: '🧠',
  },
  {
    name:   'Problem Solving',
    detail: 'Excellent approach to edge cases.',
    status: 'Excellent',
    color:  '#8b5cf6',
    pct:    88,
    avatar: '💡',
  },
];

const STATUS_COLOR: Record<string, string> = {
  Excellent: '#16a34a',
  Improving: '#2563eb',
  Neutral:   '#f59e0b',
};
const STATUS_BG: Record<string, string> = {
  Excellent: 'rgba(22,163,74,0.12)',
  Improving: 'rgba(37,99,235,0.12)',
  Neutral:   'rgba(245,158,11,0.12)',
};

export default function AIFeedbackPanel({ dark }: Props) {
  const bg     = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';
  const rowDiv = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      style={{
        borderRadius:  18,
        padding:       '20px 0',
        background:    bg,
        border:        `1px solid ${border}`,
        boxShadow:     dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition:    'background 0.3s',
      }}
    >
      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 22px',
          marginBottom:   16,
        }}
      >
        <div>
          <div style={{ color: text, fontSize: 15, fontWeight: 700 }}>
            AI Interview Feedback
          </div>
          <div style={{ color: sub, fontSize: 12, marginTop: 2 }}>
            Evaluation metrics from your last session
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          5,
            background:   'rgba(22,163,74,0.12)',
            border:       '1px solid rgba(22,163,74,0.25)',
            borderRadius: 99,
            padding:      '5px 14px',
            color:        '#16a34a',
            fontSize:     12,
            fontWeight:   700,
            cursor:       'pointer',
            fontFamily:   'inherit',
          }}
        >
          <Plus size={12} /> View All
        </motion.button>
      </div>

      {/* Metrics */}
      {METRICS.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i + 0.5 }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          14,
            padding:      '14px 22px',
            borderBottom: i < METRICS.length - 1
              ? `1px solid ${rowDiv}`
              : 'none',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width:         40,
              height:        40,
              borderRadius:  '50%',
              background:    `${m.color}15`,
              border:        `1.5px solid ${m.color}30`,
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              fontSize:      18,
              flexShrink:    0,
            }}
          >
            {m.avatar}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        8,
                marginBottom: 3,
              }}
            >
              <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>
                {m.name}
              </span>
              <span
                style={{
                  background:   STATUS_BG[m.status] ?? 'rgba(148,163,184,0.12)',
                  color:        STATUS_COLOR[m.status] ?? '#94a3b8',
                  fontSize:     10,
                  fontWeight:   700,
                  borderRadius: 99,
                  padding:      '2px 8px',
                }}
              >
                {m.status}
              </span>
            </div>
            <div style={{ color: sub, fontSize: 11.5, lineHeight: 1.4 }}>
              {m.detail}
            </div>
          </div>

          {/* Pct */}
          <div
            style={{
              color:      m.color,
              fontSize:   14,
              fontWeight: 800,
              minWidth:   38,
              textAlign:  'right',
              flexShrink: 0,
            }}
          >
            {m.pct}%
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}