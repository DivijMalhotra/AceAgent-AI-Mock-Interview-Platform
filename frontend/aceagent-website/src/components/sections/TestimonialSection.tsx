// src/components/sections/TestimonialSection.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MessageSquare } from 'lucide-react';

/* ── Testimonial data ── */
const TESTIMONIALS = [
  {
    id: 1,
    quote:
      '"This AI platform has completely transformed the way my team works. We now collaborate in real-time and always meet deadlines."',
    name: 'Sarah W.',
    role: 'Freelance Designer',
    avatar: '/avatars/avatar1.png',
    stars: 5,
    accent: '#7c3aed',
  },
  {
    id: 2,
    quote:
      '"An essential tool for anyone looking to level up their AI skills faster. The feedback system is unmatched."',
    name: 'John D.',
    role: 'Marketing Lead',
    avatar: '/avatars/avatar2.png',
    stars: 5,
    accent: '#06b6d4',
  },
  {
    id: 3,
    quote:
      '"The built-in analytics give me a complete overview of my team\'s productivity. Incredibly powerful."',
    name: 'Alex M.',
    role: 'Freelance Developer',
    avatar: '/avatars/avatar3.png',
    stars: 5,
    accent: '#10b981',
  },
  {
    id: 4,
    quote:
      '"The time-tracking feature has been a game-changer for my freelance projects. It helps me stay organised and productive."',
    name: 'Daniela T.',
    role: 'Operations Manager',
    avatar: '/avatars/avatar4.png',
    stars: 5,
    accent: '#f59e0b',
  },
  {
    id: 5,
    quote:
      '"I love how easy it is to create and assign tasks. The platform\'s interface makes work feel less overwhelming."',
    name: 'Sam J.',
    role: 'Project Coordinator',
    avatar: '/avatars/avatar2.png',
    stars: 5,
    accent: '#ec4899',
  },
  {
    id: 6,
    quote:
      '"AceAgent\'s agentic AI gave me real, actionable feedback after every session. My skills improved drastically."',
    name: 'Priya R.',
    role: 'Software Engineer',
    avatar: '/avatars/avatar1.png',
    stars: 5,
    accent: '#a78bfa',
  },
];

/* ── Star rating ── */
function Stars({ count, color }: { count: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={color}
          style={{ color }}
        />
      ))}
    </div>
  );
}

/* ── Single card ── */
function TestimonialCard({
  t,
  delay = 0,
}: {
  t: (typeof TESTIMONIALS)[0];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4, boxShadow: `0 0 28px ${t.accent}22` }}
      style={{
        background:    'rgba(12,16,50,0.72)',
        backdropFilter:'blur(18px)',
        border:        `1px solid rgba(255,255,255,0.07)`,
        borderRadius:  20,
        padding:       '26px 24px',
        display:       'flex',
        flexDirection: 'column',
        gap:           0,
        transition:    'box-shadow 0.3s, transform 0.3s',
        cursor:        'default',
        height:        '100%',
      }}
    >
      {/* Quote icon */}
      <div
        style={{
          width:          36,
          height:         36,
          borderRadius:   10,
          background:     `${t.accent}18`,
          border:         `1px solid ${t.accent}35`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          marginBottom:   16,
        }}
      >
        <MessageSquare size={16} style={{ color: t.accent }} />
      </div>

      <Stars count={t.stars} color={t.accent} />

      {/* Quote */}
      <p
        style={{
          color:      '#cbd5e1',
          fontSize:   14,
          lineHeight: 1.75,
          flex:       1,
          margin:     0,
          marginBottom: 20,
        }}
      >
        {t.quote}
      </p>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width:        44,
            height:       44,
            borderRadius: '50%',
            overflow:     'hidden',
            border:       `2px solid ${t.accent}55`,
            flexShrink:   0,
            position:     'relative',
          }}
        >
          <Image
            src={t.avatar}
            alt={t.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="44px"
          />
        </div>
        <div>
          <div
            style={{
              color:      '#e2e8f0',
              fontSize:   14,
              fontWeight: 700,
            }}
          >
            {t.name}
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Featured large card ── */
function FeaturedCard() {
  const t = TESTIMONIALS[0];
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      style={{
        background:    'rgba(12,16,50,0.82)',
        backdropFilter:'blur(20px)',
        border:        '1px solid rgba(124,58,237,0.25)',
        borderRadius:  24,
        padding:       '36px 32px',
        display:       'flex',
        flexDirection: 'column',
        gap:           0,
        gridRow:       'span 2',
        boxShadow:     '0 0 40px rgba(124,58,237,0.1)',
      }}
    >
      {/* Top chat bubble decoration */}
      <div
        style={{
          alignSelf:      'flex-start',
          background:     'rgba(255,255,255,0.06)',
          border:         '1px solid rgba(255,255,255,0.1)',
          borderRadius:   14,
          padding:        '10px 16px',
          marginBottom:   28,
          display:        'flex',
          gap:            4,
        }}
      >
        {['#7c3aed', '#06b6d4', '#ec4899'].map((c, i) => (
          <div
            key={i}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: c, opacity: 0.8,
            }}
          />
        ))}
      </div>

      <Stars count={5} color="#7c3aed" />

      <p
        style={{
          color:      '#e2e8f0',
          fontSize:   17,
          lineHeight: 1.8,
          fontWeight: 500,
          flex:       1,
          margin:     0,
          marginBottom: 32,
        }}
      >
        {t.quote}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width:        52,
            height:       52,
            borderRadius: '50%',
            overflow:     'hidden',
            border:       '2px solid rgba(124,58,237,0.5)',
            position:     'relative',
            flexShrink:   0,
          }}
        >
          <Image
            src={t.avatar}
            alt={t.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="52px"
          />
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{t.name}</div>
          <div style={{ color: '#7c3aed', fontSize: 13, marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════ */
export default function TestimonialSection() {
  return (
    <section
      id="testimonials"
      style={{
        background: 'linear-gradient(180deg,#050816 0%,#080d28 50%,#050816 100%)',
        padding:    '96px 0',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Background glow blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%',   width: 500, height: 500, borderRadius: '50%', background: 'rgba(124,58,237,0.05)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(6,182,212,0.05)', filter: 'blur(80px)'  }} />
      </div>

      <div
        style={{
          maxWidth: 1380,
          margin:   '0 auto',
          padding:  '0 32px',
          position: 'relative',
          zIndex:   1,
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          {/* Badge */}
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            8,
              background:     'rgba(124,58,237,0.1)',
              border:         '1px solid rgba(124,58,237,0.3)',
              borderRadius:   99,
              padding:        '6px 18px',
              marginBottom:   20,
            }}
          >
            <MessageSquare size={13} style={{ color: '#a78bfa' }} />
            <span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
              TESTIMONIALS
            </span>
          </div>

          <h2
            className="font-orbitron"
            style={{
              fontSize:   'clamp(26px,3.5vw,48px)',
              fontWeight: 900,
              color:      '#fff',
              lineHeight: 1.15,
              margin:     0,
              marginBottom: 14,
            }}
          >
            PEOPLE JUST LIKE YOU<br />
            <span className="gradient-text">ARE ALREADY USING ACEAGENT</span>
          </h2>

          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Thousands of professionals use AceAgent to sharpen their skills
            and accelerate their careers with agentic AI.
          </p>
        </motion.div>

        {/* ── Bento grid ── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows:    'auto auto',
            gap:                 18,
            alignItems:          'stretch',
          }}
        >
          {/* Col 1 — Featured tall card */}
          <FeaturedCard />

          {/* Col 2 row 1 */}
          <TestimonialCard t={TESTIMONIALS[1]} delay={0.1} />

          {/* Col 3 row 1 */}
          <TestimonialCard t={TESTIMONIALS[2]} delay={0.15} />

          {/* Col 2 row 2 */}
          <TestimonialCard t={TESTIMONIALS[3]} delay={0.2} />

          {/* Col 3 row 2 */}
          <TestimonialCard t={TESTIMONIALS[4]} delay={0.25} />
        </div>

        {/* ── Bottom row — full-width cards ── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 18,
            marginTop:           18,
          }}
        >
          <TestimonialCard t={TESTIMONIALS[5]} delay={0.3} />

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.35 }}
            style={{
              background:    'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))',
              backdropFilter:'blur(18px)',
              border:        '1px solid rgba(124,58,237,0.2)',
              borderRadius:  20,
              padding:       '32px 36px',
              display:       'flex',
              alignItems:    'center',
              gap:           48,
            }}
          >
            {[
              { v: '10K+',  l: 'Active Users',    c: '#a78bfa' },
              { v: '98%',   l: 'Satisfaction',     c: '#06b6d4' },
              { v: '4.9★',  l: 'Average Rating',   c: '#f59e0b' },
              { v: '24/7',  l: 'AI Support',       c: '#10b981' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  className="font-orbitron"
                  style={{ color: s.c, fontSize: 24, fontWeight: 900, marginBottom: 6 }}
                >
                  {s.v}
                </div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}