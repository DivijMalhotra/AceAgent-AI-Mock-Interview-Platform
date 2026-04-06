'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, BarChart2, Gift } from 'lucide-react';
import Button from '../ui/Button';

const FEATURES = [
  {
    icon: CheckCircle2,
    text: 'Join contests at global, national, and even college levels.',
    color: '#7c3aed',
  },
  {
    icon: CheckCircle2,
    text: 'Climb our leaderboards and showcase your success.',
    color: '#7c3aed',
  },
  {
    icon: CheckCircle2,
    text: 'Win rewards, certificates, and internship opportunities that add real value to your professional profile.',
    color: '#7c3aed',
  },
];

function IllustrationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(37,99,235,0.15))',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 24,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 340,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title text inside card */}
      <p style={{
        color: 'rgba(255,255,255,0.35)',
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 1.5,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        Compete in Coding with<br />top talents in the world
      </p>

      {/* Illustration: 3 people at desks */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 24,
        width: '100%',
      }}>
        {/* Person 1 — left, seated at desk */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          {/* Monitor */}
          <div style={{
            width: 52, height: 38,
            background: 'rgba(30,27,75,0.9)',
            border: '2px solid rgba(124,58,237,0.6)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 12px rgba(124,58,237,0.3)',
          }}>
            {/* Code lines on screen */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 6 }}>
              {[70, 50, 80, 40].map((w, i) => (
                <div key={i} style={{
                  height: 3, width: `${w}%`,
                  background: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
                  borderRadius: 2, opacity: 0.8,
                }} />
              ))}
            </div>
            {/* Monitor stand */}
            <div style={{
              position: 'absolute', bottom: -10,
              width: 14, height: 8,
              background: '#374151', borderRadius: '0 0 4px 4px',
            }} />
          </div>
          {/* Desk */}
          <div style={{
            width: 80, height: 6,
            background: 'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))',
            borderRadius: 3, marginTop: 4,
          }} />
          {/* Person body */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            {/* Head */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              border: '2px solid rgba(255,255,255,0.2)',
            }} />
            {/* Body */}
            <div style={{
              width: 30, height: 28,
              background: 'rgba(99,102,241,0.7)',
              borderRadius: '6px 6px 0 0',
              marginTop: 2,
            }} />
          </div>
        </motion.div>

        {/* Person 2 — center, standing (taller) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          {/* Tall desk */}
          <div style={{
            width: 68, height: 48,
            background: 'rgba(30,27,75,0.9)',
            border: '2px solid rgba(6,182,212,0.6)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(6,182,212,0.3)',
          }}>
            {/* Graph on screen */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, padding: 8, height: '100%', paddingTop: 12 }}>
              {[60, 80, 50, 90, 70].map((h, i) => (
                <div key={i} style={{
                  width: 6, height: `${h}%`,
                  background: i % 2 === 0 ? '#06b6d4' : '#7c3aed',
                  borderRadius: '2px 2px 0 0', opacity: 0.9,
                }} />
              ))}
            </div>
          </div>
          {/* Stand */}
          <div style={{
            width: 90, height: 6,
            background: 'linear-gradient(90deg, rgba(6,182,212,0.5), rgba(124,58,237,0.5))',
            borderRadius: 3,
          }} />
          {/* Person */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: '2px solid rgba(255,255,255,0.2)',
            }} />
            <div style={{
              width: 34, height: 32,
              background: 'rgba(124,58,237,0.7)',
              borderRadius: '6px 6px 0 0',
              marginTop: 2,
            }} />
          </div>
        </motion.div>

        {/* Person 3 — right, on bean bag with laptop */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          {/* Laptop */}
          <div style={{ position: 'relative', marginBottom: 4 }}>
            <div style={{
              width: 48, height: 32,
              background: 'rgba(30,27,75,0.9)',
              border: '2px solid rgba(236,72,153,0.6)',
              borderRadius: '6px 6px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(236,72,153,0.3)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 5 }}>
                {[60, 90, 40, 70].map((w, i) => (
                  <div key={i} style={{
                    height: 3, width: `${w}%`,
                    background: i % 2 === 0 ? '#ec4899' : '#a78bfa',
                    borderRadius: 2,
                  }} />
                ))}
              </div>
            </div>
            <div style={{
              width: 54, height: 4,
              background: 'rgba(55,65,81,0.8)',
              borderRadius: '0 0 4px 4px',
            }} />
          </div>
          {/* Bean bag */}
          <div style={{
            width: 50, height: 38,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.5), rgba(234,179,8,0.4))',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: '50% 50% 40% 40%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Person sitting */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -20 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: '2px solid rgba(255,255,255,0.2)',
              }} />
              <div style={{
                width: 26, height: 22,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px 6px 0 0',
                marginTop: 2,
              }} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function CodingContestSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #050816 0%, #080d28 50%, #050816 100%)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(6,182,212,0.05)', filter: 'blur(60px)',
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
          {/* Left — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              width: 'fit-content',
            }}>
              <Trophy size={14} style={{ color: '#7c3aed' }} />
              <span style={{
                color: '#7c3aed',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}>
                Coding Contests
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
              Show off what you've got and learn from top coders worldwide.
            </h2>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div style={{
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: `${f.color}20`,
                    border: `1.5px solid ${f.color}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <f.icon size={12} style={{ color: f.color }} />
                  </div>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: 14,
                    lineHeight: 1.65,
                  }}>
                    {f.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: 8 }}>
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </div>
          </motion.div>

          {/* Right — Illustration card */}
          <IllustrationCard />
        </div>
      </div>
    </section>
  );
}