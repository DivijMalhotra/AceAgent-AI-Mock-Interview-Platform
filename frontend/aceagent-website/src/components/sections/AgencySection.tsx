'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import dynamic from 'next/dynamic';
import { Shield, Link2, Users, Zap, Lock, UsersRound } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import type { CustomTooltipProps } from '@/lib/chartTypes';

/* ── 3D Robot (client only, no SSR) ── */
const Robot3D = dynamic(() => import('../ui/Robot3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width:          '100%',
        height:         420,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width:          48,
          height:         48,
          borderRadius:   '50%',
          border:         '2px solid rgba(124,58,237,0.3)',
          borderTopColor: '#7c3aed',
          animation:      'spin 1s linear infinite',
        }}
      />
    </div>
  ),
});

/* ── Chart data ── */
const barData = [
  { month: 'Jan', a: 20, b: 30, c: 15 },
  { month: 'Feb', a: 45, b: 22, c: 38 },
  { month: 'Mar', a: 30, b: 55, c: 20 },
  { month: 'Apr', a: 65, b: 40, c: 50 },
  { month: 'May', a: 40, b: 70, c: 35 },
  { month: 'Jun', a: 80, b: 35, c: 60 },
  { month: 'Jul', a: 55, b: 85, c: 45 },
  { month: 'Aug', a: 90, b: 50, c: 75 },
  { month: 'Sep', a: 60, b: 95, c: 55 },
  { month: 'Oct', a: 95, b: 65, c: 80 },
  { month: 'Nov', a: 70, b: 80, c: 65 },
  { month: 'Dec', a: 85, b: 75, c: 90 },
];

const lineData = [
  { month: 'Jan', revenue: 12 },
  { month: 'Feb', revenue: 28 },
  { month: 'Mar', revenue: 22 },
  { month: 'Apr', revenue: 45 },
  { month: 'May', revenue: 38 },
  { month: 'Jun', revenue: 62 },
  { month: 'Jul', revenue: 55 },
  { month: 'Aug', revenue: 78 },
  { month: 'Sep', revenue: 70 },
  { month: 'Oct', revenue: 88 },
  { month: 'Nov', revenue: 82 },
  { month: 'Dec', revenue: 96 },
];

/* ── Custom tooltips ── */
function BarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            marginTop:  3,
          }}
        >
          <div
            style={{
              width:        8,
              height:       8,
              borderRadius: '50%',
              background:   p.color,
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: 11 }}>{p.name}:</span>
          <span className="value" style={{ fontSize: 12 }}>
            {String(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        6,
          marginTop:  3,
        }}
      >
        <div
          style={{
            width:        8,
            height:       8,
            borderRadius: '50%',
            background:   '#06b6d4',
          }}
        />
        <span style={{ color: '#94a3b8', fontSize: 11 }}>Revenue:</span>
        <span className="value" style={{ fontSize: 12 }}>
          ${String(payload[0].value)}K
        </span>
      </div>
    </div>
  );
}

/* ── Features list ── */
const FEATURES = [
  {
    icon:  Shield,
    title: 'Security',
    desc:  'Enterprise-level security ensuring absolute protection of your critical platform.',
    color: '#7c3aed',
  },
  {
    icon:  Link2,
    title: 'Integration with ATS',
    desc:  'Adapt links within ATS systems with 0% syndicate overhead and seamless connectivity.',
    color: '#06b6d4',
  },
  {
    icon:  Users,
    title: 'Multi-user team',
    desc:  'Techniques team behaviors throughout an autonomous platform at scale.',
    color: '#10b981',
  },
  {
    icon:  Zap,
    title: 'Coloni Integration',
    desc:  'Enterprise real item on client authorized database. All dimensions explain.',
    color: '#f59e0b',
  },
  {
    icon:  Lock,
    title: 'Security',
    desc:  'Teamwork schedule outline a begin aut enterprise real find ideas OKI systems.',
    color: '#ec4899',
  },
  {
    icon:  UsersRound,
    title: 'Multi user team',
    desc:  'Short-time have techniques team behaviors throughout to autonomous.',
    color: '#a78bfa',
  },
];

/* ── Sub-components ── */
function BarChartCard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding:      20,
        border:       '1px solid rgba(124,58,237,0.15)',
      }}
    >
      <div
        style={{
          color:        '#94a3b8',
          fontSize:     12,
          fontWeight:   600,
          marginBottom: 16,
        }}
      >
        Simular huis
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart
          data={barData}
          barSize={6}
          barGap={2}
          margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="rgba(124,58,237,0.07)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#334155', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#334155', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<BarTooltip />}
            cursor={{ fill: 'rgba(124,58,237,0.06)' }}
          />
          <Bar dataKey="a" name="Series A" fill="#7c3aed" radius={[3, 3, 0, 0]} />
          <Bar dataKey="b" name="Series B" fill="#06b6d4" radius={[3, 3, 0, 0]} />
          <Bar dataKey="c" name="Series C" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatsCard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding:      18,
        border:       '1px solid rgba(124,58,237,0.12)',
      }}
    >
      <div
        style={{
          color:        '#94a3b8',
          fontSize:     12,
          fontWeight:   600,
          marginBottom: 12,
        }}
      >
        Quick Stats
      </div>
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 8,
        }}
      >
        {[
          { l: 'Active',  v: '2.4K', c: '#7c3aed' },
          { l: 'Revenue', v: '$98K', c: '#10b981'  },
          { l: 'Growth',  v: '+34%', c: '#06b6d4'  },
          { l: 'Score',   v: '9.8',  c: '#f59e0b'  },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              background:   'rgba(255,255,255,0.03)',
              borderRadius: 10,
              padding:      '10px 8px',
              textAlign:    'center',
              border:       '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="font-orbitron"
              style={{ color: s.c, fontSize: 15, fontWeight: 700 }}
            >
              {s.v}
            </div>
            <div style={{ color: '#475569', fontSize: 10, marginTop: 3 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AreaChartCard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding:      20,
        border:       '1px solid rgba(6,182,212,0.15)',
      }}
    >
      <div
        style={{
          color:        '#94a3b8',
          fontSize:     12,
          fontWeight:   600,
          marginBottom: 16,
        }}
      >
        Forbosnous unayfive
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart
          data={lineData}
          margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradAgency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(6,182,212,0.07)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#334155', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#334155', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<AreaTooltip />}
            cursor={{ stroke: 'rgba(6,182,212,0.3)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#areaGradAgency)"
            dot={false}
            activeDot={{
              r:           4,
              fill:        '#06b6d4',
              stroke:      '#fff',
              strokeWidth: 1.5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CTACard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding:      20,
        border:       '1px solid rgba(124,58,237,0.15)',
      }}
    >
      <div
        style={{
          color:        '#e2e8f0',
          fontSize:     13,
          fontWeight:   700,
          marginBottom: 8,
        }}
      >
        REQUEST ENTERPRISE DEMO
      </div>
      <p
        style={{
          color:        '#64748b',
          fontSize:     12,
          lineHeight:   1.65,
          marginBottom: 16,
        }}
      >
        Seamless transition to full enterprise status with advanced features
        and dedicated support.
      </p>
      <Button variant="primary" style={{ width: '100%' }}>
        Start A Enterprise Demo
      </Button>
    </div>
  );
}

/* ── Logo mark ── */
function LogoMark() {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            8,
        marginBottom:   10,
      }}
    >
      <div
        style={{
          width:          24,
          height:         24,
          borderRadius:   7,
          background:     'linear-gradient(135deg,#7c3aed,#2563eb)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width:        10,
            height:       10,
            background:   'rgba(255,255,255,0.85)',
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
  );
}

/* ════════════════════════════════════════
   MAIN SECTION
════════════════════════════════════════ */
export default function AgencySection() {
  return (
    <section
      id="agency"
      style={{
        background: 'linear-gradient(180deg,#050816 0%,#08102a 50%,#050816 100%)',
        padding:    '80px 0',
      }}
    >
      {/* spin keyframe for loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <LogoMark />

          <div
            style={{
              color:         '#7c3aed',
              fontSize:      11,
              letterSpacing: 3,
              fontWeight:    600,
              marginBottom:  12,
              textTransform: 'uppercase',
            }}
          >
            Agency & Platform Solutions
          </div>

          <h2
            className="font-orbitron"
            style={{
              fontSize:   'clamp(26px,3vw,46px)',
              fontWeight: 900,
              color:      '#fff',
              lineHeight: 1.1,
              margin:     0,
            }}
          >
            AGENCY & PLATFORM SOLUTIONS
          </h2>
        </motion.div>

        {/* ── Charts + Robot ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 260px 1fr',
            gap:                 24,
            alignItems:          'center',
            marginBottom:        40,
          }}
        >
          {/* Left col — charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <BarChartCard />
            <StatsCard />
          </div>

          {/* Center — 3D Robot */}
          <div
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              position:       'relative',
              width:          260,
            }}
          >
            {/* radial bg glow */}
            <div
              style={{
                position:      'absolute',
                inset:         0,
                background:    'radial-gradient(ellipse at center,rgba(124,58,237,0.14) 0%,transparent 70%)',
                borderRadius:  24,
                pointerEvents: 'none',
              }}
            />
            <Robot3D
              height={420}
              scale={1.3}
              autoRotate={false}
              showRings={false}
              fov={38}
            />
          </div>

          {/* Right col — charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AreaChartCard />
            <CTACard />
          </div>
        </motion.div>

        {/* ── Feature cards grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap:                 14,
            }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card"
                whileHover={{
                  borderColor: `${f.color}35`,
                  boxShadow:   `0 0 20px ${f.color}15`,
                }}
                style={{
                  borderRadius: 14,
                  padding:      22,
                  border:       '1px solid rgba(255,255,255,0.04)',
                  cursor:       'default',
                  transition:   'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width:          40,
                    height:         40,
                    borderRadius:   12,
                    background:     `${f.color}16`,
                    border:         `1px solid ${f.color}30`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    marginBottom:   14,
                  }}
                >
                  <f.icon size={17} style={{ color: f.color }} />
                </div>

                {/* Title */}
                <div
                  style={{
                    color:        '#e2e8f0',
                    fontSize:     13,
                    fontWeight:   700,
                    marginBottom: 6,
                  }}
                >
                  {f.title}
                </div>

                {/* Description */}
                <div
                  style={{
                    color:      '#64748b',
                    fontSize:   12,
                    lineHeight: 1.65,
                  }}
                >
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}