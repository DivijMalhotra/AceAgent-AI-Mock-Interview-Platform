'use client';

import { motion } from 'framer-motion';
import {
  Mic,
  BrainCircuit,
  FileText,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  feedback: string[];
  dark: boolean;
}

function categorizeFeedback(items: string[]) {
  const categories: Record<string, { icon: React.ReactNode; color: string; items: string[] }> = {
    Communication: { icon: <Mic size={16} />, color: '#22d3ee', items: [] },
    Confidence: { icon: <BrainCircuit size={16} />, color: '#8b5cf6', items: [] },
    Content: { icon: <FileText size={16} />, color: '#f59e0b', items: [] },
  };

  const commKeywords = ['filler', 'speech', 'voice', 'tone', 'articul', 'clarity', 'communication', 'word'];
  const confKeywords = ['confidence', 'hesitat', 'nervous', 'eye', 'posture', 'body', 'contact'];

  for (const item of items) {
    const lower = item.toLowerCase();
    if (commKeywords.some((k) => lower.includes(k))) {
      categories.Communication.items.push(item);
    } else if (confKeywords.some((k) => lower.includes(k))) {
      categories.Confidence.items.push(item);
    } else {
      categories.Content.items.push(item);
    }
  }

  return categories;
}

export default function AnalysisFeedbackPanel({ feedback, dark }: Props) {
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  const categories = categorizeFeedback(feedback);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '24px',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Lightbulb size={16} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: text }}>AI Feedback</span>
      </div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 24 }}>
        Actionable improvement suggestions
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {Object.entries(categories).map(([catName, cat], ci) => {
          if (cat.items.length === 0) return null;
          return (
            <div key={catName}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: cat.color,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {catName}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 4 }}>
                {cat.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + ci * 0.1 + i * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 14px',
                      background: dark ? '#050816' : '#f8fafc',
                      border: `1px solid ${dark ? 'rgba(124,58,237,0.06)' : 'rgba(0,0,0,0.04)'}`,
                      borderRadius: 10,
                    }}
                  >
                    <AlertCircle
                      size={14}
                      style={{ color: cat.color, flexShrink: 0, marginTop: 2 }}
                    />
                    <span style={{ fontSize: 12, color: text, lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
