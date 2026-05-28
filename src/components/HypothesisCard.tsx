import React, { useState } from 'react';
import type { SyndromeScore } from '../utils/scoring';

interface HypothesisCardProps {
  score: SyndromeScore;
  rank: number;
}

const RANK_LABELS = ['1ª hipótese', '2ª hipótese', '3ª hipótese', '4ª hipótese', '5ª hipótese'];

export default function HypothesisCard({ score, rank }: HypothesisCardProps) {
  const [activeTab, setActiveTab] = useState<'ross' | 'auteroche' | 'maciocia'>(
    score.treatment.ross ? 'ross' : score.treatment.auteroche ? 'auteroche' : 'maciocia'
  );
  const hasRoss = !!score.treatment.ross;
  const hasAuteroche = !!score.treatment.auteroche;
  const hasMaciocia = !!score.treatment.maciocia;
  const hasTreatment = hasRoss || hasAuteroche || hasMaciocia;

  const resolvedTab = (() => {
    if (activeTab === 'ross' && hasRoss) return 'ross';
    if (activeTab === 'auteroche' && hasAuteroche) return 'auteroche';
    if (activeTab === 'maciocia' && hasMaciocia) return 'maciocia';
    return hasRoss ? 'ross' : hasAuteroche ? 'auteroche' : 'maciocia';
  })();

  return (
    <div className={`hyp-card rank-${rank} animate-in`}>
      {/* Rank Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div className="hyp-rank-badge">{rank + 1}</div>
        <div style={{ 
          fontSize: 10, 
          fontWeight: 500, 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--text-muted)' 
        }}>
          {RANK_LABELS[rank]}
        </div>
      </div>

      {/* Syndrome Name */}
      <div className="hyp-name">{score.name}</div>

      {/* Minimal Tags */}
      <div className="hyp-tags">
        <span className="hyp-tag">{score.organ}</span>
        {' '}
        <span className="badge badge-muted">{score.nature}</span>
        {' '}
        <span 
          className="badge badge-brand"
          style={
            rank === 0 
              ? { background: 'var(--brand-light)', color: 'var(--brand)' } 
              : { background: 'var(--bg-input)', color: 'var(--text-secondary)' }
          }
        >
          {score.normalizedScore.toFixed(0)}% relevância
        </span>
      </div>

      {/* Flat Score Bar */}
      <div className="hyp-score-bar-wrap">
        <div 
          className="hyp-score-bar-fill" 
          style={{ 
            width: `${score.normalizedScore}%` 
          }} 
        />
      </div>
      <div className="hyp-score-labels">
        <span>{score.rawScore.toFixed(1)} pts obtidos</span>
        <span>máximo possível: {score.maxPossible.toFixed(1)} pts</span>
      </div>

      {/* Description */}
      <p className="hyp-description">{score.description}</p>

      {/* Treatment Suggestions */}
      {hasTreatment ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 10 
          }}>
            <div style={{ 
              fontSize: 10, 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: 'var(--text-muted)' 
            }}>
              Sugestões de Acupontos
            </div>
            <div className="treatment-legend">
              <span className="legend-pill ton"><span className="abbr">Ton</span> Tonificar</span>
              <span className="legend-pill disp"><span className="abbr">Disp</span> Dispersar</span>
              <span className="legend-pill h"><span className="abbr">H</span> Harmonizar</span>
              <span className="legend-pill m"><span className="abbr">M</span> Moxabustão</span>
              <span className="legend-pill s"><span className="abbr">S</span> Sangria</span>
            </div>
          </div>
          <div className="treatment-tabs">
            {hasRoss && (
              <button 
                type="button"
                className={`treatment-tab tab-ross ${resolvedTab === 'ross' ? 'active' : ''}`} 
                onClick={() => setActiveTab('ross')}
              >
                Ross
              </button>
            )}
            {hasAuteroche && (
              <button 
                type="button"
                className={`treatment-tab tab-auteroche ${resolvedTab === 'auteroche' ? 'active' : ''}`} 
                onClick={() => setActiveTab('auteroche')}
              >
                Auteroche
              </button>
            )}
            {hasMaciocia && (
              <button 
                type="button"
                className={`treatment-tab tab-maciocia ${resolvedTab === 'maciocia' ? 'active' : ''}`} 
                onClick={() => setActiveTab('maciocia')}
              >
                Maciocia
              </button>
            )}
          </div>
          <div className="treatment-text">{score.treatment[resolvedTab] ?? ''}</div>
        </div>
      ) : (
        <div className="treatment-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          Nenhuma sugestão de tratamento cadastrada para esta síndrome.
        </div>
      )}
    </div>
  );
}
