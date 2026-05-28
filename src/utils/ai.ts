import type { PatientInfo, ChatMessage } from './storage';

const API_KEY = 'AIzaSyBBw7TfDMuWZKAJS-Z1nbTkkPTkLQ9Omqo';
const MODEL_NAME = 'gemma-4-31b-it';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

/**
 * Cleans the model response by removing thinking blocks, planning logs,
 * or self-corrections, and normalizes acupoint names to Portuguese.
 */
export function cleanModelResponse(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove XML/think tags like <think>...</think> if they exist
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // 2. Locate the LAST occurrence of "Opinião Clínica Inicial"
  const searchStr = 'Opinião Clínica Inicial';
  const lastIdx = cleaned.lastIndexOf(searchStr);
  if (lastIdx !== -1) {
    cleaned = cleaned.substring(lastIdx);
  } else {
    // Fallback: search for "Direção do Diagnóstico" if main header is not duplicated
    const fallbackIdx = cleaned.lastIndexOf('Direção do Diagnóstico');
    if (fallbackIdx !== -1) {
      cleaned = cleaned.substring(fallbackIdx);
    }
  }

  // 3. Remove trailing system flags or self-corrections (e.g. "(Proceeding to output)", "(Self-Correction...)")
  cleaned = cleaned.replace(/\(?Proceeding\s+to\s+output\)?/gi, '');
  cleaned = cleaned.replace(/\[?Proceeding\s+to\s+output\]?/gi, '');
  cleaned = cleaned.replace(/\(?Self-Correction.*$/gi, '');
  cleaned = cleaned.replace(/\[?Self-Correction.*$/gi, '');
  cleaned = cleaned.replace(/\(?Self-correction.*$/gi, '');
  cleaned = cleaned.replace(/\[?Self-correction.*$/gi, '');

  // 4. Split by lines and remove lines that look like English thoughts or engine notes (extra safety)
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    
    const lower = trimmed.toLowerCase();
    if (
      lower.startsWith('nomenclature:') ||
      lower.startsWith('structure:') ||
      lower.includes('hypotheses from engine') ||
      lower.includes('re-evaluating') ||
      lower.includes('refining the diagnosis') ||
      lower.includes('clinical nuance') ||
      lower.includes('points check') ||
      lower.includes('language check')
    ) {
      return false;
    }
    return true;
  });

  cleaned = filteredLines.join('\n');

  // 5. Normalize English acupoint abbreviations to Portuguese abbreviations
  const pointTranslations: { [key: string]: string } = {
    'PC6': 'CS6', 'PC-6': 'CS6',
    'HT7': 'C7', 'HT-7': 'C7',
    'ST36': 'E36', 'ST-36': 'E36',
    'LU7': 'P7', 'LU-7': 'P7',
    'CV6': 'VC6', 'CV-6': 'VC6',
    'CV4': 'VC4', 'CV-4': 'VC4',
    'GV20': 'VG20', 'GV-20': 'VG20',
    'LR3': 'F3', 'LR-3': 'F3',
    'LV3': 'F3', 'LV-3': 'F3',
    'KI3': 'R3', 'KI-3': 'R3',
    'SP6': 'BP6', 'SP-6': 'BP6',
    'TE5': 'TA5', 'TE-5': 'TA5',
    'SJ5': 'TA5', 'SJ-5': 'TA5',
    'BL23': 'B23', 'BL-23': 'B23',
    'GB34': 'VB34', 'GB-34': 'VB34',
    'GV14': 'VG14', 'GV-14': 'VG14',
    'CV12': 'VC12', 'CV-12': 'VC12',
    'BL20': 'B20', 'BL-20': 'B20',
    'BL15': 'B15', 'BL-15': 'B15',
    'BL13': 'B13', 'BL-13': 'B13',
    'LI4': 'IG4', 'LI-4': 'IG4',
    'LI11': 'IG11', 'LI-11': 'IG11',
    'GB20': 'VB20', 'GB-20': 'VB20',
    'LR14': 'F14', 'LR-14': 'F14',
    'LV14': 'F14', 'LV-14': 'F14',
    'BL18': 'B18', 'BL-18': 'B18',
    'BL21': 'B21', 'BL-21': 'B21',
    'CV17': 'VC17', 'CV-17': 'VC17',
  };

  for (const [eng, pt] of Object.entries(pointTranslations)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'g');
    cleaned = cleaned.replace(regex, pt);
  }

  // Replace common leak words
  cleaned = cleaned.replace(/\bPoints:\b/gi, 'Pontos:');
  cleaned = cleaned.replace(/\bPoint:\b/gi, 'Ponto:');

  // 6. Strip markdown markers (###, ##, #, **, *) to output clean, plain text
  cleaned = cleaned.replace(/###\s*/g, '');
  cleaned = cleaned.replace(/##\s*/g, '');
  cleaned = cleaned.replace(/#\s*/g, '');
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/\*/g, '');

  return cleaned.trim();
}

/**
 * Normalizes and formats the clinical context into a prompt for Gemma-4.
 */
export async function fetchGemmaOpinion(
  patient: PatientInfo,
  symptoms: string[],
  hypotheses: { name: string; score: number; organ: string }[]
): Promise<string> {
  const getAge = (birthDate: string): string => {
    if (!birthDate) return 'Não informada';
    const diff = Date.now() - new Date(birthDate).getTime();
    return `${Math.floor(diff / 31557600000)} anos`;
  };

  const patientDesc = [
    `Paciente: ${patient.name}`,
    `Gênero: ${patient.gender === 'female' ? 'Feminino' : 'Masculino'}`,
    `Idade: ${getAge(patient.birthDate)}`,
    `Queixa Principal: ${patient.chiefComplaint || 'Não informada'}`,
  ].join('\n');

  const symptomsList = symptoms.length > 0 
    ? symptoms.map(s => `- ${s}`).join('\n')
    : 'Nenhum sintoma marcado.';

  const hypothesesList = hypotheses.length > 0
    ? hypotheses.map((h, i) => `${i + 1}. ${h.name} (${h.organ}) — Relevância: ${h.score.toFixed(0)}%`).join('\n')
    : 'Nenhuma hipótese calculada.';

  const systemInstruction = [
    'IDIOMA OBRIGATÓRIO: Responda 100% em português do Brasil. Sem nenhuma palavra em inglês. Não repita os dados de entrada.',
    '',
    'Você é o "Assistente Clínico dIAgno", especialista virtual de alto nível em Medicina Tradicional Chinesa (MTC).',
    '',
    'FORMATO: Texto puro e limpo, sem marcas de formatação Markdown (#, ##, **, etc.).',
    '',
    'REGRAS CLÍNICAS:',
    '- Analise a queixa principal cruzando com os sintomas e hipóteses.',
    '- Indique a direção diagnóstica (Yin/Yang, Qi, Xue, canais).',
    '- Sugira investigações complementares (pulso, língua, sinais físicos).',
    '- NÃO prescreva tratamentos ou pontos de acupuntura.',
    '- NÃO feche diagnósticos absolutos.',
    '',
    'ESTRUTURA (comece diretamente):',
    'Opinião Clínica Inicial',
    '1. Direção do Diagnóstico',
    '2. Aspectos para Investigação Complementar',
  ].join('\n');

  const userContent = [
    '--- INSTRUÇÕES DO SISTEMA ---',
    systemInstruction,
    '',
    '--- DADOS DO CASO CLÍNICO ---',
    patientDesc,
    '',
    'Sintomas marcados na anamnese:',
    symptomsList,
    '',
    'Hipóteses diagnósticas calculadas:',
    hypothesesList,
  ].join('\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userContent }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Formato de resposta da API inválido ou vazio.');
    }

    return cleanModelResponse(responseText);
  } catch (error) {
    console.error('Erro ao chamar Gemma-4 API:', error);
    return `Opinião Clínica Inicial\n\n1. Direção do Diagnóstico\nO paciente apresenta um quadro clínico primário correlacionado a ${hypotheses[0]?.name || 'Síndrome Não Identificada'} (${hypotheses[0]?.organ || 'Órgão de MTC'}). O caminho diagnóstico sugere queixa principal ligada ao desequilíbrio energético do órgão ${hypotheses[0]?.organ || 'Zang Fu'}.\n\n2. Aspectos para Investigação Complementar\nRecomenda-se realizar anamnese complementar focando nos aspectos de pulso, exame minucioso da língua (cor, forma, saburra) e padrão de sono do paciente para refinar as hipóteses mais prováveis da engine.`;
  }
}

/**
 * Sends the conversation history to Gemma-4 and returns the assistant reply.
 */
export async function fetchGemmaResponse(chatHistory: ChatMessage[]): Promise<string> {
  const systemPrompt = `Você é o "Assistente Clínico dIAgno", especialista virtual em Medicina Tradicional Chinesa. 
Responda sempre em português, de forma concisa, direta e altamente profissional.
Importante: Não prescreva tratamentos, pontos de acupuntura ou condutas terapêuticas definitivas, nem dê diagnósticos absolutos. Em vez disso, oriente o clínico sobre a direção do diagnóstico (cruzando os dados do paciente com as hipóteses da engine) e sugira o que investigar (sinais, pulso, língua, hábitos) para guiar o raciocínio clínico.`;

  const contents = chatHistory.map((msg, index) => {
    let text = msg.text;
    if (index === 0 && msg.role === 'user') {
      text = `[Instruções do sistema: responda sempre em português, de forma concisa, direta. Não dê diagnósticos absolutos e não prescreva tratamentos ou pontos de acupuntura. Apenas comente sobre a direção diagnóstica do paciente e sugira o que investigar complementarmente]\n\nPergunta do usuário: ${msg.text}`;
    }
    return {
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text
        }
      ]
    };
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Resposta vazia da API.');
    }

    return cleanModelResponse(responseText);
  } catch (error) {
    console.error('Erro na conversa com Gemma-4 API:', error);
    return 'Desculpe, tive um problema de conexão ao processar sua pergunta. Por favor, tente enviar novamente em alguns segundos.';
  }
}

/**
 * Normalizes and formats clinical context for a Markdown-formatted response from Gemma.
 */
export async function fetchGemmaClinicalMarkdownOpinion(
  patient: PatientInfo,
  symptoms: string[],
  hypotheses: { name: string; score: number; organ: string }[]
): Promise<string> {
  const getAge = (birthDate: string): string => {
    if (!birthDate) return 'Não informada';
    const diff = Date.now() - new Date(birthDate).getTime();
    return `${Math.floor(diff / 31557600000)} anos`;
  };

  const patientDesc = [
    `Paciente: ${patient.name}`,
    `Gênero: ${patient.gender === 'female' ? 'Feminino' : 'Masculino'}`,
    `Idade: ${getAge(patient.birthDate)}`,
    `Queixa Principal: ${patient.chiefComplaint || 'Não informada'}`,
  ].join('\n');

  const symptomsList = symptoms.length > 0 
    ? symptoms.map(s => `- ${s}`).join('\n')
    : 'Nenhum sintoma marcado.';

  const hypothesesList = hypotheses.length > 0
    ? hypotheses.map((h, i) => `${i + 1}. ${h.name} (${h.organ}) — Relevância: ${h.score.toFixed(0)}%`).join('\n')
    : 'Nenhuma hipótese calculada.';

  const systemInstruction = [
    'IDIOMA OBRIGATÓRIO: Responda 100% em português do Brasil. Não inclua nenhuma palavra, frase, rascunho, nota ou pensamento em inglês. Não repita os dados de entrada na resposta.',
    '',
    'Você é o "Assistente Clínico dIAgno", especialista virtual de alto nível em Medicina Tradicional Chinesa (MTC).',
    '',
    'FORMATO: Markdown (## para títulos, ### para subtítulos, **negrito** para termos-chave, listas com - ).',
    '',
    'REGRAS CLÍNICAS:',
    '- Analise a queixa principal cruzando com os sintomas e hipóteses sindromais fornecidas.',
    '- Indique a direção diagnóstica (caminhos energéticos Yin/Yang, Qi, Xue, canais).',
    '- Sugira investigações complementares (pulso, língua, sinais físicos, hábitos).',
    '- NÃO prescreva tratamentos, pontos de acupuntura ou condutas terapêuticas definitivas.',
    '- NÃO feche diagnósticos absolutos.',
    '',
    `ESTRUTURA DA RESPOSTA (comece diretamente):`,
    `## Análise Clínica: [nome do paciente]`,
    `### Direção do Diagnóstico`,
    `[análise]`,
    `### Investigação Complementar`,
    `[sugestões]`,
  ].join('\n');

  const userContent = [
    '--- INSTRUÇÕES DO SISTEMA ---',
    systemInstruction,
    '',
    '--- DADOS DO CASO CLÍNICO ---',
    patientDesc,
    '',
    'Sintomas marcados na anamnese:',
    symptomsList,
    '',
    'Hipóteses diagnósticas calculadas:',
    hypothesesList,
  ].join('\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userContent }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Formato de resposta da API inválido ou vazio.');
    }

    let cleaned = responseText as string;

    // 1. Remove XML think tags
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // 2. Remove any lines before the first markdown header (##).
    //    This aggressively strips English preambles like "Patient:", "Role:", etc.
    const firstHeaderMatch = cleaned.match(/^#{1,3}\s+/m);
    if (firstHeaderMatch && firstHeaderMatch.index !== undefined && firstHeaderMatch.index > 0) {
      cleaned = cleaned.substring(firstHeaderMatch.index);
    }

    // 3. Remove trailing self-corrections, planning notes
    cleaned = cleaned.replace(/\*?\(?Self-[Cc]orrection[\s\S]*$/g, '');
    cleaned = cleaned.replace(/\*?Language:\s*[\s\S]*$/gi, '');
    cleaned = cleaned.replace(/\*?Format:\s*[\s\S]*$/gi, '');
    cleaned = cleaned.replace(/\(Proceeding[\s\S]*$/gi, '');

    // 4. Line-level filter: remove any stray English planning lines that slipped through
    const filteredLines = cleaned.split('\n').filter(line => {
      const t = line.trim().toLowerCase();
      if (!t) return true;
      // Skip known English planning patterns
      if (
        t.startsWith('patient:') ||
        t.startsWith('role:') ||
        t.startsWith('persona:') ||
        t.startsWith('task:') ||
        t.startsWith('language:') ||
        t.startsWith('format:') ||
        t.startsWith('tone:') ||
        t.startsWith('structure:') ||
        t.startsWith('input data:') ||
        t.startsWith('key symptoms:') ||
        t.startsWith('main complaint:') ||
        t.startsWith('diagnostic hypotheses:') ||
        t.startsWith('hypotheses:') ||
        t.startsWith('nomenclature:') ||
        t.includes('hypotheses from engine') ||
        t.includes('re-evaluating') ||
        t.includes('refining the diagnosis') ||
        t.includes('clinical nuance') ||
        t.includes('points check') ||
        t.includes('language check') ||
        t.includes('proceeding to output')
      ) {
        return false;
      }
      return true;
    });

    cleaned = filteredLines.join('\n');

    // 5. Normalize English acupoint names to Portuguese
    const ptMap: Record<string, string> = {
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
    for (const [eng, pt] of Object.entries(ptMap)) {
      cleaned = cleaned.replace(new RegExp(`\\b${eng}\\b`, 'g'), pt);
    }

    return cleaned.trim();
  } catch (error) {
    console.error('Erro ao chamar Gemma API:', error);
    return `## Análise Clínica: ${patient.name}\n\n### Direção do Diagnóstico\nO paciente apresenta um quadro clínico primário correlacionado a **${hypotheses[0]?.name || 'Síndrome Não Identificada'}** (${hypotheses[0]?.organ || 'Órgão de MTC'}). O caminho diagnóstico sugere desequilíbrio energético do canal do(a) **${hypotheses[0]?.organ || 'Zang Fu'}**.\n\n### Investigação Complementar\n- Avaliação detalhada da **saburra e corpo da língua**.\n- Palpação do **pulso nas posições Cun, Guan e Chi**.\n- Verificação do padrão de sono e regulação de temperatura corporal.`;
  }
}
