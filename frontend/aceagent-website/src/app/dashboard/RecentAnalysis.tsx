'use client';

import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface Props { dark: boolean; }

const ITEMS = [
  { title: 'Data Structures Round',  score: 82, color: '#8b5cf6', trend: 'up'   },
  { title: 'Behavioral Leadership',  score: 74, color: '#f59e0b', trend: 'down' },
  { title: 'Python Deep Dive',       score: 91, color: '#6366f1', trend: 'up'   },
  { title: 'System Design Basics',   score: 68, color: '#ec4899', trend: 'up'   },
  { title: 'HR Communication Round', score: 79, color: '#22d3ee', trend: 'up'   },
];

export default function RecentAnalysis({ dark }: Props) {
  const bg     = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        borderRadius:  18,
        padding:       '20px 0',
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
      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 20px',
          marginBottom:   16,
        }}
      >
        <div style={{ color: text, fontSize: 15, fontWeight: 700 }}>
          Recent Analysis
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          suppressHydrationWarning
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          4,
            background:   dark
              ? 'rgba(139,92,246,0.08)'
              : 'rgba(0,0,0,0.05)',
            border:       `1px solid ${border}`,
            borderRadius: 99,
            padding:      '4px 12px',
            color:        sub,
            fontSize:     12,
            fontWeight:   600,
            cursor:       'pointer',
            fontFamily:   'inherit',
          }}
        >
          <Plus size={12} /> New
        </motion.button>
      </div>

      {/* List */}
      {ITEMS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * i + 0.4 }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          12,
            padding:      '11px 20px',
            borderBottom: i < ITEMS.length - 1
              ? `1px solid ${border}`
              : 'none',
            cursor:     'pointer',
            transition: 'background 0.15s',
          }}
          whileHover={{
            background: dark
              ? 'rgba(139,92,246,0.04)'
              : 'rgba(0,0,0,0.02)',
          }}
        >
          {/* Dot */}
          <div
            style={{
              width:         32,
              height:        32,
              borderRadius:  10,
              background:    `${item.color}18`,
              border:        `1.5px solid ${item.color}35`,
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              flexShrink:    0,
            }}
          >
            <div
              style={{
                width:        8,
                height:       8,
                borderRadius: '50%',
                background:   item.color,
              }}
            />
          </div>

          {/* Title + bar */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color:         text,
                fontSize:      12,
                fontWeight:    600,
                whiteSpace:    'nowrap',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                marginBottom:  5,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                height:       4,
                background:   dark
                  ? 'rgba(139,92,246,0.08)'
                  : 'rgba(0,0,0,0.06)',
                borderRadius: 99,
                overflow:     'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{
                  duration: 1,
                  delay:    0.1 * i + 0.5,
                  ease:     'easeOut',
                }}
                style={{
                  height:       '100%',
                  background:   item.color,
                  borderRadius: 99,
                }}
              />
            </div>
          </div>

          {/* Score + trend */}
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'flex-end',
              flexShrink:    0,
            }}
          >
            <div
              style={{
                color:      item.color,
                fontSize:   13,
                fontWeight: 800,
              }}
            >
              {item.score}/100
            </div>
            {item.trend === 'up'
              ? <TrendingUp   size={11} style={{ color: '#8b5cf6', marginTop: 2 }} />
              : <TrendingDown size={11} style={{ color: '#ef4444', marginTop: 2 }} />
            }
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}