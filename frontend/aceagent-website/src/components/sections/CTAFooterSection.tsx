'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NAV_LINKS = {
  col1: [
    { label: 'About Us',    href: '#' },
    { label: 'Contact',     href: '#' },
    { label: "What's New",  href: '#' },
    { label: 'Careers',     href: '#' },
  ],
  col2: [
    { label: 'Product',      href: '#' },
    { label: 'Solutions',    href: '#' },
    { label: 'Integrations', href: '#' },
    { label: 'Price',        href: '#' },
  ],
};

const APP_ICONS = [
  { emoji: '🔢', label: 'Counter',   top: '18%', left: '18%',  size: 64, rotate: -8  },
  { emoji: '💬', label: 'Messages',  top: '38%', left: '6%',   size: 56, rotate: 4   },
  { emoji: '✅', label: 'Tasks',     top: '62%', left: '14%',  size: 60, rotate: -6  },
  { emoji: '🚩', label: 'Flag',      top: '24%', left: '34%',  size: 58, rotate: 5   },
  { emoji: '🕐', label: 'Clock',     top: '50%', left: '27%',  size: 58, rotate: -4  },
  { emoji: '⏳', label: 'Timer',     top: '68%', left: '38%',  size: 60, rotate: 6   },
  { emoji: '📅', label: 'Calendar',  top: '18%', left: '54%',  size: 62, rotate: 3   },
  { emoji: '⏱️', label: 'Stopwatch', top: '52%', left: '56%',  size: 56, rotate: -5  },
  { emoji: '💡', label: 'Ideas',     top: '20%', left: '72%',  size: 62, rotate: 7   },
  { emoji: '»',  label: 'More',      top: '55%', left: '74%',  size: 60, rotate: -3  },
];

function AppIcon({
  icon,
  index,
}: {
  icon: (typeof APP_ICONS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      animate={{ y: [0, -6, 0] }}
      style={{
        position: 'absolute',
        top: icon.top,
        left: icon.left,
        width: icon.size,
        height: icon.size,
        borderRadius: icon.size * 0.25,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: icon.size * 0.42,
        transform: `rotate(${icon.rotate}deg)`,
        boxShadow:
          '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        cursor: 'default',
      }}
    >
      {icon.emoji === '»' ? (
        <span
          style={{
            color: '#2563eb',
            fontSize: icon.size * 0.38,
            fontWeight: 900,
          }}
        >
          »
        </span>
      ) : (
        icon.emoji
      )}
    </motion.div>
  );
}

export default function CTAFooterSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #050816 0%, #030610 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Top CTA band ── */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(8,12,40,0.95), rgba(12,16,50,0.98))',
          borderTop: '1px solid rgba(124,58,237,0.15)',
          borderBottom: '1px solid rgba(124,58,237,0.1)',
          padding: '64px 32px 48px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Dot grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top row: logo + nav links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 48,
              marginBottom: 56,
            }}
          >
            {/* Left: logo + tagline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ maxWidth: 360 }}
            >
              {/* Logo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#2563eb',
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#7c3aed',
                    }}
                  />
                </div>
                <span
                  className="font-orbitron"
                  style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}
                >
                  AceAgent
                </span>
              </div>

              {/* Tagline */}
              <h3
                style={{
                  color: '#fff',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                Stay organized and
                <br />
                boost your productivity
              </h3>
            </motion.div>

            {/* Right: nav columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', gap: 64 }}
            >
              {[NAV_LINKS.col1, NAV_LINKS.col2].map((col, ci) => (
                <div
                  key={ci}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {col.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ x: 4 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#94a3b8',
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          '#e2e8f0')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          '#94a3b8')
                      }
                    >
                      <ArrowRight size={13} style={{ opacity: 0.5 }} />
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── App icons floating area ── */}
      <div
        style={{
          position: 'relative',
          height: 280,
          background:
            'linear-gradient(180deg, rgba(8,12,40,0.98) 0%, rgba(3,6,16,1) 100%)',
          borderTop: '1px solid rgba(124,58,237,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }}
        />

        {/* Floating app icons */}
        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 1100, margin: '0 auto' }}>
          {APP_ICONS.map((icon, i) => (
            <AppIcon key={icon.label} icon={icon} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          background: 'rgba(3,6,16,1)',
          borderTop: '1px solid rgba(124,58,237,0.08)',
          padding: '20px 32px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span style={{ color: '#334155', fontSize: 13 }}>
            © 2024. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  color: '#334155',
                  fontSize: 13,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = '#94a3b8')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = '#334155')
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}