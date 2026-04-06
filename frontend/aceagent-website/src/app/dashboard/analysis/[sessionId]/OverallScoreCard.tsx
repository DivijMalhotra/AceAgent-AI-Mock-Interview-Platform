'use client';

import { motion } from 'framer-motion';

interface Props {
  score: number;
  label: string;
  dark: boolean;
}

export default function OverallScoreCard({ score, label, dark }: Props) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const glowColor =
    score >= 75
      ? 'rgba(34,197,94,0.3)'
      : score >= 50
      ? 'rgba(245,158,11,0.3)'
      : 'rgba(239,68,68,0.3)';

  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        boxShadow: dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ position: 'relative', width: 170, height: 170 }}>
        <svg
          width={170}
          height={170}
          viewBox="0 0 170 170"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background ring */}
          <circle
            cx={85}
            cy={85}
            r={radius}
            fill="none"
            stroke={dark ? 'rgba(124,58,237,0.1)' : 'rgba(0,0,0,0.06)'}
            strokeWidth={12}
          />
          {/* Score arc */}
          <motion.circle
            cx={85}
            cy={85}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Score text in center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: text,
              fontFamily: "'Orbitron', sans-serif",
              lineHeight: 1,
            }}
          >
            {Math.round(score)}
          </motion.span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: sub,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              marginTop: 4,
            }}
          >
            / 100
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: text,
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work'}
        </div>
      </div>
    </motion.div>
  );
}
