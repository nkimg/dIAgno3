import React, { useState } from 'react';
import type { PatientInfo } from '../utils/storage';

interface PatientModalProps {
  onStart: (info: PatientInfo) => void;
  onShowHistory: () => void;
  onLoadMockCase?: () => void;
}

export default function PatientModal({ onStart, onShowHistory, onLoadMockCase }: PatientModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [info, setInfo] = useState<PatientInfo>({
    name: '',
    birthDate: '',
    gender: 'female',
    chiefComplaint: '',
  });
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!anon && !info.name.trim()) { 
      setError('Informe o nome do paciente ou marque como anônimo.'); 
      return; 
    }
    if (!anon && !info.birthDate) { 
      setError('Informe a data de nascimento do paciente.'); 
      return; 
    }
    setError('');
    onStart({ ...info, name: anon ? 'Paciente Anônimo' : info.name });
    setIsFormOpen(false);
  }

  return (
    <div className="hero-page-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E"), linear-gradient(135deg, #0b0d16 0%, #1a2035 50%, #07090e 100%)`,
      padding: '32px'
    }}>
      <div className="hero-card" style={{
        width: '100%',
        maxWidth: '624px',
        background: 'linear-gradient(180deg, rgba(12, 15, 22, 0.5) 0%, rgba(12, 15, 22, 0.95) 100%), url("/bg-mtc.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.7)',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}>
        {/* Hero Header Text */}
        <div className="hero-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 className="hero-title" style={{ fontSize: '38px', fontWeight: 600, letterSpacing: '1px', textTransform: 'none', margin: 0, color: '#FFFFFF' }}>
            dIAgno 3.0
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.5px', textTransform: 'none', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
            Apoio ao Diagnóstico em Medicina Tradicional Chinesa
          </p>
        </div>

        {/* Main View Buttons */}
        <div className="hero-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button 
              type="button" 
              className="btn btn-primary btn-full btn-lg" 
              onClick={() => setIsFormOpen(true)}
              style={{ height: '48px', fontSize: '14px', borderRadius: '8px' }}
            >
              Iniciar Nova Consulta
            </button>
            <button 
              type="button" 
              className="btn btn-ghost btn-full btn-lg" 
              style={{ background: '#FFFFFF', color: '#171A20', border: 'none', height: '48px', fontSize: '14px', borderRadius: '8px' }}
              onClick={onShowHistory}
            >
              Ver Histórico
            </button>
          </div>
          
          {/* {onLoadMockCase && (
            <button 
              type="button" 
              className="btn btn-secondary btn-full btn-lg" 
              onClick={onLoadMockCase}
              style={{ 
                height: '48px', 
                fontSize: '14px', 
                borderRadius: '8px', 
                background: 'linear-gradient(90deg, #d97706, #b45309)', 
                color: '#FFFFFF', 
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🧪 Testar com Caso Mock (Aleatório)
            </button>
          )} */}
          
          <div className="disclaimer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>
              <strong>Aviso:</strong> Esta é uma ferramenta de apoio aos estudos e não substitui uma consulta profissional.
            </p>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Ao clicar em "Iniciar Anamnese", você concorda com estes termos.
            </p>
          </div>

          <div className="hero-credits" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>UX Design e Desenvolvimento: <strong>Ephraim Ferreira Medeiros</strong></div>
            <div>Conceito e Banco de Dados: <strong>Wu Tou Kwang</strong></div>
            <div>Baseado na planilha original: <strong>Prof. Sérgio Destácio Junior (CEATA)</strong></div>
          </div>
        </div>
      </div>

      {/* Patient Entry Modal Overlay */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Novo Paciente</h2>
              <p className="modal-subtitle">Insira os dados clínicos para iniciar a avaliação por Zang Fu.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {/* Name input */}
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Nome ou identificador do paciente"
                  value={info.name}
                  onChange={e => setInfo(p => ({ ...p, name: e.target.value }))}
                  disabled={anon}
                />
              </div>

              {/* Row: Date + Gender */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    className="form-input"
                    type="date"
                    value={info.birthDate}
                    onChange={e => setInfo(p => ({ ...p, birthDate: e.target.value }))}
                    disabled={anon}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gênero Biológico</label>
                  <select
                    className="form-select"
                    value={info.gender}
                    onChange={e => setInfo(p => ({ ...p, gender: e.target.value as 'male' | 'female' }))}
                  >
                    <option value="female">Feminino</option>
                    <option value="male">Masculino</option>
                  </select>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="form-group">
                <label className="form-label">Queixa Principal (Sintoma Primário)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Ex: Insônia severa, palpitações, dores lombares"
                  value={info.chiefComplaint}
                  onChange={e => setInfo(p => ({ ...p, chiefComplaint: e.target.value }))}
                />
              </div>

              {/* Anon check */}
              <label className="anon-row">
                <input
                  type="checkbox"
                  checked={anon}
                  onChange={e => { 
                    setAnon(e.target.checked); 
                    if (e.target.checked) setError(''); 
                  }}
                />
                <span className="anon-label">Continuar como Paciente Anônimo</span>
              </label>

              {error && (
                <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</p>
              )}

              <div className="modal-footer" style={{ marginTop: 16 }}>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Iniciar Anamnese
                </button>
              </div>
            </form>

            <div className="credits">
              <div>UX Design e Desenvolvimento: <strong>Ephraim Ferreira Medeiros</strong></div>
              <div>Conceito e Banco de Dados: <strong>Wu Tou Kwang</strong></div>
              <div style={{ marginTop: 4 }}>Baseado na planilha original: <strong>Prof. Sérgio Destácio Junior (CEATA)</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
