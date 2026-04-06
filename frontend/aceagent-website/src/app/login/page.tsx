'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

/* ── Animated canvas circuit background ── */
function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Circuit node positions (relative, recomputed on draw)
    const nodes = [
      { x: 0.08, y: 0.18 },
      { x: 0.92, y: 0.18 },
      { x: 0.08, y: 0.82 },
      { x: 0.92, y: 0.82 },
    ];

    // Horizontal / vertical circuit lines from corners to center-ish
    const lines = [
      // top-left corner cluster
      { x1: 0.02, y1: 0.18, x2: 0.14, y2: 0.18 },
      { x1: 0.08, y1: 0.14, x2: 0.08, y2: 0.22 },
      { x1: 0.14, y1: 0.18, x2: 0.32, y2: 0.18 },
      { x1: 0.32, y1: 0.18, x2: 0.32, y2: 0.38 },
      // top-right corner cluster
      { x1: 0.86, y1: 0.18, x2: 0.98, y2: 0.18 },
      { x1: 0.92, y1: 0.14, x2: 0.92, y2: 0.22 },
      { x1: 0.68, y1: 0.18, x2: 0.86, y2: 0.18 },
      { x1: 0.68, y1: 0.18, x2: 0.68, y2: 0.38 },
      // bottom-left corner cluster
      { x1: 0.02, y1: 0.82, x2: 0.14, y2: 0.82 },
      { x1: 0.08, y1: 0.78, x2: 0.08, y2: 0.86 },
      { x1: 0.14, y1: 0.82, x2: 0.32, y2: 0.82 },
      { x1: 0.32, y1: 0.62, x2: 0.32, y2: 0.82 },
      // bottom-right corner cluster
      { x1: 0.86, y1: 0.82, x2: 0.98, y2: 0.82 },
      { x1: 0.92, y1: 0.78, x2: 0.92, y2: 0.86 },
      { x1: 0.68, y1: 0.82, x2: 0.86, y2: 0.82 },
      { x1: 0.68, y1: 0.62, x2: 0.68, y2: 0.82 },
    ];

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Circuit lines
      lines.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(l.x1 * W, l.y1 * H);
        ctx.lineTo(l.x2 * W, l.y2 * H);
        ctx.strokeStyle = 'rgba(124,58,237,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Corner node boxes
      nodes.forEach((n) => {
        const cx = n.x * W;
        const cy = n.y * H;
        const bw = 64, bh = 28;
        ctx.strokeStyle = 'rgba(124,58,237,0.28)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);

        // dot grid inside box
        for (let col = 0; col < 5; col++) {
          for (let row = 0; row < 2; row++) {
            ctx.fillStyle = 'rgba(124,58,237,0.35)';
            ctx.beginPath();
            ctx.arc(
              cx - bw / 2 + 8 + col * 12,
              cy - bh / 2 + 8 + row * 12,
              1.5, 0, Math.PI * 2
            );
            ctx.fill();
          }
        }

        // Pulsing dot
        const pulse = 0.5 + 0.5 * Math.sin(tick * 0.04);
        ctx.beginPath();
        ctx.arc(cx + bw / 2 + 8, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${0.3 + pulse * 0.5})`;
        ctx.fill();
      });

      // Travelling pulse on lines
      const tlPulse = (tick % 160) / 160;
      const tlLine = lines[2]; // top-left horizontal
      ctx.beginPath();
      ctx.arc(
        (tlLine.x1 + (tlLine.x2 - tlLine.x1) * tlPulse) * W,
        tlLine.y1 * H,
        2.5, 0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(167,139,250,0.8)';
      ctx.fill();

      const trPulse = 1 - tlPulse;
      const trLine = lines[6];
      ctx.beginPath();
      ctx.arc(
        (trLine.x1 + (trLine.x2 - trLine.x1) * trPulse) * W,
        trLine.y1 * H,
        2.5, 0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(167,139,250,0.8)';
      ctx.fill();

      tick++;
      animFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

/* ── Orbit ring logo ── */
function LogoMark() {
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#7c3aed',
          borderRightColor: 'rgba(124,58,237,0.3)',
        }}
      />
      {/* Inner bg */}
      <div style={{
        position: 'absolute', inset: 4,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, rgba(124,58,237,0.3), rgba(8,12,40,0.9))',
        border: '1px solid rgba(124,58,237,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Letter A */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L21 20H3L12 3Z" stroke="#a78bfa" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
          <path d="M7.5 14.5H16.5" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── Social button ── */
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, borderColor: 'rgba(124,58,237,0.5)' }}
      whileTap={{ scale: 0.97 }}
      aria-label={label}
      style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8,
        height: 44,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        cursor: 'pointer',
        color: '#cbd5e1',
        fontSize: 13,
        fontWeight: 500,
        transition: 'border-color 0.2s',
      }}
    >
      {icon}
    </motion.button>
  );
}

/* ── Input field ── */
function FormInput({
  type, placeholder, icon, value, onChange, id,
}: {
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${focused ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 10,
      padding: '0 14px',
      height: 48,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
    }}>
      <span style={{ color: focused ? '#a78bfa' : '#475569', flexShrink: 0, transition: 'color 0.2s' }}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#f1f5f9',
          fontSize: 14,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      />
    </div>
  );
}

/* ── Main page ── */
export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    // Simulate async auth
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#080c0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(124,58,237,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.035) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(88,28,135,0.07)', filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '20%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(6,182,212,0.05)', filter: 'blur(100px)',
        }} />
      </div>

      {/* Circuit board canvas */}
      <CircuitBackground />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 420,
          background: 'rgba(10,14,32,0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(124,58,237,0.22)',
          borderRadius: 20,
          padding: '36px 36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.7), transparent)',
          borderRadius: 99,
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <LogoMark />
        </div>

        {/* Heading */}
        <h1 style={{
          textAlign: 'center', margin: '0 0 4px',
          fontSize: 22, fontWeight: 700,
          color: '#f1f5f9', letterSpacing: -0.3,
        }}>
          {tab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 28 }}>
          {tab === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button
                id="switch-to-signup"
                onClick={() => { setTab('signup'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}
              >Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button
                id="switch-to-login"
                onClick={() => { setTab('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}
              >Log in</button>
            </>
          )}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence mode="popLayout">
            {tab === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 48 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <FormInput
                  id="login-name"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={setName}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FormInput
            id="login-email"
            type="email"
            placeholder="email address"
            value={email}
            onChange={setEmail}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />

          <FormInput
            id="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button
                type="button"
                id="forgot-password"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12 }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8, padding: '8px 12px',
                  color: '#fca5a5', fontSize: 13,
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            id="login-submit"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              marginTop: 4,
              height: 48,
              background: loading
                ? 'rgba(124,58,237,0.5)'
                : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4c1d95 100%)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              letterSpacing: 0.3,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.25)',
                    borderTopColor: '#fff',
                  }}
                />
                Authenticating…
              </>
            ) : (
              tab === 'login' ? 'Login' : 'Create Account'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ color: '#334155', fontSize: 12, letterSpacing: 1 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <SocialBtn label="Continue with Apple" icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          } />
          <SocialBtn label="Continue with Google" icon={
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          } />
          <SocialBtn label="Continue with X" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          } />
        </div>

        {/* Bottom micro text */}
        <p style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, marginTop: 20, marginBottom: 0 }}>
          By continuing you agree to our{' '}
          <span style={{ color: '#334155', cursor: 'pointer' }}>Terms</span> &amp;{' '}
          <span style={{ color: '#334155', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
