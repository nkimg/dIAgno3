export interface Treatment {
  ross?: string;
  auteroche?: string;
  maciocia?: string;
}

export interface Syndrome {
  key: string;
  name: string;
  organ: string;
  nature: string;
  description: string;
  treatment: Treatment;
  maxScore?: number; // computed at runtime
}

export const SYNDROMES: Record<string, Syndrome> = {
  // ─── RIM ───────────────────────────────────────────────────────────────────
  DEFQIR: {
    key: 'DEFQIR', organ: 'Rim', nature: 'Deficiência',
    name: 'Deficiência de Qi do Rim',
    description: 'Dor lombar, fraqueza nos joelhos, micção frequente e clara, letargia.',
    treatment: {
      ross: 'Alternar com VG4, B11, B23, B52 Ton, VC4, R3, E36 Ton M',
    }
  },
  DEFYNR: {
    key: 'DEFYNR', organ: 'Rim', nature: 'Deficiência',
    name: 'Deficiência de Yin do Rim',
    description: 'Calor nos cinco palmos, febre vespertina, boca seca, zumbido agudo, sudorese noturna.',
    treatment: {
      ross: 'VC4, VC6, E36, R2, R7, Ton M + VC4, R6, E36 Ton',
      auteroche: 'B17, B23, B52, R1, R2, R3, R6, R7, BP1, BP6, BP8, F1, F8, TA6, CS6, IG11',
      maciocia: 'VC4, R3, R6, R10, R9, BP6, VC1',
    }
  },
  DEFYGR: {
    key: 'DEFYGR', organ: 'Rim', nature: 'Deficiência',
    name: 'Deficiência de Yang do Rim',
    description: 'Frio na lombar e joelhos, aversão ao frio, edema, impotência, urina clara e abundante.',
    treatment: {
      ross: 'VC4, VC6, E36, R2, R7, Ton M',
      auteroche: 'TA4, TA6, B23, R7, R9, VG4, VG14, VB39',
      maciocia: 'B23, VG4, VC4, VC6, R3, R7, B52 (Homem)',
    }
  },
  DEFJGR: {
    key: 'DEFJGR', organ: 'Rim', nature: 'Deficiência',
    name: 'Deficiência de Jing (Essência) do Rim',
    description: 'Envelhecimento precoce, memória fraca (antiga), problemas ósseos, queda de cabelo, infertilidade.',
    treatment: {
      ross: 'VC4, R3, VB39, E36 Ton',
    }
  },

  // ─── CORAÇÃO ───────────────────────────────────────────────────────────────
  DEFQIC: {
    key: 'DEFQIC', organ: 'Coração', nature: 'Deficiência',
    name: 'Deficiência de Qi do Coração',
    description: 'Palpitações, falta de ar ao esforço, sudorese espontânea, cansaço, palidez.',
    treatment: {
      ross: 'VC4, VC17, E36, R3 Ton M; C7 Ton',
      maciocia: 'C5, CS6, B15, VC17, VC6',
    }
  },
  DEFYNC: {
    key: 'DEFYNC', organ: 'Coração', nature: 'Deficiência',
    name: 'Deficiência de Yin do Coração',
    description: 'Agitação mental, insônia (dificuldade em adormecer), palpitações, ansiedade, boca seca.',
    treatment: {
      ross: 'VC14, VC17, C7 H, C3, BP6, R6 Ton',
      maciocia: 'C7, CS6, VC14, VC15, VC4, C6, BP6, R7, R6',
    }
  },
  DEFYGC: {
    key: 'DEFYGC', organ: 'Coração', nature: 'Deficiência',
    name: 'Deficiência de Yang do Coração',
    description: 'Palpitações, sensação de frio no peito e membros, lábios azulados, dispneia.',
    treatment: {
      ross: 'VG20, VC4, VC6, VC17, VC8, R2 Ton M',
      maciocia: 'C5, CS6, B15, VC17, VC6, VG14',
    }
  },
  DEFXUEC: {
    key: 'DEFXUEC', organ: 'Coração', nature: 'Deficiência',
    name: 'Deficiência de Xue (Sangue) do Coração',
    description: 'Palidez, tontura, memória fraca, insônia (sono leve, acorda fácil), ansiedade.',
    treatment: {
      ross: 'VC4, VC17, E36, BP6, BP10 Ton M; C7, CS7 H',
      maciocia: 'C7, CS6, VC14, VC15, VC4, B17, B20',
    }
  },
  COLAPSQIC: {
    key: 'COLAPSQIC', organ: 'Coração', nature: 'Colapso',
    name: 'Colapso de Yang do Coração',
    description: 'Forma grave de Def. de Yang, sudorese fria profusa, pulso fraco, risco de choque.',
    treatment: {}
  },
  ESTGXUEC: {
    key: 'ESTGXUEC', organ: 'Coração', nature: 'Estagnação',
    name: 'Estagnação de Xue (Sangue) do Coração',
    description: 'Dor em facada no peito que pode irradiar, face e lábios arroxeados, palpitações.',
    treatment: {
      ross: 'VC14, VC17, CS1, CS8, BP4, BP21 Disp + VC4, R7 Ton M',
      auteroche: 'B14, B15, TA14, TA17, CS6, C5, B17, P4',
      maciocia: 'CS6, CS4, C7, VC17, B14, B17, BP10, R25',
    }
  },
  FGC: {
    key: 'FGC', organ: 'Coração', nature: 'Calor',
    name: 'Fogo no Coração',
    description: 'Agitação, insônia com muitos sonhos, úlceras na boca, sensação de calor, urina escura.',
    treatment: {
      ross: 'VC14, CS8, R1 Disp; R6, BP6 Ton + F1, F2 Disp para Fogo no Fígado',
    }
  },
  FLMC: {
    key: 'FLMC', organ: 'Coração', nature: 'Fleuma',
    name: 'Fleuma-Fogo no Coração',
    description: 'Confusão mental, comportamento errático, fala incoerente, som de catarro na garganta.',
    treatment: {
      ross: 'VC17, B15, C5, C9, CS5, E40 Disp; VC12 Ton M',
      maciocia: 'C9, CS5, B15, E40, VG26, VC12, B20',
    }
  },
  ESTGQIC: {
    key: 'ESTGQIC', organ: 'Coração', nature: 'Estagnação',
    name: 'Estagnação de Qi do Coração',
    description: 'Irritabilidade, suspiros, distensão no peito, sensação de nó na garganta.',
    treatment: {
      ross: 'VC6, VC17, P7, CS8, BP6, F3 H',
    }
  },

  // ─── BAÇO-PÂNCREAS ─────────────────────────────────────────────────────────
  DEFQIBP: {
    key: 'DEFQIBP', organ: 'Baço', nature: 'Deficiência',
    name: 'Deficiência de Qi do Baço',
    description: 'Fadiga, falta de apetite, fezes moles, distensão abdominal após comer, palidez.',
    treatment: {
      ross: 'VC12, E36, BP3 Ton M',
      auteroche: 'B20, B21, E21, E36, BP6, BP9, TA4, F13',
      maciocia: 'VC12, E36, BP3, BP6, B21',
    }
  },
  DEFYGBP: {
    key: 'DEFYGBP', organ: 'Baço', nature: 'Deficiência',
    name: 'Deficiência de Yang do Baço',
    description: 'Sintomas de Def. de Qi com mais frio, edema, sensação de frio no abdome.',
    treatment: {
      ross: 'VC6, VC12, E28, E36, R7 Ton',
      auteroche: 'B20, B21, E36, E41, TA12, F13, BP2, BP3, BP6, BP9',
      maciocia: 'Mesmo que Def. Qi Baço + BP9, VC9, E28, B22 (sedar se houver umidade)',
    }
  },
  UMDFRIOBP: {
    key: 'UMDFRIOBP', organ: 'Baço', nature: 'Umidade-Frio',
    name: 'Umidade-Frio no Baço',
    description: 'Sensação de peso no corpo e cabeça, falta de apetite, náusea, fezes pastosas.',
    treatment: {
      ross: 'VC6, VC12, E28, E36, R7 Ton + VC9, BP9 Disp M; BP2 Ton M',
    }
  },
  UMDCALORBP: {
    key: 'UMDCALORBP', organ: 'Baço', nature: 'Umidade-Calor',
    name: 'Umidade-Calor no Baço',
    description: 'Sensação de peso, febre baixa, sede sem vontade de beber, pele amarelada, gosto amargo.',
    treatment: {}
  },
  COLAPSQIBP: {
    key: 'COLAPSQIBP', organ: 'Baço', nature: 'Colapso',
    name: 'Colapso de Qi do Baço',
    description: 'Sensação de "queda" dos órgãos, prolapsos (anal, uterino), cansaço extremo.',
    treatment: {
      ross: 'VC12, E36, BP3 Ton M + VG20, VC6 Ton M',
    }
  },
  BPCONTRXUE: {
    key: 'BPCONTRXUE', organ: 'Baço', nature: 'Deficiência',
    name: 'Baço não controla o Sangue (Xue)',
    description: 'Hemorragias crônicas (manchas roxas, sangue na urina/fezes), cansaço, palidez.',
    treatment: {
      ross: 'VC12, E36, BP3 Ton M + BP1 M; BP10 Ton M',
    }
  },

  // ─── PULMÃO ────────────────────────────────────────────────────────────────
  DEFQIP: {
    key: 'DEFQIP', organ: 'Pulmão', nature: 'Deficiência',
    name: 'Deficiência de Qi do Pulmão',
    description: 'Tosse fraca, falta de ar, voz fraca, sudorese diurna, aversão a vento.',
    treatment: {
      ross: 'VC4, CS17, P9, E36 Ton M',
      auteroche: 'B13, P1, P7, P9, TA6, TA17, IG4, IG18, E36',
      maciocia: 'P9, P7, VC6, B13, VG12, E36',
    }
  },
  DEFYNP: {
    key: 'DEFYNP', organ: 'Pulmão', nature: 'Deficiência',
    name: 'Deficiência de Yin do Pulmão',
    description: 'Tosse seca, pouca/nenhuma expectoração, garganta seca, febre baixa à tarde, maçãs do rosto vermelhas.',
    treatment: {
      ross: 'VC4, VC17, P5, P9, R6, E36 Ton; P10, R2 Disp',
      auteroche: 'P6, P9, P10, R3, B43, B13, B23, BP6',
      maciocia: 'P9, VC17, B43, B13, VG12, VC12, VC4, R6, P10',
    }
  },
  SECP: {
    key: 'SECP', organ: 'Pulmão', nature: 'Secura',
    name: 'Secura no Pulmão',
    description: 'Similar à Def. de Yin, causada por fator externo. Tosse seca, pele e boca secas.',
    treatment: {
      ross: 'P7, IG4, B12 Disp + P5, R6 Ton',
    }
  },
  VTFRIOP: {
    key: 'VTFRIOP', organ: 'Pulmão', nature: 'Invasão',
    name: 'Invasão de Vento-Frio no Pulmão',
    description: 'Aversão ao frio, febre, espirros, coriza clara, tosse, dor de cabeça occipital.',
    treatment: {
      ross: 'P7, IG4, B12 Disp + moxa nos pontos básicos',
    }
  },
  VTCALORP: {
    key: 'VTCALORP', organ: 'Pulmão', nature: 'Invasão',
    name: 'Invasão de Vento-Calor no Pulmão',
    description: 'Aversão ao vento, febre, garganta inflamada, coriza amarela, tosse com catarro amarelo.',
    treatment: {
      ross: 'P7, IG4, B12 Disp + VG14, TA5, IG11 Disp (sem moxa)',
    }
  },
  FLMFRIOP: {
    key: 'FLMFRIOP', organ: 'Pulmão', nature: 'Fleuma',
    name: 'Fleuma-Frio no Pulmão',
    description: 'Tosse com expectoração branca e aquosa abundante, sensação de frio no peito.',
    treatment: {
      ross: 'VC17, B13, P1, P6, E40 Disp + moxa nos pontos básicos',
    }
  },
  FLMCALORP: {
    key: 'FLMCALORP', organ: 'Pulmão', nature: 'Fleuma',
    name: 'Fleuma-Calor no Pulmão',
    description: 'Tosse "latida" com expectoração amarela, espessa e difícil de sair, falta de ar.',
    treatment: {
      ross: 'VC17, B13, P1, P6, E40 Disp + P10 Disp; P11 S',
    }
  },

  // ─── ESTÔMAGO ──────────────────────────────────────────────────────────────
  DEFQIE: {
    key: 'DEFQIE', organ: 'Estômago', nature: 'Deficiência',
    name: 'Deficiência de Qi do Estômago',
    description: 'Desconforto epigástrico, falta de apetite, cansaço principalmente após as refeições.',
    treatment: {
      ross: 'VC12, E36, BP3 Ton M',
      maciocia: 'E36, VC12, B21, VC6',
    }
  },
  DEFYNE: {
    key: 'DEFYNE', organ: 'Estômago', nature: 'Deficiência',
    name: 'Deficiência de Yin do Estômago',
    description: 'Fome sem vontade de comer, boca e garganta secas, constipação, dor epigástrica.',
    treatment: {
      ross: 'VC12, BP6, E36 Ton; E44 Disp',
      auteroche: 'CS6, TA12, B20, B21, BP6, E44',
      maciocia: 'VC12, E36, BP6, BP3',
    }
  },
  CALORE: {
    key: 'CALORE', organ: 'Estômago', nature: 'Calor',
    name: 'Calor/Fogo no Estômago',
    description: 'Sensação de queimação no estômago, sede de bebidas frias, mau hálito, gengivas inchadas.',
    treatment: {
      ross: 'VC12, CS8, E21, E44 Disp; E45 S, BP6 Ton',
      auteroche: 'CS6, BP4, TA11, TA12, E25, E36, E44',
      maciocia: 'E21, VC13, E44, E45, BP6, VC12, CS6',
    }
  },
  FRIOE: {
    key: 'FRIOE', organ: 'Estômago', nature: 'Frio',
    name: 'Frio no Estômago',
    description: 'Dor súbita no estômago que melhora com calor e pressão, vômito de líquidos claros.',
    treatment: {
      ross: 'VC10, VC13, E21, E36, BP4 Disp M',
      auteroche: 'CS6, TA4, TA12, E36, B20, B21, F13, BP4',
      maciocia: 'E21, BP4, VC13, E34',
    }
  },
  REBELE: {
    key: 'REBELE', organ: 'Estômago', nature: 'Rebelião',
    name: 'Rebelião de Qi no Estômago',
    description: 'Náuseas, vômitos, arrotos, soluços.',
    treatment: {
      ross: 'VC10, VC14, CS6, BP4 Disp',
      maciocia: 'VC13, VC10, CS6, BP4',
    }
  },
  ALIME: {
    key: 'ALIME', organ: 'Estômago', nature: 'Retenção',
    name: 'Retenção de Alimentos',
    description: 'Sensação de plenitude e dor no estômago, arrotos com cheiro de comida, azia.',
    treatment: {
      ross: 'VC10, VC13, CS6, BP4, IG10 Disp',
      auteroche: 'TA10, TA12, TA22, CS6, BP4, E21, E36, R21, F2, F13, F14',
      maciocia: 'VC13, VC10, E21, E44, E45, BP4, CS6',
    }
  },

  // ─── INTESTINOS ────────────────────────────────────────────────────────────
  CALORID: {
    key: 'CALORID', organ: 'Intestino Delgado', nature: 'Calor',
    name: 'Calor no Intestino Delgado',
    description: 'Dor abdominal, urina escura e ardente, sede, pode haver sangue na urina.',
    treatment: {
      ross: 'C5, VC8, ID2, ID5, E39 Disp + VC3, BP6 Disp para cistite',
      auteroche: 'Refrescar e fazer escoar a plenitude de Calor',
      maciocia: 'ID2, ID5, C5, C8, E39',
    }
  },
  OBSTID: {
    key: 'OBSTID', organ: 'Intestino Delgado', nature: 'Obstrução',
    name: 'Obstrução de Qi no Intestino Delgado',
    description: 'Dor abdominal intensa, vômitos, constipação severa.',
    treatment: {
      ross: 'VC6, VC12, CS8, E25, E29, F3 Disp',
      maciocia: 'E39, Lanweixue (ponto extra), VC6, VB34, E25, BP6, F3',
    }
  },
  UMDCALORIG: {
    key: 'UMDCALORIG', organ: 'Intestino Grosso', nature: 'Umidade-Calor',
    name: 'Umidade-Calor no Intestino Grosso',
    description: 'Diarreia com muco e/ou sangue, dor e queimação anal, febre, sede.',
    treatment: {
      ross: 'IG11, E25, E37, E44, BP6, BP9 Disp',
      auteroche: 'TA12, E25, E37, TA6, IG11',
      maciocia: 'BP6, BP9, VC3, B22, E25, B25, B17, VC12, IG11, E37, B20',
    }
  },
  UMDFRIOIG: {
    key: 'UMDFRIOIG', organ: 'Intestino Grosso', nature: 'Umidade-Frio',
    name: 'Umidade-Frio no Intestino Grosso',
    description: 'Dor abdominal tipo cólica, diarreia aquosa, ruídos intestinais.',
    treatment: {
      ross: 'VC6, IG10, E25, E27, E37 Disp M',
      auteroche: 'Aquecer e fazer circular',
      maciocia: 'E25, VC6, E36, E37, B25, B20',
    }
  },
  PARASITA: {
    key: 'PARASITA', organ: 'Intestino Grosso', nature: 'Parasita',
    name: 'Parasitas Intestinais',
    description: 'Dor abdominal, desejo por alimentos estranhos, ranger de dentes, coceira anal.',
    treatment: {}
  },

  // ─── FÍGADO / VESÍCULA ─────────────────────────────────────────────────────
  ESTGQIF: {
    key: 'ESTGQIF', organ: 'Fígado', nature: 'Estagnação',
    name: 'Estagnação de Qi do Fígado',
    description: 'Irritabilidade, suspiros, distensão nos hipocôndrios e seios, TPM, pulso em corda.',
    treatment: {
      ross: 'CS8, F3, F14 Disp',
      auteroche: 'B17, B18, B19, B51, F2, F3, F14, VB20, VB34, E18, E34, E36, CS6, BP6, C5, TA10',
      maciocia: 'VB34, F3, F13, F14, TA6, CS6',
    }
  },
  ESTGXUEF: {
    key: 'ESTGXUEF', organ: 'Fígado', nature: 'Estagnação',
    name: 'Estagnação de Xue (Sangue) do Fígado',
    description: 'Dor fixa e em pontada, massas abdominais, menstruação dolorosa com coágulos escuros.',
    treatment: {}
  },
  DEFXUEF: {
    key: 'DEFXUEF', organ: 'Fígado', nature: 'Deficiência',
    name: 'Deficiência de Xue (Sangue) do Fígado',
    description: 'Visão turva, cãibras, unhas fracas, tontura, menstruação escassa ou ausente.',
    treatment: {
      ross: 'VG20 H; IG4, BP6, E36, F8 Ton',
      auteroche: 'BP6, BP9, BP10, E36, B17, B18, B20, B21, F13, VG9, Yin Tang, Si Shen Cong',
      maciocia: 'B18, B20, B23, B17, F8, BP6, E36, VC4',
    }
  },
  ASCYGF: {
    key: 'ASCYGF', organ: 'Fígado', nature: 'Ascensão',
    name: 'Ascensão do Yang do Fígado',
    description: 'Dor de cabeça latejante, tontura, zumbido, irritabilidade, face vermelha.',
    treatment: {
      ross: 'VG20, VB20, VB34, BP6, F3 Disp',
      auteroche: 'B18, B23, R3, BP6, BP10, VB20, VB34, VB38, F2, F3, VG20',
      maciocia: 'F3, TA5, BP6, R3, F8, VB43, VB38, B2, Tai Yang, VB20, VB9, VB8, VB6',
    }
  },
  FGF: {
    key: 'FGF', organ: 'Fígado', nature: 'Calor',
    name: 'Fogo no Fígado',
    description: 'Sintomas de Ascensão do Yang mais intensos, olhos vermelhos, gosto amargo, raiva explosiva.',
    treatment: {
      ross: 'VG20, CS8, R1, F3 Disp; BP6 Ton',
      auteroche: 'VG20, VG23, VB2, VB20, VB34, VB43, F2, F3, IG4, TA3, TA5, TA17, CS6, C7, E36',
      maciocia: 'F2, F3, VB20, Taiyang, VB13',
    }
  },
  UMDCALORF: {
    key: 'UMDCALORF', organ: 'Fígado', nature: 'Umidade-Calor',
    name: 'Umidade-Calor no Fígado e Vesícula Biliar',
    description: 'Icterícia, dor no hipocôndrio, gosto amargo, náusea, urina escura, problemas genitais.',
    treatment: {
      ross: 'VB34, BP6 Disp',
    }
  },
  VTF: {
    key: 'VTF', organ: 'Fígado', nature: 'Vento',
    name: 'Vento do Fígado',
    description: 'Tremores, tiques, convulsões, tontura severa (vertigem), dormência nos membros.',
    treatment: {
      ross: 'VG16, VG20, VB20, IG4, BP6, F3 H',
      auteroche: 'VB20, IG11, CS6, BP6, R3',
      maciocia: 'F8, F3, B18, BP6, R3, VG16, VB20',
    }
  },
  DEFQIVB: {
    key: 'DEFQIVB', organ: 'Vesícula Biliar', nature: 'Deficiência',
    name: 'Deficiência de Qi da Vesícula Biliar',
    description: 'Timidez, falta de coragem, indecisão, insônia (acordar muito cedo).',
    treatment: {
      ross: 'VC4, TA4, VB13, VB40, R7 Ton M',
    }
  },

  // ─── BEXIGA ────────────────────────────────────────────────────────────────
  UMDFRIOB: {
    key: 'UMDFRIOB', organ: 'Bexiga', nature: 'Umidade-Frio',
    name: 'Umidade-Frio na Bexiga',
    description: 'Micção frequente com urina pálida e turva, sensação de peso no baixo ventre.',
    treatment: {}
  },
  UMDCALORB: {
    key: 'UMDCALORB', organ: 'Bexiga', nature: 'Umidade-Calor',
    name: 'Umidade-Calor na Bexiga',
    description: 'Micção frequente, urgente, dolorosa e com queimação; urina escura e turva.',
    treatment: {
      ross: 'VC3, VC6, TA6, E28, BP6, BP9 H',
      auteroche: 'B22, B23, B28, B52, R3, F2, F8, BP6, BP9, TA3, BP12',
      maciocia: 'BP6, BP9, B22, B28, VC3, B63, B66',
    }
  },
};

// Organ color map for visual grouping
export const ORGAN_COLORS: Record<string, string> = {
  'Rim': '#475569',
  'Coração': '#9A3A0A',
  'Baço': '#CF4500',
  'Pulmão': '#D1CDC7',
  'Estômago': '#2E4F4F',
  'Intestino Delgado': '#696969',
  'Intestino Grosso': '#5C6B73',
  'Fígado': '#141413',
  'Vesícula Biliar': '#344E41',
  'Bexiga': '#8A5A44',
};
