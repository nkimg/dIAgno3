import React from 'react';
import { SECTIONS } from '../data/sections';
import type { ConsultationSession } from '../utils/storage';
import { loadHistory, clearHistory } from '../utils/storage';

interface HistoryDrawerProps {
  onLoad: (session: ConsultationSession) => void;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function HistoryDrawer({ onLoad, onClose }: HistoryDrawerProps) {
  const history = loadHistory();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-in" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Histórico de Consultas</div>
          <p className="modal-subtitle">Últimas {history.length} consultas salvas neste dispositivo.</p>
        </div>
        <div className="modal-body" style={{ gap: 8 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhuma consulta salva ainda neste navegador.
            </div>
          ) : (
            history.map(session => {
              const topHyp = session.results[0];
              return (
                <div
                  key={session.id}
                  className="history-item"
                  onClick={() => { onLoad(session); onClose(); }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '2px',
                    background: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 500, flexShrink: 0,
                  }}>
                    {session.patient.gender === 'female' ? 'F' : 'M'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500, 
                      fontSize: 14, 
                      color: 'var(--text-primary)', 
                      marginBottom: 2 
                    }}>
                      {session.patient.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatDate(session.date)} · {session.checkedIds.length} sintomas
                    </div>
                    {topHyp && (
                      <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 500, marginTop: 2 }}>
                        {topHyp.name}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', userSelect: 'none' }}>›</span>
                </div>
              );
            })
          )}
        </div>
        <div className="modal-footer">
          {history.length > 0 && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => { if (confirm("Deseja realmente apagar todo o histórico de consultas?")) { clearHistory(); onClose(); } }}
              style={{ marginRight: 'auto' }}
            >
              Limpar Tudo
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
