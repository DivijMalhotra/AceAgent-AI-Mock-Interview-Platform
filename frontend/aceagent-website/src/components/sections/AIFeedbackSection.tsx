'use client';

import { motion } from 'framer-motion';
import { Zap, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';

export default function AIFeedbackSection() {
  const steps = [
    {
      n: 1,
      text: 'Complete a mock interview session on your own schedule.',
    },
    {
      n: 2,
      text: 'Receive immediate performance scores and detailed analysis across key domains.',
    },
    {
      n: 3,
      text: 'Identify strengths and weaknesses with specific tips to refine your answers.',
    },
  ];

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #050816 0%, #06091f 50%, #050816 100%)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'rgba(245,158,11,0.04)',
            filter: 'blur(90px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '8%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.05)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(245,158,11,0.2)',
                boxShadow: '0 0 40px rgba(245,158,11,0.1), 0 20px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                background: 'rgba(8,12,40,0.6)',
              }}
            >
              <Image
                src="/images/ai-feedback.png"
                alt="AI Feedback Analysis"
                width={600}
                height={480}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                background: 'rgba(8,12,40,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: 14,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 0 20px rgba(245,158,11,0.15)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(245,158,11,0.15)',
                  border: '1.5px solid rgba(245,158,11,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={16} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div
                  style={{
                    color: '#e2e8f0',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Score: 94%
                </div>
                <div
                  style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}
                >
                  Analysis Ready
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                width: 'fit-content',
              }}
            >
              <Zap size={13} style={{ color: '#f59e0b' }} />
              <span
                style={{
                  color: '#f59e0b',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                AI Feedback
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(26px, 3vw, 38px)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Your Personal Interview Coach : Analyze and Improve Your
              Performance Instantly
            </h2>

            <p
              style={{
                color: '#94a3b8',
                fontSize: 15,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Get a detailed breakdown of your interview skills, performance
              scores, and personalized recommendations for improvement from
              our AI-driven assessment tool.
            </p>

            <div>
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 16,
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  textDecorationColor: 'rgba(255,255,255,0.2)',
                }}
              >
                How It Works
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'rgba(245,158,11,0.12)',
                        border: '1.5px solid rgba(245,158,11,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <span
                        style={{
                          color: '#f59e0b',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {step.n}
                      </span>
                    </div>
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: 14,
                        lineHeight: 1.7,
                        paddingTop: 4,
                      }}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <Button variant="primary" size="lg">
                View Your Analysis
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}