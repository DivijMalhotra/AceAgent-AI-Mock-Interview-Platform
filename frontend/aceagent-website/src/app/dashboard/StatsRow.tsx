'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props { dark: boolean; }

const STATS = [
  {
    label:    'Total Interviews',
    value:    '24',
    trend:    '↑ Increased from last month',
    featured: true,
    small:    false,
  },
  {
    label:    'Avg. Performance Score',
    value:    '78%',
    trend:    '↑ Trending up',
    featured: false,
    small:    false,
  },
  {
    label:    'Top Skill',
    value:    'System Design',
    trend:    '↑ Trending up',
    featured: false,
    small:    true,
  },
  {
    label:    'Interviews Remaining',
    value:    '5',
    trend:    'On Track',
    featured: false,
    small:    false,
  },
];

export default function StatsRow({ dark }: Props) {
  const cardBg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const sub    = dark ? '#64748b' : '#9ca3af';
  const text   = dark ? '#f1f5f9' : '#0f172a';

  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap:                 16,
      }}
    >
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          style={{
            borderRadius: 18,
            padding:      '20px 22px',
            background:   s.featured
              ? 'linear-gradient(145deg,#7c3aed,#6d28d9)'
              : cardBg,
            border:      s.featured ? 'none' : `1px solid ${border}`,
            boxShadow:   s.featured
              ? '0 8px 32px rgba(139,92,246,0.35)'
              : dark
                ? '0 2px 12px rgba(0,0,0,0.2)'
                : '0 2px 12px rgba(0,0,0,0.06)',
            position:   'relative',
            overflow:   'hidden',
            transition: 'background 0.3s',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position:       'absolute',
              top:            16,
              right:          16,
              width:          30,
              height:         30,
              borderRadius:   '50%',
              background:     s.featured
                ? 'rgba(255,255,255,0.2)'
                : dark
                  ? 'rgba(139,92,246,0.08)'
                  : 'rgba(0,0,0,0.05)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpRight
              size={14}
              style={{ color: s.featured ? '#fff' : sub }}
            />
          </div>

          <div
            style={{
              color:        s.featured ? 'rgba(255,255,255,0.85)' : sub,
              fontSize:     12,
              fontWeight:   600,
              marginBottom: 10,
            }}
          >
            {s.label}
          </div>

          <div
            style={{
              color:      s.featured ? '#fff' : text,
              fontSize:   s.small ? 22 : 36,
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: 12,
              fontFamily: s.small
                ? "'Space Grotesk', sans-serif"
                : "'Orbitron', sans-serif",
            }}
          >
            {s.value}
          </div>

          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              background:   s.featured
                ? 'rgba(255,255,255,0.15)'
                : dark
                  ? 'rgba(139,92,246,0.08)'
                  : 'rgba(0,0,0,0.04)',
              borderRadius: 99,
              padding:      '4px 10px',
              width:        'fit-content',
            }}
          >
            <TrendingUp
              size={10}
              style={{ color: s.featured ? '#fff' : '#8b5cf6' }}
            />
            <span
              style={{
                color:      s.featured ? '#fff' : '#8b5cf6',
                fontSize:   10,
                fontWeight: 600,
              }}
            >
              {s.trend}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}