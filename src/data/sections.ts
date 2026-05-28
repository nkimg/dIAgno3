export type Gender = 'all' | 'male' | 'female';

export interface Symptom {
  id: string;
  label: string;
  syndromes: string[];
  gender: Gender;
  // weight is computed automatically by the scoring engine based on specificity
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  gender: Gender;
  symptoms: Symptom[];
}

export const SECTIONS: Section[] = [
  {
    id: 'face', title: 'Aspecto da Face', icon: '', gender: 'all',
    symptoms: [
      { id: 'face_arroxeada', label: 'Arroxeada', gender: 'all', syndromes: ['ESTGXUEC'] },
      { id: 'face_macas_vermelhas', label: 'Maçãs Vermelhas', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC'] },
      { id: 'face_palida', label: 'Pálida', gender: 'all', syndromes: ['DEFQIC', 'DEFXUEC', 'DEFYGBP', 'DEFXUEF', 'DEFYGR', 'DEFQIVB'] },
      { id: 'face_vermelha', label: 'Vermelha', gender: 'all', syndromes: ['FGC', 'FGF'] },
      { id: 'face_ictericia', label: 'Icterícia', gender: 'all', syndromes: ['UMDCALORF'] },
      { id: 'face_inchada', label: 'Inchada', gender: 'all', syndromes: ['DEFQIE', 'DEFYGBP', 'DEFYGR'] },
      { id: 'face_sem_brilho', label: 'Sem Brilho', gender: 'all', syndromes: ['DEFQIR', 'DEFQIBP', 'DEFQIC'] },
    ]
  },
  {
    id: 'emocional', title: 'Emocional', icon: '', gender: 'all',
    symptoms: [
      { id: 'emocional_agitacao', label: 'Agitação', gender: 'all', syndromes: ['DEFYNC', 'DEFXUEC', 'ESTGXUEC', 'FGC', 'ESTGQIF', 'ASCYGF', 'FGF', 'DEFYNR'] },
      { id: 'emocional_apatia', label: 'Apatia', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'DEFXUEF'] },
      { id: 'emocional_depressao', label: 'Depressão', gender: 'all', syndromes: ['ESTGQIF', 'DEFYGC', 'DEFQIE'] },
      { id: 'emocional_desanimo', label: 'Desânimo', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'emocional_falta_vontade', label: 'Falta de vontade', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'emocional_impaciencia', label: 'Impaciência', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'FGF', 'VTF', 'DEFYNR'] },
      { id: 'emocional_introversao', label: 'Introversão', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'emocional_irritabilidade', label: 'Irritabilidade', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'FGF', 'DEFXUEC', 'DEFYNE', 'FGC'] },
      { id: 'emocional_letargia', label: 'Letargia', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'DEFQIBP', 'DEFXUEF', 'DEFXUEC', 'DEFQIC', 'DEFYGC'] },
      { id: 'emocional_loquaz', label: 'Loquaz', gender: 'all', syndromes: ['DEFYNC'] },
      { id: 'emocional_medo', label: 'Medo', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'emocional_pessoa_ausente', label: 'Pessoa Ausente', gender: 'all', syndromes: ['DEFYNC', 'DEFYGR', 'DEFJGR', 'DEFYNR'] },
      { id: 'emocional_preocupacao', label: 'Preocupação', gender: 'all', syndromes: ['DEFQIBP', 'DEFYNC', 'DEFYGR', 'DEFJGR', 'DEFYNR'] },
      { id: 'emocional_tristeza', label: 'Tristeza', gender: 'all', syndromes: ['DEFQIP', 'DEFQIC', 'DEFYGC', 'DEFXUEC', 'DEFYNC'] },
    ]
  },
  {
    id: 'memoria', title: 'Memória', icon: '', gender: 'all',
    symptoms: [
      { id: 'memoria_fraca_geral', label: 'Fraca em geral', gender: 'all', syndromes: ['DEFXUEC', 'DEFJGR', 'DEFYNR'] },
      { id: 'memoria_falta_concentracao', label: 'Falta de concentração', gender: 'all', syndromes: ['DEFQIBP'] },
      { id: 'memoria_antiga_enfraquecida', label: 'Antiga enfraquecida', gender: 'all', syndromes: ['DEFXUEC', 'DEFYNC', 'DEFJGR'] },
      { id: 'memoria_recente_enfraquecida', label: 'Recente enfraquecida', gender: 'all', syndromes: ['DEFYNR', 'DEFJGR'] },
    ]
  },
  {
    id: 'disfuncoes_corporais', title: 'Disfunções Corporais', icon: '', gender: 'all',
    symptoms: [
      { id: 'disfuncoes_cansaco', label: 'Cansaço', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP', 'DEFQIR', 'DEFYGR'] },
      { id: 'disfuncoes_diabetes', label: 'Diabetes', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP'] },
      { id: 'disfuncoes_fala_anormal', label: 'Fala anormal', gender: 'all', syndromes: ['DEFQIC', 'DEFYNC', 'DEFXUEC', 'ESTGXUEC', 'FGC', 'FLMC'] },
      { id: 'disfuncoes_falta_ar', label: 'Falta de ar', gender: 'all', syndromes: ['DEFQIP', 'DEFYGR'] },
      { id: 'disfuncoes_osteoporose', label: 'Osteoporose', gender: 'all', syndromes: ['DEFJGR', 'DEFYNR'] },
      { id: 'disfuncoes_pressao_alta', label: 'Pressão alta', gender: 'all', syndromes: ['DEFYNR', 'DEFXUEF', 'ASCYGF', 'FGF', 'VTF', 'DEFQIVB'] },
      { id: 'disfuncoes_reumatismo', label: 'Reumatismo', gender: 'all', syndromes: ['CALORID', 'OBSTID'] },
      { id: 'disfuncoes_tremores', label: 'Tremores', gender: 'all', syndromes: ['DEFXUEF', 'ASCYGF', 'VTF'] },
    ]
  },
  {
    id: 'aspecto_corpo', title: 'Aspecto do Corpo', icon: '', gender: 'all',
    symptoms: [
      { id: 'corpo_magreza', label: 'Magreza', gender: 'all', syndromes: ['DEFYNR', 'DEFXUEF', 'CALORE'] },
      { id: 'corpo_obesidade', label: 'Obesidade', gender: 'all', syndromes: ['UMDCALORBP', 'UMDFRIOBP'] },
    ]
  },
  {
    id: 'temperatura', title: 'Temperatura e Sensações Térmicas', icon: '', gender: 'all',
    symptoms: [
      { id: 'temp_ondas_calor', label: 'Ondas de calor', gender: 'all', syndromes: ['DEFYNR'] },
      { id: 'temp_aversao_frio', label: 'Aversão ao frio', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'VTFRIOP'] },
      { id: 'temp_aversao_vento', label: 'Aversão ao vento', gender: 'all', syndromes: ['VTCALORP', 'DEFQIP'] },
      { id: 'temp_calor_cinco_palmos', label: 'Calor nos cinco palmos', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC'] },
    ]
  },
  {
    id: 'inchacos', title: 'Inchaços e Edema', icon: '', gender: 'all',
    symptoms: [
      { id: 'inchaco_abdome', label: 'Abdome', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP'] },
      { id: 'inchaco_ascite', label: 'Ascite', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'inchaco_corpo', label: 'Corpo', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'inchaco_face', label: 'Face', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'inchaco_olhos', label: 'Olhos', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'inchaco_tornozelo', label: 'Tornozelo', gender: 'all', syndromes: ['DEFYGR', 'UMDFRIOB', 'UMDCALORB'] },
      { id: 'edema_com_cacifo', label: 'Edema com cacifo', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP'] },
      { id: 'edema_sem_cacifo', label: 'Edema sem cacifo', gender: 'all', syndromes: ['UMDCALORBP', 'UMDFRIOBP'] },
    ]
  },
  {
    id: 'aspecto_pele', title: 'Aspecto da Pele', icon: '', gender: 'all',
    symptoms: [
      { id: 'pele_anormal', label: 'Anormal', gender: 'all', syndromes: ['UMDCALORIG'] },
      { id: 'pele_hematomas', label: 'Hematomas', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGXUEF', 'BPCONTRXUE'] },
      { id: 'pele_petequias', label: 'Petéquias', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGXUEF'] },
      { id: 'pele_seca', label: 'Seca', gender: 'all', syndromes: ['DEFYNP', 'DEFXUEF', 'DEFYNE'] },
    ]
  },
  {
    id: 'transpiracao', title: 'Transpiração', icon: '', gender: 'all',
    symptoms: [
      { id: 'transp_ausencia', label: 'Ausência', gender: 'all', syndromes: ['VTFRIOP'] },
      { id: 'transp_dia', label: 'Mais de dia (espontânea)', gender: 'all', syndromes: ['DEFYGR', 'DEFYGC'] },
      { id: 'transp_profusa_fria', label: 'Profusa e Fria', gender: 'all', syndromes: ['COLAPSQIBP'] },
      { id: 'transp_noite', label: 'Mais à noite (sudorese noturna)', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC'] },
      { id: 'transp_sem_esforco', label: 'Sem esforço', gender: 'all', syndromes: ['DEFQIP'] },
      { id: 'transp_cabeca', label: 'Cabeça', gender: 'all', syndromes: ['FGC', 'FLMC', 'CALORE', 'UMDCALORBP'] },
      { id: 'transp_maos', label: 'Mãos', gender: 'all', syndromes: ['DEFQIP'] },
      { id: 'transp_membros', label: 'Membros', gender: 'all', syndromes: ['DEFQIBP', 'DEFQIE'] },
    ]
  },
  {
    id: 'febre', title: 'Febre', icon: '', gender: 'all',
    symptoms: [
      { id: 'febre_alta_constante', label: 'Alta e constante', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP'] },
      { id: 'febre_calafrios', label: '+ Calafrios', gender: 'all', syndromes: ['DEFYGBP'] },
      { id: 'febre_calafrios_melhora_calor', label: '+ Calafrios que melhoram com calor', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'febre_febricula', label: 'Febrícula', gender: 'all', syndromes: ['UMDCALORBP'] },
      { id: 'febre_sem_sudorese', label: 'Sem sudorese', gender: 'all', syndromes: ['CALORE'] },
      { id: 'febre_vespertina', label: 'Vespertina', gender: 'all', syndromes: ['DEFYNP', 'DEFYNR', 'DEFYNE'] },
    ]
  },
  {
    id: 'dor_intensidade', title: 'Dor — Intensidade', icon: '', gender: 'all',
    symptoms: [
      { id: 'dor_int_forte', label: 'Forte', gender: 'all', syndromes: ['ESTGXUEF'] },
      { id: 'dor_int_fraca', label: 'Fraca', gender: 'all', syndromes: ['ESTGQIF'] },
    ]
  },
  {
    id: 'dor_tipo', title: 'Dor — Tipo', icon: '', gender: 'all',
    symptoms: [
      { id: 'dor_tipo_colica', label: 'Cólica', gender: 'all', syndromes: ['UMDFRIOIG', 'ESTGXUEF'] },
      { id: 'dor_tipo_frio', label: 'Sensação de frio', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP'] },
      { id: 'dor_tipo_latejante', label: 'Latejante', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF'] },
      { id: 'dor_tipo_peso', label: 'Peso', gender: 'all', syndromes: ['UMDCALORB', 'UMDFRIOB', 'UMDCALORBP', 'UMDFRIOBP'] },
      { id: 'dor_tipo_pontada', label: 'Pontada', gender: 'all', syndromes: ['ESTGXUEF', 'ESTGXUEC'] },
      { id: 'dor_tipo_queimacao', label: 'Queimação', gender: 'all', syndromes: ['DEFYNE', 'DEFYNR'] },
      { id: 'dor_tipo_surda', label: 'Surda', gender: 'all', syndromes: ['DEFQIR', 'DEFQIBP', 'DEFXUEC', 'DEFXUEF'] },
      { id: 'dor_tipo_piora_pressao', label: 'Piora com pressão', gender: 'all', syndromes: ['ESTGXUEF', 'ESTGXUEC', 'ESTGQIF'] },
      { id: 'dor_tipo_alivia_movimento', label: 'Alivia com movimento', gender: 'all', syndromes: ['DEFQIR', 'DEFQIBP'] },
      { id: 'dor_tipo_piora_movimento', label: 'Piora com movimento', gender: 'all', syndromes: ['ESTGXUEF', 'ESTGXUEC', 'ESTGQIF'] },
      { id: 'dor_cor_arroxeada', label: 'Região dolorida arroxeada', gender: 'all', syndromes: ['ESTGXUEF'] },
    ]
  },
  {
    id: 'dor_localizacao', title: 'Dor — Localização', icon: '', gender: 'all',
    symptoms: [
      { id: 'dor_loc_peito', label: 'Peito', gender: 'all', syndromes: ['ESTGQIF', 'ESTGXUEF', 'ESTGXUEC', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'dor_loc_lateral_torax', label: 'Lateral do tórax', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'ESTGXUEF'] },
      { id: 'dor_loc_abaixo_costelas', label: 'Abaixo das costelas', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'ESTGXUEF'] },
      { id: 'dor_loc_acima_umbigo', label: 'Acima do umbigo', gender: 'all', syndromes: ['ALIME', 'REBELE'] },
      { id: 'dor_loc_abaixo_umbigo', label: 'Abaixo do umbigo', gender: 'all', syndromes: ['UMDCALORB', 'UMDFRIOB'] },
    ]
  },
  {
    id: 'coluna', title: 'Coluna', icon: '', gender: 'all',
    symptoms: [
      { id: 'coluna_costas_tensas', label: 'Costas tensas', gender: 'all', syndromes: ['UMDFRIOB', 'UMDCALORB'] },
      { id: 'coluna_dor_dorso', label: 'Dor no dorso', gender: 'all', syndromes: ['UMDFRIOB', 'UMDCALORB'] },
      { id: 'coluna_fraqueza', label: 'Fraqueza', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'coluna_rigidez_nuca', label: 'Rigidez na nuca', gender: 'all', syndromes: ['UMDFRIOB', 'UMDCALORB'] },
      { id: 'coluna_torcicolo', label: 'Torcicolo', gender: 'all', syndromes: ['OBSTID'] },
    ]
  },
  {
    id: 'coluna_lombar', title: 'Coluna Lombar', icon: '', gender: 'all',
    symptoms: [
      { id: 'lombar_dor_noite', label: 'Dolorida à noite', gender: 'all', syndromes: ['DEFYGR', 'UMDFRIOB'] },
      { id: 'lombar_dor_sempre', label: 'Dolorida sempre', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'lombar_fraca', label: 'Fraca', gender: 'all', syndromes: ['DEFQIR', 'DEFJGR'] },
      { id: 'lombar_dor_extensa', label: 'Dor extensa', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR'] },
      { id: 'lombar_dor_pontual', label: 'Dor pontual', gender: 'all', syndromes: ['ESTGXUEF'] },
    ]
  },
  {
    id: 'membros_geral', title: 'Membros — Estado Geral', icon: '', gender: 'all',
    symptoms: [
      { id: 'membros_arroxeamento', label: 'Arroxeamento', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGXUEF', 'BPCONTRXUE'] },
      { id: 'membros_espasticos', label: 'Espásticos', gender: 'all', syndromes: ['FLMC', 'VTF'] },
      { id: 'membros_fracos', label: 'Fracos', gender: 'all', syndromes: ['DEFQIBP'] },
    ]
  },
  {
    id: 'membros_bracos', title: 'Membros — Braços', icon: '', gender: 'all',
    symptoms: [
      { id: 'bracos_inchados', label: 'Braços inchados', gender: 'all', syndromes: ['DEFYGBP', 'DEFQIP', 'ESTGQIF', 'UMDCALORBP', 'UMDFRIOBP'] },
      { id: 'bracos_pesados', label: 'Braços pesados', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP', 'UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'bracos_dor', label: 'Dor no braço', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGQIF', 'UMDCALORIG', 'UMDFRIOIG'] },
      { id: 'bracos_dor_ombros', label: 'Dor nos ombros', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGQIF', 'UMDCALORIG', 'UMDFRIOIG', 'VTCALORP', 'VTFRIOP'] },
      { id: 'bracos_ombros_rigidos', label: 'Ombros rígidos', gender: 'all', syndromes: ['ESTGXUEC', 'ESTGQIF', 'UMDCALORIG', 'UMDFRIOIG', 'VTCALORP', 'VTFRIOP'] },
    ]
  },
  {
    id: 'membros_maos', title: 'Membros — Mãos', icon: '', gender: 'all',
    symptoms: [
      { id: 'maos_caimbras', label: 'Cãibras', gender: 'all', syndromes: ['DEFXUEC'] },
      { id: 'maos_dor', label: 'Dor nas mãos', gender: 'all', syndromes: ['OBSTID'] },
      { id: 'maos_formigamento', label: 'Formigamento', gender: 'all', syndromes: ['DEFXUEF', 'ASCYGF', 'DEFYNP'] },
      { id: 'maos_frias', label: 'Mãos frias', gender: 'all', syndromes: ['DEFYGC', 'DEFQIP'] },
      { id: 'maos_quentes', label: 'Mãos quentes', gender: 'all', syndromes: ['DEFYNC', 'DEFYNP'] },
    ]
  },
  {
    id: 'membros_pernas', title: 'Membros — Pernas', icon: '', gender: 'all',
    symptoms: [
      { id: 'pernas_artrite_dores', label: 'Artrite e dores', gender: 'all', syndromes: ['UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'pernas_problemas_nervosos', label: 'Problemas nervosos', gender: 'all', syndromes: ['DEFQIR', 'UMDFRIOB', 'UMDCALORB'] },
      { id: 'pernas_dor_calcanhar', label: 'Dor no calcanhar', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR'] },
      { id: 'pernas_joelhos_fracos', label: 'Joelhos fracos', gender: 'all', syndromes: ['DEFJGR', 'DEFQIR'] },
      { id: 'pernas_joelhos_frios', label: 'Joelhos frios', gender: 'all', syndromes: ['DEFJGR', 'DEFYGR'] },
      { id: 'pernas_manchas_roxas', label: 'Manchas roxas', gender: 'all', syndromes: ['BPCONTRXUE'] },
      { id: 'pernas_marcha_vacilante', label: 'Marcha vacilante', gender: 'all', syndromes: ['ESTGXUEF', 'DEFYNR', 'DEFXUEF'] },
      { id: 'pernas_pesadas', label: 'Pernas pesadas', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'pernas_frias', label: 'Pernas frias', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP', 'UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'pernas_quentes', label: 'Pernas quentes', gender: 'all', syndromes: ['DEFYNR'] },
    ]
  },
  {
    id: 'membros_pes', title: 'Membros — Pés', icon: '', gender: 'all',
    symptoms: [
      { id: 'pes_caimbras', label: 'Cãibras', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'pes_dor', label: 'Dor', gender: 'all', syndromes: ['DEFYGR', 'DEFYNR', 'DEFXUEF', 'UMDCALORB', 'UMDFRIOB'] },
      { id: 'pes_formigamento', label: 'Formigamento', gender: 'all', syndromes: ['DEFXUEF', 'ASCYGF'] },
      { id: 'pes_frio', label: 'Frio', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'pes_calor', label: 'Calor', gender: 'all', syndromes: ['DEFYNR'] },
    ]
  },
  {
    id: 'unhas', title: 'Unhas', icon: '', gender: 'all',
    symptoms: [
      { id: 'unhas_fracas', label: 'Fracas', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'unhas_secas', label: 'Secas', gender: 'all', syndromes: ['DEFXUEF'] },
    ]
  },
  {
    id: 'sono', title: 'Sono', icon: '', gender: 'all',
    symptoms: [
      { id: 'sono_demora_pegar', label: 'Demora a pegar no sono', gender: 'all', syndromes: ['DEFXUEC', 'DEFXUEF', 'DEFQIBP'] },
      { id: 'sono_agitado_nao_dorme', label: 'Agitado, não dorme', gender: 'all', syndromes: ['FGC'] },
      { id: 'sono_acorda_azia', label: 'Acorda com azia', gender: 'all', syndromes: ['DEFYNC', 'FGC', 'FLMC', 'CALORE'] },
      { id: 'sono_acorda_boca_seca', label: 'Acorda com boca seca', gender: 'all', syndromes: ['DEFYNE'] },
      { id: 'sono_acorda_calor_suor', label: 'Acorda com calor e suor', gender: 'all', syndromes: ['DEFYNC'] },
      { id: 'sono_acorda_pesadelo', label: 'Acorda com pesadelo', gender: 'all', syndromes: ['FGC'] },
      { id: 'sono_acorda_sono_leve', label: 'Acorda por sono leve', gender: 'all', syndromes: ['DEFXUEC'] },
      { id: 'sono_acorda_taquicardia', label: 'Acorda com taquicardia', gender: 'all', syndromes: ['DEFYNC', 'FGC'] },
      { id: 'sono_acorda_urinar', label: 'Acorda para urinar', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'sono_acorda_sonolencia', label: 'Acorda com sonolência excessiva', gender: 'all', syndromes: ['DEFYGR', 'DEFYGC'] },
      { id: 'sono_acorda_cedo', label: 'Acorda muito cedo', gender: 'all', syndromes: ['DEFXUEC', 'DEFQIVB'] },
      { id: 'sono_acorda_cansado', label: 'Acorda cansado', gender: 'all', syndromes: ['DEFYGC'] },
    ]
  },
  {
    id: 'sonhos', title: 'Sonhos', icon: '', gender: 'all',
    symptoms: [
      { id: 'sonhos_comida', label: 'Comida', gender: 'all', syndromes: ['DEFQIE', 'DEFYNE'] },
      { id: 'sonhos_sexo', label: 'Sexo', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC', 'FGC'] },
      { id: 'sonhos_fogo', label: 'Fogo', gender: 'all', syndromes: ['DEFYNC', 'FGC'] },
      { id: 'sonhos_floresta', label: 'Floresta', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'VTF'] },
      { id: 'sonhos_voar', label: 'Voar', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'sonhos_abismo', label: 'Abismo', gender: 'all', syndromes: ['DEFYNR'] },
      { id: 'sonhos_afogamento', label: 'Afogamento', gender: 'all', syndromes: ['DEFYGR'] },
      { id: 'sonhos_choro_medo', label: 'Choro e medo', gender: 'all', syndromes: ['SECP', 'VTFRIOP', 'VTCALORP', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'sonhos_raiva', label: 'Raiva', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'VTF'] },
      { id: 'sonhos_agua_chuva', label: 'Água/chuva', gender: 'all', syndromes: ['DEFYGBP', 'UMDFRIOBP'] },
      { id: 'sonhos_inundacao', label: 'Inundação', gender: 'all', syndromes: ['DEFYGR', 'UMDFRIOBP', 'UMDFRIOB'] },
    ]
  },
  {
    id: 'cefaleia_localizacao', title: 'Cefaleia — Localização', icon: '', gender: 'all',
    symptoms: [
      { id: 'cefaleia_loc_olhos', label: 'Acima e atrás dos olhos', gender: 'all', syndromes: ['VTF', 'ASCYGF', 'DEFXUEF'] },
      { id: 'cefaleia_loc_ao_redor', label: 'Ao redor da cabeça', gender: 'all', syndromes: ['ESTGQIF', 'VTFRIOP'] },
      { id: 'cefaleia_loc_frontal', label: 'Frontal', gender: 'all', syndromes: ['UMDFRIOBP', 'UMDCALORBP', 'CALORE', 'REBELE', 'ALIME', 'DEFQIBP'] },
      { id: 'cefaleia_loc_hemicrania', label: 'Hemicrania', gender: 'all', syndromes: ['ASCYGF', 'DEFXUEF'] },
      { id: 'cefaleia_loc_occipital', label: 'Occipital', gender: 'all', syndromes: ['ASCYGF', 'DEFQIR'] },
      { id: 'cefaleia_loc_occipital_cervical', label: 'Occipital e cervical', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'cefaleia_loc_occipital_narinas', label: 'Occipital e narinas', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP'] },
    ]
  },
  {
    id: 'cefaleia_sensacao', title: 'Cefaleia — Sensação e Piora', icon: '', gender: 'all',
    symptoms: [
      { id: 'cefaleia_sens_pulsando', label: 'Fluxo de sangue pulsando', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP'] },
      { id: 'cefaleia_sens_aperto', label: 'Forte em aperto', gender: 'all', syndromes: ['VTF'] },
      { id: 'cefaleia_sens_latejante', label: 'Forte e latejante', gender: 'all', syndromes: ['CALORE', 'ASCYGF'] },
      { id: 'cefaleia_sens_peso', label: 'Forte em peso', gender: 'all', syndromes: ['UMDFRIOBP', 'UMDCALORBP', 'UMDCALORF'] },
      { id: 'cefaleia_sens_fraca_fronte', label: 'Fraca na fronte', gender: 'all', syndromes: ['DEFQIBP'] },
      { id: 'cefaleia_sens_fraca_lateral', label: 'Fraca na lateral', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'cefaleia_sens_vazio_cabeca', label: 'Vazio na cabeça', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'cefaleia_piora_pre_menstrual', label: 'Piora antes do fluxo', gender: 'female', syndromes: ['ESTGQIF'] },
      { id: 'cefaleia_piora_pos_menstrual', label: 'Piora depois do fluxo', gender: 'female', syndromes: ['DEFXUEF'] },
    ]
  },
  {
    id: 'tontura', title: 'Tontura', icon: '', gender: 'all',
    symptoms: [
      { id: 'tontura_forte', label: 'Forte', gender: 'all', syndromes: ['FLMC'] },
      { id: 'tontura_geral', label: 'Tontura em geral', gender: 'all', syndromes: ['DEFXUEF', 'ASCYGF', 'FLMC', 'DEFYNR'] },
      { id: 'tontura_com_cefaleia_latejante', label: 'Com cefaleia latejante', gender: 'all', syndromes: ['ASCYGF'] },
      { id: 'tontura_com_peso_cabeca', label: 'Com peso na cabeça', gender: 'all', syndromes: ['DEFQIBP', 'UMDCALORBP', 'UMDFRIOBP'] },
      { id: 'tontura_escurece_vista', label: 'Escurece a vista', gender: 'all', syndromes: ['DEFQIBP', 'DEFXUEC', 'FLMC', 'DEFXUEF'] },
      { id: 'tontura_perde_linha_andar', label: 'Perde a linha ao andar', gender: 'all', syndromes: ['DEFQIR', 'DEFXUEF'] },
      { id: 'tontura_vazio_cabeca', label: 'Vazio na cabeça', gender: 'all', syndromes: ['DEFQIR', 'DEFYNR'] },
      { id: 'tontura_ver_tudo_girando', label: 'Ver tudo girando', gender: 'all', syndromes: ['VTF'] },
    ]
  },
  {
    id: 'olhos_visao', title: 'Olhos e Visão', icon: '', gender: 'all',
    symptoms: [
      { id: 'olhos_doenca', label: 'Doença nos olhos', gender: 'all', syndromes: ['ASCYGF', 'VTF', 'UMDCALORF', 'FGF', 'ESTGXUEF', 'ESTGQIF'] },
      { id: 'olhos_dor', label: 'Dor nos olhos', gender: 'all', syndromes: ['ASCYGF', 'FGF', 'VTF', 'UMDCALORF', 'ESTGXUEF', 'DEFXUEF'] },
      { id: 'olhos_lacrimeja', label: 'Lacrimeja e epífora', gender: 'all', syndromes: ['DEFYNP', 'DEFYNE', 'DEFXUEF', 'FGF', 'UMDCALORF'] },
      { id: 'olhos_secura', label: 'Secura', gender: 'all', syndromes: ['DEFYNR', 'DEFXUEF'] },
      { id: 'olhos_vermelhidao', label: 'Vermelhidão', gender: 'all', syndromes: ['ASCYGF', 'FGF'] },
      { id: 'olhos_visao_embacada', label: 'Visão embaçada', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'olhos_visao_fraca', label: 'Visão fraca', gender: 'all', syndromes: ['DEFXUEF'] },
      { id: 'olhos_visao_ofuscacoes', label: 'Visão com ofuscações', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'DEFXUEF', 'DEFQIBP'] },
      { id: 'olhos_olhar_vidrado', label: 'Olhar vidrado', gender: 'all', syndromes: ['DEFQIVB'] },
      { id: 'olhos_pontos_brilho', label: 'Enxerga pontos com brilho', gender: 'all', syndromes: ['ASCYGF'] },
      { id: 'olhos_pontos_escuros', label: 'Enxerga pontos escuros', gender: 'all', syndromes: ['DEFXUEF'] },
    ]
  },
  {
    id: 'nariz_ouvido', title: 'Nariz e Ouvido', icon: '', gender: 'all',
    symptoms: [
      { id: 'nariz_entupido', label: 'Nariz entupido', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP'] },
      { id: 'nariz_epistaxe', label: 'Epistaxe (sangramento nasal)', gender: 'all', syndromes: ['FGF', 'VTCALORP', 'UMDCALORIG', 'UMDCALORB'] },
      { id: 'nariz_secrecao_amarela', label: 'Secreção nasal amarela', gender: 'all', syndromes: ['VTCALORP'] },
      { id: 'nariz_secrecao_branca', label: 'Secreção nasal branca', gender: 'all', syndromes: ['VTFRIOP'] },
      { id: 'ouvido_surdez_gradual', label: 'Surdez gradual', gender: 'all', syndromes: ['DEFXUEC', 'DEFQIC'] },
      { id: 'ouvido_surdez_repentina', label: 'Surdez repentina', gender: 'all', syndromes: ['ASCYGF', 'FGF'] },
      { id: 'ouvido_zumbidos', label: 'Zumbido em geral', gender: 'all', syndromes: ['DEFYNR', 'ASCYGF', 'DEFXUEF', 'FGF', 'DEFQIR'] },
      { id: 'ouvido_zumbido_agudo', label: 'Zumbido agudo', gender: 'all', syndromes: ['ASCYGF', 'FGF'] },
      { id: 'ouvido_zumbido_grave', label: 'Zumbido grave', gender: 'all', syndromes: ['DEFQIR', 'DEFYNR'] },
      { id: 'ouvido_cera_coceira', label: 'Cera e coceira', gender: 'all', syndromes: ['UMDCALORF'] },
    ]
  },
  {
    id: 'boca_garganta', title: 'Boca e Garganta', icon: '', gender: 'all',
    symptoms: [
      { id: 'boca_aftas', label: 'Aftas', gender: 'all', syndromes: ['CALORE', 'FGC'] },
      { id: 'boca_muita_salivacao', label: 'Muita salivação', gender: 'all', syndromes: ['ALIME', 'DEFYGBP'] },
      { id: 'boca_seca', label: 'Boca seca', gender: 'all', syndromes: ['DEFYNE', 'CALORE'] },
      { id: 'boca_gengivite', label: 'Gengivite', gender: 'all', syndromes: ['CALORE'] },
      { id: 'boca_mau_halito', label: 'Mau hálito', gender: 'all', syndromes: ['CALORE', 'ALIME', 'UMDCALORBP'] },
      { id: 'boca_gosto_adocicado', label: 'Gosto adocicado', gender: 'all', syndromes: ['UMDCALORBP'] },
      { id: 'boca_gosto_amargo', label: 'Gosto amargo', gender: 'all', syndromes: ['FGC', 'FGF'] },
      { id: 'boca_gosto_metalico', label: 'Gosto metálico', gender: 'all', syndromes: ['UMDCALORIG'] },
      { id: 'boca_gosto_salgado', label: 'Gosto salgado', gender: 'all', syndromes: ['DEFQIR'] },
      { id: 'garganta_dores', label: 'Dores na garganta', gender: 'all', syndromes: ['VTCALORP', 'DEFYNP', 'DEFYNR', 'CALORE'] },
      { id: 'garganta_seca', label: 'Garganta seca', gender: 'all', syndromes: ['DEFYNP', 'VTCALORP', 'DEFYNR', 'CALORE'] },
      { id: 'garganta_rouquidao_pigarro', label: 'Rouquidão e pigarro', gender: 'all', syndromes: ['DEFYNP'] },
      { id: 'garganta_caroco', label: 'Caroço na garganta', gender: 'all', syndromes: ['ESTGQIF'] },
      { id: 'garganta_dor_dente', label: 'Dor de dente', gender: 'all', syndromes: ['UMDCALORIG', 'UMDFRIOIG'] },
    ]
  },
  {
    id: 'respiratorio_tosse', title: 'Respiratório — Tosse', icon: '', gender: 'all',
    symptoms: [
      { id: 'tosse_aguda', label: 'Aguda', gender: 'all', syndromes: ['SECP', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'tosse_cronica', label: 'Crônica', gender: 'all', syndromes: ['DEFYNP', 'DEFQIP'] },
      { id: 'tosse_forte', label: 'Forte', gender: 'all', syndromes: ['SECP', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'tosse_fraca', label: 'Fraca', gender: 'all', syndromes: ['DEFYNP', 'DEFQIP'] },
      { id: 'tosse_chiado_asma', label: 'Chiado/asma', gender: 'all', syndromes: ['FLMFRIOP', 'FLMCALORP', 'DEFYGR', 'DEFQIP'] },
      { id: 'tosse_piora_noite', label: 'Piora à noite', gender: 'all', syndromes: ['DEFYNP'] },
      { id: 'tosse_catarro_amarelo_garganta', label: 'Catarro amarelo (garganta)', gender: 'all', syndromes: ['VTCALORP'] },
      { id: 'tosse_catarro_amarelo_pulmao', label: 'Catarro amarelo (pulmão)', gender: 'all', syndromes: ['FLMCALORP'] },
      { id: 'tosse_catarro_branco_garganta', label: 'Catarro branco (garganta)', gender: 'all', syndromes: ['VTFRIOP'] },
      { id: 'tosse_catarro_branco_pulmao', label: 'Catarro branco (pulmão)', gender: 'all', syndromes: ['FLMFRIOP'] },
    ]
  },
  {
    id: 'torax', title: 'Tórax e Coração', icon: '', gender: 'all',
    symptoms: [
      { id: 'torax_palpitacao', label: 'Palpitação', gender: 'all', syndromes: ['DEFQIC', 'DEFYGC', 'DEFYNC', 'DEFXUEC', 'FGC', 'FLMC', 'ESTGXUEC', 'COLAPSQIC'] },
      { id: 'torax_taquicardia', label: 'Taquicardia', gender: 'all', syndromes: ['DEFQIC', 'DEFYGC', 'DEFYNC', 'DEFXUEC', 'FGC', 'FLMC', 'ESTGXUEC', 'COLAPSQIC'] },
      { id: 'torax_dor_peito', label: 'Dor no peito', gender: 'all', syndromes: ['ESTGQIF', 'ESTGXUEC'] },
      { id: 'torax_pressao_peito', label: 'Pressão no peito', gender: 'all', syndromes: ['ESTGQIF', 'FLMFRIOP', 'FLMCALORP'] },
      { id: 'torax_desconforto_hipocondrios', label: 'Desconforto nos hipocôndrios', gender: 'all', syndromes: ['ESTGQIF', 'UMDCALORF'] },
      { id: 'torax_dor_hipocondrios', label: 'Dor nos hipocôndrios', gender: 'all', syndromes: ['ESTGQIF', 'UMDCALORF', 'FGF'] },
      { id: 'torax_dor_intercostal', label: 'Dor intercostal', gender: 'all', syndromes: ['ESTGQIF', 'UMDCALORF', 'FGF'] },
      { id: 'torax_mamas_doloridas', label: 'Mamas doloridas e inchadas', gender: 'female', syndromes: ['ESTGQIF'] },
      { id: 'torax_resp_suspiros', label: 'Suspiros frequentes', gender: 'all', syndromes: ['ESTGQIF'] },
      { id: 'torax_resp_bocejos', label: 'Bocejos frequentes', gender: 'all', syndromes: ['ESTGQIF', 'ESTGXUEF'] },
    ]
  },
  {
    id: 'sede_apetite', title: 'Sede e Apetite', icon: '', gender: 'all',
    symptoms: [
      { id: 'sede_ausencia', label: 'Ausência de sede', gender: 'all', syndromes: ['FRIOE', 'UMDFRIOBP'] },
      { id: 'sede_com_desejo_beber', label: 'Sede com desejo de beber', gender: 'all', syndromes: ['CALORE', 'UMDCALORBP'] },
      { id: 'sede_sem_desejo_beber', label: 'Sede sem desejo de beber', gender: 'all', syndromes: ['UMDFRIOBP', 'UMDCALORBP'] },
      { id: 'sede_bebidas_frias', label: 'Prefere bebidas frias', gender: 'all', syndromes: ['CALORE', 'FGC', 'FGF'] },
      { id: 'sede_bebidas_quentes', label: 'Prefere bebidas quentes', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'FRIOE'] },
      { id: 'apetite_ausencia', label: 'Ausência de apetite', gender: 'all', syndromes: ['DEFQIBP', 'DEFQIE'] },
      { id: 'apetite_excesso', label: 'Excesso de apetite', gender: 'all', syndromes: ['CALORE', 'DEFYNE'] },
      { id: 'apetite_fome_sem_vontade_comer', label: 'Fome mas sem vontade de comer', gender: 'all', syndromes: ['DEFYNE'] },
      { id: 'apetite_nausea', label: 'Náusea', gender: 'all', syndromes: ['REBELE', 'ALIME', 'UMDFRIOBP', 'VTFRIOP', 'VTCALORP'] },
      { id: 'apetite_vomito', label: 'Vômito', gender: 'all', syndromes: ['REBELE', 'ALIME', 'FRIOE'] },
    ]
  },
  {
    id: 'abdome', title: 'Abdome', icon: '', gender: 'all',
    symptoms: [
      { id: 'abdome_distensao_geral', label: 'Distensão em geral', gender: 'all', syndromes: ['DEFQIBP', 'ESTGQIF', 'ALIME'] },
      { id: 'abdome_distensao_baixo_ventre', label: 'Distensão no baixo ventre', gender: 'all', syndromes: ['UMDCALORB', 'UMDFRIOB', 'ESTGXUEF'] },
      { id: 'abdome_dor_abdominal', label: 'Dor abdominal', gender: 'all', syndromes: ['OBSTID', 'UMDCALORIG', 'UMDFRIOIG', 'FRIOE', 'CALORID'] },
      { id: 'abdome_queimacao_periumbilical', label: 'Queimação periumbilical', gender: 'all', syndromes: ['CALORE', 'UMDCALORB'] },
      { id: 'abdome_falta_paladar', label: 'Falta de paladar', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP'] },
      { id: 'abdome_gases', label: 'Gases', gender: 'all', syndromes: ['DEFQIBP', 'ALIME', 'ESTGQIF'] },
      { id: 'abdome_azia_refluxo', label: 'Azia e refluxo', gender: 'all', syndromes: ['CALORE', 'REBELE', 'ALIME'] },
    ]
  },
  {
    id: 'intestinos', title: 'Intestinos e Fezes', icon: '', gender: 'all',
    symptoms: [
      { id: 'intestino_hemorroidas', label: 'Hemorróidas', gender: 'all', syndromes: ['UMDCALORIG', 'COLAPSQIBP'] },
      { id: 'intestino_prolapso_anal', label: 'Prolapso anal', gender: 'all', syndromes: ['COLAPSQIBP'] },
      { id: 'intestino_constipacao', label: 'Constipação', gender: 'all', syndromes: ['DEFYNE', 'CALORE', 'DEFYNR', 'ESTGQIF'] },
      { id: 'intestino_diarreia', label: 'Diarreia', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP', 'UMDFRIOBP', 'UMDCALORIG'] },
      { id: 'intestino_diarreia_amanhecer', label: 'Diarreia ao amanhecer', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP'] },
      { id: 'intestino_fezes_moles', label: 'Fezes moles/pastosas', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP', 'UMDFRIOBP'] },
      { id: 'intestino_fezes_ressecadas', label: 'Fezes ressecadas', gender: 'all', syndromes: ['DEFYNE', 'CALORE', 'DEFYNR'] },
      { id: 'intestino_fezes_grudentas', label: 'Fezes grudentas', gender: 'all', syndromes: ['UMDCALORIG', 'UMDCALORBP'] },
      { id: 'intestino_fezes_sangue_muco', label: 'Fezes com sangue ou muco', gender: 'all', syndromes: ['UMDCALORIG', 'BPCONTRXUE'] },
      { id: 'intestino_fezes_restos', label: 'Fezes com restos alimentares', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP'] },
    ]
  },
  {
    id: 'urina', title: 'Urina e Bexiga', icon: '', gender: 'all',
    symptoms: [
      { id: 'urina_incontinencia', label: 'Incontinência urinária', gender: 'all', syndromes: ['DEFYGR', 'COLAPSQIBP'] },
      { id: 'urina_micção_frequente_clara', label: 'Micção frequente e clara', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR'] },
      { id: 'urina_micção_frequente_escura', label: 'Micção frequente e escura', gender: 'all', syndromes: ['UMDCALORB', 'FGC', 'CALORID'] },
      { id: 'urina_nocturia', label: 'Noctúria (urinar à noite)', gender: 'all', syndromes: ['DEFYGR', 'DEFQIR'] },
      { id: 'urina_escassa', label: 'Urina escassa', gender: 'all', syndromes: ['DEFYNR', 'UMDCALORB'] },
      { id: 'urina_abundante', label: 'Urina abundante', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR'] },
      { id: 'urina_cor_escura', label: 'Cor amarelo escura/alaranjada', gender: 'all', syndromes: ['UMDCALORB', 'FGC', 'CALORE'] },
      { id: 'urina_cor_turva', label: 'Cor turva', gender: 'all', syndromes: ['UMDCALORB', 'UMDFRIOB'] },
      { id: 'urina_queimacao', label: 'Queimação ao urinar', gender: 'all', syndromes: ['UMDCALORB', 'CALORID'] },
      { id: 'urina_jato_fraco', label: 'Jato fraco', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR'] },
      { id: 'urina_inicio_dificil', label: 'Início difícil', gender: 'all', syndromes: ['DEFQIR', 'UMDCALORB'] },
      { id: 'urina_peso_hipogastrio', label: 'Peso no hipogástrio', gender: 'all', syndromes: ['UMDCALORB', 'UMDFRIOB'] },
    ]
  },
  {
    id: 'genitais_masculino', title: 'Genitais — Masculino', icon: '', gender: 'male',
    symptoms: [
      { id: 'genm_ejaculacao_precoce', label: 'Ejaculação precoce', gender: 'male', syndromes: ['DEFYNR', 'DEFQIR'] },
      { id: 'genm_emissao_noturna', label: 'Emissão noturna', gender: 'male', syndromes: ['DEFYNR', 'DEFQIR'] },
      { id: 'genm_esterilidade', label: 'Esterilidade', gender: 'male', syndromes: ['DEFJGR', 'DEFYGR', 'DEFYNR'] },
      { id: 'genm_impotencia', label: 'Impotência', gender: 'male', syndromes: ['DEFYGR', 'DEFQIR', 'DEFJGR'] },
      { id: 'genm_libido_diminuida', label: 'Libido diminuída', gender: 'male', syndromes: ['DEFYGR', 'DEFQIR'] },
      { id: 'genm_libido_excesso', label: 'Libido em excesso', gender: 'male', syndromes: ['DEFYNR', 'FGC'] },
    ]
  },
  {
    id: 'genitais_feminino', title: 'Genitais — Feminino', icon: '', gender: 'female',
    symptoms: [
      { id: 'genf_infertilidade', label: 'Infertilidade', gender: 'female', syndromes: ['DEFJGR', 'DEFYGR', 'DEFXUEF', 'ESTGXUEF'] },
      { id: 'genf_frigidez', label: 'Frigidez', gender: 'female', syndromes: ['DEFYGR', 'DEFYNR'] },
      { id: 'genf_prolapso_uterino', label: 'Prolapso uterino', gender: 'female', syndromes: ['COLAPSQIBP', 'DEFYGBP'] },
      { id: 'genf_libido_diminuida', label: 'Libido diminuída', gender: 'female', syndromes: ['DEFYGR', 'DEFXUEF'] },
      { id: 'genf_libido_excesso', label: 'Libido em excesso', gender: 'female', syndromes: ['DEFYNR', 'FGC'] },
      { id: 'genf_corrimento_amarelo', label: 'Corrimento amarelo', gender: 'female', syndromes: ['UMDCALORF', 'UMDCALORB'] },
      { id: 'genf_corrimento_branco', label: 'Corrimento branco', gender: 'female', syndromes: ['UMDFRIOBP', 'DEFYGBP'] },
      { id: 'genf_corrimento_escuro_frio', label: 'Corrimento escuro e frio', gender: 'female', syndromes: ['DEFYGR', 'ESTGXUEF'] },
    ]
  },
  {
    id: 'menstruacao', title: 'Menstruação', icon: '', gender: 'female',
    symptoms: [
      { id: 'mens_mamas_doloridas', label: 'Mamas doloridas (TPM)', gender: 'female', syndromes: ['ESTGQIF'] },
      { id: 'mens_tpm', label: 'TPM em geral', gender: 'female', syndromes: ['ESTGQIF', 'DEFXUEF', 'DEFXUEC'] },
      { id: 'mens_ciclo_curto', label: 'Ciclo curto (< 28d)', gender: 'female', syndromes: ['FGC', 'BPCONTRXUE', 'DEFXUEC'] },
      { id: 'mens_ciclo_irregular', label: 'Ciclo irregular', gender: 'female', syndromes: ['ESTGQIF', 'DEFXUEF'] },
      { id: 'mens_ciclo_longo', label: 'Ciclo longo (> 28d)', gender: 'female', syndromes: ['DEFXUEF', 'DEFYGR', 'DEFYGBP'] },
      { id: 'mens_quantidade_abundante', label: 'Quantidade abundante', gender: 'female', syndromes: ['FGC', 'BPCONTRXUE', 'DEFXUEC'] },
      { id: 'mens_quantidade_escassa', label: 'Quantidade escassa', gender: 'female', syndromes: ['DEFXUEF', 'DEFYNR', 'ESTGXUEF'] },
      { id: 'mens_quantidade_ausente', label: 'Amenorreia', gender: 'female', syndromes: ['DEFXUEF', 'ESTGXUEF', 'DEFJGR'] },
      { id: 'mens_cor_arroxeado', label: 'Cor arroxeada', gender: 'female', syndromes: ['ESTGXUEF', 'ESTGQIF'] },
      { id: 'mens_cor_escura_coagulo', label: 'Escura com coágulo', gender: 'female', syndromes: ['ESTGXUEF', 'FGC'] },
      { id: 'mens_cor_vermelha_forte', label: 'Vermelho forte', gender: 'female', syndromes: ['FGC', 'DEFXUEC'] },
      { id: 'mens_cor_vermelha_palida', label: 'Vermelho pálido', gender: 'female', syndromes: ['DEFXUEF', 'DEFYGBP'] },
      { id: 'mens_colica_durante', label: 'Cólica durante o fluxo', gender: 'female', syndromes: ['ESTGXUEF', 'FGC'] },
      { id: 'mens_colica_pre', label: 'Cólica pré-menstrual', gender: 'female', syndromes: ['ESTGQIF', 'ESTGXUEF'] },
      { id: 'mens_colica_pos', label: 'Cólica pós-menstrual', gender: 'female', syndromes: ['DEFXUEF', 'DEFYGR'] },
      { id: 'mens_colica_forte_pontada', label: 'Cólica forte em pontada', gender: 'female', syndromes: ['ESTGXUEF'] },
      { id: 'mens_colica_forte_peso', label: 'Cólica forte em peso', gender: 'female', syndromes: ['ESTGXUEF', 'UMDFRIOBP'] },
      { id: 'mens_colica_alivia_calor', label: 'Cólica alivia com calor', gender: 'female', syndromes: ['DEFYGR', 'DEFYGBP', 'UMDFRIOBP'] },
      { id: 'mens_colica_alivia_frio', label: 'Cólica alivia com frio', gender: 'female', syndromes: ['FGC', 'UMDCALORF'] },
    ]
  },
  {
    id: 'lingua', title: 'Língua', icon: '', gender: 'all',
    symptoms: [
      { id: 'lingua_cor_palida', label: 'Cor pálida', gender: 'all', syndromes: ['DEFXUEF', 'DEFXUEC', 'DEFQIBP', 'DEFYGBP', 'DEFYGR'] },
      { id: 'lingua_cor_vermelha_escura', label: 'Cor vermelho escura', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC', 'FGC', 'FGF'] },
      { id: 'lingua_cor_arroxeada', label: 'Cor arroxeada', gender: 'all', syndromes: ['ESTGXUEF', 'ESTGXUEC', 'DEFYGC'] },
      { id: 'lingua_cor_vermelha_ponta', label: 'Cor vermelha na ponta', gender: 'all', syndromes: ['FGC', 'DEFYNC'] },
      { id: 'lingua_pontos_vermelhos', label: 'Pontos vermelhos', gender: 'all', syndromes: ['FGC', 'FGF', 'ESTGXUEC'] },
      { id: 'lingua_lateral_roxa', label: 'Lateral roxa', gender: 'all', syndromes: ['ESTGXUEF', 'ESTGQIF'] },
      { id: 'lingua_saburra_fina', label: 'Saburra fina', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC'] },
      { id: 'lingua_saburra_grossa', label: 'Saburra grossa', gender: 'all', syndromes: ['ALIME', 'UMDCALORIG', 'CALORE'] },
      { id: 'lingua_saburra_ausente', label: 'Saburra ausente', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC', 'DEFYNE'] },
      { id: 'lingua_saburra_branca', label: 'Saburra branca', gender: 'all', syndromes: ['VTFRIOP', 'UMDFRIOBP', 'UMDFRIOB'] },
      { id: 'lingua_saburra_amarela', label: 'Saburra amarela', gender: 'all', syndromes: ['VTCALORP', 'CALORE', 'UMDCALORIG', 'FGC', 'FGF'] },
      { id: 'lingua_saburra_umida', label: 'Saburra úmida', gender: 'all', syndromes: ['UMDFRIOBP', 'DEFYGBP'] },
      { id: 'lingua_saburra_seca', label: 'Saburra seca', gender: 'all', syndromes: ['DEFYNR', 'CALORE', 'FGF'] },
      { id: 'lingua_edemaciada', label: 'Edemaciada', gender: 'all', syndromes: ['DEFYGBP', 'UMDFRIOBP', 'DEFYGR'] },
      { id: 'lingua_marcas_dentes', label: 'Marcas de dentes', gender: 'all', syndromes: ['DEFQIBP', 'DEFYGBP'] },
      { id: 'lingua_fissuras_verticais', label: 'Fissuras verticais', gender: 'all', syndromes: ['DEFYNR', 'DEFYNC'] },
      { id: 'lingua_fissuras_horizontais', label: 'Fissuras horizontais', gender: 'all', syndromes: ['DEFQIBP'] },
      { id: 'lingua_tremula', label: 'Trêmula', gender: 'all', syndromes: ['VTF'] },
      { id: 'lingua_desviada', label: 'Desviada', gender: 'all', syndromes: ['VTF'] },
    ]
  },
  {
    id: 'pulso', title: 'Pulso', icon: '', gender: 'all',
    symptoms: [
      { id: 'pulso_profundo', label: 'Profundo', gender: 'all', syndromes: ['DEFQIR', 'DEFYGR', 'DEFYGBP', 'DEFXUEF'] },
      { id: 'pulso_superficial', label: 'Superficial', gender: 'all', syndromes: ['VTFRIOP', 'VTCALORP'] },
      { id: 'pulso_lento', label: 'Lento', gender: 'all', syndromes: ['DEFYGR', 'DEFYGBP', 'DEFYGC', 'FRIOE'] },
      { id: 'pulso_rapido', label: 'Rápido', gender: 'all', syndromes: ['FGC', 'FGF', 'DEFYNR', 'DEFYNC', 'CALORE'] },
      { id: 'pulso_forte', label: 'Forte', gender: 'all', syndromes: ['FGC', 'FGF', 'CALORE', 'ASCYGF'] },
      { id: 'pulso_fraco', label: 'Fraco', gender: 'all', syndromes: ['DEFQIC', 'DEFQIBP', 'DEFQIP', 'DEFQIR', 'DEFXUEF', 'DEFXUEC'] },
      { id: 'pulso_fino', label: 'Fino', gender: 'all', syndromes: ['DEFXUEF', 'DEFXUEC', 'DEFYNR', 'DEFYNC'] },
      { id: 'pulso_escorregadio', label: 'Escorregadio', gender: 'all', syndromes: ['UMDFRIOBP', 'UMDCALORBP', 'FLMC', 'ALIME'] },
      { id: 'pulso_em_corda', label: 'Em corda', gender: 'all', syndromes: ['ESTGQIF', 'ASCYGF', 'FGF', 'VTF'] },
    ]
  },
];
