'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props { dark: boolean; }

const data = [
  { day: 'S', score: 55,  highlight: false },
  { day: 'M', score: 82,  highlight: false },
  { day: 'T', score: 74,  highlight: true  },
  { day: 'W', score: 90,  highlight: false },
  { day: 'T', score: 68,  highlight: false },
  { day: 'F', score: 78,  highlight: false },
  { day: 'S', score: 60,  highlight: false },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background:   'rgba(22,163,74,0.95)',
        borderRadius: 10,
        padding:      '8px 14px',
        boxShadow:    '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>
        {label}: {payload[0].value}/100
      </div>
    </div>
  );
}

export default function ScoreTrendChart({ dark }: Props) {
  const bg     = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';
  const grid   = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        borderRadius: 18,
        padding:      '20px 22px',
        background:   bg,
        border:       `1px solid ${border}`,
        boxShadow:    dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition:   'background 0.3s',
      }}
    >
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   20,
        }}
      >
        <div>
          <div style={{ color: text, fontSize: 15, fontWeight: 700 }}>
            Score Trend
          </div>
          <div style={{ color: sub, fontSize: 12, marginTop: 2 }}>
            AI-generated scores across recent sessions
          </div>
        </div>
        <div
          style={{
            background:   dark
              ? 'rgba(22,163,74,0.15)'
              : 'rgba(22,163,74,0.1)',
            color:        '#16a34a',
            fontSize:     11,
            fontWeight:   700,
            padding:      '4px 12px',
            borderRadius: 99,
            border:       '1px solid rgba(22,163,74,0.3)',
          }}
        >
          This Week
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          barSize={28}
          margin={{ top: 8, right: 0, left: -24, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis
            dataKey="day"
            tick={{ fill: sub, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: sub, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(22,163,74,0.06)' }}
          />
          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.highlight
                    ? '#16a34a'
                    : dark
                      ? 'rgba(22,163,74,0.25)'
                      : 'rgba(22,163,74,0.15)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}