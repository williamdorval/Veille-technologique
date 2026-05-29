// normes.ts — Constantes pour le calcul de toiture
//
// Sources :
// - CCQ 9.26.1-3 : pente minimale selon revêtement
// - CNB 2020, Annexe C, Tableau C-2 : charges de neige
// - CCQ 9.19.1.1-3 : ventilation
//
// RÈGLE ABSOLUE : Jamais hardcoder ces valeurs dans les composants.

import { RegionQuebec, TypeRevetement } from './types';

// ── PENTES MINIMALES ─────────────────────────────────────────────────────────
// CCQ 9.26.1 (bardeau), 9.26.2 (tôle), 9.26.3 (membrane)
export const PENTES_MIN_DEGRES: Record<TypeRevetement, number> = {
  bardeau_asphalte: 18.4,   // ~1:3 = 4/12 = 18,4°
  tole_acier: 9.5,          // ~1:6 = 2/12 = 9,5°
  membrane: 1.1,            // ~1:50 = toit plat minimum
};

// ── CHARGES DE NEIGE AU SOL Ss (kPa) ─────────────────────────────────────────
// CNB 2020, Annexe C, Tableau C-2 — valeurs indicatives par région
// Note: utiliser les valeurs exactes du tableau C-2 pour la conception officielle
export const CHARGES_NEIGE: Record<RegionQuebec, number> = {
  montreal: 2.1,
  quebec_ville: 3.2,
  saguenay: 3.5,
  mauricie: 3.0,
  estrie: 3.2,
  outaouais: 2.4,
  abitibi: 3.0,
  cote_nord: 3.5,
  gaspesie: 4.0,
};

// ── VENTILATION ───────────────────────────────────────────────────────────────
// CCQ 9.19.1.1 : ratio minimum = 1/300
export const RATIO_VENTILATION = 1 / 300;   // surface vent. / surface plafond

// ── BARDEAUX ──────────────────────────────────────────────────────────────────
// Bardeau asphalte standard : ~3,07 m² par paquet (1 bundle = 1/3 paquet)
// Pratique standard : paquet de 3 bundles couvre ~33 pi² = 3,07 m²
export const SURFACE_PAR_PAQUET_M2 = 3.07;
export const SURPLUS_BARDEAU = 1.15;  // +15% pour coupes et chevauchementsps

// ── CHEVRONS ──────────────────────────────────────────────────────────────────
// Espacement standard (CCQ 9.23.8)
export const ESPACEMENT_CHEVRONS_CM = 40;    // cm (16 po)

// ── LABELS ────────────────────────────────────────────────────────────────────
export const LABELS_TYPE_TOIT = {
  deux_versants: 'Deux versants (pignon)',
  croupe: 'Croupe (4 versants)',
  appentis: 'Appentis (un versant)',
};

export const LABELS_REVETEMENT = {
  bardeau_asphalte: 'Bardeau d\'asphalte',
  tole_acier: 'Tôle d\'acier nervurée',
  membrane: 'Membrane élastomère',
};

export const LABELS_REGION: Record<RegionQuebec, string> = {
  montreal: 'Montréal',
  quebec_ville: 'Québec (ville)',
  saguenay: 'Saguenay / Chicoutimi',
  mauricie: 'Mauricie / Trois-Rivières',
  estrie: 'Estrie / Sherbrooke',
  outaouais: 'Outaouais / Gatineau',
  abitibi: 'Abitibi / Rouyn-Noranda',
  cote_nord: 'Côte-Nord / Sept-Îles',
  gaspesie: 'Gaspésie / Gaspé',
};
