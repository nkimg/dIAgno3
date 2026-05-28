import React from 'react';
import { SECTIONS } from '../data/sections';
import type { SyndromeScore } from '../utils/scoring';
import { calculateEnergeticProfile, calculateFiveElements } from '../utils/scoring';
import { SyndromeBarChart } from './SyndromeChart';
import Heatmap from './Heatmap';
import HypothesisCard from './HypothesisCard';
import AnamnesisLog from './AnamnesisLog';
import type { PatientInfo } from '../utils/storage';
import { parseMarkdownToReact } from '../utils/markdown';

interface ReportDashboardProps {
  scores: SyndromeScore[];
  checkedIds: Set<string>;
  patient: PatientInfo;
  onBack: () => void;
  onExportPDF: () => void;
  aiOpinion: string | null;
  attachAiToReport: boolean;
  onUpdateAiOpinion: (opinion: string | null, attach: boolean) => void;
}

function getAge(birthDate: string): string {
  if (!birthDate) return '';
  const diff = Date.now() - new Date(birthDate).getTime();
  return `${Math.floor(diff / 31557600000)} anos`;
}

export default function ReportDashboard({
  scores, checkedIds, patient, onBack, onExportPDF,
  aiOpinion, attachAiToReport, onUpdateAiOpinion
}: ReportDashboardProps) {
  const [isLoadingAi, setIsLoadingAi] = React.useState(false);
  const [errorAi, setErrorAi] = React.useState<string | null>(null);
  const top5 = scores.slice(0, 5);
  const top3 = scores.slice(0, 3);
  const selectedSymptomLabels = React.useMemo(() => {
    return SECTIONS.flatMap(s => s.symptoms)
      .filter(sym => checkedIds.has(sym.id))
      .map(sym => sym.label);
  }, [checkedIds]);

  const hypothesesForAi = React.useMemo(() => {
    return scores.slice(0, 5).map(h => ({
      name: h.name,
      score: h.normalizedScore,
      organ: h.organ
    }));
  }, [scores]);

  const handleRequestAi = async () => {
    setIsLoadingAi(true);
    setErrorAi(null);
    try {
      const { fetchGemmaClinicalMarkdownOpinion } = await import('../utils/ai');
      const opinion = await fetchGemmaClinicalMarkdownOpinion(patient, selectedSymptomLabels, hypothesesForAi);
      onUpdateAiOpinion(opinion, true);
    } catch (err) {
      console.error(err);
      setErrorAi('Falha ao gerar opinião da IA. Verifique sua conexão.');
    } finally {
      setIsLoadingAi(false);
    }
  };


  const totalSections = SECTIONS.filter(
    s => s.gender === 'all' || s.gender === patient.gender
  ).length;

  const filledSections = SECTIONS.filter(s => {
    if (s.gender !== 'all' && s.gender !== patient.gender) return false;
    return s.symptoms.some(sym => checkedIds.has(sym.id));
  }).length;

  const totalSymptoms = checkedIds.size;

  // Calculate profiles
  const energeticProfile = React.useMemo(() => calculateEnergeticProfile(scores), [scores]);
  const fiveElements = React.useMemo(() => calculateFiveElements(scores), [scores]);

  return (
    <div id="report-root" className="animate-in" style={{ maxWidth: 880, margin: '0 auto', paddingBottom: 60 }}>
      {/* 1. Header Strip - zero decoration */}
      <div style={{
        background: 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 0 24px 0',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ 
            fontSize: 10, 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            fontWeight: 500,
            marginBottom: 6 
          }}>
            Relatório de Avaliação Clínica em MTC
          </div>
          <div style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontSize: 24, 
            fontWeight: 500, 
            color: 'var(--text-primary)' 
          }}>
            {patient.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {getAge(patient.birthDate)} · {patient.gender === 'female' ? 'Feminino' : 'Masculino'}
            {patient.chiefComplaint && ` · Queixa Principal: ${patient.chiefComplaint}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onBack}>Voltar</button>
          <button className="btn btn-primary" onClick={onExportPDF}>Exportar PDF</button>
        </div>
      </div>

      {/* 2. Disclaimer */}
      <div className="disclaimer-bar">
        <span>
          <strong>Aviso Importante:</strong> Este relatório é de caráter informativo para fins de estudo. 
          <strong> Não substitui o diagnóstico profissional ou prescrição médica.</strong>
        </span>
      </div>

      {/* 3. KPIs */}
      <div className="kpi-strip">
        <div className="kpi-box">
          <div className="kpi-box-label">Sintomas</div>
          <div className="kpi-box-value">{totalSymptoms}</div>
          <div className="kpi-box-sub">marcados na anamnese</div>
        </div>
        <div className="kpi-box">
          <div className="kpi-box-label">Seções</div>
          <div className="kpi-box-value" style={{ color: 'var(--brand)' }}>
            {filledSections} <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>/ {totalSections}</span>
          </div>
          <div className="kpi-box-sub">partes preenchidas</div>
        </div>
        <div className="kpi-box">
          <div className="kpi-box-label">Hipóteses</div>
          <div className="kpi-box-value">{scores.length}</div>
          <div className="kpi-box-sub">síndromes compatíveis</div>
        </div>
      </div>

      {/* 4. Energetic Profile + 5 Elements Table (Responsive Grid) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: 24, 
        marginBottom: 32 
      }}>
        {/* Profile: Yin/Yang etc */}
        <div className="chart-panel">
          <div className="chart-panel-title">Perfil de Desequilíbrio Energético</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {energeticProfile.map(item => (
              <div key={item.name} title={item.description}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: item.value > 0 ? 'var(--brand)' : 'var(--text-muted)' }}>
                    {item.value}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 0, overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: item.value > 50 ? 'var(--brand)' : 'var(--text-secondary)',
                      width: `${item.value}%`,
                      transition: 'width 0.8s var(--ease)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Five Elements Table */}
        <div className="chart-panel">
          <div className="chart-panel-title">Impacto nos 5 elementos</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '8px 8px', fontWeight: 500 }}>Elemento</th>
                <th style={{ padding: '8px 8px', fontWeight: 500 }}>Zang Fu</th>
                <th style={{ padding: '8px 8px', fontWeight: 500, textAlign: 'right' }}>Deficiência (Xu)</th>
                <th style={{ padding: '8px 8px', fontWeight: 500, textAlign: 'right' }}>Excesso (Shi)</th>
              </tr>
            </thead>
            <tbody>
              {fiveElements.map(el => {
                const elementRowClasses: Record<string, string> = {
                  'Madeira': 'el-row-madeira',
                  'Fogo': 'el-row-fogo',
                  'Terra': 'el-row-terra',
                  'Metal': 'el-row-metal',
                  'Água': 'el-row-agua'
                };
                const isWater = el.element === 'Água';
                return (
                  <tr key={el.element} className={elementRowClasses[el.element]} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{el.element}</td>
                    <td style={{ padding: '10px 8px', color: isWater ? '#cbd5e1' : 'var(--text-muted)' }}>{el.organs}</td>
                    <td 
                      style={{ 
                        padding: '10px 8px', 
                        textAlign: 'right', 
                        color: el.deficiency > 0 
                          ? (isWater ? '#60a5fa' : 'var(--brand)') 
                          : (isWater ? '#94a3b8' : 'var(--text-muted)'),
                        fontWeight: el.deficiency > 0 ? 600 : 400 
                      }}
                    >
                      {el.deficiency > 0 ? `${el.deficiency}%` : '0%'}
                    </td>
                    <td 
                      style={{ 
                        padding: '10px 8px', 
                        textAlign: 'right', 
                        color: el.excess > 0 
                          ? (isWater ? '#ffffff' : 'var(--text-primary)') 
                          : (isWater ? '#94a3b8' : 'var(--text-muted)'),
                        fontWeight: el.excess > 0 ? 600 : 400 
                      }}
                    >
                      {el.excess > 0 ? `${el.excess}%` : '0%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Center: Bar Chart (Ranking de Relevância) */}
      <div style={{ marginBottom: 32 }}>
        <SyndromeBarChart scores={scores} />
      </div>

      {/* 6. Center: Symptom-Syndrome Heatmap */}
      <div style={{ marginBottom: 32 }}>
        <Heatmap topScores={scores} checkedIds={checkedIds} gender={patient.gender} />
      </div>

      {/* 7. Center: AI Opinion Section (Control Panel) */}
      <div className="chart-panel animate-in" style={{ padding: '24px 30px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="chart-panel-title" style={{ margin: 0 }}>Opinião Clínica da IA (powered by Google Gemini)</div>
          {aiOpinion && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={attachAiToReport}
                onChange={(e) => onUpdateAiOpinion(aiOpinion, e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--brand)', cursor: 'pointer' }}
              />
              Anexar ao Relatório e PDF
            </label>
          )}
        </div>
        
        {errorAi && (
          <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>
            {errorAi}
          </div>
        )}

        {!aiOpinion && !isLoadingAi && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Você pode solicitar uma análise clínica complementar gerada pelo modelo Gemini baseada nos sintomas e hipóteses de MTC deste paciente.
            </p>
            <button className="btn btn-primary" onClick={handleRequestAi} style={{ minHeight: 36, padding: '8px 20px' }}>
              Solicitar Opinião da IA
            </button>
          </div>
        )}

        {isLoadingAi && (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <div className="loader-spinner-tesla">
              <div className="pulse-circle"></div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
              Analisando dados do paciente e gerando opinião clínica...
            </p>
          </div>
        )}

        {aiOpinion && !isLoadingAi && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ai-markdown-content" style={{ fontSize: 13.5, lineHeight: 1.65, borderLeft: '3px solid var(--brand)', paddingLeft: 16, textAlign: 'left' }}>
              {parseMarkdownToReact(aiOpinion)}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={handleRequestAi}>
                Regerar Opinião
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onUpdateAiOpinion(null, false)} style={{ color: 'var(--danger)', borderColor: 'rgba(232,33,39,0.2)' }}>
                Remover
              </button>
            </div>
          </div>
        )}
      </div>



      {/* 8. Bottom: Hypotheses Cards (Top 5 Detailed) */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 12, 
          fontWeight: 500, 
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--text-muted)',
          marginBottom: 20, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8
        }}>
          Detalhamento das Hipóteses
          <span className="badge badge-brand">{top5.length} Principais</span>
        </div>

        {top5.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Nenhuma hipótese diagnóstica gerada.
          </div>
        ) : (
          top5.map((score, i) => (
            <HypothesisCard key={score.key} score={score} rank={i} />
          ))
        )}
      </div>

      {/* 9. Bottom: Symptom marked log */}
      {totalSymptoms > 0 && (
        <div className="chart-panel">
          <div className="chart-panel-title">Diário de Sintomas Marcados</div>
          <AnamnesisLog
            checkedIds={checkedIds}
            gender={patient.gender}
            topSyndromes={top3}
          />
        </div>
      )}

      {/* 10. Bottom: Attached AI Opinion Card (if checked) */}
      {attachAiToReport && aiOpinion && (
        <div className="chart-panel animate-in" style={{ padding: '30px 40px', marginTop: 32, borderTop: '2px solid var(--brand)', textAlign: 'left' }}>
          <div style={{ 
            fontSize: 12, 
            fontWeight: 500, 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-muted)',
            marginBottom: 20
          }}>
            Anexo: Opinião Clínica Complementar da IA (powered by Google Gemini)
          </div>
          <div className="ai-markdown-content" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
            {parseMarkdownToReact(aiOpinion)}
          </div>
        </div>
      )}
    </div>
  );
}
