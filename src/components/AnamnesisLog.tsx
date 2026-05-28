import React from 'react';
import { SECTIONS } from '../data/sections';
import type { SyndromeScore } from '../utils/scoring';
import { ORGAN_COLORS } from '../data/syndromes';

interface AnamnesisLogProps {
  checkedIds: Set<string>;
  gender: 'male' | 'female';
  topSyndromes: SyndromeScore[];
}

export default function AnamnesisLog({ checkedIds, gender, topSyndromes }: AnamnesisLogProps) {
  const filled = SECTIONS
    .filter(s => s.gender === 'all' || s.gender === gender)
    .map(section => {
      const visible = section.symptoms.filter(s => s.gender === 'all' || s.gender === gender);
      const checked = visible.filter(s => checkedIds.has(s.id));
      return { section, checked };
    })
    .filter(r => r.checked.length > 0);

  if (filled.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
        Nenhum sintoma marcado.
      </p>
    );
  }

  return (
    <div>
      {filled.map(({ section, checked }) => (
        <div key={section.id} className="log-section">
          <div className="log-section-title">{section.title}</div>
          <div className="log-chips">
            {checked.map(s => {
              const contrib = topSyndromes.slice(0, 3).filter(syn => s.syndromes.includes(syn.key));
              const color = contrib.length > 0 ? (ORGAN_COLORS[contrib[0].organ] ?? '#6366f1') : 'var(--text-muted)';
              return (
                <span
                  key={s.id}
                  className="log-chip"
                  style={{ color, borderColor: color + '44', background: color + '10' }}
                  title={`Contribui para: ${s.syndromes.slice(0, 3).join(', ')}`}
                >
                  {s.label}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
