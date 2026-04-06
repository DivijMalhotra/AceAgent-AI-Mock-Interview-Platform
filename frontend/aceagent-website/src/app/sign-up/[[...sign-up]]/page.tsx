'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animFrameId: number;
    let tick = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = [{ x: 0.08, y: 0.18 }, { x: 0.92, y: 0.18 }, { x: 0.08, y: 0.82 }, { x: 0.92, y: 0.82 }];
    const lines = [
      { x1: 0.02, y1: 0.18, x2: 0.14, y2: 0.18 }, { x1: 0.08, y1: 0.14, x2: 0.08, y2: 0.22 },
      { x1: 0.14, y1: 0.18, x2: 0.32, y2: 0.18 }, { x1: 0.86, y1: 0.18, x2: 0.98, y2: 0.18 },
      { x1: 0.92, y1: 0.14, x2: 0.92, y2: 0.22 }, { x1: 0.68, y1: 0.18, x2: 0.86, y2: 0.18 },
      { x1: 0.02, y1: 0.82, x2: 0.14, y2: 0.82 }, { x1: 0.68, y1: 0.82, x2: 0.86, y2: 0.82 },
    ];
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      lines.forEach(l => { ctx.beginPath(); ctx.moveTo(l.x1*W,l.y1*H); ctx.lineTo(l.x2*W,l.y2*H); ctx.strokeStyle='rgba(124,58,237,0.18)'; ctx.lineWidth=1; ctx.stroke(); });
      nodes.forEach(n => {
        const cx=n.x*W, cy=n.y*H, bw=64, bh=28;
        ctx.strokeStyle='rgba(124,58,237,0.28)'; ctx.lineWidth=1; ctx.strokeRect(cx-bw/2,cy-bh/2,bw,bh);
        for(let c=0;c<5;c++) for(let r=0;r<2;r++) { ctx.fillStyle='rgba(124,58,237,0.35)'; ctx.beginPath(); ctx.arc(cx-bw/2+8+c*12,cy-bh/2+8+r*12,1.5,0,Math.PI*2); ctx.fill(); }
        const pulse=0.5+0.5*Math.sin(tick*0.04); ctx.beginPath(); ctx.arc(cx+bw/2+8,cy,3,0,Math.PI*2); ctx.fillStyle=`rgba(124,58,237,${0.3+pulse*0.5})`; ctx.fill();
      });
      tick++; animFrameId=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}} />;
}

export default function SignUpPage() {
  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'#080c0f', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', fontFamily:"'Space Grotesk', sans-serif" }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(124,58,237,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.035) 1px, transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'15%', left:'20%', width:500, height:500, borderRadius:'50%', background:'rgba(88,28,135,0.07)', filter:'blur(120px)' }} />
        <div style={{ position:'absolute', bottom:'15%', right:'20%', width:400, height:400, borderRadius:'50%', background:'rgba(6,182,212,0.05)', filter:'blur(100px)' }} />
      </div>
      <CircuitBackground />
      <div style={{ position:'relative', zIndex:10 }}>
        <SignUp
          path="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#7c3aed',
              colorBackground: 'rgba(10,14,32,0.9)',
              colorInputBackground: 'rgba(255,255,255,0.04)',
              colorInputText: '#f1f5f9',
              colorText: '#f1f5f9',
              colorTextSecondary: '#94a3b8',
              colorNeutral: '#334155',
              borderRadius: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
              spacingUnit: '18px',
            },
            elements: {
              card: { background:'rgba(10,14,32,0.88)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(124,58,237,0.22)', borderRadius:'20px', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' },
              headerTitle: { color:'#f1f5f9', fontFamily:"'Space Grotesk', sans-serif", fontWeight:'700' },
              headerSubtitle: { color:'#64748b' },
              socialButtonsBlockButton: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#cbd5e1', borderRadius:'10px' },
              dividerLine: { background:'rgba(255,255,255,0.07)' },
              dividerText: { color:'#334155' },
              formFieldLabel: { color:'#94a3b8', fontSize:'13px' },
              formFieldInput: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#f1f5f9', fontFamily:"'Space Grotesk', sans-serif" },
              formButtonPrimary: { background:'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4c1d95 100%)', borderRadius:'10px', fontFamily:"'Space Grotesk', sans-serif", fontWeight:'700', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' },
              footerActionText: { color: '#cbd5e1' },
              footerActionLink: { color:'#a78bfa', fontWeight:'600' },
              alert: { background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', color:'#fca5a5' },
            },
          }}
        />
      </div>
    </div>
  );
}
