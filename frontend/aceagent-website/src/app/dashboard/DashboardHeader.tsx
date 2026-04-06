'use client';

import { Search, Moon, Sun, Bell, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  dark:         boolean;
  onToggleDark: () => void;
}

export default function DashboardHeader({ dark, onToggleDark }: Props) {
  const bg      = dark ? '#161b27' : '#fff';
  const border  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text    = dark ? '#f1f5f9' : '#0f172a';
  const sub     = dark ? '#64748b' : '#9ca3af';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  const inputBorder = dark
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid rgba(0,0,0,0.08)';

  return (
    <div
      style={{
        height:       70,
        background:   bg,
        borderBottom: `1px solid ${border}`,
        display:      'flex',
        alignItems:   'center',
        padding:      '0 24px',
        gap:          12,
        flexShrink:   0,
        transition:   'background 0.3s',
      }}
    >
      {/* Search */}
      <div
        style={{
          flex:     1,
          maxWidth: 440,
          position: 'relative',
          display:  'flex',
          alignItems:'center',
        }}
      >
        <Search
          size={15}
          style={{
            position:      'absolute',
            left:          12,
            color:         sub,
            pointerEvents: 'none',
          }}
        />
        <input
          placeholder="Search interview types, roles, or feedback..."
          style={{
            width:        '100%',
            padding:      '9px 48px 9px 36px',
            background:   inputBg,
            border:       inputBorder,
            borderRadius: 10,
            color:        text,
            fontSize:     13,
            outline:      'none',
            fontFamily:   'inherit',
            transition:   'all 0.2s',
          }}
        />
        <div
          style={{
            position:     'absolute',
            right:        10,
            background:   dark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
            borderRadius: 6,
            padding:      '2px 7px',
            fontSize:     11,
            color:        sub,
            fontFamily:   'monospace',
            pointerEvents:'none',
          }}
        >
          ⌘F
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Dark / Light toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleDark}
        style={{
          width:         38,
          height:        38,
          borderRadius:  '50%',
          background:    inputBg,
          border:        inputBorder,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          cursor:        'pointer',
          flexShrink:    0,
        }}
      >
        {dark
          ? <Sun  size={16} style={{ color: '#f59e0b' }} />
          : <Moon size={16} style={{ color: '#6b7280' }} />
        }
      </motion.button>

      {/* Mail */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        style={{
          width:         38,
          height:        38,
          borderRadius:  '50%',
          background:    inputBg,
          border:        inputBorder,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          cursor:        'pointer',
          flexShrink:    0,
        }}
      >
        <Mail size={16} style={{ color: sub }} />
      </motion.button>

      {/* Bell */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        style={{
          width:         38,
          height:        38,
          borderRadius:  '50%',
          background:    inputBg,
          border:        inputBorder,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          cursor:        'pointer',
          flexShrink:    0,
          position:      'relative',
        }}
      >
        <Bell size={16} style={{ color: sub }} />
        <div
          style={{
            position:     'absolute',
            top:          8,
            right:        8,
            width:        7,
            height:       7,
            borderRadius: '50%',
            background:   '#16a34a',
            border:       `1.5px solid ${bg}`,
          }}
        />
      </motion.button>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width:         38,
            height:        38,
            borderRadius:  '50%',
            background:    'linear-gradient(135deg,#16a34a,#2563eb)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            color:         '#fff',
            fontSize:      14,
            fontWeight:    700,
            flexShrink:    0,
          }}
        >
          T
        </div>
        <div>
          <div
            style={{
              color:      text,
              fontSize:   13,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Totok Michael
          </div>
          <div style={{ color: sub, fontSize: 11 }}>
            tmichael20@mail.com
          </div>
        </div>
      </div>
    </div>
  );
}