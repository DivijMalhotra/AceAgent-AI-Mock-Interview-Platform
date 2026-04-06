'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { Mic, Eye, Activity, Hash } from 'lucide-react';
import type {
  EmotionAnalysis,
  SpeechMetrics,
  GestureAnalysis,
  ContentAnalysis,
} from '@/lib/analysisTypes';

interface Props {
  emotion: EmotionAnalysis;
  speech: SpeechMetrics;
  gesture: GestureAnalysis;
  content: ContentAnalysis;
  dark: boolean;
}

export default function PerformanceInsights({
  emotion,
  speech,
  gesture,
  content,
  dark,
}: Props) {
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  const radarData = [
    { metric: 'Confidence', value: Math.round(emotion.confidence * 100) },
    { metric: 'Engagement', value: Math.round(emotion.engagement * 100) },
    { metric: 'Calmness', value: Math.round((1 - emotion.nervousness) * 100) },
    { metric: 'Eye Contact', value: Math.round(gesture.eye_contact * 100) },
    { metric: 'Posture', value: Math.round(gesture.posture * 100) },
    { metric: 'Clarity', value: speech.clarity_score },
  ];

  const speechCards = [
    {
      label: 'Filler Words',
      value: speech.filler_words,
      unit: 'detected',
      icon: <Hash size={16} />,
      color: speech.filler_words > 15 ? '#ef4444' : speech.filler_words > 8 ? '#f59e0b' : '#22c55e',
    },
    {
      label: 'Speech Rate',
      value: speech.speech_rate,
      unit: 'WPM',
      icon: <Mic size={16} />,
      color: '#8b5cf6',
    },
    {
      label: 'Clarity Score',
      value: speech.clarity_score,
      unit: '/ 100',
      icon: <Activity size={16} />,
      color: speech.clarity_score >= 70 ? '#22c55e' : '#f59e0b',
    },
  ];

  const gestureCards = [
    {
      label: 'Eye Contact',
      value: Math.round(gesture.eye_contact * 100),
      icon: <Eye size={16} />,
      color: '#22d3ee',
    },
    {
      label: 'Posture',
      value: Math.round(gesture.posture * 100),
      icon: <Activity size={16} />,
      color: '#8b5cf6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '24px',
        boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 4 }}>
        Performance Insights
      </div>
      <div style={{ fontSize: 12, color: sub, marginBottom: 24 }}>
        Multi-dimensional behavioral analysis
      </div>

      {/* Radar Chart */}
      <div style={{ marginBottom: 28 }}>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke={dark ? 'rgba(124,58,237,0.15)' : 'rgba(0,0,0,0.08)'} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: sub, fontSize: 10, fontWeight: 600 }}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Speech Metrics */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: sub,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 12,
        }}
      >
        Speech Metrics
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {speechCards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{
              background: dark ? '#050816' : '#f8fafc',
              border: `1px solid ${dark ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: 14,
              padding: '14px 12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: `${c.color}15`,
                border: `1px solid ${c.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.color,
                margin: '0 auto 10px',
              }}
            >
              {c.icon}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: text,
                fontFamily: "'Orbitron', sans-serif",
                lineHeight: 1,
              }}
            >
              {c.value}
            </div>
            <div style={{ fontSize: 10, color: sub, marginTop: 4, fontWeight: 600 }}>
              {c.unit}
            </div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Gesture Analysis */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: sub,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 12,
        }}
      >
        Gesture Analysis
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {gestureCards.map((g, i) => (
          <div key={i}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: g.color }}>{g.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{g.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: g.color }}>
                {g.value}%
              </span>
            </div>
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
                animate={{ width: `${g.value}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                style={{
                  height: '100%',
                  background: g.color,
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: sub,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 12,
        }}
      >
        Keyword Matches
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {content.keyword_match.map((kw, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.06 }}
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
              padding: '5px 14px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {kw}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
