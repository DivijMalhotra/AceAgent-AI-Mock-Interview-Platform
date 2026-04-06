'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare, FileText } from 'lucide-react';

interface ScoreItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Props {
  confidence: number;
  communication: number;
  relevance: number;
  dark: boolean;
}

export default function SectionBreakdown({
  confidence,
  communication,
  relevance,
  dark,
}: Props) {
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  const items: ScoreItem[] = [
    {
      label: 'Confidence',
      value: confidence,
      icon: <ShieldCheck size={16} />,
      color: '#8b5cf6',
    },
    {
      label: 'Communication',
      value: communication,
      icon: <MessageSquare size={16} />,
      color: '#22d3ee',
    },
    {
      label: 'Content Relevance',
      value: relevance,
      icon: <FileText size={16} />,
      color: '#f59e0b',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '24px',
        boxShadow: dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: text,
          marginBottom: 4,
        }}
      >
        Section Breakdown
      </div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 24 }}>
        Performance across key dimensions
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((item, i) => {
          const scoreColor =
            item.value >= 75
              ? '#22c55e'
              : item.value >= 50
              ? '#f59e0b'
              : '#ef4444';

          return (
            <div key={i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: text }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: scoreColor,
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {Math.round(item.value)}%
                </span>
              </div>

              <div
                style={{
                  height: 8,
                  background: dark
                    ? 'rgba(124,58,237,0.08)'
                    : 'rgba(0,0,0,0.06)',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.15 * i + 0.4,
                    ease: 'easeOut',
                  }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${item.color}, ${scoreColor})`,
                    borderRadius: 99,
                    boxShadow: `0 0 8px ${item.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
