'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter Plan',
    subtitle: 'The "Aspirant"',
    tag: 'Perfect for students & freshers',
    price: '₹499',
    period: '/ month',
    featured: false,
    badge: null,
    badgeLabel: null,
    cta: 'Get Started',
    learnMore: true,
    features: [
      '5 AI-Generated Mock Interviews',
      'Basic Feedback Report',
      'Single Industry Focus',
      'Standard AI Agent Interviewer',
      'Resume Parser & Alignment',
      'Confidence, Pace & Clarity Scoring',
    ],
  },
  {
    name: 'Pro Plan',
    subtitle: 'The "Career Climber"',
    tag: 'Best choice',
    price: '₹1,299',
    period: '/ month',
    featured: true,
    badge: '⚡',
    badgeLabel: 'Most Popular',
    cta: 'Get Started',
    learnMore: true,
    features: [
      'Unlimited Mock Interviews',
      'Adaptive AI Agents (Multi-turn)',
      'Deep-Dive Technical Rounds',
      'Behavioral Nuance Analysis',
      'Company-Specific Modes (FAANG)',
      'Priority Email Support',
    ],
  },
  {
    name: 'Elite Plan',
    subtitle: 'The "Executive Edge"',
    tag: 'For leadership & high-stakes roles',
    price: '₹2,999',
    period: '/ month',
    featured: false,
    badge: null,
    badgeLabel: null,
    cta: 'Get Started',
    learnMore: true,
    features: [
      'Multi-Agent Panel Interviews',
      'AI Career Coach (Persistent)',
      'Hyper-Personalized Feedback',
      'Mock Interview Recording & Playback',
      'LinkedIn & Portfolio Optimization',
      '24/7 Priority Concierge Support',
    ],
  },
];

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[0];
  index: number;
}) {
  const isFeatured = plan.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.13 }}
      whileHover={{
        y: isFeatured ? -6 : -4,
        transition: { duration: 0.25 },
      }}
      style={{
        position: 'relative',
        borderRadius: 28,
        padding: '36px 32px 32px',
        background: isFeatured
          ? 'linear-gradient(160deg, #2563eb 0%, #1e40af 60%, #1d4ed8 100%)'
          : 'rgba(10,14,44,0.85)',
        border: isFeatured
          ? '1.5px solid rgba(255,255,255,0.18)'
          : '1.5px solid rgba(124,58,237,0.22)',
        backdropFilter: 'blur(24px)',
        boxShadow: isFeatured
          ? '0 24px 80px rgba(37,99,235,0.5), 0 0 0 1px rgba(255,255,255,0.08)'
          : '0 8px 40px rgba(0,0,0,0.35)',
        zIndex: isFeatured ? 3 : 1,
        marginTop: isFeatured ? -28 : 0,
        marginBottom: isFeatured ? -28 : 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        cursor: 'default',
        transform: isFeatured ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Lightning badge */}
      {isFeatured && plan.badge && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: -40,
            right: 28,
            width: 52,
            height: 52,
            borderRadius: 16,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 6px 24px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.5)',
          }}
        >
          {plan.badge}
        </motion.div>
      )}

      {/* Most popular ribbon */}
      {isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 99,
            padding: '3px 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: 0.5,
          }}
        >
          MOST POPULAR
        </div>
      )}

      {/* Plan name & subtitle */}
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            color: isFeatured ? '#fff' : '#e2e8f0',
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: 0.2,
          }}
        >
          {plan.name}
        </div>
        <div
          style={{
            color: isFeatured ? 'rgba(255,255,255,0.65)' : '#7c3aed',
            fontSize: 13,
            fontWeight: 600,
            marginTop: 3,
          }}
        >
          {plan.subtitle}
        </div>
      </div>

      {/* Tag line */}
      <div
        style={{
          color: isFeatured ? 'rgba(255,255,255,0.5)' : '#475569',
          fontSize: 12,
          marginBottom: 24,
          marginTop: 2,
        }}
      >
        {plan.tag}
      </div>

      {/* Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 4,
          marginBottom: 6,
        }}
      >
        <span
          className="font-orbitron"
          style={{
            color: '#fff',
            fontSize: isFeatured ? 56 : 50,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {plan.price}
        </span>
        <span
          style={{
            color: isFeatured ? 'rgba(255,255,255,0.6)' : '#64748b',
            fontSize: 15,
            fontWeight: 500,
            marginBottom: 7,
          }}
        >
          {plan.period}
        </span>
      </div>

      {/* Best choice label */}
      {isFeatured && (
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            marginBottom: 24,
            fontStyle: 'italic',
          }}
        >
          Best choice for professionals
        </div>
      )}
      {!isFeatured && <div style={{ marginBottom: 24 }} />}

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 99,
          border: isFeatured ? 'none' : 'none',
          background: isFeatured
            ? '#fff'
            : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: isFeatured ? '#1d4ed8' : '#fff',
          fontSize: 15,
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 28,
          letterSpacing: 0.3,
          boxShadow: isFeatured
            ? '0 4px 20px rgba(255,255,255,0.25)'
            : '0 4px 20px rgba(124,58,237,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {plan.cta}
      </motion.button>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: isFeatured
            ? 'rgba(255,255,255,0.18)'
            : 'rgba(124,58,237,0.18)',
          marginBottom: 24,
        }}
      />

      {/* Features */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
          flex: 1,
        }}
      >
        {plan.features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i + index * 0.1 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: isFeatured
                  ? 'rgba(255,255,255,0.18)'
                  : 'rgba(37,99,235,0.15)',
                border: isFeatured
                  ? '1.5px solid rgba(255,255,255,0.35)'
                  : '1.5px solid rgba(37,99,235,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <Check
                size={10}
                style={{
                  color: isFeatured ? '#fff' : '#2563eb',
                  strokeWidth: 3.5,
                }}
              />
            </div>
            <span
              style={{
                color: isFeatured ? 'rgba(255,255,255,0.88)' : '#94a3b8',
                fontSize: 13.5,
                lineHeight: 1.55,
                fontWeight: isFeatured ? 500 : 400,
              }}
            >
              {f}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Learn more */}
      {plan.learnMore && (
        <motion.a
          href="#"
          whileHover={{ x: 4 }}
          style={{
            display: 'inline-block',
            marginTop: 24,
            color: isFeatured ? 'rgba(255,255,255,0.7)' : '#7c3aed',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            textDecorationColor: isFeatured
              ? 'rgba(255,255,255,0.35)'
              : 'rgba(124,58,237,0.5)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          Learn more →
        </motion.a>
      )}
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        background:
          'linear-gradient(180deg, #050816 0%, #07091e 50%, #050816 100%)',
        padding: '110px 0 130px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(37,99,235,0.07)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.06)',
            filter: 'blur(90px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.04)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 99,
              padding: '6px 20px',
              marginBottom: 28,
            }}
          >
            <span
              style={{
                color: '#94a3b8',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Pricing
            </span>
          </div>

          <h2
            className="font-orbitron"
            style={{
              fontSize: 'clamp(30px, 4.5vw, 58px)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.08,
              margin: '0 0 16px',
              textShadow: '0 0 40px rgba(124,58,237,0.3)',
            }}
          >
            Simple pricing plans
          </h2>

          <p
            style={{
              color: '#64748b',
              fontSize: 16,
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Transparent pricing for every stage of your career journey.
            No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'stretch',
            padding: '36px 0 56px',
          }}
        >
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 16 }}
        >
          <p style={{ color: '#334155', fontSize: 13 }}>
            All plans include a{' '}
            <span style={{ color: '#7c3aed', fontWeight: 600 }}>
              7-day free trial
            </span>
            . No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}