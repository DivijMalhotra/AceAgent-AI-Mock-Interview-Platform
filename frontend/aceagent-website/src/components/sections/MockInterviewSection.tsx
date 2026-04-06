'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Mic } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function MockInterviewSection() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleStartInterview = async () => {
    if (!isSignedIn) {
      router.push('/login');
      return;
    }

    try {
      const { startInterview } = await import('@/lib/api');
      const { data } = await startInterview("General Software Engineering", "medium");
      if (data?.session_id) {
        window.location.href = `/interview/${data.session_id}`;
      }
    } catch (err) {
      console.error("Failed to start interview:", err);
      alert("Could not start interview. Is the backend running?");
    }
  };

  const features = [
    'Engage in full-length, role-specific technical and behavioral mock interviews.',
    'Face a diverse range of questions tailored to top-tier company interview standards.',
    'Benefit from a dynamic, conversational AI interviewer that adapts to your responses.',
  ];

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #050816 0%, #080d28 50%, #050816 100%)',
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
            top: '20%',
            left: '5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.06)',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.05)',
            filter: 'blur(80px)',
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
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                width: 'fit-content',
              }}
            >
              <Mic size={14} style={{ color: '#7c3aed' }} />
              <span
                style={{
                  color: '#7c3aed',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Mock Interviews
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
              Practice anytime, anywhere with the most realistic AI-powered
              interview experience.
            </h2>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {features.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
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
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(124,58,237,0.15)',
                      border: '1.5px solid rgba(124,58,237,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <CheckCircle2 size={12} style={{ color: '#7c3aed' }} />
                  </div>
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 8 }}>
              <Button 
                variant="glow" 
                size="lg"
                onClick={handleStartInterview}
              >
                Start Interview
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(124,58,237,0.2)',
                boxShadow: '0 0 40px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.5)',
                position: 'relative',
              }}
            >
              <Image
                src="/images/mock-interview.png"
                alt="AI Mock Interview"
                width={600}
                height={420}
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
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: -16,
                left: -16,
                background: 'rgba(8,12,40,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(124,58,237,0.35)',
                borderRadius: 14,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 0 20px rgba(124,58,237,0.2)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(124,58,237,0.2)',
                  border: '1.5px solid rgba(124,58,237,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic size={16} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <div
                  style={{
                    color: '#e2e8f0',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  AI Interviewer
                </div>
                <div
                  style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}
                >
                  Live Session Active
                </div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                  marginLeft: 4,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}