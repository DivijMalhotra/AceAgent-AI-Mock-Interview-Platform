'use client';

import { motion } from 'framer-motion';

interface Props { dark: boolean; }

const LEGEND = [
  { label: 'Concept Mastery', color: '#16a34a', pct: 72 },
  { label: 'Coding Speed',    color: '#2563eb', pct: 58 },
  { label: 'Soft Skills',     color: '#f59e0b', pct: 81 },
];

export default function ReadinessScore({ dark }: Props) {
  const bg     = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';
  const trackBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const pct   = 68;
  const r     = 54;
  const circ  = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        borderRadius: 18,
        padding:      '20px 22px',
        background:   bg,
        border:       `1px solid ${border}`,
        boxShadow:    dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition:   'background 0.3s',
      }}
    >
      <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
        Readiness Score
      </div>
      <div style={{ color: sub, fontSize: 12, marginBottom: 20 }}>
        Overall interview readiness
      </div>

      {/* Circular gauge */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'center',
          marginBottom:   20,
          position:       'relative',
        }}
      >
        <svg width={140} height={140} viewBox="0 0 140 140">
          <defs>
            <linearGradient id="readGrad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#16a34a" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle
            cx={70} cy={70} r={r}
            fill="none"
            stroke={trackBg}
            strokeWidth={14}
          />
          <motion.circle
            cx={70} cy={70} r={r}
            fill="none"
            stroke="url(#readGrad)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize:   26,
              fontWeight: 900,
              color:      text,
            }}
          >
            {pct}%
          </span>
          <span style={{ color: sub, fontSize: 10, marginTop: 2 }}>
            Readiness
          </span>
        </div>
      </div>

      {/* Legend bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEGEND.map((l, i) => (
          <div key={i}>
            <div
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                marginBottom:   4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div
                  style={{
                    width:        8,
                    height:       8,
                    borderRadius: '50%',
                    background:   l.color,
                  }}
                />
                <span style={{ color: sub, fontSize: 11 }}>{l.label}</span>
              </div>
              <span style={{ color: l.color, fontSize: 11, fontWeight: 700 }}>
                {l.pct}%
              </span>
            </div>
            <div
              style={{
                height:       4,
                background:   trackBg,
                borderRadius: 99,
                overflow:     'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${l.pct}%` }}
                transition={{
                  duration: 1,
                  delay:    0.1 * i + 0.7,
                  ease:     'easeOut',
                }}
                style={{
                  height:       '100%',
                  background:   l.color,
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}