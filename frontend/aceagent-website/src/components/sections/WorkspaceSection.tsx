'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CustomTooltipProps } from '@/lib/chartTypes';

const perfData = [
  { day: 'Mon', ui: 40, api: 65, test: 30 },
  { day: 'Tue', ui: 55, api: 45, test: 50 },
  { day: 'Wed', ui: 80, api: 70, test: 60 },
  { day: 'Thu', ui: 60, api: 85, test: 45 },
  { day: 'Fri', ui: 90, api: 75, test: 80 },
  { day: 'Sat', ui: 70, api: 90, test: 65 },
  { day: 'Sun', ui: 95, api: 80, test: 85 },
];

function DashTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: p.color as string,
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: 10 }}>{p.name}:</span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>
            {String(p.value)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniDashboard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8,12,40,0.85)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div
              key={c}
              style={{ width: 9, height: 9, borderRadius: '50%', background: c }}
            />
          ))}
        </div>
        <span style={{ color: '#475569', fontSize: 11, flex: 1, textAlign: 'center' }}>
          Tomorrow Atlas — Dashboard
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 44,
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {['🏠', '📊', '👥', '⚙️', '🔔'].map((ic, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                background: i === 1 ? 'rgba(124,58,237,0.3)' : 'transparent',
              }}
            >
              {ic}
            </div>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflow: 'hidden',
          }}
        >
          {/* Stat cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {[
              { l: 'Team',  v: '04:21:36', c: '#7c3aed' },
              { l: 'Done',  v: '28/31',    c: '#10b981' },
              { l: 'Score', v: '94%',      c: '#f59e0b' },
              { l: 'Users', v: '127',      c: '#06b6d4' },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: '#475569', fontSize: 9, marginBottom: 3 }}>
                  {s.l}
                </div>
                <div
                  className="font-orbitron"
                  style={{ color: s.c, fontSize: 11, fontWeight: 700 }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 10,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Bar chart */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  color: '#475569',
                  fontSize: 9,
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Performance Analytics
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={perfData}
                    barSize={5}
                    barGap={1}
                    margin={{ top: 0, right: 0, left: -32, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="rgba(124,58,237,0.08)"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#334155', fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#334155', fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<DashTooltip />}
                      cursor={{ fill: 'rgba(124,58,237,0.05)' }}
                    />
                    <Bar dataKey="ui"   name="UI"   fill="#7c3aed" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="api"  name="API"  fill="#06b6d4" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="test" name="Test" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <div style={{ color: '#475569', fontSize: 9, fontWeight: 600 }}>
                Progress
              </div>
              <div style={{ position: 'relative', width: 58, height: 58 }}>
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)',
                  }}
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="13"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="4.5"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="13"
                    fill="none"
                    stroke="url(#dg)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray="81.68"
                    initial={{ strokeDashoffset: 81.68 }}
                    whileInView={{ strokeDashoffset: 19 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                  />
                  <defs>
                    <linearGradient id="dg" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  77%
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              padding: '10px 12px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                color: '#475569',
                fontSize: 9,
                fontWeight: 600,
                marginBottom: 7,
              }}
            >
              Active Tasks
            </div>
            {[
              { t: 'UI Implementation', p: 85, c: '#7c3aed' },
              { t: 'API Integration',   p: 60, c: '#06b6d4' },
              { t: 'Testing Suite',     p: 40, c: '#10b981' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 9,
                    width: 100,
                    flexShrink: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.t}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.p}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.12 }}
                    style={{ height: '100%', background: item.c, borderRadius: 99 }}
                  />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, minWidth: 24 }}>
                  {item.p}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceSection() {
  return (
    <section
      id="workspace"
      style={{
        background: 'linear-gradient(180deg,#050816 0%,#080d28 50%,#050816 100%)',
        padding: '80px 0',
      }}
    >
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 32px' }}>
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr 1fr',
            gap: 28,
            alignItems: 'start',
            marginBottom: 48,
          }}
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="glass-card border-glow-purple"
              style={{ borderRadius: 18, padding: 24 }}
            >
              <div
                style={{
                  color: '#a78bfa',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  marginBottom: 3,
                }}
              >
                DEEP FEEDBACK &
              </div>
              <div
                style={{
                  color: '#a78bfa',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                SKILL CREATION
              </div>
              <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.75 }}>
                Bring your performance farther, harness interconnected results
                from Alanine sontact. Track every milestone with intelligent
                analytics.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-end',
                  marginTop: 18,
                  height: 28,
                }}
              >
                {[5, 9, 6, 13, 9, 15, 7, 12, 10, 14].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [h, h + 5, h] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                    style={{
                      flex: 1,
                      background: 'rgba(124,58,237,0.45)',
                      borderRadius: 3,
                      minHeight: h,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
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
                style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}
              >
                AceAgent
              </span>
            </div>
            <h2
              className="font-orbitron"
              style={{
                fontSize: 'clamp(26px,2.8vw,42px)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              CUSTOMIZABLE
              <br />
              <span className="gradient-text">WORKSPACE:</span>
            </h2>
            <p
              style={{
                color: '#64748b',
                fontSize: 13,
                lineHeight: 1.7,
                marginTop: 14,
              }}
            >
              Adapt differently. Tailor colors within your integrations, edith
              dialscrolled onearcontrol tools.
            </p>
          </motion.div>

          {/* Right code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="glass-card"
              style={{
                borderRadius: 18,
                padding: 22,
                border: '1px solid rgba(37,99,235,0.2)',
                fontFamily: 'monospace',
              }}
            >
              <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <div
                    key={c}
                    style={{ width: 9, height: 9, borderRadius: '50%', background: c }}
                  />
                ))}
              </div>
              {[
                { c: '#a78bfa', t: 'const agent = new AceAgent({' },
                { c: '#06b6d4', t: '  model: "gpt-4",' },
                { c: '#10b981', t: '  workspace: "custom",' },
                { c: '#f59e0b', t: '  integrations: [...],' },
                { c: '#ec4899', t: '  tools: ["search",' },
                { c: '#a78bfa', t: '    "analytics", "ai"]' },
                { c: '#7c3aed', t: '});' },
              ].map((l, i) => (
                <div key={i} style={{ color: l.c, fontSize: 11, lineHeight: 1.9 }}>
                  {l.t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div
            style={{
              height: 380,
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.18)',
              boxShadow: '0 0 50px rgba(124,58,237,0.1)',
            }}
          >
            <MiniDashboard />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <Button
              variant="cyan"
              size="lg"
              style={{ padding: '13px 56px', fontSize: 14, letterSpacing: 3, fontWeight: 700 }}
            >
              GO LIVE
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}