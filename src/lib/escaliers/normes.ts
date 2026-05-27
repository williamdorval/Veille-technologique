// normes.ts — Constantes du Code de construction du Québec (CCQ)
// Chapitre I — Bâtiment, Partie 9
//
// RÈGLE ABSOLUE : Jamais hardcoder ces valeurs dans les composants.
// Toujours importer depuis ce fichier.
//
// Sources :
// - rbq.gouv.qc.ca (Régie du bâtiment du Québec)
// - qccodes.ca/escaliers-et-rampes/
// - plans-architecture.ca/calcul-escalier-cnb-2020-quebec/
// - escalierinterieur.ca/normes-escalier-quebec-guide-complet/

export const NORMES_CCQ = {
  // ─── CONTREMARCHE ────────────────────────────────────────────────────────
  // Article 9.8.4.1 du CCQ — hauteur de contremarche (résidentiel privé)
  CONTREMARCHE_MIN_MM: 125,
  CONTREMARCHE_MAX_PRIVE_MM: 200,
  // Article 9.8.4.1 du CCQ — hauteur de contremarche (commun / Partie 3)
  CONTREMARCHE_MAX_COMMUN_MM: 180,
  // Valeur idéale de confort reconnue dans la pratique professionnelle
  CONTREMARCHE_IDEAL_MM: 180,

  // ─── GIRON ────────────────────────────────────────────────────────────────
  // Article 9.8.4.2 du CCQ — profondeur de marche (résidentiel privé)
  GIRON_MIN_PRIVE_MM: 210,
  // Article 9.8.4.2 du CCQ — profondeur de marche (commun / Partie 3)
  GIRON_MIN_COMMUN_MM: 280,
  // Article 9.8.4.2 du CCQ — maximum
  GIRON_MAX_MM: 355,

  // ─── LARGEUR ──────────────────────────────────────────────────────────────
  // Article 9.8.2.1 du CCQ — largeur minimale (résidentiel privé)
  LARGEUR_MIN_PRIVE_MM: 860,
  // Article 9.8.2.1 du CCQ — largeur minimale (commun / issues)
  LARGEUR_MIN_COMMUN_MM: 900,

  // ─── DÉGAGEMENT DE TÊTE ──────────────────────────────────────────────────
  // Article 9.8.3.1 du CCQ — échappée (résidentiel privé)
  DEGAGEMENT_TETE_MIN_PRIVE_MM: 1950,
  // Article 9.8.3.1 du CCQ — échappée (commun / Partie 3)
  DEGAGEMENT_TETE_MIN_COMMUN_MM: 2050,

  // ─── FORMULE DE BLONDEL ───────────────────────────────────────────────────
  // 2H + G = 600 à 640 mm (outil de confort, pratique professionnelle reconnue)
  // Cible idéale : 630 mm
  BLONDEL_MIN_MM: 600,
  BLONDEL_MAX_MM: 640,
  BLONDEL_CIBLE_MM: 630,

  // ─── TOLÉRANCES D'UNIFORMITÉ ─────────────────────────────────────────────
  // Article 9.8.4.4 du CCQ
  TOLERANCE_CONSECUTIVE_MM: 5,   // écart max entre marches consécutives
  TOLERANCE_VOLEE_MM: 10,        // écart max sur toute la volée

  // ─── MAIN COURANTE ────────────────────────────────────────────────────────
  // Article 9.8.7.4 du CCQ
  MAIN_COURANTE_HAUTEUR_MIN_MM: 800,
  MAIN_COURANTE_HAUTEUR_MAX_MM: 965,
  MAIN_COURANTE_HAUTEUR_MAX_AVEC_GARDE_CORPS_MM: 1070,
  MAIN_COURANTE_DISTANCE_MUR_MIN_MM: 50,
  MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES: 3,
  MAIN_COURANTE_DOUBLE_LARGEUR_MM: 1100, // deux côtés si largeur ≥ 1100mm

  // ─── GARDE-CORPS ─────────────────────────────────────────────────────────
  // Article 9.8.8 du CCQ
  GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM: 900,
  GARDE_CORPS_HAUTEUR_MIN_ELEVE_MM: 1070,  // si hauteur de chute > 1800mm
  GARDE_CORPS_HAUTEUR_MIN_COMMUN_MM: 1070,
  GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM: 600, // obligatoire si chute > 600mm
  GARDE_CORPS_BALUSTRE_MAX_MM: 100,        // espacement max entre barreaux

  // ─── HAUTEUR DE VOLÉE MAXIMALE ───────────────────────────────────────────
  // Au-delà, un palier intermédiaire est requis (hors portée de ce calculateur)
  HAUTEUR_MAX_VOLEE_MM: 3700,

  // ─── NOSING (NEZ DE MARCHE) ──────────────────────────────────────────────
  // Valeur standard pratique (non réglementée explicitement par un article dédié)
  NOSING_STANDARD_MM: 25,
} as const;

// ─── SEUILS D'AVERTISSEMENT (orange) ────────────────────────────────────────
// Ces valeurs définissent la zone "proche des limites" → pastille orange
export const SEUILS_AVERTISSEMENT = {
  CONTREMARCHE_ZONE_ORANGE_BAS: 10,   // mm en dessous du min → orange
  CONTREMARCHE_ZONE_ORANGE_HAUT: 10,  // mm en dessous du max → orange
  GIRON_ZONE_ORANGE_BAS: 15,          // mm au-dessus du min → orange
  BLONDEL_ZONE_ORANGE: 10,            // mm autour des limites → orange
  DEGAGEMENT_ZONE_ORANGE_MM: 50,      // mm au-dessus du min → orange
  LARGEUR_ZONE_ORANGE_MM: 20,         // mm au-dessus du min → orange
} as const;

// ─── LABELS D'AFFICHAGE ──────────────────────────────────────────────────────
export const LABELS_TYPE_USAGE = {
  residentiel_prive: 'Résidentiel privé',
  residentiel_commun: 'Résidentiel commun',
  commercial: 'Commercial',
} as const;

export const LABELS_MATERIAU_LIMON = {
  epinette: 'Épinette',
  bois_franc: 'Bois franc',
  acier: 'Acier',
  composite: 'Composite',
} as const;

export const LABELS_TYPE_MARCHE = {
  bois_traite: 'Bois traité',
  epinette: 'Épinette',
  bois_franc: 'Bois franc',
  contrepalque: 'Contreplaqué',
  composite: 'Composite',
} as const;

// ─── COULEURS MATÉRIAUX (pour la visualisation 3D) ───────────────────────────
export const COULEURS_MATERIAUX = {
  limon: {
    epinette: '#E5D4B1',
    bois_franc: '#6B4423',
    acier: '#6B7280',
    composite: '#4A5568',
  },
  marche: {
    bois_traite: '#8B6F47',
    epinette: '#E5D4B1',
    bois_franc: '#6B4423',
    contrepalque: '#C8A878',
    composite: '#4A5568',
  },
} as const;

// ─── PRIX INDICATIFS 2025 (CAD) ──────────────────────────────────────────────
// IMPORTANT : Ces valeurs sont indicatives. Elles varient selon les fournisseurs.
// Ne jamais présenter ces valeurs comme définitives.
export const PRIX_INDICATIFS_CAD = {
  limon: {
    epinette: 3.50,    // $/m linéaire (38×235mm)
    bois_franc: 8.00,  // $/m linéaire
    acier: 12.00,      // $/m linéaire (profil C)
    composite: 15.00,  // $/m linéaire
  },
  marche: {
    bois_traite: 4.50,   // $/m linéaire (38×width)
    epinette: 3.00,      // $/m linéaire
    bois_franc: 7.50,    // $/m linéaire
    contrepalque: 45.00, // $/feuille 4×8 pi (converti en $/m²)
    composite: 15.00,    // $/m linéaire
  },
  quincaillerie: {
    vis_boite: 25.00,          // $/boite de 100 vis
    support_ancrage: 8.00,     // $/unité
    espaceur: 3.00,            // $/unité
  },
} as const;
