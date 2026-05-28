// normes.ts — Constantes pour le calcul de plancher
//
// Sources :
// - CNB 2020, Tableau A-9.23.4.2 (portées des solives)
// - CNB 2020, Table 4.1.5.3 (charges vives)
// - CCQ 9.23.4.2 (exigences solives)
// - CCQ 9.4.3.1 (flèche admissible)
//
// RÈGLE ABSOLUE : Jamais hardcoder ces valeurs dans les composants.

import { DimensionSolive, EspacementSolive, TypeBois, TypeUsagePlancher } from './types';

// ── CHARGES VIVES (kPa) ───────────────────────────────────────────────
// CNB 2020, Table 4.1.5.3
export const CHARGES_VIVES: Record<TypeUsagePlancher, number> = {
  chambre: 1.9,
  salon: 1.9,
  salleBain: 1.9,
  garage: 2.4,
  commercial: 2.4,
};

// ── CHARGE MORTE TYPE (kPa) ───────────────────────────────────────────
// Pratique standard : plancher fini + isolant + plafond suspendu
export const CHARGE_MORTE_KPA = 0.5;

// ── FLÈCHE ADMISSIBLE ─────────────────────────────────────────────────
// CCQ 9.4.3.1 : L/360 pour plancher résidentiel sous charge vive
export const FLECHE_RATIO = 360;

// ── MODULE D'ÉLASTICITÉ (MPa) — valeurs indicatives ──────────────────
// Pratique standard industrie canadienne; source officielle requiert CNB
export const MODULE_ELASTICITE: Record<TypeBois, number> = {
  SPF: 9500,     // MPa — épinette-pin-sapin catégorie n°2
  douglas: 12000, // MPa — sapin de Douglas
  LVL: 13800,    // MPa — bois lamellé-veneer
};

// ── MODULE DE RÉSISTANCE EN FLEXION (MPa) ────────────────────────────
// Valeur indicative pour dimensionnement préliminaire
export const RESISTANCE_FLEXION: Record<TypeBois, number> = {
  SPF: 9.0,      // MPa
  douglas: 12.0,
  LVL: 20.0,
};

// ── DIMENSIONS DES SOLIVES ─────────────────────────────────────────────
// Largeur × Hauteur en mm — dimensions nominales courantes (bois d'oeuvre)
export const DIMENSIONS_SOLIVES: Record<DimensionSolive, { b: number; h: number }> = {
  '2x6':  { b: 38, h: 140 },
  '2x8':  { b: 38, h: 184 },
  '2x10': { b: 38, h: 235 },
  '2x12': { b: 38, h: 286 },
};

// ── ÉPAISSEUR SOUS-PLANCHER (mm) ──────────────────────────────────────
// CCQ 9.23.15.3 — minimum selon espacement solives
export const EPAISSEUR_SOUS_PLANCHER: Record<EspacementSolive, number> = {
  300: 15.9,   // 5/8 po
  400: 15.9,   // 5/8 po
  600: 19.0,   // 3/4 po
};

// ── ORDRE DE PRÉFÉRENCE DES DIMENSIONS ───────────────────────────────
export const ORDRE_DIMENSIONS: DimensionSolive[] = ['2x6', '2x8', '2x10', '2x12'];

// ── ESPACEMENTS DISPONIBLES ───────────────────────────────────────────
export const ESPACEMENTS: EspacementSolive[] = [400, 600, 300];

// ── LABELS ─────────────────────────────────────────────────────────────
export const LABELS_TYPE_USAGE: Record<TypeUsagePlancher, string> = {
  chambre: 'Chambre / Bureau',
  salon: 'Salon / Salle à manger',
  salleBain: 'Salle de bain',
  garage: 'Garage',
  commercial: 'Commercial',
};

export const LABELS_TYPE_BOIS: Record<TypeBois, string> = {
  SPF: 'SPF n°2 (épinette-pin-sapin)',
  douglas: 'Sapin de Douglas',
  LVL: 'LVL (lamellé-veneer)',
};

export const LABELS_SOUS_PLANCHER = {
  OSB: 'OSB',
  contreplaque: 'Contreplaqué',
};
