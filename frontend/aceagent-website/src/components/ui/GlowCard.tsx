'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'cyan' | 'pink';
  hover?: boolean;
}

export const GlowCard = ({ 
  children, 
  className, 
  glowColor = 'purple',
  hover = true 
}: GlowCardProps) => {
  const glowColors = {
    purple: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]',
    blue: 'hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -3 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass-card rounded-2xl transition-all duration-300',
        hover && glowColors[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
};