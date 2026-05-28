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
  // ── HAUTEUR DE CHUTE SEUIL ──────────────────────────────────────────
  // CCQ 9.8.8.1 — en dessous, pas de garde-corps requis
  HAUTEUR_CHUTE_SEUIL_MM: 600,

  // ── HAUTEUR MINIMALE DU GARDE-CORPS ─────────────────────────────────
  // CCQ 9.8.8.1 — chute > 600 mm et < 1 800 mm (résidentiel privé)
  HAUTEUR_MIN_FAIBLE_MM: 900,
  // CCQ 9.8.8.1 — chute >= 1 800 mm (résidentiel privé)
  HAUTEUR_MIN_ELEVEE_MM: 1070,
  // CCQ 9.8.8.1 — usage commun ou commercial
  HAUTEUR_MIN_COMMUN_MM: 1070,

  // ── ESPACEMENT BARREAUX ──────────────────────────────────────────────
  // CCQ 9.8.8.3 — règle sphère 100 mm
  ESPACEMENT_MAX_BARREAUX_MM: 100,
  // CCQ 9.8.8.3 — hauteur max entre sol et premier barreau
  HAUTEUR_MAX_BASE_MM: 100,

  // ── POTEAUX ──────────────────────────────────────────────────────────
  // Pratique standard industrie canadienne — source officielle non trouvée
  ESPACEMENT_MAX_POTEAUX_MM: 1200,

  // ── MAIN COURANTE ────────────────────────────────────────────────────
  // CCQ 9.8.7.4 — hauteur mesurée verticalement depuis le nez de marche
  HAUTEUR_MAIN_COURANTE_MIN_MM: 800,
  HAUTEUR_MAIN_COURANTE_MAX_MM: 965,
  // Dépassement standard de chaque côté de l'escalier
  DEPASSEMENT_MAIN_COURANTE_MM: 300,
} as const;

// ── SEUIL POUR LA ZONE ORANGE (avertissement) ──────────────────────────
export const SEUILS_AVERTISSEMENT_RAMPE = {
  GARDE_CORPS_ZONE_ORANGE_MM: 30,   // mm de marge avant la limite — orange
  MAIN_COURANTE_ZONE_ORANGE_MM: 20, // mm de marge avant les limites — orange
} as const;

// ── LABELS D'AFFICHAGE ────────────────────────────────────────────────
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

// ── COULEURS 3D SELON MATÉRIAU ────────────────────────────────────────
export const COULEURS_3D = {
  bois:   { color: '#8B6F47', roughness: 0.7, metalness: 0.0 },
  metal:  { color: '#6B7280', roughness: 0.2, metalness: 0.8 },
  verre:  { color: '#A8D8EA', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.6 },
  cable:  { color: '#9CA3AF', roughness: 0.15, metalness: 0.9 },
} as const;
