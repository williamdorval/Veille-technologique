// normes.ts — Constantes du Code de construction du Québec (CCQ) pour rampes
//
// RÈGLE ABSOLUE : Jamais hardcoder ces valeurs dans les composants.
// Toujours importer depuis ce fichier.
//
// Sources :
// - CCQ 9.8.7.4 : main courante
// - CCQ 9.8.8.1 : hauteur garde-corps
// - CCQ 9.8.8.3 : espacement barreaux
// - qccodes.ca/escaliers-et-rampes/

export const NORMES_GARDE_CORPS = {
  // ── HAUTEUR DE CHUTE SEUIL ──────────────────────────────────────────────────
  // CCQ 9.8.8.1 – en dessous, pas de garde-corps requis
  HAUTEUR_CHUTE_SEUIL_CM: 60,

  // ── HAUTEUR MINIMALE DU GARDE-CORPS ─────────────────────────────────────────
  // CCQ 9.8.8.1 – chute > 60 cm et < 180 cm (résidentiel privé)
  HAUTEUR_MIN_FAIBLE_CM: 90,
  // CCQ 9.8.8.1 – chute >= 180 cm (résidentiel privé)
  HAUTEUR_MIN_ELEVEE_CM: 107,
  // CCQ 9.8.8.1 – usage commun ou commercial
  HAUTEUR_MIN_COMMUN_CM: 107,

  // ── ESPACEMENT BARREAUX ──────────────────────────────────────────────────────
  // CCQ 9.8.8.3 – règle sphère 100 mm (10 cm)
  ESPACEMENT_MAX_BARREAUX_CM: 10,
  // CCQ 9.8.8.3 – hauteur max entre sol et premier barreau
  HAUTEUR_MAX_BASE_CM: 10,

  // ── POTEAUX ──────────────────────────────────────────────────────────────────
  // Pratique standard industrie canadienne – source officielle non trouvée
  ESPACEMENT_MAX_POTEAUX_CM: 120,

  // ── MAIN COURANTE ────────────────────────────────────────────────────────────
  // CCQ 9.8.7.4 – hauteur mesurée verticalement depuis le nez de marche
  HAUTEUR_MAIN_COURANTE_MIN_CM: 80,
  HAUTEUR_MAIN_COURANTE_MAX_CM: 96.5,
  // Dépassement standard de chaque côté de l'escalier
  DEPASSEMENT_MAIN_COURANTE_CM: 30,
} as const;

// ── SEUIL POUR LA ZONE ORANGE (avertissement) ───────────────────────────────
export const SEUILS_AVERTISSEMENT_RAMPE = {
  GARDE_CORPS_ZONE_ORANGE_CM: 3,   // cm de marge avant la limite – orange
  MAIN_COURANTE_ZONE_ORANGE_CM: 2, // cm de marge avant les limites – orange
} as const;

// ── LABELS D'AFFICHAGE ───────────────────────────────────────────────────────
export const LABELS_TYPE_USAGE = {
  residentiel_prive: 'Résidentiel privé',
  residentiel_commun: 'Résidentiel commun',
  commercial: 'Commercial',
} as const;

export const LABELS_MATERIAU = {
  bois: 'Bois traité',
  metal: 'Acier galvanisé',
  verre: 'Verre trempé',
  cable: 'Câble inox',
} as const;

export const LABELS_TYPE_INSTALLATION = {
  escalier: 'Escalier',
  balcon: 'Balcon',
  terrasse: 'Terrasse / palier',
} as const;

// ── COULEURS 3D SELON MATÉRIAU ───────────────────────────────────────────────
export const COULEURS_3D = {
  bois:   { color: '#8B6F47', roughness: 0.7, metalness: 0.0 },
  metal:  { color: '#6B7280', roughness: 0.2, metalness: 0.8 },
  verre:  { color: '#A8D8EA', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.6 },
  cable:  { color: '#9CA3AF', roughness: 0.15, metalness: 0.9 },
} as const;
