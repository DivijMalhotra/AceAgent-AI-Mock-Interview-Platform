'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import AnimatedRobot from '../ui/AnimatedRobot';
import { Trophy, Star, Crown, Zap, Target, Award } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CustomTooltipProps } from '@/lib/chartTypes';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

/* ── data ── */
const NODES = [
  { id: 'ranit', label: 'Ranit',     x: 9,  y: 50, type: 'robot',    color: '#7c3aed', active: true  },
  { id: 'beh1',  label: 'Behavioral',x: 27, y: 70, type: 'skill',    color: '#7c3aed', active: true  },
  { id: 'dsa',   label: 'DSA',       x: 38, y: 26, type: 'category', color: '#06b6d4', active: true  },
  { id: 'des1',  label: 'Design',    x: 37, y: 78, type: 'skill',    color: '#10b981', active: true  },
  { id: 'beh2',  label: 'Behavioral',x: 55, y: 44, type: 'skill',    color: '#7c3aed', active: false },
  { id: 'beh3',  label: 'Behavioral',x: 54, y: 82, type: 'skill',    color: '#7c3aed', active: false },
  { id: 'des2',  label: 'Design',    x: 67, y: 60, type: 'skill',    color: '#10b981', active: false },
  { id: 'nil',   label: 'Nilofar',   x: 76, y: 32, type: 'robot',    color: '#7c3aed', active: false },
  { id: 'emg',   label: 'Emergent',  x: 88, y: 14, type: 'special',  color: '#f59e0b', active: false },
  { id: 'des3',  label: 'Design',    x: 75, y: 80, type: 'skill',    color: '#10b981', active: false },
  { id: 'beh4',  label: 'Behavioral',x: 88, y: 68, type: 'skill',    color: '#7c3aed', active: false },
];

const EDGES = [
  ['ranit', 'beh1'], ['ranit', 'dsa'],
  ['beh1', 'beh2'],  ['dsa', 'beh2'],  ['dsa', 'des1'],
  ['des1', 'beh3'],  ['beh2', 'nil'],
  ['beh3', 'des2'],  ['des2', 'nil'],
  ['nil', 'emg'],    ['des2', 'des3'], ['des3', 'beh4'], ['beh4', 'emg'],
];

const ACHIEVEMENTS = [
  { icon: Trophy, label: 'First Win',  color: '#f59e0b', earned: true  },
  { icon: Star,   label: 'Top Rated',  color: '#7c3aed', earned: true  },
  { icon: Crown,  label: 'Champion',   color: '#06b6d4', earned: true  },
  { icon: Zap,    label: 'Speed Run',  color: '#ec4899', earned: false },
  { icon: Target, label: 'Precision',  color: '#10b981', earned: false },
  { icon: Award,  label: 'Master',     color: '#f59e0b', earned: false },
];

const LEADERS = [
  { name: 'Adam Johnson',  score: '9,420', badge: '🥇', av: '🧑' },
  { name: 'Agent Santana', score: '8,651', badge: '🥈', av: '👩' },
  { name: 'Agent Santana', score: '7,203', badge: '🥉', av: '🧑' },
  { name: 'Agent Santana', score: '6,890', badge: '⭐',  av: '👨' },
];

const radialData = [
  { name: 'Expert',       value: 34,  fill: '#7c3aed' },
  { name: 'Advanced',     value: 58,  fill: '#06b6d4' },
  { name: 'Intermediate', value: 75,  fill: '#10b981' },
  { name: 'Basics',       value: 100, fill: 'rgba(255,255,255,0.08)' },
];

/* ── Tooltip ── */
function RadialTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{payload[0].name}</div>
      <div className="value">{String(payload[0].value)}%</div>
    </div>
  );
}

/* ── Skill Tree ── */
function SkillTree() {
  const pos = (id: string) => {
    const n = NODES.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '155%',
        height: 420,
        background:
          'linear-gradient(135deg,rgba(10,16,46,0.92),rgba(5,8,22,0.96))',
        borderRadius: 16,
        border: '1px solid rgba(124,58,237,0.18)',
        overflow: 'hidden',
      }}
    >
      <div
        className="grid-bg"
        style={{ position: 'absolute', inset: 0, opacity: 0.35 }}
      />

      {/* SVG edges */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="eg1" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="eg2" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {EDGES.map(([f, t], i) => {
          const s = pos(f);
          const e = pos(t);
          const mx = (s.x + e.x) / 2;
          return (
            <motion.path
              key={i}
              d={`M${s.x} ${s.y} Q${mx} ${s.y} ${e.x} ${e.y}`}
              fill="none"
              stroke={i % 2 === 0 ? 'url(#eg1)' : 'url(#eg2)'}
              strokeWidth="0.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.65 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.06 }}
            />
          );
        })}
        {EDGES.slice(0, 4).map(([f, t], i) => {
          const s = pos(f);
          const e = pos(t);
          return (
            <motion.circle
              key={`p${i}`}
              r="0.65"
              fill="#a78bfa"
              animate={{
                cx: [s.x, e.x],
                cy: [s.y, e.y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((n) => {
        const isR = n.type === 'robot';
        const isS = n.type === 'special';
        const sz = isR ? 38 : isS ? 34 : 28;
        return (
          <div
            key={n.id}
            style={{
              position: 'absolute',
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: 'translate(-50%,-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              zIndex: 1,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={
                n.active
                  ? {
                      boxShadow: [
                        `0 0 6px ${n.color}90`,
                        `0 0 14px ${n.color}90`,
                        `0 0 6px ${n.color}90`,
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: sz,
                height: sz,
                borderRadius: '50%',
                border: `2px solid ${n.active ? n.color : n.color + '40'}`,
                background: `${n.color}14`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: n.active ? 1 : 0.42,
                cursor: 'pointer',
              }}
            >
              {isR ? (
                <span style={{ fontSize: sz * 0.44 }}>🤖</span>
              ) : isS ? (
                <Trophy size={sz * 0.4} style={{ color: n.color }} />
              ) : (
                <div
                  style={{
                    width: sz * 0.36,
                    height: sz * 0.36,
                    borderRadius: '50%',
                    background: n.color,
                    boxShadow: `0 0 5px ${n.color}`,
                  }}
                />
              )}
            </motion.div>
            <span
              style={{
                fontSize: 7.5,
                color: n.active ? '#cbd5e1' : '#3d4f68',
                whiteSpace: 'nowrap',
              }}
            >
              {n.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Progress Card ── */
function ProgressCard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 700 }}>
          Level 3 Progress
        </span>
        <span
          className="font-orbitron"
          style={{ color: '#a78bfa', fontSize: 14, fontWeight: 700 }}
        >
          34%
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {/* Radial chart */}
        <div style={{ position: 'relative', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="90%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
              barSize={9}
            >
              <defs>
                <linearGradient id="radGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Tooltip content={<RadialTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              className="font-orbitron"
              style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}
            >
              34%
            </span>
            <span style={{ color: '#64748b', fontSize: 9, marginTop: 2 }}>
              Complete
            </span>
          </div>
        </div>

        {/* Level bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Basics',       pct: 100, color: 'rgba(255,255,255,0.15)' },
            { label: 'Intermediate', pct: 58,  color: 'rgba(6,182,212,0.6)'    },
            { label: 'Advanced',     pct: 34,  color: '#7c3aed'                },
            { label: 'Expert',       pct: 0,   color: 'rgba(248,113,113,0.4)'  },
          ].map((lvl, i) => (
            <div key={i}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    color: i === 2 ? '#a78bfa' : '#64748b',
                    fontSize: 11,
                    fontWeight: i === 2 ? 600 : 400,
                  }}
                >
                  {lvl.label}
                </span>
                <span
                  style={{
                    color: i === 2 ? '#a78bfa' : '#475569',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {lvl.pct}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lvl.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: lvl.color,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      style={{
        background:
          'linear-gradient(180deg,#050816 0%,#0a0520 40%,#050816 100%)',
        padding: '80px 0',
      }}
    >
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 10,
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
              fontSize: 'clamp(24px,3vw,44px)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            GAMIFIED PROGRESS DASHBOARD
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 360, margin: '0 auto' }}>
            Re-imagines the whole page as a progress-tracking game
          </p>
        </motion.div>

        {/* 3-col layout */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '280px 0.6fr 420px', gap: 20 }}
        >
          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div
              className="glass-card border-glow-purple"
              style={{ borderRadius: 18, padding: 22 }}
            >
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Achievements
              </div>
              <p
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  lineHeight: 1.65,
                  marginBottom: 18,
                }}
              >
                Track your progress and earn exclusive badges as you level up
                your skills.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,1fr)',
                  gap: 8,
                }}
              >
                {ACHIEVEMENTS.map((a, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, y: -2 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 4px',
                      borderRadius: 12,
                      background: a.earned
                        ? 'rgba(255,255,255,0.04)'
                        : 'transparent',
                      opacity: a.earned ? 1 : 0.32,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: `${a.color}18`,
                        border: `1px solid ${a.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: a.earned ? `0 0 10px ${a.color}30` : 'none',
                      }}
                    >
                      <a.icon size={14} style={{ color: a.color }} />
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        color: '#64748b',
                        textAlign: 'center',
                      }}
                    >
                      {a.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                borderRadius: 18,
                padding: 22,
                border: '1px solid rgba(6,182,212,0.15)',
              }}
            >
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Achievement
              </div>
              <p
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  lineHeight: 1.65,
                  marginBottom: 18,
                }}
              >
                Teamwork schedule makes enterprise collaboration better during
                any autonomous operation flows.
              </p>
              <Button variant="primary" style={{ width: '100%' }}>
                Claim Reward
              </Button>
            </div>
          </motion.div>

          {/* ── Center ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Top 3 */}
            <div
              className="glass-card"
              style={{
                borderRadius: 18,
                padding: '18px 24px',
                border: '1px solid rgba(124,58,237,0.15)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 32,
              }}
            >
              {[
                { av: '👩', name: 'Sienna',      color: '#7c3aed', sz: 42 },
                { av: '🧑', name: 'Leaderboard', color: '#f59e0b', sz: 54 },
                { av: '👨', name: 'Taysean',     color: '#06b6d4', sz: 42 },
              ].map((p) => (
                <div
                  key={p.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: p.sz,
                      height: p.sz,
                      borderRadius: '50%',
                      background: `${p.color}18`,
                      border: `2px solid ${p.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: p.sz * 0.46,
                      boxShadow:
                        p.sz > 44 ? `0 0 14px ${p.color}55` : 'none',
                    }}
                  >
                    {p.av}
                  </div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Leaderboard */}
            <div
              className="glass-card"
              style={{
                borderRadius: 18,
                border: '1px solid rgba(124,58,237,0.15)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span
                  style={{
                    color: '#e2e8f0',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Leaderboard
                </span>
              </div>
              {LEADERS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ background: 'rgba(124,58,237,0.06)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{p.badge}</span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}
                  >
                    {p.av}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: '#e2e8f0',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {p.name}
                    </div>
                  </div>
                  <div
                    className="font-orbitron"
                    style={{
                      color: '#a78bfa',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {p.score}
                  </div>
                </motion.div>
              ))}
              <div style={{ padding: '14px 20px' }}>
                <Button variant="outline" style={{ width: '100%', fontSize: 12 }}>
                  List Users
                </Button>
              </div>
            </div>

            {/* Robot */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <AnimatedRobot size="md" color="purple" />
            </div>
          </motion.div>

          {/* ── Right ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <SkillTree />
            <ProgressCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}