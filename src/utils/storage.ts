import type { SyndromeScore } from '../utils/scoring';

export interface PatientInfo {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  chiefComplaint: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isInitialOpinion?: boolean;
}

export interface ConsultationSession {
  id: string;
  date: string;
  patient: PatientInfo;
  checkedIds: string[];
  results: SyndromeScore[];
  chatHistory?: ChatMessage[];
  aiOpinion?: string;
  attachAiToReport?: boolean;
}

const STORAGE_KEY = 'diagno3_history';
const MAX_HISTORY = 5;

export function saveSession(session: ConsultationSession): void {
  const history = loadHistory();
  // Remove duplicate if same id
  const filtered = history.filter(s => s.id !== session.id);
  const newHistory = [session, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function loadHistory(): ConsultationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
