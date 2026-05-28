import React from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { SyndromeScore } from '../utils/scoring';

interface SyndromeChartProps {
  scores: SyndromeScore[];
}

// Custom tooltip styled after Tesla minimal interface
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--r-xs)',
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.fullName}</div>
      <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{d.organ}</div>
      <div style={{ color: 'var(--brand)', fontWeight: 500, marginTop: 4 }}>{d.value.toFixed(1)}% relevância</div>
    </div>
  );
}

/**
 * Bar Chart Component - top 8 syndromes
 */
export function SyndromeBarChart({ scores }: SyndromeChartProps) {
  const top8 = React.useMemo(() => {
    return scores.slice(0, 8).map((s, i) => ({
      name: s.name.length > 28 ? s.name.slice(0, 26) + '…' : s.name,
      fullName: s.name,
      organ: s.organ,
      value: s.normalizedScore,
      color: i === 0 ? 'var(--brand)' : 'var(--text-muted)',
    }));
  }, [scores]);

  if (top8.length === 0) return null;

  return (
    <div className="chart-panel animate-in">
      <div className="chart-panel-title">
        Ranking de Relevância Sindrômica
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={top8} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="var(--border-subtle)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
            tickFormatter={v => `${v}%`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-input)' }} />
          <Bar dataKey="value" radius={0}>
            {top8.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

