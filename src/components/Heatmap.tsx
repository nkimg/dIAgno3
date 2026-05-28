import React, { useState } from 'react';
import type { SyndromeScore } from '../utils/scoring';
import { SECTIONS } from '../data/sections';

interface HeatmapProps {
  topScores: SyndromeScore[];
  checkedIds: Set<string>;
  gender: 'male' | 'female';
}

interface HoveredCellInfo {
  syndromeName: string;
  symptomLabel: string;
  weight: number;
  isRelated: boolean;
  x: number;
  y: number;
}

export default function Heatmap({ topScores, checkedIds, gender }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HoveredCellInfo | null>(null);

  // Find all visible checked symptoms
  const activeSymptoms = React.useMemo(() => {
    const list: { id: string; label: string; syndromes: string[] }[] = [];
    SECTIONS.forEach(section => {
      if (section.gender !== 'all' && section.gender !== gender) return;
      section.symptoms.forEach(sym => {
        if (sym.gender !== 'all' && sym.gender !== gender) return;
        if (checkedIds.has(sym.id)) {
          list.push(sym);
        }
      });
    });
    return list;
  }, [checkedIds, gender]);

  if (activeSymptoms.length === 0 || topScores.length === 0) {
    return (
      <div className="chart-panel animate-in" style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 13, fontStyle: 'italic' }}>
          Selecione sintomas na anamnese para visualizar a matriz de correlação diagnóstico-sintomática.
        </p>
      </div>
    );
  }

  const top5 = topScores.slice(0, 5);

  const getCellColor = (isRelated: boolean, weight: number) => {
    if (!isRelated) {
      return 'var(--bg-input)'; // Tesla off-white / dark ash background
    }
    // Tesla Red tints based on specificity weight
    if (weight >= 3.0) return '#E82127'; // Pure Tesla Red
    if (weight >= 2.0) return 'rgba(232, 33, 40, 0.72)'; // Vibrant Coral Red
    if (weight >= 1.5) return 'rgba(232, 33, 40, 0.42)'; // Medium Pinkish Red
    return 'rgba(232, 33, 40, 0.18)'; // Soft Pale Red
  };

  const getCellTextColor = (isRelated: boolean, weight: number) => {
    if (!isRelated) return 'transparent';
    if (weight >= 2.0) return '#FFFFFF'; // White text on dark red backgrounds
    return 'var(--text-primary)'; // Primary text color on light backgrounds
  };

  const handleMouseMove = (
    e: React.MouseEvent,
    syndromeName: string,
    symptomLabel: string,
    weight: number,
    isRelated: boolean
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.closest('.heatmap-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    setHoveredCell({
      syndromeName,
      symptomLabel,
      weight,
      isRelated,
      // Adjust x position for horizontal scrolling inside the container
      x: rect.left - containerRect.left + container.scrollLeft + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
  };

  return (
    <div className="chart-panel animate-in">
      <style>{`
        .heatmap-cell-inner {
          height: 38px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s ease;
          position: relative;
        }
        .heatmap-cell-inner:hover {
          transform: scale(1.06);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          z-index: 5;
          outline: 1.5px solid var(--text-primary);
        }
      `}</style>

      <div className="chart-panel-title" style={{ marginBottom: 12 }}>
        Matriz de Correlação (Sintomas vs Síndromes)
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
        A matriz abaixo correlaciona os sintomas ativos do paciente com as principais hipóteses diagnósticas. A intensidade do <strong>Vermelho</strong> indica a <strong>especificidade (peso clínico)</strong> do sintoma para aquela síndrome (tons mais escuros e intensos indicam sintomas mais determinantes para o quadro).
      </p>

      {/* Heatmap Grid Wrapper with horizontal scrolling */}
      <div className="heatmap-container" style={{ position: 'relative', overflowX: 'auto', width: '100%', paddingBottom: 16 }}>
        <table 
          style={{ 
            borderCollapse: 'collapse', 
            width: '100%', 
            minWidth: 600,
            fontSize: 12,
            fontFamily: 'inherit'
          }}
        >
          <thead>
            <tr>
              {/* Corner cell */}
              <th 
                style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px',
                  borderBottom: '2px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  width: 220,
                  minWidth: 220
                }}
              >
                Síndrome Diagnóstica
              </th>

              {/* Symptom column headers */}
              {activeSymptoms.map(sym => (
                <th
                  key={sym.id}
                  style={{
                    padding: '12px 4px',
                    borderBottom: '2px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    textAlign: 'center',
                    minWidth: 52,
                    maxWidth: 80,
                    verticalAlign: 'bottom',
                    fontSize: 11
                  }}
                >
                  {/* Rotated header style for space efficiency */}
                  <div style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    whiteSpace: 'nowrap',
                    maxHeight: 110,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontWeight: 500,
                    letterSpacing: '0.2px'
                  }}>
                    {sym.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top5.map((score, rIdx) => {
              return (
                <tr 
                  key={score.key}
                  style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    background: rIdx === 0 ? 'rgba(62, 106, 225, 0.01)' : 'transparent'
                  }}
                >
                  {/* Syndrome label */}
                  <td
                    style={{
                      padding: '12px 16px',
                      color: 'var(--text-primary)',
                      fontWeight: rIdx === 0 ? 600 : 500,
                      fontFamily: "'Outfit', sans-serif",
                      borderRight: '1px solid var(--border-subtle)',
                      background: 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 18,
                        height: 18,
                        background: rIdx === 0 ? 'var(--brand)' : 'var(--border-medium)',
                        color: '#FFFFFF',
                        borderRadius: '2px',
                        fontSize: 9,
                        fontWeight: 700
                      }}>
                        {rIdx + 1}
                      </span>
                      <span style={{ fontSize: 12 }}>{score.name}</span>
                    </div>
                  </td>

                  {/* Heatmap cells */}
                  {activeSymptoms.map(sym => {
                    const isRelated = sym.syndromes.includes(score.key);
                    const weight = isRelated ? (sym.syndromes.length === 1 ? 3.0 : sym.syndromes.length === 2 ? 2.0 : sym.syndromes.length <= 4 ? 1.5 : 1.0) : 0;
                    
                    const cellBg = getCellColor(isRelated, weight);
                    const textColor = getCellTextColor(isRelated, weight);

                    return (
                      <td
                        key={sym.id}
                        onMouseEnter={(e) => handleMouseMove(e, score.name, sym.label, weight, isRelated)}
                        onMouseMove={(e) => handleMouseMove(e, score.name, sym.label, weight, isRelated)}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          padding: 0,
                          textAlign: 'center',
                          border: '1.5px solid var(--bg-card)', // Grid dividers in card color (crisp borders)
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{ background: cellBg }}
                          className="heatmap-cell-inner"
                        >
                          {isRelated && (
                            <span style={{ 
                              color: textColor, 
                              fontSize: 10, 
                              fontWeight: 600,
                              opacity: 0.95
                            }}>
                              {weight.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Custom HTML Floating Tooltip */}
        {hoveredCell && (
          <div
            style={{
              position: 'absolute',
              left: hoveredCell.x,
              top: hoveredCell.y,
              transform: 'translate(-50%, -100%)',
              background: 'var(--text-primary)',
              color: 'var(--bg-app)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: 11,
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              whiteSpace: 'nowrap',
              transition: 'left 0.08s ease, top 0.08s ease',
            }}
          >
            <div style={{ fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 2, marginBottom: 2 }}>
              {hoveredCell.syndromeName}
            </div>
            <div>Sintoma: <strong style={{ color: hoveredCell.isRelated ? '#FFCDD2' : 'inherit' }}>{hoveredCell.symptomLabel}</strong></div>
            <div>Peso Clínico: <strong>{hoveredCell.isRelated ? `${hoveredCell.weight.toFixed(1)}x` : '0.0x (Neutro)'}</strong></div>
            {hoveredCell.isRelated && (
              <div style={{ fontSize: 9, color: 'var(--brand)', opacity: 0.85, marginTop: 2 }}>
                {hoveredCell.weight === 3.0 ? '★ Sintoma Altamente Específico' : hoveredCell.weight === 2.0 ? 'Sintoma Moderadamente Específico' : 'Sintoma Geral'}
              </div>
            )}
            {/* Tooltip arrow */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -4,
                transform: 'translateX(-50%) rotate(45deg)',
                width: 8,
                height: 8,
                background: 'var(--text-primary)',
              }}
            />
          </div>
        )}
      </div>
      
      {/* Legend and stats */}
      <div 
        style={{ 
          marginTop: 16, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: 11,
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <span>
          Amostra: {top5.length} hipóteses vs {activeSymptoms.length} sintomas
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, marginRight: 4 }}>Especificidade:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: '#E82127', borderRadius: '2px' }} /> 3.0x (Alta)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: 'rgba(232, 33, 40, 0.72)', borderRadius: '2px' }} /> 2.0x (Média)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: 'rgba(232, 33, 40, 0.42)', borderRadius: '2px' }} /> 1.5x (Baixa)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: 'rgba(232, 33, 40, 0.18)', borderRadius: '2px' }} /> 1.0x (Geral)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--bg-input)', borderRadius: '2px' }} /> Neutro
          </span>
        </div>
      </div>
    </div>
  );
}
