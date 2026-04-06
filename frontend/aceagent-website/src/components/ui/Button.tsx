'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'glow' | 'cyan' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const styles = {
  primary: {
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    color: '#fff',
    border: '1px solid rgba(124,58,237,0.4)',
  },
  outline: {
    background: 'transparent',
    color: '#a78bfa',
    border: '1px solid rgba(124,58,237,0.5)',
  },
  glow: {
    background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
    color: '#fff',
    border: '1px solid rgba(236,72,153,0.4)',
    boxShadow: '0 0 20px rgba(236,72,153,0.3)',
  },
  cyan: {
    background: 'linear-gradient(135deg,#06b6d4,#2563eb)',
    color: '#fff',
    border: '1px solid rgba(6,182,212,0.4)',
    boxShadow: '0 0 20px rgba(6,182,212,0.3)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

const pads = {
  sm: '7px 18px',
  md: '9px 24px',
  lg: '12px 32px',
};

const fonts = { sm: 13, md: 14, lg: 15 };

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  style,
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
      style={{
        ...styles[variant],
        padding: pads[size],
        fontSize: fonts[size],
        fontWeight: 600,
        borderRadius: 99,
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}