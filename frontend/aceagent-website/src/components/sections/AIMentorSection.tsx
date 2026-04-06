'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Zap, Code2, Bug } from 'lucide-react';
import Button from '../ui/Button';

const HOW_IT_WORKS = [
  { n: 1, text: 'Ask a coding-related question.', color: '#f59e0b' },
  { n: 2, text: 'Get instant solutions & explanations.', color: '#f59e0b' },
  { n: 3, text: 'Debug and optimize your code in real time..', color: '#f59e0b' },
];

function RobotIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(124,58,237,0.10))',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 24,
        padding: '48px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 360,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 40% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 20,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Robot */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
        >
          {/* Speech bubble 1 — code */}
          <motion.div
            animate={{ y: [0, -3, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            style={{
              position: 'absolute', top: -60, left: 10,
              background: 'rgba(6,182,212,0.18)',
              border: '1.5px solid rgba(6,182,212,0.45)',
              borderRadius: 12,
              padding: '8px 12px',
              minWidth: 80,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Code lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[80, 60, 90, 50].map((w, i) => (
                <div key={i} style={{
                  height: 4, width: `${w}%`,
                  background: i % 2 === 0
                    ? 'rgba(6,182,212,0.8)'
                    : 'rgba(124,58,237,0.8)',
                  borderRadius: 2,
                }} />
              ))}
            </div>
          </motion.div>

          {/* Speech bubble 2 — tag icon */}
          <motion.div
            animate={{ y: [0, -4, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
            style={{
              position: 'absolute', top: -50, right: -55,
              background: 'rgba(6,182,212,0.22)',
              border: '1.5px solid rgba(6,182,212,0.5)',
              borderRadius: 12,
              width: 52, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Code2 size={22} style={{ color: '#06b6d4' }} />
          </motion.div>

          {/* Robot head */}
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(220,230,255,0.85))',
            border: '3px solid rgba(6,182,212,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 20px rgba(6,182,212,0.3)',
          }}>
            {/* Face */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {/* Eyes */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[0, 1].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#030d2a',
                      border: '3px solid rgba(6,182,212,0.8)',
                    }}
                  />
                ))}
              </div>
              {/* Smile */}
              <div style={{
                width: 22, height: 10,
                border: '2px solid #1e293b',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
              }} />
            </div>
          </div>

          {/* Robot body */}
          <div style={{
            width: 80, height: 75,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.88), rgba(210,225,255,0.8))',
            border: '2px solid rgba(6,182,212,0.35)',
            borderRadius: '12px 12px 8px 8px',
            marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 14px rgba(6,182,212,0.2)',
          }}>
            {/* Chest panel */}
            <div style={{
              width: 44, height: 38,
              background: 'rgba(6,182,212,0.15)',
              border: '1.5px solid rgba(6,182,212,0.4)',
              borderRadius: 8,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <Zap size={14} style={{ color: '#06b6d4' }} />
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: '#06b6d4' }}
                  />
                ))}
              </div>
            </div>
            {/* Left arm pointing */}
            <div style={{
              position: 'absolute', right: -18, top: 10,
              width: 18, height: 8,
              background: 'rgba(255,255,255,0.8)',
              border: '1.5px solid rgba(6,182,212,0.4)',
              borderRadius: '0 8px 8px 0',
              transform: 'rotate(-20deg)',
            }} />
          </div>
        </motion.div>

        {/* Person with laptop */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          {/* Head */}
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.9), rgba(245,158,11,0.85))',
            border: '2px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Hair */}
            <div style={{
              position: 'absolute', top: 0, left: 4, right: 4,
              height: 18,
              background: '#1e293b',
              borderRadius: '50% 50% 0 0',
            }} />
            {/* Face features */}
            <div style={{
              display: 'flex', gap: 8, marginTop: 10,
            }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#1e293b',
                }} />
              ))}
            </div>
          </div>

          {/* Body / shirt */}
          <div style={{
            width: 72, height: 60,
            background: 'linear-gradient(160deg, rgba(99,102,241,0.7), rgba(79,70,229,0.6))',
            border: '1.5px solid rgba(99,102,241,0.4)',
            borderRadius: '10px 10px 4px 4px',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: 4,
            position: 'relative',
          }}>
            {/* Arms */}
            <div style={{
              position: 'absolute', left: -10, top: 16,
              width: 12, height: 32,
              background: 'rgba(251,191,36,0.7)',
              borderRadius: 6,
              transform: 'rotate(15deg)',
            }} />
            <div style={{
              position: 'absolute', right: -10, top: 16,
              width: 12, height: 32,
              background: 'rgba(251,191,36,0.7)',
              borderRadius: 6,
              transform: 'rotate(-15deg)',
            }} />
          </div>

          {/* Laptop */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 90, height: 56,
              background: 'rgba(15,20,50,0.95)',
              border: '2px solid rgba(124,58,237,0.6)',
              borderRadius: '6px 6px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px rgba(124,58,237,0.3)',
            }}>
              {/* Screen content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, width: '100%' }}>
                {[{ w: 70, c: '#a78bfa' }, { w: 90, c: '#06b6d4' }, { w: 55, c: '#10b981' }, { w: 80, c: '#a78bfa' }].map((l, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      height: 4, width: `${l.w}%`,
                      background: l.c, borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{
              width: 96, height: 5,
              background: 'rgba(55,65,81,0.9)',
              borderRadius: '0 0 4px 4px',
              marginLeft: -3,
            }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AIMentorSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #050816 0%, #06091f 50%, #050816 100%)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          width: 450, height: 450, borderRadius: '50%',
          background: 'rgba(245,158,11,0.04)', filter: 'blur(90px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '8%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(6,182,212,0.05)', filter: 'blur(70px)',
        }} />
      </div>

      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 32px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>
          {/* Left — Illustration */}
          <RobotIllustration />

          {/* Right — Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              width: 'fit-content',
            }}>
              <Zap size={13} style={{ color: '#f59e0b' }} />
              <span style={{
                color: '#f59e0b',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}>
                AI mentor
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: 'clamp(26px, 3vw, 38px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.25,
              margin: 0,
            }}>
              Your Personal AI Tutor : Solve Problems Instantly
            </h2>

            {/* Description */}
            <p style={{
              color: '#94a3b8',
              fontSize: 15,
              lineHeight: 1.75,
              margin: 0,
            }}>
              Get step-by-step explanations, debugging help, and personalized
              learning guidance from our AI-powered assistant.
            </p>

            {/* How it works */}
            <div>
              <div style={{
                color: '#e2e8f0',
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 14,
                textDecoration: 'underline',
                textUnderlineOffset: 4,
                textDecorationColor: 'rgba(255,255,255,0.2)',
              }}>
                How It Works
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {HOW_IT_WORKS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                  >
                    {/* Number badge */}
                    <div style={{
                      width: 24, height: 24,
                      borderRadius: '50%',
                      background: `${step.color}20`,
                      border: `1.5px solid ${step.color}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        color: step.color,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        {step.n}
                      </span>
                    </div>
                    <span style={{
                      color: '#94a3b8',
                      fontSize: 14,
                      lineHeight: 1.65,
                      paddingTop: 3,
                    }}>
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 8 }}>
              <Button variant="primary" size="lg">
                Ask AI Mentor
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}