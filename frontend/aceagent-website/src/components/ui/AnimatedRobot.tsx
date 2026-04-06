'use client';

import { motion } from 'framer-motion';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'cyan';
  className?: string;
}

const dims = { sm: { w: 60, h: 76 }, md: { w: 80, h: 100 }, lg: { w: 110, h: 136 } };

export default function AnimatedRobot({ size = 'md', color = 'purple', className = '' }: Props) {
  const { w, h } = dims[size];
  const accent  = color === 'purple' ? '#a855f7' : '#06b6d4';
  const glow    = color === 'purple' ? 'rgba(168,85,247,0.5)' : 'rgba(6,182,212,0.5)';
  const headH   = Math.round(h * 0.35);
  const bodyH   = Math.round(h * 0.5);
  const neckH   = h - headH - bodyH;

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: w, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Head */}
      <div style={{
        width: w * 0.75, height: headH,
        background: 'linear-gradient(160deg,#1e1b4b,#0f0a2e)',
        border: `1px solid ${accent}60`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        position: 'relative',
        boxShadow: `0 0 16px ${glow}`,
      }}>
        {/* Antenna */}
        <div style={{ position: 'absolute', top: -(neckH + 4), left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }}
          />
          <div style={{ width: 2, height: 8, background: '#374151' }} />
        </div>
        {/* Eyes */}
        {[0, 1].map(i => (
          <motion.div key={i}
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.85, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
            style={{ width: headH * 0.22, height: headH * 0.22, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}` }}
          />
        ))}
      </div>

      {/* Neck */}
      <div style={{ width: w * 0.18, height: neckH, background: '#1f2937' }} />

      {/* Body */}
      <div style={{
        width: w, height: bodyH,
        background: 'linear-gradient(160deg,#1e1b4b,#0f0a2e)',
        border: `1px solid ${accent}40`,
        borderRadius: 12,
        position: 'relative',
        boxShadow: `0 0 12px ${glow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Chest grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: 8 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.15 }}
              style={{ width: '100%', height: 4, background: accent, borderRadius: 2 }}
            />
          ))}
        </div>
        {/* Arms */}
        {[-1, 1].map(side => (
          <div key={side} style={{
            position: 'absolute', top: 14,
            [side === -1 ? 'left' : 'right']: -8,
            width: 8, height: bodyH * 0.55,
            background: '#1e1b4b',
            border: `1px solid ${accent}30`,
            borderRadius: side === -1 ? '8px 0 0 8px' : '0 8px 8px 0',
          }} />
        ))}
      </div>
    </motion.div>
  );
}