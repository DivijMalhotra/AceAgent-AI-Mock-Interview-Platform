'use client';

import { motion } from 'framer-motion';
import { Video, Clock } from 'lucide-react';

interface Props { dark: boolean; }

export default function UpcomingInterview({ dark }: Props) {
  const bg     = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      style={{
        borderRadius:  18,
        padding:       '20px 22px',
        background:    bg,
        border:        `1px solid ${border}`,
        boxShadow:     dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        display:       'flex',
        flexDirection: 'column',
        transition:    'background 0.3s',
      }}
    >
      <div
        style={{
          color:        text,
          fontSize:     15,
          fontWeight:   700,
          marginBottom: 20,
        }}
      >
        Upcoming Mock Interview
      </div>

      <div
        style={{
          background:   dark
            ? 'rgba(22,163,74,0.08)'
            : 'rgba(22,163,74,0.06)',
          border:       '1px solid rgba(22,163,74,0.2)',
          borderRadius: 14,
          padding:      16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width:         36,
            height:        36,
            borderRadius:  '50%',
            background:    'linear-gradient(135deg,#16a34a,#15803d)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            marginBottom:  12,
            boxShadow:     '0 4px 12px rgba(22,163,74,0.35)',
          }}
        >
          <Video size={16} style={{ color: '#fff' }} />
        </div>

        <div
          style={{
            color:        text,
            fontSize:     15,
            fontWeight:   800,
            marginBottom: 6,
            lineHeight:   1.3,
          }}
        >
          System Design with AI-Bot Zeta
        </div>

        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            color:      sub,
            fontSize:   12,
          }}
        >
          <Clock size={12} />
          Tomorrow, 10:00 am
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03, filter: 'brightness(1.08)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          width:          '100%',
          padding:        '13px 0',
          borderRadius:   12,
          border:         'none',
          background:     'linear-gradient(135deg,#16a34a,#15803d)',
          color:          '#fff',
          fontSize:       14,
          fontWeight:     700,
          cursor:         'pointer',
          fontFamily:     'inherit',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            8,
          boxShadow:      '0 4px 16px rgba(22,163,74,0.4)',
        }}
      >
        <Video size={15} />
        Join Room
      </motion.button>
    </motion.div>
  );
}