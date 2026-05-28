import math

def get_f_s(n_s):
    # False positive rate based on specificity
    return 0.05 + 0.40 * (1 - 1.0/n_s)

def compute_bayesian_score(checked_symptoms, all_symptoms, matches_chief_complaint=False):
    # Prior probability
    prior = 0.30 if matches_chief_complaint else 0.10
    log_odds_prior = math.log(prior / (1.0 - prior))
    
    # Soft penalty parameter
    lam = 0.3
    
    log_odds = log_odds_prior
    
    has_clinical = False
    has_tongue = False
    has_pulse = False
    
    for sym in all_symptoms:
        is_checked = sym['id'] in checked_symptoms
        is_tongue = sym['category'] == 'lingua'
        is_pulse = sym['category'] == 'pulso'
        is_clinical = not is_tongue and not is_pulse
        
        # Sensitivity
        p_s = 0.85 if (is_tongue or is_pulse) else 0.70
        # False Positive Rate
        f_s = get_f_s(sym['n_s'])
        
        if is_checked:
            # Positive evidence weight
            w_plus = math.log(p_s / f_s)
            log_odds += w_plus
            
            # Synergy tracking
            if is_tongue: has_tongue = True
            if is_pulse: has_pulse = True
            if is_clinical: has_clinical = True
        else:
            # Negative evidence weight (soft penalty)
            w_minus = lam * math.log((1.0 - p_s) / (1.0 - f_s))
            log_odds += w_minus
            
    # Synergy multiplier (applied as addition to log-odds)
    eta = 1.0
    if has_clinical and has_tongue and has_pulse:
        eta = 2.0
    elif has_clinical and (has_tongue or has_pulse):
        eta = 1.4
    elif has_tongue and has_pulse:
        eta = 1.2
        
    log_odds += math.log(eta)
    
    # Convert log-odds back to probability
    posterior = 1.0 / (1.0 + math.exp(-log_odds))
    return posterior * 100.0

# Mock symptoms for Kidney Yin Deficiency (DEFYNR)
defynr_symptoms = [
    {'id': 'face_macas_vermelhas', 'category': 'face', 'n_s': 2},
    {'id': 'emocional_agitacao', 'category': 'emocional', 'n_s': 8},
    {'id': 'temp_ondas_calor', 'category': 'temperatura', 'n_s': 1}, # Highly specific
    {'id': 'temp_calor_cinco_palmos', 'category': 'temperatura', 'n_s': 2},
    {'id': 'lombar_fraca', 'category': 'lombar', 'n_s': 2},
    {'id': 'lingua_cor_vermelha_escura', 'category': 'lingua', 'n_s': 4},
    {'id': 'lingua_saburra_ausente', 'category': 'lingua', 'n_s': 3},
    {'id': 'pulso_rapido', 'category': 'pulso', 'n_s': 5},
    {'id': 'pulso_fino', 'category': 'pulso', 'n_s': 4},
]

print("--- CASOS DE TESTE PARA DEFYNR ---")

# Caso 1: Sem sintomas
print(f"Sem sintomas: {compute_bayesian_score([], defynr_symptoms):.2f}%")

# Caso 2: 1 sintoma genérico (Agitação, n_s=8)
print(f"1 sintoma genérico (Agitação): {compute_bayesian_score(['emocional_agitacao'], defynr_symptoms):.2f}%")

# Caso 3: 1 sintoma específico (Ondas de calor, n_s=1)
print(f"1 sintoma específico (Ondas de calor): {compute_bayesian_score(['temp_ondas_calor'], defynr_symptoms):.2f}%")

# Caso 4: 2 sintomas clínicos específicos (Ondas de calor + Calor cinco palmos)
print(f"2 sintomas clínicos específicos: {compute_bayesian_score(['temp_ondas_calor', 'temp_calor_cinco_palmos'], defynr_symptoms):.2f}%")

# Caso 5: Tríade completa (Ondas de calor + Língua vermelha escura + Pulso rápido)
print(f"Tríade Completa (Clínica + Língua + Pulso): {compute_bayesian_score(['temp_ondas_calor', 'lingua_cor_vermelha_escura', 'pulso_rapido'], defynr_symptoms):.2f}%")

# Caso 6: Tríade completa + Chief Complaint Match
print(f"Tríade Completa + Chief Complaint: {compute_bayesian_score(['temp_ondas_calor', 'lingua_cor_vermelha_escura', 'pulso_rapido'], defynr_symptoms, True):.2f}%")

# Caso 7: Quadro clássico (5 sintomas: 3 clínicos, 1 língua, 1 pulso)
print(f"Quadro clássico (5 sintomas): {compute_bayesian_score(['temp_ondas_calor', 'temp_calor_cinco_palmos', 'lombar_fraca', 'lingua_saburra_ausente', 'pulso_fino'], defynr_symptoms):.2f}%")
