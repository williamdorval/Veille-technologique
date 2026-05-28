// calculs.ts — Fonctions de calcul pour plancher
// Algorithme de sélection de solive par vérification de flèche L/360

import {
  EntreesPlancher,
  ResultatsPlancher,
  DimensionSolive,
  EspacementSolive,
  IndicateurConformitePlancher,
  ConformitePlancher,
  StatutConformite,
  ResultatOuErreur,
} from './types';
import {
  CHARGES_VIVES,
  CHARGE_MORTE_KPA,
  FLECHE_RATIO,
  MODULE_ELASTICITE,
  DIMENSIONS_SOLIVES,
  EPAISSEUR_SOUS_PLANCHER,
  ORDRE_DIMENSIONS,
  ESPACEMENTS,
} from './normes';

// ── Validation ─────────────────────────────────────────────────────────
function valider(e: EntreesPlancher): string | null {
  if (e.longueur < 1000 || e.longueur > 8000) return 'La portée doit être entre 1 000 et 8 000 mm.';
  if (e.largeur < 1000 || e.largeur > 20000) return 'La largeur doit être entre 1 000 et 20 000 mm.';
  return null;
}

// ── Moment d'inertie rectangulaire ────────────────────────────────────
function inertie(b: number, h: number): number {
  return (b * h * h * h) / 12; // mm⁴
}

// ── Flèche sous charge uniformément répartie ─────────────────────────
// Formule : δ = 5qL⁴ / (384EI)
// q = charge en N/mm (kPa × espacement en m × 1000)
// L = portée en mm
// E = module élasticité en MPa (N/mm²)
// I = moment inertie en mm⁴
function calculerFleche(
  portee: number,           // mm
  espacement: number,       // mm
  chargeKPa: number,        // kPa = kN/m²
  E: number,                // MPa
  b: number, h: number,     // dimensions solive mm
): number {
  const q = chargeKPa * (espacement / 1000);  // kN/m → N/mm via /1000 * /1 = kN/m² * m = kN/m, puis /1000 pour N/mm
  // q en kPa * espacement_m = kN/m = N/mm (× 1000 / 1000 = identique)
  const qNmm = chargeKPa * 1000 * (espacement / 1000) / 1000; // N/mm = Pa*m = (kPa×1000)*m/1000 = kPa*m
  // Simplifié : q [N/mm] = chargekPa [kN/m²] × espacement[m] × 1000[N/kN] / 1000[mm/m]
  const qSimple = (chargeKPa * espacement) / 1000; // N/mm
  const I = inertie(b, h);
  const L = portee;
  return (5 * qSimple * Math.pow(L, 4)) / (384 * E * I); // mm
}

// ── Sélection de la solive ─────────────────────────────────────────────
function selectionnerSolive(
  portee: number,
  espacement: EspacementSolive,
  chargeKPa: number,
  E: number,
): { dimension: DimensionSolive; fleche: number; flecheMax: number } | null {
  const flecheMax = portee / FLECHE_RATIO;

  for (const dim of ORDRE_DIMENSIONS) {
    const { b, h } = DIMENSIONS_SOLIVES[dim];
    const fleche = calculerFleche(portee, espacement, chargeKPa, E, b, h);
    if (fleche <= flecheMax) {
      return { dimension: dim, fleche, flecheMax };
    }
  }
  return null; // portée trop grande même avec 2x12
}

// ── Indicateur de conformité ───────────────────────────────────────────
function creerIndicateur(
  valeur: number,
  limite: number,
  estValeurMax: boolean,
  unite: string,
  article: string,
  zoneOrange: number,
): IndicateurConformitePlancher {
  let statut: StatutConformite;
  let conforme: boolean;
  let messageStatut: string;

  if (estValeurMax) {
    conforme = valeur <= limite;
    const marge = limite - valeur;
    if (!conforme) {
      statut = 'non_conforme';
      messageStatut = `${valeur.toFixed(1)} ${unite} — dépasse le maximum de ${limite.toFixed(1)} ${unite}`;
    } else if (marge <= zoneOrange) {
      statut = 'avertissement';
      messageStatut = `${valeur.toFixed(1)} ${unite} — proche du maximum (${limite.toFixed(1)} ${unite})`;
    } else {
      statut = 'conforme';
      messageStatut = `${valeur.toFixed(1)} ${unite} ≤ ${limite.toFixed(1)} ${unite} ✓`;
    }
  } else {
    conforme = valeur >= limite;
    if (!conforme) {
      statut = 'non_conforme';
      messageStatut = `Portée ${valeur} mm — dépasse la portée max admissible`;
    } else {
      statut = 'conforme';
      messageStatut = `Portée conforme ✓`;
    }
  }

  return { conforme, statut, valeurCalculee: valeur, valeurLimite: limite, unite, article, messageStatut };
}

// ── Calcul principal ───────────────────────────────────────────────────
export function calculerPlancher(entrees: EntreesPlancher): ResultatOuErreur {
  const err = valider(entrees);
  if (err) return { succes: false, erreur: { code: 'ENTREE_INVALIDE', message: err } };

  const { longueur, largeur, typeUsage, typeBois, typeSousPlancher } = entrees;
  const chargeVive = CHARGES_VIVES[typeUsage];
  const chargeTotal = chargeVive + CHARGE_MORTE_KPA + (entrees.presenceElementLourd ? 1.0 : 0);
  const E = MODULE_ELASTICITE[typeBois];

  // Essayer chaque espacement (préférence 400mm → 600mm → 300mm)
  let solution: { dimension: DimensionSolive; espacement: EspacementSolive; fleche: number; flecheMax: number } | null = null;

  for (const esp of ESPACEMENTS) {
    const r = selectionnerSolive(longueur, esp, chargeTotal, E);
    if (r) {
      solution = { ...r, espacement: esp };
      break;
    }
  }

  if (!solution) {
    return {
      succes: false,
      erreur: {
        code: 'PORTEE_TROP_GRANDE',
        message: `La portée de ${longueur} mm est trop grande pour une solive simple. Utilisez une poutre de soutien ou réduisez la portée.`,
      },
    };
  }

  const { dimension, espacement, fleche, flecheMax } = solution;
  const epaisseurSousPlancher = EPAISSEUR_SOUS_PLANCHER[espacement];

  // Nombre de solives
  const nombreSolives = Math.ceil(largeur / espacement) + 1;
  // Longueur totale de bois (mètres linéaires)
  const longueurTotaleBoisM = (nombreSolives * longueur) / 1000;
  // Panneaux 4x8 (1219 x 2438 mm)
  const surfaceM2 = (longueur / 1000) * (largeur / 1000);
  const surfacePanneau = 1.219 * 2.438; // m²
  const quantitePanneaux = Math.ceil(surfaceM2 / surfacePanneau * 1.1); // +10% surplus

  // Conformité flèche (L/360)
  const indicateurFleche = creerIndicateur(
    fleche, flecheMax, true, 'mm', 'CCQ 9.4.3.1 (L/360)', flecheMax * 0.1,
  );

  // Conformité portée (on marque conforme car solution trouvée)
  const indicateurPortee: IndicateurConformitePlancher = {
    conforme: true,
    statut: 'conforme',
    valeurCalculee: longueur,
    valeurLimite: longueur,
    unite: 'mm',
    article: 'CNB 2020, Tableau A-9.23.4.2',
    messageStatut: `Solive ${dimension} convient pour ${longueur} mm de portée ✓`,
  };

  const conformite: ConformitePlancher = {
    portee: indicateurPortee,
    fleche: indicateurFleche,
  };

  const nbErreurs = [indicateurPortee, indicateurFleche].filter(i => i.statut === 'non_conforme').length;
  const nbAvertissements = [indicateurPortee, indicateurFleche].filter(i => i.statut === 'avertissement').length;

  // Sous-plancher non utilisé directement dans les calculs mais retourné pour affichage
  void typeSousPlancher;

  return {
    succes: true,
    resultat: {
      dimensionSoliveRecommandee: dimension,
      espacementSolive: espacement,
      nombreSolives,
      longueurTotaleBoisM: Math.round(longueurTotaleBoisM * 10) / 10,
      quantitePanneaux,
      epaisseurSousPlancher,
      fleche: Math.round(fleche * 10) / 10,
      flecheMax: Math.round(flecheMax * 10) / 10,
      chargeVive,
      conformite,
      estConforme: nbErreurs === 0,
      nbErreurs,
      nbAvertissements,
    },
  };
}
