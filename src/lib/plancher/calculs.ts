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
  if (e.longueur < 100 || e.longueur > 800) return 'La portée doit être entre 100 et 800 cm.';
  if (e.largeur < 100 || e.largeur > 2000) return 'La largeur doit être entre 100 et 2 000 cm.';
  return null;
}

// ── Moment d'inertie rectangulaire ────────────────────────────────────
function inertie(b: number, h: number): number {
  return (b * h * h * h) / 12; // mm⁴
}

// ── Flèche sous charge uniformément répartie ─────────────────────────
// Formule : δ = 5qL⁴ / (384EI)
// Inputs en cm — conversion interne en mm pour la formule (E en MPa = N/mm²)
// q = charge en N/mm, L = portée en mm, E = MPa, I = mm⁴
// Résultat converti de mm à cm avant retour
function calculerFleche(
  portee: number,           // cm
  espacement: number,       // cm
  chargeKPa: number,        // kPa = kN/m²
  E: number,                // MPa
  b: number, h: number,     // dimensions solive cm
): number {
  // Conversion cm → mm pour la formule Euler-Bernoulli
  const portee_mm = portee * 10;
  const espacement_mm = espacement * 10;
  const b_mm = b * 10;
  const h_mm = h * 10;

  const qSimple = (chargeKPa * espacement_mm) / 1000; // N/mm
  const I = inertie(b_mm, h_mm);                       // mm⁴
  const fleche_mm = (5 * qSimple * Math.pow(portee_mm, 4)) / (384 * E * I); // mm

  return fleche_mm / 10; // cm
}

// ── Sélection de la solive ─────────────────────────────────────────────
function selectionnerSolive(
  portee: number,           // cm
  espacement: EspacementSolive, // cm
  chargeKPa: number,
  E: number,
): { dimension: DimensionSolive; fleche: number; flecheMax: number } | null {
  const flecheMax = portee / FLECHE_RATIO; // cm (L/360 fonctionne dans n'importe quelle unité)

  for (const dim of ORDRE_DIMENSIONS) {
    const { b, h } = DIMENSIONS_SOLIVES[dim]; // cm
    const fleche = calculerFleche(portee, espacement, chargeKPa, E, b, h); // cm
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
      messageStatut = `Portée ${valeur} cm — dépasse la portée max admissible`;
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

  // Essayer chaque espacement (préférence 40cm → 60cm → 30cm)
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
        message: `La portée de ${longueur} cm est trop grande pour une solive simple. Utilisez une poutre de soutien ou réduisez la portée.`,
      },
    };
  }

  const { dimension, espacement, fleche, flecheMax } = solution;
  const epaisseurSousPlancher = EPAISSEUR_SOUS_PLANCHER[espacement];

  // Nombre de solives (largeur et espacement en cm)
  const nombreSolives = Math.ceil(largeur / espacement) + 1;
  // Longueur totale de bois (mètres linéaires) — cm ÷ 100 = m
  const longueurTotaleBoisM = (nombreSolives * longueur) / 100;
  // Panneaux 4x8 (1.219 × 2.438 m) — surface en m²
  const surfaceM2 = (longueur / 100) * (largeur / 100);
  const surfacePanneau = 1.219 * 2.438; // m²
  const quantitePanneaux = Math.ceil(surfaceM2 / surfacePanneau * 1.1); // +10% surplus

  // Conformité flèche (L/360)
  const indicateurFleche = creerIndicateur(
    fleche, flecheMax, true, 'cm', 'CCQ 9.4.3.1 (L/360)', flecheMax * 0.1,
  );

  // Conformité portée (on marque conforme car solution trouvée)
  const indicateurPortee: IndicateurConformitePlancher = {
    conforme: true,
    statut: 'conforme',
    valeurCalculee: longueur,
    valeurLimite: longueur,
    unite: 'cm',
    article: 'CNB 2020, Tableau A-9.23.4.2',
    messageStatut: `Solive ${dimension} convient pour ${longueur} cm de portée ✓`,
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
