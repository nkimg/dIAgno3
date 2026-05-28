import { SECTIONS, type Symptom } from '../data/sections';
import { SYNDROMES } from '../data/syndromes';
import type { PatientInfo } from './storage';

export interface SyndromeScore {
  key: string;
  name: string;
  organ: string;
  nature: string;
  rawScore: number;
  maxPossible: number;
  normalizedScore: number; // 0-100, now represents Bayesian Posterior Probability
  percentageOfTotal: number; // for pie/bar chart
  description: string;
  treatment: { ross?: string; auteroche?: string; maciocia?: string };
}

export interface EnergeticProfileItem {
  name: string;
  value: number; // 0 - 100
  description: string;
}

export interface ElementScore {
  element: string; // 'Madeira' | 'Fogo' | 'Terra' | 'Metal' | 'Água'
  organs: string;
  deficiency: number; // 0 - 100
  excess: number;     // 0 - 100
}

/**
 * Maps the false positive rate (f_s) based on the number of associated syndromes (specificity).
 * More specific symptoms have a lower false positive rate under the null hypothesis (Y_j = 0).
 */
function getFalsePositiveRate(ns: number): number {
  return 0.05 + 0.40 * (1.0 - 1.0 / ns);
}

/**
 * Checks if keywords in the chief complaint match the syndrome name, organ, or description.
 * This dynamically adjusts the Bayesian prior probability.
 */
function checkChiefComplaintMatch(syndromeKey: string, patient?: PatientInfo | null): boolean {
  if (!patient || !patient.chiefComplaint || !patient.chiefComplaint.trim()) {
    return false;
  }

  // Normalize strings (remove accents, convert to lowercase)
  const norm = (s: string) => 
    s.normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase();

  const complaintNorm = norm(patient.chiefComplaint);
  const syn = SYNDROMES[syndromeKey];
  if (!syn) return false;

  const nameNorm = norm(syn.name);
  const organNorm = norm(syn.organ);
  const descNorm = norm(syn.description);

  // Extract keywords of length > 2
  const keywords = complaintNorm.split(/[\s,.;:!?()]+/).filter(w => w.length > 2);
  if (keywords.length === 0) return false;

  // Check if any keyword matches the syndrome name, organ, or description
  return keywords.some(kw => 
    nameNorm.includes(kw) || 
    organNorm.includes(kw) || 
    descNorm.includes(kw)
  );
}

/**
 * Bayesian Scoring Engine with Soft Penalization (BBN-SP) and Semiological Synergy.
 */
export function calculateScores(
  checkedIds: Set<string>,
  gender: 'male' | 'female',
  patient?: PatientInfo | null
): SyndromeScore[] {
  const syndromeSymptoms: Record<string, { id: string; ns: number; isChecked: boolean; isTongue: boolean; isPulse: boolean }[]> = {};
  
  // Initialize lists for each syndrome
  Object.keys(SYNDROMES).forEach(key => {
    syndromeSymptoms[key] = [];
  });

  // Group symptoms applicable to the gender for each syndrome
  SECTIONS.forEach(section => {
    if (section.gender !== 'all' && section.gender !== gender) return;

    section.symptoms.forEach(symptom => {
      if (symptom.gender !== 'all' && symptom.gender !== gender) return;

      const isChecked = checkedIds.has(symptom.id);
      const isTongue = section.id === 'lingua';
      const isPulse = section.id === 'pulso';
      const ns = symptom.syndromes.length;

      symptom.syndromes.forEach(synKey => {
        if (syndromeSymptoms[synKey] !== undefined) {
          syndromeSymptoms[synKey].push({
            id: symptom.id,
            ns,
            isChecked,
            isTongue,
            isPulse
          });
        }
      });
    });
  });

  const results: SyndromeScore[] = Object.entries(syndromeSymptoms)
    .map(([key, symptoms]) => {
      const syn = SYNDROMES[key];
      
      // Calculate only if at least one symptom is checked
      const checkedCount = symptoms.filter(s => s.isChecked).length;
      if (checkedCount === 0) return null;

      // 1. Prior Probability (modulated by chief complaint)
      const hasComplaintMatch = checkChiefComplaintMatch(key, patient);
      const prior = hasComplaintMatch ? 0.30 : 0.10;
      let logOdds = Math.log(prior / (1.0 - prior));

      // 2. Soft Penalty parameter
      const lambda = 0.30;

      let hasClinical = false;
      let hasTongue = false;
      let hasPulse = false;

      // 3. Accumulate evidence in log-odds space
      symptoms.forEach(s => {
        const isSemiological = s.isTongue || s.isPulse;
        const p_s = isSemiological ? 0.85 : 0.70; // Sensitivity
        const f_s = getFalsePositiveRate(s.ns);   // False Positive Rate

        if (s.isChecked) {
          // Positive evidence
          const w_plus = Math.log(p_s / f_s);
          logOdds += w_plus;

          if (s.isTongue) hasTongue = true;
          else if (s.isPulse) hasPulse = true;
          else hasClinical = true;
        } else {
          // Negative evidence (soft penalty)
          const w_minus = lambda * Math.log((1.0 - p_s) / (1.0 - f_s));
          logOdds += w_minus;
        }
      });

      // 4. Semiological Synergy (MTC Triad confirmation)
      let synergyMultiplier = 1.0;
      if (hasClinical && hasTongue && hasPulse) {
        synergyMultiplier = 2.00; // Complete Triad (+100% odds)
      } else if (hasClinical && (hasTongue || hasPulse)) {
        synergyMultiplier = 1.40; // Clinical + Partial Semiological
      } else if (hasTongue && hasPulse) {
        synergyMultiplier = 1.20; // Concordant physical signs
      }
      logOdds += Math.log(synergyMultiplier);

      // 5. Convert back to posterior probability [0 - 100]
      const posteriorProbability = 1.0 / (1.0 + Math.exp(-logOdds));
      const normalizedScore = Math.round(posteriorProbability * 100.0);

      return {
        key,
        name: syn.name,
        organ: syn.organ,
        nature: syn.nature,
        rawScore: checkedCount,
        maxPossible: symptoms.length,
        normalizedScore,
        percentageOfTotal: 0,
        description: syn.description,
        treatment: syn.treatment,
      };
    })
    .filter((res): res is SyndromeScore => res !== null)
    // Filter out syndromes with negligible probability (<= 1%) to keep charts clean
    .filter(res => res.normalizedScore > 1)
    .sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Calculate relative percentages for the charts (normalized over top 10)
  const totalNorm = results.slice(0, 10).reduce((s, r) => s + r.normalizedScore, 0);
  results.forEach(r => {
    r.percentageOfTotal = totalNorm > 0 ? (r.normalizedScore / totalNorm) * 100 : 0;
  });

  return results;
}

/**
 * Calculates a global systemic energy profile based on the top hypotheses.
 */
export function calculateEnergeticProfile(scores: SyndromeScore[]): EnergeticProfileItem[] {
  const getCatScore = (filterFn: (s: SyndromeScore) => boolean) => {
    const matching = scores.filter(filterFn);
    if (matching.length === 0) return 0;
    // Hybrid index: maximum score + small bonus based on other active syndromes in same category
    const max = Math.max(...matching.map(m => m.normalizedScore));
    const count = matching.length;
    return Math.min(100, Math.round(max * 0.9 + (count - 1) * 3));
  };

  return [
    {
      name: 'Vazio de Yin',
      value: getCatScore(s => s.name.toLowerCase().includes('yin')),
      description: 'Deficiência de fluidos corporais, secura, calor vespertino e agitação mental.'
    },
    {
      name: 'Vazio de Yang',
      value: getCatScore(s => s.name.toLowerCase().includes('yang')),
      description: 'Deficiência de calor orgânico, aversão ao frio, membros frios e lentidão metabólica.'
    },
    {
      name: 'Estagnação de Qi',
      value: getCatScore(s => s.nature === 'Estagnação' || s.name.toLowerCase().includes('estagnacao de qi')),
      description: 'Bloqueio no fluxo livre de energia, distensões, TPM, irritabilidade e dores migratórias.'
    },
    {
      name: 'Deficiência de Xue',
      value: getCatScore(s => s.name.toLowerCase().includes('xue') || s.name.toLowerCase().includes('sangue')),
      description: 'Falta de nutrição celular, palidez, cãibras, visão turva e insônia leve.'
    },
    {
      name: 'Calor ou Fogo',
      value: getCatScore(s => s.nature === 'Calor' || s.nature === 'Fogo' || s.name.toLowerCase().includes('fogo')),
      description: 'Hiperatividade inflamatória, sede de bebidas frias, inflamações bucais e urina escura.'
    },
    {
      name: 'Frio ou Umidade',
      value: getCatScore(s => s.nature === 'Frio' || s.nature.includes('Umidade-Frio') || s.name.toLowerCase().includes('frio') || s.name.toLowerCase().includes('umidade')),
      description: 'Congestão de líquidos, sensação de peso no corpo, diarreia e fezes pastosas.'
    }
  ];
}

/**
 * Calculates Deficiency and Excess levels for each of the Five Elements.
 */
export function calculateFiveElements(scores: SyndromeScore[]): ElementScore[] {
  const getScoresForElement = (organs: string[], isDeficiency: boolean) => {
    const filtered = scores.filter(s => 
      organs.includes(s.organ) && 
      (isDeficiency 
        ? (s.nature === 'Deficiência' || s.nature === 'Essência' || s.nature === 'Colapso')
        : (s.nature !== 'Deficiência' && s.nature !== 'Essência' && s.nature !== 'Colapso'))
    );
    if (filtered.length === 0) return 0;
    return Math.round(Math.max(...filtered.map(f => f.normalizedScore)));
  };

  const elementsConfig = [
    { element: 'Madeira', organs: ['Fígado', 'Vesícula Biliar'], organsLabel: 'Fígado / V. Biliar' },
    { element: 'Fogo', organs: ['Coração', 'Intestino Delgado'], organsLabel: 'Coração / I. Delgado' },
    { element: 'Terra', organs: ['Baço', 'Estômago'], organsLabel: 'Baço-Pâncreas / Estômago' },
    { element: 'Metal', organs: ['Pulmão', 'Intestino Grosso'], organsLabel: 'Pulmão / I. Grosso' },
    { element: 'Água', organs: ['Rim', 'Bexiga'], organsLabel: 'Rim / Bexiga' }
  ];

  return elementsConfig.map(cfg => ({
    element: cfg.element,
    organs: cfg.organsLabel,
    deficiency: getScoresForElement(cfg.organs, true),
    excess: getScoresForElement(cfg.organs, false)
  }));
}

/**
 * Group scores by organ for radar chart
 */
export function groupByOrgan(scores: SyndromeScore[]): Record<string, number> {
  const byOrgan: Record<string, number> = {};
  scores.forEach(s => {
    if (!byOrgan[s.organ]) byOrgan[s.organ] = 0;
    // Take max of all syndromes in same organ
    if (s.normalizedScore > byOrgan[s.organ]) {
      byOrgan[s.organ] = s.normalizedScore;
    }
  });
  return byOrgan;
}

/**
 * Count how many symptoms are checked per section
 */
export function countBySection(checkedIds: Set<string>): Record<string, number> {
  const counts: Record<string, number> = {};
  SECTIONS.forEach(section => {
    counts[section.id] = section.symptoms.filter(s => checkedIds.has(s.id)).length;
  });
  return counts;
}
