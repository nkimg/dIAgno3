import type { PatientInfo, ChatMessage } from './storage';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-3.1-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// Conservative generation config to minimize reasoning leakage
const GENERATION_CONFIG = {
  temperature: 0.15,
  topP: 0.8,
  topK: 20,
  maxOutputTokens: 700,
};

// Patterns that indicate chain-of-thought / planner leakage
const LEAK_PATTERNS: RegExp[] = [
  /\blanguage:/i,
  /\bstructure:/i,
  /\bself-correction/i,
  /\bproceeding to output/i,
  /\bclinical reasoning:/i,
  /\bhypothes[ie]s?:/i,
  /\btask:/i,
  /\brole:/i,
  /\bformat:/i,
  /\btone:/i,
  /\bconstraints?:/i,
  /\bpatient:/i,
  /\bchief complaint:/i,
  /\bkey symptoms:/i,
  /\binput data:/i,
  /\bre-evaluat/i,
  /\brefining the/i,
  /\bpoints check/i,
  /\blanguage check/i,
  /\bnomenclature:/i,
  /\bpersona:/i,
  /\bmain complaint:/i,
  /\bdiagnostic hypotheses:/i,
  /\bcross-analysis/i,
  /\bSection \d/i,
  /\bDirection of Diagnosis/i,
  /\bComplementary Investigation/i,
  /100% Portuguese/i,
  /\bNo English/i,
  /\bNo repetition/i,
  /\bMarkdown used/i,
  /\bNo prescriptions/i,
  /\bNo absolute diagnosis/i,
  /\bStarts directly/i,
];

// English acupoint → Portuguese normalization (thin safety net, not primary defense)
const ACUPOINT_MAP: Record<string, string> = {
  'PC6': 'CS6', 'PC-6': 'CS6', 'HT7': 'C7', 'HT-7': 'C7',
  'ST36': 'E36', 'ST-36': 'E36', 'LU7': 'P7', 'LU-7': 'P7',
  'CV6': 'VC6', 'CV-6': 'VC6', 'CV4': 'VC4', 'CV-4': 'VC4',
  'GV20': 'VG20', 'GV-20': 'VG20', 'LR3': 'F3', 'LR-3': 'F3',
  'LV3': 'F3', 'LV-3': 'F3', 'KI3': 'R3', 'KI-3': 'R3',
  'SP6': 'BP6', 'SP-6': 'BP6', 'TE5': 'TA5', 'TE-5': 'TA5',
  'SJ5': 'TA5', 'SJ-5': 'TA5', 'BL23': 'B23', 'BL-23': 'B23',
  'GB34': 'VB34', 'GB-34': 'VB34', 'GV14': 'VG14', 'GV-14': 'VG14',
  'CV12': 'VC12', 'CV-12': 'VC12', 'BL20': 'B20', 'BL-20': 'B20',
  'BL15': 'B15', 'BL-15': 'B15', 'BL13': 'B13', 'BL-13': 'B13',
  'LI4': 'IG4', 'LI-4': 'IG4', 'LI11': 'IG11', 'LI-11': 'IG11',
  'GB20': 'VB20', 'GB-20': 'VB20', 'LR14': 'F14', 'LR-14': 'F14',
  'LV14': 'F14', 'LV-14': 'F14', 'BL18': 'B18', 'BL-18': 'B18',
  'BL21': 'B21', 'BL-21': 'B21', 'CV17': 'VC17', 'CV-17': 'VC17',
};

/**
 * Detects if the response contains chain-of-thought / planner leakage.
 * Returns true if leaked content is found.
 */
function hasLeakage(text: string): boolean {
  return LEAK_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Minimal post-processing: only strip <think> tags and normalize acupoints.
 * No aggressive "cleaning" — if the output is bad, we retry instead.
 */
function normalizeOutput(text: string): string {
  if (!text) return '';

  let result = text;

  // Strip <think> blocks (Gemma sometimes wraps internal reasoning)
  result = result.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Normalize English acupoint abbreviations to Portuguese
  for (const [eng, pt] of Object.entries(ACUPOINT_MAP)) {
    result = result.replace(new RegExp(`\\b${eng}\\b`, 'g'), pt);
  }

  return result.trim();
}

/**
 * Core API call with leak detection and retry logic.
 * If the model leaks planning/reasoning, retries up to MAX_RETRIES times.
 * On all retries failing, returns the fallback string.
 */
async function callGemmaWithRetry(
  systemInstruction: string,
  userContent: string,
  fallback: string,
  stripMarkdown: boolean = false,
  maxRetries: number = 2,
): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userContent }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: GENERATION_CONFIG,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('Resposta vazia da API.');
      }

      let output = normalizeOutput(responseText);

      // Strip markdown if requested (plain text mode)
      if (stripMarkdown) {
        output = output.replace(/###\s*/g, '');
        output = output.replace(/##\s*/g, '');
        output = output.replace(/#\s*/g, '');
        output = output.replace(/\*\*/g, '');
        output = output.replace(/\*/g, '');
      }

      // Check for leakage — retry if detected
      if (hasLeakage(output)) {
        console.warn(`[Gemma] Leak detected on attempt ${attempt + 1}, retrying...`);
        continue;
      }

      return output;
    } catch (error) {
      console.error(`[Gemma] API error on attempt ${attempt + 1}:`, error);
      // On network/API error, don't retry — return fallback immediately
      return fallback;
    }
  }

  // All retries exhausted — return fallback
  console.warn('[Gemma] All retries exhausted due to leakage. Using fallback.');
  return fallback;
}

/**
 * Helper: compute patient age from birthDate string.
 */
function getAge(birthDate: string): string {
  if (!birthDate) return 'Não informada';
  const diff = Date.now() - new Date(birthDate).getTime();
  return `${Math.floor(diff / 31557600000)} anos`;
}

/**
 * Helper: format patient data block (used by both plain and markdown functions).
 */
function formatPatientData(
  patient: PatientInfo,
  symptoms: string[],
  hypotheses: { name: string; score: number; organ: string }[],
): string {
  const lines = [
    `${patient.name}, ${patient.gender === 'female' ? 'feminino' : 'masculino'}, ${getAge(patient.birthDate)}.`,
    `Queixa: ${patient.chiefComplaint || 'Não informada'}.`,
    '',
    'Sintomas:',
    ...(symptoms.length > 0 ? symptoms.map(s => `- ${s}`) : ['Nenhum.']),
    '',
    'Hipóteses da engine:',
    ...(hypotheses.length > 0
      ? hypotheses.map((h, i) => `${i + 1}. ${h.name} (${h.organ}) — ${h.score.toFixed(0)}%`)
      : ['Nenhuma.']),
  ];
  return lines.join('\n');
}

// ─── PUBLIC FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Generates a plain-text clinical opinion (no markdown).
 */
export async function fetchGemmaOpinion(
  patient: PatientInfo,
  symptoms: string[],
  hypotheses: { name: string; score: number; organ: string }[],
): Promise<string> {

  // SYSTEM: minimal, declarative, no redundancy
  const systemInstruction = [
    'Você é um assistente clínico de MTC.',
    '',
    'Regras obrigatórias:',
    '- Responda somente em português do Brasil.',
    '- Não escreva pensamentos internos, notas ou raciocínio.',
    '- Não use inglês.',
    '- Não repita os dados do paciente.',
    '- Não prescreva tratamentos.',
    '- Não dê diagnósticos absolutos.',
    '- Não use markdown.',
    '',
    'Formato obrigatório da resposta:',
    '',
    'Opinião Clínica Inicial',
    '',
    '1. Direção do Diagnóstico',
    '[texto da análise]',
    '',
    '2. Aspectos para Investigação Complementar',
    '[texto das sugestões]',
  ].join('\n');

  // USER: only patient data, no meta-instructions
  const userContent = formatPatientData(patient, symptoms, hypotheses);

  const fallback = `Opinião Clínica Inicial\n\n1. Direção do Diagnóstico\nO quadro clínico sugere correlação primária com ${hypotheses[0]?.name || 'síndrome não identificada'} (${hypotheses[0]?.organ || 'Zang Fu'}). A direção diagnóstica aponta para desequilíbrio energético do órgão ${hypotheses[0]?.organ || 'não identificado'}.\n\n2. Aspectos para Investigação Complementar\nRecomenda-se avaliação complementar de pulso, exame minucioso da língua (cor, forma, saburra) e padrão de sono para refinar as hipóteses.`;

  return callGemmaWithRetry(systemInstruction, userContent, fallback, true);
}

/**
 * Sends the conversation history to Gemma and returns the assistant reply.
 * Sanitizes history to prevent contamination from prior leaked outputs.
 */
export async function fetchGemmaResponse(chatHistory: ChatMessage[]): Promise<string> {

  const systemInstruction = [
    'Você é um assistente clínico de MTC. Responda em português, de forma concisa e direta.',
    'Não prescreva tratamentos ou pontos de acupuntura.',
    'Não dê diagnósticos absolutos.',
    'Não escreva notas internas ou raciocínio.',
    'Não use inglês.',
  ].join('\n');

  // Sanitize chat history: remove any prior model messages that contain leakage
  const sanitizedHistory = chatHistory.filter(msg => {
    if (msg.role === 'model') {
      return !hasLeakage(msg.text);
    }
    return true;
  });

  // Build contents — NO fake system prompts injected into user messages
  const contents = sanitizedHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: GENERATION_CONFIG,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Resposta vazia da API.');
    }

    return normalizeOutput(responseText);
  } catch (error) {
    console.error('[Gemma] Erro na conversa:', error);
    return 'Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente.';
  }
}

/**
 * Generates a Markdown-formatted clinical opinion.
 */
export async function fetchGemmaClinicalMarkdownOpinion(
  patient: PatientInfo,
  symptoms: string[],
  hypotheses: { name: string; score: number; organ: string }[],
): Promise<string> {

  // SYSTEM: minimal, declarative
  const systemInstruction = [
    'Você é um assistente clínico de MTC.',
    '',
    'Regras obrigatórias:',
    '- Responda somente em português do Brasil.',
    '- Não escreva pensamentos internos, notas ou raciocínio.',
    '- Não use inglês.',
    '- Não repita os dados do paciente.',
    '- Não prescreva tratamentos.',
    '- Não dê diagnósticos absolutos.',
    '',
    'Formato obrigatório da resposta (Markdown):',
    '',
    `## Análise Clínica: ${patient.name}`,
    '',
    '### Direção do Diagnóstico',
    '[texto da análise]',
    '',
    '### Investigação Complementar',
    '[texto das sugestões]',
  ].join('\n');

  // USER: only patient data
  const userContent = formatPatientData(patient, symptoms, hypotheses);

  const fallback = `## Análise Clínica: ${patient.name}\n\n### Direção do Diagnóstico\nO quadro clínico sugere correlação primária com **${hypotheses[0]?.name || 'Síndrome Não Identificada'}** (${hypotheses[0]?.organ || 'Zang Fu'}). A direção diagnóstica aponta para desequilíbrio energético do canal do(a) **${hypotheses[0]?.organ || 'não identificado'}**.\n\n### Investigação Complementar\n- Avaliação detalhada da **saburra e corpo da língua**.\n- Palpação do **pulso nas posições Cun, Guan e Chi**.\n- Verificação do padrão de sono e regulação de temperatura corporal.`;

  return callGemmaWithRetry(systemInstruction, userContent, fallback, false);
}

// Re-export cleanModelResponse for backward compatibility (components may import it)
export function cleanModelResponse(text: string): string {
  return normalizeOutput(text);
}
