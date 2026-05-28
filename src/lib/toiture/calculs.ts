// calculs.ts — Fonctions de calcul pour toiture

import {
  EntreesToiture,
  ResultatsToiture,
  ConformiteToiture,
  IndicateurConformiteToiture,
  StatutConformite,
  ResultatOuErreur,
} from './types';
import {
  PENTES_MIN_DEGRES,
  CHARGES_NEIGE,
  RATIO_VENTILATION,
  SURFACE_PAR_PAQUET_M2,
  SURPLUS_BARDEAU,
  ESPACEMENT_CHEVRONS_MM,
} from './normes';

// ── Validation ─────────────────────────────────────────────────────────
function valider(e: EntreesToiture): string | null {
  if (e.longueurBatiment < 2000 || e.longueurBatiment > 50000) return 'Longueur : 2 000 – 50 000 mm.';
  if (e.largeurBatiment < 2000 || e.largeurBatiment > 30000) return 'Largeur : 2 000 – 30 000 mm.';
  if (e.penteDegres < 0 || e.penteDegres > 70) return 'Pente : 0 – 70 degrés.';
  if (e.debordToit < 0 || e.debordToit > 2000) return 'Débord : 0 – 2 000 mm.';
  return null;
}

// ── Surfaces ───────────────────────────────────────────────────────────
function calculerSurfaces(e: EntreesToiture): {
  surfaceHorizontale: number;
  surfaceDeveloppee: number;
  longueurChevron: number;
} {
  const L = e.longueurBatiment / 1000;     // m
  const W = e.largeurBatiment / 1000;      // m
  const debord = e.debordToit / 1000;      // m
  const pRad = (e.penteDegres * Math.PI) / 180;
  const facteur = 1 / Math.cos(pRad);      // facteur de développement de pente

  let surfaceHorizontale: number;
  let surfaceDeveloppee: number;
  let longueurChevron: number;

  const demiLargeur = W / 2 + debord;
  const longueurAvecDebord = L + 2 * debord;

  switch (e.typeToit) {
    case 'deux_versants':
      surfaceHorizontale = L * W;
      surfaceDeveloppee = longueurAvecDebord * demiLargeur * 2 * facteur;
      longueurChevron = demiLargeur / Math.cos(pRad) * 1000; // en mm
      break;
    case 'appentis':
      surfaceHorizontale = L * W;
      surfaceDeveloppee = longueurAvecDebord * (W + debord) * facteur;
      longueurChevron = (W + debord) / Math.cos(pRad) * 1000;
      break;
    case 'croupe':
      surfaceHorizontale = L * W;
      // Approximation croupe : 4 versants, 2 triangulaires + 2 trapézoïdaux
      surfaceDeveloppee = (L * W + (L - W) * W / 2) * facteur + debord * (L + W) * 2;
      longueurChevron = demiLargeur / Math.cos(pRad) * 1000;
      break;
    default:
      surfaceHorizontale = L * W;
      surfaceDeveloppee = L * W * facteur;
      longueurChevron = demiLargeur / Math.cos(pRad) * 1000;
  }

  return {
    surfaceHorizontale: Math.round(surfaceHorizontale * 100) / 100,
    surfaceDeveloppee: Math.round(surfaceDeveloppee * 100) / 100,
    longueurChevron: Math.round(longueurChevron),
  };
}

// ── Indicateur de conformité ───────────────────────────────────────────
function creerIndicateur(
  valeur: number,
  limite: number,
  estValeurMin: boolean,
  unite: string,
  article: string,
  zoneOrange: number,
): IndicateurConformiteToiture {
  let statut: StatutConformite;
  let conforme: boolean;
  let messageStatut: string;

  if (estValeurMin) {
    conforme = valeur >= limite;
    const marge = valeur - limite;
    if (!conforme) {
      statut = 'non_conforme';
      messageStatut = `Pente ${valeur.toFixed(1)}° — inférieure au minimum requis de ${limite.toFixed(1)}° pour ce revêtement`;
    } else if (marge <= zoneOrange) {
      statut = 'avertissement';
      messageStatut = `Pente ${valeur.toFixed(1)}° — proche du minimum (${limite.toFixed(1)}°)`;
    } else {
      statut = 'conforme';
      messageStatut = `Pente ${valeur.toFixed(1)}° ≥ ${limite.toFixed(1)}° minimum ✓`;
    }
  } else {
    conforme = valeur <= limite;
    messageStatut = conforme
      ? `${valeur.toFixed(1)} ${unite} ≤ ${limite.toFixed(1)} ${unite} ✓`
      : `${valeur.toFixed(1)} ${unite} — dépasse le maximum`;
    statut = conforme ? 'conforme' : 'non_conforme';
  }

  return { conforme, statut, valeurCalculee: valeur, valeurLimite: limite, unite, article, messageStatut };
}

// ── Calcul principal ───────────────────────────────────────────────────
export function calculerToiture(entrees: EntreesToiture): ResultatOuErreur {
  const err = valider(entrees);
  if (err) return { succes: false, erreur: { code: 'ENTREE_INVALIDE', message: err } };

  const { surfaces, longueurChevron } = (() => {
    const s = calculerSurfaces(entrees);
    return { surfaces: s, longueurChevron: s.longueurChevron };
  })();

  const { surfaceHorizontale, surfaceDeveloppee } = surfaces;

  // Nombre de chevrons
  const largeurAvecDebord = entrees.largeurBatiment / 1000 + 2 * (entrees.debordToit / 1000);
  const nombreChevrons = Math.ceil(
    (entrees.longueurBatiment / 1000 + 2 * (entrees.debordToit / 1000)) /
    (ESPACEMENT_CHEVRONS_MM / 1000)
  ) + 1;

  // Matériaux de couverture
  let nombrePaquetsBardeaux: number | undefined;
  let surfaceMembraneM2: number | undefined;
  if (entrees.typeRevetement === 'bardeau_asphalte') {
    nombrePaquetsBardeaux = Math.ceil((surfaceDeveloppee * SURPLUS_BARDEAU) / SURFACE_PAR_PAQUET_M2);
  } else {
    surfaceMembraneM2 = Math.round(surfaceDeveloppee * SURPLUS_BARDEAU * 10) / 10;
  }

  // Ventilation CCQ 9.19.1.1 : 1/300 de la surface de plafond
  const surfacePlafond = surfaceHorizontale; // m²
  const surfaceVentilationTotale = surfacePlafond * RATIO_VENTILATION; // m²
  const ventilationCm2Total = Math.round(surfaceVentilationTotale * 10000); // cm²
  const ventilationEntreeCm2 = Math.ceil(ventilationCm2Total / 2);
  const ventilationSortieCm2 = Math.ceil(ventilationCm2Total / 2);

  // Charge de neige
  const chargeNeige = CHARGES_NEIGE[entrees.region];

  // Conformité pente
  const penteMin = PENTES_MIN_DEGRES[entrees.typeRevetement];
  const indicateurPente = creerIndicateur(
    entrees.penteDegres, penteMin, true, '°',
    `CCQ 9.26 (${entrees.typeRevetement === 'bardeau_asphalte' ? '9.26.1' : entrees.typeRevetement === 'tole_acier' ? '9.26.2' : '9.26.3'})`,
    2.0,
  );

  const conformite: ConformiteToiture = { pente: indicateurPente };
  const nbErreurs = indicateurPente.statut === 'non_conforme' ? 1 : 0;

  void largeurAvecDebord;

  return {
    succes: true,
    resultat: {
      surfaceHorizontale,
      surfaceDeveloppee,
      nombrePaquetsBardeaux,
      surfaceMembraneM2,
      nombreChevrons,
      longueurChevrons: longueurChevron,
      ventilationEntreeCm2,
      ventilationSortieCm2,
      chargeNeige,
      conformite,
      estConforme: nbErreurs === 0,
      nbErreurs,
    },
  };
}
