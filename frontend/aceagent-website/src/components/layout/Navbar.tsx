'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const links = [
  { label: 'Home',       href: '#hero'      },
  { label: 'Technology', href: '#workspace' },
  { label: 'About',      href: '#agency'    },
  { label: 'Pricing',    href: '#pricing'   },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 20px' }}>
        <div
          className="glass-dark"
          style={{
            borderRadius: 16,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
            transition: 'box-shadow 0.3s',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              className="font-orbitron"
              style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1,
              }}
            >
              AceAgent
            </span>
          </div>

          {/* Desktop nav */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            className="hidden md:flex"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  color: '#94a3b8',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '6px 16px',
                  borderRadius: 99,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#fff';
                  (e.target as HTMLElement).style.background =
                    'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#94a3b8';
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            className="hidden md:flex"
          >
            <button
              onClick={goToDashboard}
              style={{
                color: '#94a3b8',
                fontSize: 13,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Learn more
            </button>

            <button
              onClick={goToDashboard}
              style={{
                background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
                color: '#fff',
                border: 'none',
                borderRadius: 99,
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Join Us
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 4,
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="glass-dark"
              style={{ borderRadius: 16, marginTop: 8, padding: '12px 16px' }}
            >
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    color: '#cbd5e1',
                    fontSize: 14,
                    padding: '10px 12px',
                    borderRadius: 10,
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </a>
              ))}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  marginTop: 10,
                  paddingTop: 10,
                  display: 'flex',
                  gap: 10,
                }}
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    goToDashboard();
                  }}
                  style={{
                    color: '#94a3b8',
                    fontSize: 13,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Learn More
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    goToDashboard();
                  }}
                  style={{
                    background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 99,
                    padding: '7px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Join Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}