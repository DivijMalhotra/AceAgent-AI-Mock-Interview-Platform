'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState, useRef } from 'react';
import { useLoadingStore } from '@/lib/loadingStore';

/* ─────────────────────────────────────────
   Skeleton sub-components (unchanged visually)
───────────────────────────────────────── */
function NavbarSkeleton() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '12px 20px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        background: 'rgba(8,12,40,0.75)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(124,58,237,0.18)', borderRadius: 16,
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Skeleton className="h-7 w-28 rounded-lg" />
        <div style={{ display: 'flex', gap: 12 }}>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingLeft: 32, paddingRight: 32, maxWidth: 1380, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Skeleton className="h-7 w-44 rounded-full" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-5/6 rounded-xl" />
            <Skeleton className="h-14 w-4/6 rounded-xl" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-4/6 rounded-lg" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
          <div style={{ display: 'flex', gap: 36, paddingTop: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-3 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: 520 }}>
          {/* Robot placeholder — pulses while loading */}
          <div style={{ position: 'absolute', right: '5%', top: '10%', width: '55%', height: '80%' }}>
            <Skeleton className="h-full w-full rounded-3xl" />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '3px solid rgba(124,58,237,0.3)',
                borderTopColor: '#7c3aed',
                animation: 'spin 1s linear infinite',
              }} />
              <span style={{ color: 'rgba(124,58,237,0.6)', fontSize: 12, fontWeight: 500 }}>
                {/* Loading 3D model... */}
              </span>
            </div>
          </div>
          <Skeleton className="absolute left-0 top-1/3 h-32 w-36 rounded-2xl" />
          <Skeleton className="absolute right-0 top-8 h-40 w-44 rounded-2xl" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, paddingBottom: 64 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ borderRadius: 14, padding: '16px 14px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton className="h-6 w-8 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="h-3 w-4/6 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSkeleton({ reverse = false }: { reverse?: boolean }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', direction: reverse ? 'rtl' : 'ltr' }}>
        <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Skeleton className="h-5 w-32 rounded-full" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-5/6 rounded-xl" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-4/6 rounded-lg" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
        <div style={{ direction: 'ltr' }}>
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 48 }}>
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-12 w-80 rounded-xl" />
        <Skeleton className="h-4 w-60 rounded-lg" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 420px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-60 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function AgencySkeleton() {
  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 48 }}>
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-12 w-96 rounded-xl" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px 1fr', gap: 24, marginBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: 28, marginBottom: 48 }}>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-5/6 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 64 }}>
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-12 w-96 rounded-xl" />
        <Skeleton className="h-5 w-72 rounded-lg" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18 }}>
        <Skeleton className="h-80 w-full rounded-3xl" style={{ gridRow: 'span 2' }} />
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-56 w-full rounded-3xl" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(124,58,237,0.15)', zIndex: 9999 }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #ec4899)',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 10px rgba(124,58,237,0.8)',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ── Status pill ── */
function StatusPill({
  progress,
  robotLoaded,
}: {
  progress: number;
  robotLoaded: boolean;
}) {
  const getMessage = () => {
    if (!robotLoaded && progress > 60) return 'Loading 3D robot model...';
    if (progress < 20) return 'Initializing AceAgent...';
    if (progress < 40) return 'Loading AI models...';
    if (progress < 60) return 'Preparing workspace...';
    if (progress < 80) return 'Calibrating interview engine...';
    if (progress < 95) return 'Almost ready...';
    return 'Launching AceAgent!';
  };

  return (
    <motion.div
      key={getMessage()}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(8,12,40,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 99,
        padding: '10px 20px',
        boxShadow: '0 0 20px rgba(124,58,237,0.15)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        border: '2px solid rgba(124,58,237,0.3)',
        borderTopColor: '#7c3aed',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
      }} />
      <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
        {getMessage()}
      </span>
      <span style={{ color: '#7c3aed', fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>
        {Math.round(progress)}%
      </span>

      {/* Robot load indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        paddingLeft: 10,
        borderLeft: '1px solid rgba(124,58,237,0.2)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: robotLoaded ? '#10b981' : 'rgba(124,58,237,0.4)',
          boxShadow: robotLoaded ? '0 0 6px #10b981' : 'none',
          transition: 'all 0.4s',
        }} />
        <span style={{ color: robotLoaded ? '#10b981' : '#475569', fontSize: 11 }}>
          {robotLoaded ? '3D Ready' : '3D Loading'}
        </span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const completedRef = useRef(false);

  const robotLoaded = useLoadingStore((s) => s.robotLoaded);
  const fontsLoaded = useLoadingStore((s) => s.fontsLoaded);
  const setFontsLoaded = useLoadingStore((s) => s.setFontsLoaded);

  /* ── Detect fonts loaded ── */
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => setFontsLoaded());
    } else {
      setFontsLoaded();
    }
  }, [setFontsLoaded]);

  /* ── Animate progress to 90% on its own, then wait for robot ── */
  useEffect(() => {
    const steps = [
      { target: 15,  delay: 0    },
      { target: 30,  delay: 300  },
      { target: 45,  delay: 700  },
      { target: 58,  delay: 1100 },
      { target: 70,  delay: 1600 },
      { target: 80,  delay: 2100 },
      { target: 88,  delay: 2700 },
      /* Stops at 88 — robot load pushes it to 100 */
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ target, delay }) => {
      const t = setTimeout(() => setProgress(target), delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── When robot is loaded push to 100 and dismiss ── */
  useEffect(() => {
    if (robotLoaded && !completedRef.current) {
      completedRef.current = true;

      /* Animate to 100% */
      setProgress(95);
      const t1 = setTimeout(() => setProgress(100), 300);

      /* Small pause so user sees 100%, then fade out */
      const t2 = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 700);
      }, 900);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [robotLoaded, fontsLoaded, onComplete]);

  /* Safety net — dismiss after 12s no matter what */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 700);
        }, 500);
      }
    }, 12000);
    return () => clearTimeout(t);
  }, [onComplete]);

  const dividerStyle = {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)',
    margin: '0 32px',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050816',
            zIndex: 9998,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>

          <ProgressBar progress={progress} />

          {/* Grid overlay */}
          <div style={{
            position: 'fixed', inset: 0,
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none', zIndex: 0,
          }} />

          {/* Ambient glows */}
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(124,58,237,0.05)', filter: 'blur(120px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(6,182,212,0.04)', filter: 'blur(100px)' }} />
          </div>

          {/* Skeleton pages */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <NavbarSkeleton />
            <HeroSkeleton />
            <div style={dividerStyle} />
            <WorkspaceSkeleton />
            <div style={dividerStyle} />
            <AgencySkeleton />
            <div style={dividerStyle} />
            <DashboardSkeleton />
            <div style={dividerStyle} />
            <SectionSkeleton />
            <div style={dividerStyle} />
            <SectionSkeleton reverse />
            <div style={dividerStyle} />
            <TestimonialSkeleton />
          </div>

          <StatusPill progress={progress} robotLoaded={robotLoaded} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}