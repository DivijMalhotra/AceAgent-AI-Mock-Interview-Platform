'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import dynamic from 'next/dynamic';

const Robot3D = dynamic(() => import('../ui/Robot3D'), {
  ssr: false,
  loading: () => null,
});

const PARTICLES = [
  { x: 8, y: 15 }, { x: 22, y: 72 }, { x: 38, y: 8 }, { x: 52, y: 88 },
  { x: 68, y: 30 }, { x: 84, y: 62 }, { x: 14, y: 45 }, { x: 30, y: 92 },
  { x: 58, y: 18 }, { x: 76, y: 78 }, { x: 92, y: 22 }, { x: 5, y: 60 },
  { x: 44, y: 50 }, { x: 80, y: 85 }, { x: 18, y: 28 }, { x: 62, y: 40 },
  { x: 90, y: 10 }, { x: 34, y: 55 }, { x: 72, y: 5 }, { x: 48, y: 70 },
];

function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(167,139,250,0.5)',
            pointerEvents: 'none',
          }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.22,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

const FEATURES = [
  {
    n: '01',
    title: 'TEAMLESS COLLABORATION',
    desc: 'To achieve up to 10x symbol on 10% ownership.',
    bg: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.35)',
  },
  {
    n: '02',
    title: 'PROFESSIONAL INFRASTRUCTURE',
    desc: 'Enterprise grade performance and powerful benefits.',
    bg: 'rgba(37,99,235,0.12)',
    border: 'rgba(37,99,235,0.35)',
  },
  {
    n: '03',
    title: 'CUSTOMIZABLE WORKSPACE',
    desc: 'Adapt different roles and user integrations with control.',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.35)',
  },
  {
    n: '04',
    title: 'FUTURE-PROOF TECHNOLOGY',
    desc: 'Built on scalable, secure blockchain infrastructure.',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.35)',
  },
];

export default function HeroSection() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: '#050816',
        paddingTop: 90,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D Robot */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          right: '-3%',
          transform: 'translateY(-50%)',
          width: '60%',
          height: '95%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
          <Robot3D fillParent scale={1.65} showRings fov={45} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '40%',
            background:
              'linear-gradient(90deg,#050816 0%,rgba(5,8,22,0.75) 55%,transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10%',
            background: 'linear-gradient(180deg,#050816 0%,transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '15%',
            background: 'linear-gradient(0deg,#050816 0%,transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Grid + glows + particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          className="grid-bg"
          style={{ position: 'absolute', inset: 0, opacity: 0.28 }}
        />
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '3%',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.06)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '5%',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.05)',
            filter: 'blur(65px)',
          }}
        />
        <Particles />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1380,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            minHeight: 'calc(100vh - 220px)',
          }}
        >
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 99,
                padding: '6px 16px',
                width: 'fit-content',
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#a855f7',
                }}
              />
              <span style={{ color: '#c084fc', fontSize: 12, fontWeight: 500 }}>
                AI-Powered Platform
              </span>
            </div>

            <h1
              className="font-orbitron"
              style={{
                fontSize: 'clamp(32px,4.5vw,58px)',
                fontWeight: 900,
                lineHeight: 1.08,
                color: '#fff',
                margin: 0,
                textShadow: '0 2px 40px rgba(0,0,0,0.95)',
              }}
            >
              MASTER YOUR
              <br />
              PATH WITH
              <br />
              <span className="gradient-text-purple">AGENTIC AI</span>
            </h1>

            <p
              style={{
                color: '#cbd5e1',
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 420,
                margin: 0,
              }}
            >
              Practice, feedback, and holistic skill validation, all on one
              autonomous platform. Your AI agent works tirelessly so you can
              focus on growth.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="glow" size="lg" onClick={goToLogin}>
                Join Now
              </Button>
              <Button variant="outline" size="lg" onClick={goToLogin}>
                Learn More
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 36, paddingTop: 8 }}>
              {[
                { v: '10K+', l: 'Active Users' },
                { v: '98%', l: 'Satisfaction' },
                { v: '24/7', l: 'AI Support' },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="font-orbitron"
                    style={{
                      color: '#a78bfa',
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {s.v}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT HUD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ position: 'relative', height: 520, pointerEvents: 'none' }}
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="glass-dark"
              style={{
                position: 'absolute',
                left: 0,
                top: '38%',
                borderRadius: 14,
                padding: '12px 14px',
                width: 130,
                border: '1px solid rgba(124,58,237,0.4)',
                pointerEvents: 'auto',
              }}
            >
              <div
                className="font-orbitron"
                style={{
                  color: '#a78bfa',
                  fontSize: 9,
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                AI AGENT
              </div>
              <div
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Active
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-end',
                  height: 24,
                }}
              >
                {[6, 10, 8, 14, 11, 16, 9].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    style={{
                      flex: 1,
                      height: h,
                      background: '#7c3aed',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="glass-dark"
              style={{
                position: 'absolute',
                right: 0,
                top: '5%',
                borderRadius: 14,
                padding: '12px 14px',
                width: 148,
                border: '1px solid rgba(6,182,212,0.4)',
                pointerEvents: 'auto',
              }}
            >
              <div
                className="font-orbitron"
                style={{
                  color: '#06b6d4',
                  fontSize: 9,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                PERFORMANCE
              </div>
              {[
                { v: 80, c: '#06b6d4' },
                { v: 65, c: '#7c3aed' },
                { v: 92, c: '#10b981' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 4,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.v}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      style={{
                        height: '100%',
                        background: item.c,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: 9,
                      minWidth: 22,
                    }}
                  >
                    {item.v}%
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ paddingBottom: 64 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
            }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: f.bg,
                  border: `1px solid ${f.border}`,
                  borderRadius: 14,
                  padding: '16px 14px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: 22,
                    fontWeight: 900,
                    marginBottom: 6,
                  }}
                >
                  {f.n}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 4,
                    lineHeight: 1.35,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 11,
                    lineHeight: 1.55,
                  }}
                >
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}