import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/global.css';
import { SECTIONS } from './data/sections';
import { calculateScores, countBySection } from './utils/scoring';
import {
  saveSession, generateSessionId, type PatientInfo, type ConsultationSession
} from './utils/storage';
import PatientModal from './components/PatientModal';
import SectionCard from './components/SectionCard';
import ReportDashboard from './components/ReportDashboard';
import HistoryDrawer from './components/HistoryDrawer';

// 🧪 MOCK PRESETS FOR DIAGNOSTIC TESTING (REMOVE LATER)
const MOCK_PRESETS: { name: string; patientInfo: PatientInfo; symptoms: string[] }[] = [
  {
    name: "Deficiência de Yin do Rim",
    patientInfo: {
      name: "Ana Silva (Yin Rim)",
      birthDate: "1985-05-15",
      gender: "female",
      chiefComplaint: "Calor à noite e zumbido nos ouvidos (Deficiência de Yin do Rim)"
    },
    symptoms: [
      'face_macas_vermelhas',
      'temp_ondas_calor',
      'temp_calor_cinco_palmos',
      'transp_noite',
      'febre_vespertina',
      'dor_tipo_queimacao',
      'ouvido_zumbidos',
      'ouvido_zumbido_grave',
      'lingua_saburra_ausente',
      'pulso_rapido',
      'pulso_fino'
    ]
  },
  {
    name: "Deficiência de Yang do Rim",
    patientInfo: {
      name: "Carlos Souza (Yang Rim)",
      birthDate: "1978-10-20",
      gender: "male",
      chiefComplaint: "Dor e frio na lombar, impotência sexual (Deficiência de Yang do Rim)"
    },
    symptoms: [
      'face_palida',
      'temp_aversao_frio',
      'febre_calafrios_melhora_calor',
      'inchaco_corpo',
      'edema_com_cacifo',
      'transp_dia',
      'dor_tipo_frio',
      'pes_frio',
      'urina_micção_frequente_clara',
      'lingua_cor_palida',
      'pulso_profundo',
      'pulso_lento'
    ]
  },
  {
    name: "Estagnação de Qi do Fígado",
    patientInfo: {
      name: "Mariana Costa (Qi Fígado)",
      birthDate: "1992-03-08",
      gender: "female",
      chiefComplaint: "Irritabilidade severa, distensão abdominal e TPM (Estagnação de Qi do Fígado)"
    },
    symptoms: [
      'emocional_irritabilidade',
      'emocional_depressao',
      'emocional_impaciencia',
      'dor_loc_peito',
      'dor_loc_abaixo_costelas',
      'garganta_caroco',
      'torax_resp_suspiros',
      'mens_tpm',
      'mens_mamas_doloridas',
      'lingua_lateral_roxa',
      'pulso_em_corda'
    ]
  },
  {
    name: "Deficiência de Qi do Baço",
    patientInfo: {
      name: "Beatriz Oliveira (Qi Baço)",
      birthDate: "1988-12-01",
      gender: "female",
      chiefComplaint: "Falta de apetite, fadiga extrema e fezes moles (Deficiência de Qi do Baço)"
    },
    symptoms: [
      'face_sem_brilho',
      'emocional_letargia',
      'disfuncoes_cansaco',
      'transp_membros',
      'membros_fracos',
      'apetite_ausencia',
      'abdome_distensao_geral',
      'intestino_fezes_moles',
      'lingua_cor_palida',
      'lingua_marcas_dentes',
      'pulso_fraco'
    ]
  },
  {
    name: "Fogo no Coração",
    patientInfo: {
      name: "Roberto Lima (Fogo Coração)",
      birthDate: "1975-07-22",
      gender: "male",
      chiefComplaint: "Agitação mental extrema, aftas dolorosas na boca e palpitações (Fogo no Coração)"
    },
    symptoms: [
      'face_vermelha',
      'emocional_agitacao',
      'emocional_irritabilidade',
      'boca_aftas',
      'boca_gosto_amargo',
      'torax_palpitacao',
      'torax_taquicardia',
      'urina_micção_frequente_escura',
      'urina_cor_escura',
      'lingua_cor_vermelha_escura',
      'lingua_cor_vermelha_ponta',
      'lingua_pontos_vermelhos',
      'lingua_saburra_amarela',
      'pulso_rapido',
      'pulso_forte'
    ]
  }
];



type AppView = 'questionnaire' | 'report';

export default function App() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<AppView>('questionnaire');
  const [showHistory, setShowHistory] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('diagno3-theme') as 'light' | 'dark') || 'light';
  });

  // Session States
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [attachAiToReport, setAttachAiToReport] = useState<boolean>(false);

  // Questionnaire Accordion & Highlight States
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['face', 'emocional']));
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diagno3-theme', theme);
  }, [theme]);

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const gender = patient?.gender ?? 'female';

  const visibleSections = useMemo(() =>
    SECTIONS.filter(s => s.gender === 'all' || s.gender === gender),
    [gender]
  );

  // Compute scores (passing the patient object for chief complaint boosting)
  const scores = useMemo(() =>
    calculateScores(checkedIds, gender, patient),
    [checkedIds, gender, patient]
  );

  const sectionCounts = useMemo(() =>
    countBySection(checkedIds),
    [checkedIds]
  );

  const totalSymptoms = useMemo(() =>
    visibleSections.reduce((acc, s) =>
      acc + s.symptoms.filter(sym => sym.gender === 'all' || sym.gender === gender).length, 0
    ), [visibleSections, gender]
  );

  const getAge = (): string => {
    if (!patient?.birthDate) return '';
    const diff = Date.now() - new Date(patient.birthDate).getTime();
    return `${Math.floor(diff / 31557600000)}a`;
  };



  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleToggle = useCallback((id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function handlePatientStart(info: PatientInfo) {
    setPatient(info);
    setCheckedIds(new Set());
    setView('questionnaire');
    setCurrentSessionId(generateSessionId());
  }

  const handleLoadMockCase = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_PRESETS.length);
    const preset = MOCK_PRESETS[randomIndex];
    
    setPatient(preset.patientInfo);
    setCheckedIds(new Set(preset.symptoms));
    setView('questionnaire');
    setCurrentSessionId(generateSessionId());
    setOpenSections(new Set(SECTIONS.map(s => s.id))); // Open all sections for visual inspection
  }, []);

  function handleGenerateReport() {
    if (!patient) return;
    const activeId = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      setCurrentSessionId(activeId);
    }
    const session: ConsultationSession = {
      id: activeId,
      date: new Date().toISOString(),
      patient,
      checkedIds: Array.from(checkedIds),
      results: scores,
      aiOpinion: aiOpinion ?? undefined,
      attachAiToReport: attachAiToReport
    };
    saveSession(session);
    setView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLoadSession(session: ConsultationSession) {
    setPatient(session.patient);
    setCheckedIds(new Set(session.checkedIds));
    setView('report');
    setCurrentSessionId(session.id);
    setAiOpinion(session.aiOpinion ?? null);
    setAttachAiToReport(session.attachAiToReport ?? false);
  }

  function handleReset() {
    setPatient(null);
    setCheckedIds(new Set());
    setView('questionnaire');
    setCurrentSessionId(null);
    setOpenSections(new Set(['face', 'emocional']));
    setHighlightedSection(null);
    setAiOpinion(null);
    setAttachAiToReport(false);
  }

  const handleUpdateAiOpinion = useCallback((opinion: string | null, attach: boolean) => {
    setAiOpinion(opinion);
    setAttachAiToReport(attach);
    
    if (patient) {
      const activeId = currentSessionId || generateSessionId();
      const session: ConsultationSession = {
        id: activeId,
        date: new Date().toISOString(),
        patient,
        checkedIds: Array.from(checkedIds),
        results: scores,
        aiOpinion: opinion ?? undefined,
        attachAiToReport: attach
      };
      saveSession(session);
    }
  }, [patient, currentSessionId, checkedIds, scores]);

  async function handleExportPDF() {
    if (!patient) return;
    const { exportReportToPDF } = await import('./utils/pdfGenerator');
    exportReportToPDF(patient, scores, checkedIds, aiOpinion ?? undefined, attachAiToReport);
  }

  function scrollToSection(id: string) {
    setActiveSection(id);
    
    // Open the accordion
    setOpenSections(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Highlight the card background
    setHighlightedSection(id);
    
    // Clear highlight after 2.5s
    setTimeout(() => {
      setHighlightedSection(prev => prev === id ? null : prev);
    }, 2500);

    // Scroll to the card element
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }



  // ─── Patient modal (no patient yet) ──────────────────────────────────────────
  if (!patient) {
    return (
      <div className="app-wrapper">
        <PatientModal 
          onStart={handlePatientStart} 
          onShowHistory={() => setShowHistory(true)} 
          onLoadMockCase={handleLoadMockCase}
        />
        {showHistory && (
          <HistoryDrawer
            onLoad={handleLoadSession}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    );
  }

  // ─── Full layout ─────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      <div className="app-layout">
        {/* ══ HEADER ══════════════════════════════════════════════ */}
        <header className="app-header">
          {/* Row 1: Logo, Patient Badge, and Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="logo">
                <span className="logo-name" style={{ textTransform: 'none', letterSpacing: '2px' }}>dIAgno 3.0</span>
                <span className="logo-subtitle">MTC</span>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
              <div className="patient-badge">
                <strong>{patient.name}</strong>
                <span>·</span>
                <span>{patient.gender === 'female' ? 'Fem' : 'Masc'}</span>
                <span>·</span>
                <span>{getAge()}</span>
                {view === 'questionnaire' && checkedIds.size > 0 && (
                  <>
                    <span>·</span>
                    <span style={{ color: 'var(--brand)', fontWeight: 500 }}>{checkedIds.size} sintomas</span>
                  </>
                )}
              </div>
            </div>

            <div className="header-actions">
              {/* 🧪 BOTÃO MOCK - REMOVER DEPOIS
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleLoadMockCase}
                style={{ 
                  marginRight: 8, 
                  background: 'linear-gradient(90deg, #d97706, #b45309)', 
                  color: '#FFFFFF', 
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Carregar outro caso mock aleatório"
              >
                🧪 Caso Mock
              </button>
              */}

              <button 
                className="theme-toggle" 
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
                title="Alternar Tema"
                style={{ marginRight: 8 }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
              <button className="btn btn-ghost btn-sm" onClick={() => setShowHistory(true)}>
                Histórico
              </button>
              {view === 'questionnaire' && checkedIds.size > 0 && (
                <button className="btn btn-primary btn-sm" onClick={handleGenerateReport}>
                  Gerar Relatório
                </button>
              )}
              {view === 'report' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setView('questionnaire')}>
                  Questionário
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Nova consulta">
                Nova Consulta
              </button>
            </div>
          </div>

          {/* Row 2: Real-time Hypotheses Cards (Active in Questionnaire View) */}
          {view === 'questionnaire' && checkedIds.size > 0 && (
            <div 
              className="header-hypotheses-panel animate-in"
              style={{ 
                width: '100%',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              {scores.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic', padding: '8px 0' }}>
                  Nenhuma hipótese compatível com os sintomas selecionados.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {scores.slice(0, 3).map((score, idx) => (
                    <div 
                      key={score.key} 
                      style={{ 
                        background: 'var(--bg-card)', 
                        padding: '12px 16px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border-subtle)',
                        borderLeft: idx === 0 ? '4px solid var(--brand)' : '4px solid var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>
                          {idx + 1}º Diagnóstico · <strong style={{ color: 'var(--text-primary)' }}>{score.organ}</strong>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{score.nature}</span>
                      </div>
                      <h4 style={{ fontSize: 13, fontWeight: 600, margin: '2px 0', fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
                        {score.name}
                      </h4>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
                          <span>Relevância</span>
                          <span style={{ color: idx === 0 ? 'var(--brand)' : 'var(--text-secondary)' }}>{score.normalizedScore.toFixed(0)}%</span>
                        </div>
                        <div style={{ height: 3, background: 'var(--border-subtle)', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              background: idx === 0 ? 'var(--brand)' : 'var(--text-muted)', 
                              width: `${score.normalizedScore}%`,
                              transition: 'width 0.4s var(--ease)'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>

        {/* ══ SIDEBAR ═════════════════════════════════════════════ */}
        <aside className="app-sidebar">
          {/* Selected symptoms summary */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sintomas Selecionados</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-primary)', marginTop: 4 }}>
              {checkedIds.size} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/ {totalSymptoms}</span>
            </div>
          </div>

          {/* Section list */}
          <div className="sidebar-nav">
            <div className="sidebar-heading">Seções</div>
            {visibleSections.map(section => {
              const count = sectionCounts[section.id] ?? 0;
              return (
                <a
                  key={section.id}
                  className={`sidebar-item ${count > 0 ? 'has-checks' : ''} ${activeSection === section.id ? 'active' : ''}`}
                  href="#"
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => { e.preventDefault(); scrollToSection(section.id); }}
                >
                  <span className="sidebar-item-label">{section.title}</span>
                  {count > 0 && (
                    <span className="sidebar-item-badge">{count}</span>
                  )}
                </a>
              );
            })}
          </div>
        </aside>

        {/* ══ MAIN ════════════════════════════════════════════════ */}
        <main className="app-main">
          {view === 'questionnaire' ? (
            <>
              {/* Section cards */}
              {visibleSections.map(section => (
                <SectionCard
                  key={section.id}
                  section={section}
                  checkedIds={checkedIds}
                  onToggle={handleToggle}
                  gender={gender}
                  isOpen={openSections.has(section.id)}
                  onToggleOpen={() => {
                    setOpenSections(prev => {
                      const next = new Set(prev);
                      if (next.has(section.id)) {
                        next.delete(section.id);
                      } else {
                        next.add(section.id);
                      }
                      return next;
                    });
                  }}
                  isHighlighted={highlightedSection === section.id}
                />
              ))}

              {/* Sticky footer */}
              <div className="generate-bar">
                {checkedIds.size === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Selecione sintomas acima para habilitar o relatório.
                  </p>
                ) : (
                  <>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, marginRight: 16 }}>
                      {checkedIds.size} sintomas marcados
                    </span>
                    <button className="btn btn-primary btn-lg" onClick={handleGenerateReport}>
                      Gerar Hipóteses Diagnósticas
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <ReportDashboard
              scores={scores}
              checkedIds={checkedIds}
              patient={patient}
              onBack={() => setView('questionnaire')}
              onExportPDF={handleExportPDF}
              aiOpinion={aiOpinion}
              attachAiToReport={attachAiToReport}
              onUpdateAiOpinion={handleUpdateAiOpinion}
            />
          )}
        </main>
      </div>



      {/* Modals */}
      {showHistory && (
        <HistoryDrawer
          onLoad={handleLoadSession}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
