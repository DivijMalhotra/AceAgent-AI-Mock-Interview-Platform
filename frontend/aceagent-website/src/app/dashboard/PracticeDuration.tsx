'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pause, Square, Play } from 'lucide-react';

interface Props { dark: boolean; }

export default function PracticeDuration({ dark }: Props) {
  const [seconds, setSeconds] = useState(5048);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const h   = Math.floor(seconds / 3600);
  const m   = Math.floor((seconds % 3600) / 60);
  const s   = seconds % 60;
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      style={{
        borderRadius:  18,
        padding:       '22px',
        background:    'linear-gradient(145deg,#4c1d95,#6d28d9)',
        boxShadow:     '0 8px 32px rgba(139,92,246,0.35)',
        display:       'flex',
        flexDirection: 'column',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position:      'absolute',
          bottom:        -20,
          right:         -20,
          width:         120,
          height:        120,
          borderRadius:  '50%',
          background:    'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position:      'absolute',
          top:           -30,
          left:          -30,
          width:         100,
          height:        100,
          borderRadius:  '50%',
          background:    'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          color:        'rgba(255,255,255,0.7)',
          fontSize:     13,
          fontWeight:   700,
          marginBottom: 4,
          letterSpacing:0.3,
        }}
      >
        Practice Duration
      </div>
      <div
        style={{
          color:        'rgba(255,255,255,0.5)',
          fontSize:     11,
          marginBottom: 24,
        }}
      >
        Active mock session time this week
      </div>

      {/* Timer */}
      <div
        style={{
          fontFamily:  "'Orbitron', sans-serif",
          fontSize:    34,
          fontWeight:  900,
          color:       '#fff',
          letterSpacing: 2,
          marginBottom:28,
          textShadow:  '0 0 20px rgba(255,255,255,0.3)',
          textAlign:   'center',
        }}
      >
        {fmt(h)}:{fmt(m)}:{fmt(s)}
      </div>

      {/* Controls */}
      <div
        style={{
          display:        'flex',
          gap:            12,
          justifyContent: 'center',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((v) => !v)}
          suppressHydrationWarning
          style={{
            width:         44,
            height:        44,
            borderRadius:  '50%',
            background:    'rgba(255,255,255,0.2)',
            border:        '2px solid rgba(255,255,255,0.3)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            cursor:        'pointer',
            color:         '#fff',
          }}
        >
          {running
            ? <Pause size={16} fill="#fff" />
            : <Play  size={16} fill="#fff" />
          }
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setSeconds(0); setRunning(false); }}
          suppressHydrationWarning
          style={{
            width:         44,
            height:        44,
            borderRadius:  '50%',
            background:    'rgba(239,68,68,0.25)',
            border:        '2px solid rgba(239,68,68,0.4)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            cursor:        'pointer',
          }}
        >
          <Square size={14} fill="#ef4444" style={{ color: '#ef4444' }} />
        </motion.button>
      </div>

      {/* Weekly goal */}
      <div
        style={{
          marginTop:    24,
          paddingTop:   18,
          borderTop:    '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            marginBottom:   8,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
            Weekly Goal
          </span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>
            70%
          </span>
        </div>
        <div
          style={{
            height:       5,
            background:   'rgba(255,255,255,0.15)',
            borderRadius: 99,
            overflow:     'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
            style={{
              height:       '100%',
              background:   '#fff',
              borderRadius: 99,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}