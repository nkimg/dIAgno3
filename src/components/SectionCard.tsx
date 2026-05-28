import React, { useRef } from 'react';
import type { Section } from '../data/sections';

interface SectionCardProps {
  section: Section;
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
  gender: 'male' | 'female';
  isOpen: boolean;
  onToggleOpen: () => void;
  isHighlighted?: boolean;
}

function specClass(n: number) {
  if (n === 1) return 'spec-high';
  if (n <= 2) return 'spec-med';
  return 'spec-low';
}

function specTitle(n: number) {
  if (n === 1) return 'Sintoma muito específico (peso 3x)';
  if (n <= 2) return 'Sintoma específico (peso 2x)';
  if (n <= 4) return 'Sintoma moderado (peso 1.5x)';
  return 'Sintoma geral (peso 1x)';
}

export default function SectionCard({ 
  section, 
  checkedIds, 
  onToggle, 
  gender, 
  isOpen, 
  onToggleOpen, 
  isHighlighted = false 
}: SectionCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const visible = section.symptoms.filter(s => s.gender === 'all' || s.gender === gender);
  const checked = visible.filter(s => checkedIds.has(s.id)).length;
  const hasData = checked > 0;

  return (
    <div
      id={`section-${section.id}`}
      className={`section-card ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        transition: 'all 0.4s var(--ease)',
        borderRadius: isHighlighted ? '4px' : '0',
        padding: isHighlighted ? '12px 16px' : '0',
        marginTop: isHighlighted ? '12px' : '0',
        marginBottom: isHighlighted ? '12px' : '0',
      }}
    >
      <div
        className={`section-card-header ${isOpen ? 'open' : ''} ${hasData ? 'has-data' : ''}`}
        onClick={onToggleOpen}
      >
        <span className="section-card-title">
          {section.title}
        </span>
        <div className="section-card-right">
          {hasData && (
            <span className="section-count-badge">{checked} selecionado{checked !== 1 ? 's' : ''}</span>
          )}
          <span className="section-total-badge">{visible.length} itens</span>
          <span className={`section-chevron ${isOpen ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      <div
        className="section-body"
        ref={bodyRef}
        style={{ maxHeight: isOpen ? (bodyRef.current?.scrollHeight ?? 2000) + 'px' : '0' }}
      >
        <div className="symptoms-table">
          {visible.map(symptom => {
            const sel = checkedIds.has(symptom.id);
            return (
              <div
                key={symptom.id}
                className={`symptom-chip ${sel ? 'selected' : ''}`}
                onClick={() => onToggle(symptom.id)}
              >
                <div className="symptom-tick">
                  {sel && (
                    <svg className="symptom-tick-mark" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l3 3L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="symptom-text">{symptom.label}</span>
                <span
                  className={`spec-pip ${specClass(symptom.syndromes.length)}`}
                  title={specTitle(symptom.syndromes.length)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
