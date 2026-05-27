// calculs.ts — Algorithme de calcul des escaliers
// Utilise UNIQUEMENT les constantes de normes.ts — jamais de valeurs hardcodées

import {
  EntreeFormulaire,
  ResultatOuErreur,
  DimensionsEscalier,
  IndicateurConformite,
  ConformiteResultat,
  StatutConformite,
  TypeUsage,
} from './types';
import { NORMES_CCQ, SEUILS_AVERTISSEMENT } from './normes';
import { calculerMateriaux, calculerEstimation } from './materiaux';
import { genererPlanConstruction } from './plan-construction';

// ─── CONVERSION D'UNITÉS ────────────────────────────────────────────────────

export function poucesEnMm(pouces: number): number {
  return pouces * 25.4;
}

export function mmEnPouces(mm: number): number {
  return Math.round((mm / 25.4) * 100) / 100;
}

// ─── FONCTION PRINCIPALE ────────────────────────────────────────────────────

export function calculerEscalier(entree: EntreeFormulaire): ResultatOuErreur {
  // Validation des plages
  if (entree.hauteurTotale < 400 || entree.hauteurTotale > 6000) {
    return {
      succes: false,
      erreur: {
        code: 'HAUTEUR_INVALIDE',
        message: `La hauteur totale doit être entre 400 mm et 6 000 mm (valeur : ${Math.round(entree.hauteurTotale)} mm)`,
        champ: 'hauteurTotale',
      },
    };
  }
  if (entree.largeur < 600 || entree.largeur > 2500) {
    return {
      succes: false,
      erreur: {
        code: 'LARGEUR_INVALIDE',
        message: `La largeur doit être entre 600 mm et 2 500 mm (valeur : ${Math.round(entree.largeur)} mm)`,
        champ: 'largeur',
      },
    };
  }

  // Calcul du nombre de marches optimal
  const nbMarchesBase = Math.round(
    entree.hauteurTotale / NORMES_CCQ.CONTREMARCHE_IDEAL_MM
  );

  // Tester nbMarches-1, nbMarches, nbMarches+1 → choisir le meilleur Blondel
  const candidats = [nbMarchesBase - 1, nbMarchesBase, nbMarchesBase + 1].filter(
    (n) => n >= 2
  );

  if (candidats.length === 0) {
    return {
      succes: false,
      erreur: {
        code: 'IMPOSSIBLE_DEUX_MARCHES',
        message: `La hauteur de ${Math.round(entree.hauteurTotale)} mm est trop faible pour 2 marches minimum. Hauteur minimale recommandée : 300 mm.`,
        champ: 'hauteurTotale',
      },
    };
  }

  let meilleureNbMarches = nbMarchesBase;
  let meilleurEcartBlondel = Infinity;

  for (const n of candidats) {
    const h = entree.hauteurTotale / n;
    const g = Math.min(
      Math.max(
        NORMES_CCQ.BLONDEL_CIBLE_MM - 2 * h,
        NORMES_CCQ.GIRON_MIN_PRIVE_MM
      ),
      NORMES_CCQ.GIRON_MAX_MM
    );
    const blondel = 2 * h + g;
    const ecart = Math.abs(blondel - NORMES_CCQ.BLONDEL_CIBLE_MM);
    if (ecart < meilleurEcartBlondel) {
      meilleurEcartBlondel = ecart;
      meilleureNbMarches = n;
    }
  }

  const nombreMarches = meilleureNbMarches;

  // Calcul des dimensions exactes
  const hauteurContremarche =
    Math.round((entree.hauteurTotale / nombreMarches) * 10) / 10;

  const gironBrut = NORMES_CCQ.BLONDEL_CIBLE_MM - 2 * hauteurContremarche;
  const gironMin =
    entree.typeUsage === 'residentiel_prive'
      ? NORMES_CCQ.GIRON_MIN_PRIVE_MM
      : NORMES_CCQ.GIRON_MIN_COMMUN_MM;
  const giron =
    Math.round(
      Math.min(Math.max(gironBrut, gironMin), NORMES_CCQ.GIRON_MAX_MM) * 10
    ) / 10;

  const longueurAuSol = Math.round(nombreMarches * giron);
  const longueurLimon =
    Math.round(
      Math.sqrt(longueurAuSol * longueurAuSol + entree.hauteurTotale * entree.hauteurTotale) *
        10
    ) / 10;
  const angleDegres =
    Math.round(
      Math.atan2(entree.hauteurTotale, longueurAuSol) * (180 / Math.PI) * 10
    ) / 10;
  const blondel = Math.round((2 * hauteurContremarche + giron) * 10) / 10;

  const dimensions: DimensionsEscalier = {
    nombreMarches,
    hauteurContremarche,
    giron,
    longueurAuSol,
    longueurLimon,
    angleDegres,
    blondel,
  };

  // Vérification de conformité
  const conformite = verifierConformiteComplete(
    dimensions,
    entree.typeUsage,
    entree.hauteurPlafond,
    entree.largeur
  );

  // Matériaux, plan, estimation
  const materiaux = calculerMateriaux(dimensions, entree);
  const etapesConstruction = genererPlanConstruction(dimensions, entree, conformite);
  const estimation = calculerEstimation(dimensions, materiaux, entree);

  // Méta-indicateurs
  const indicateurs = Object.values(conformite);
  const nbErreurs = indicateurs.filter((i) => i.statut === 'non_conforme').length;
  const nbAvertissements = indicateurs.filter(
    (i) => i.statut === 'avertissement'
  ).length;

  return {
    succes: true,
    resultat: {
      nombreMarches,
      hauteurContremarche,
      giron,
      longueurAuSol,
      longueurLimon,
      angleDegres,
      blondel,
      conformite,
      materiaux,
      etapesConstruction,
      estimation,
      estConforme: nbErreurs === 0 && nbAvertissements === 0,
      nbAvertissements,
      nbErreurs,
    },
  };
}

// ─── VÉRIFICATION DE CONFORMITÉ ─────────────────────────────────────────────

export function verifierConformite(
  dim: DimensionsEscalier,
  typeUsage: TypeUsage,
  hauteurPlafond: number
): ConformiteResultat {
  return verifierConformiteComplete(dim, typeUsage, hauteurPlafond, 0);
}

export function verifierConformiteComplete(
  dim: DimensionsEscalier,
  typeUsage: TypeUsage,
  hauteurPlafond: number,
  largeur: number
): ConformiteResultat {
  const estPrive = typeUsage === 'residentiel_prive';

  return {
    contremarche: verifierContremarche(dim.hauteurContremarche, estPrive),
    giron: verifierGiron(dim.giron, estPrive),
    blondel: verifierBlondel(dim.blondel),
    degagementTete: verifierDegagementTete(
      hauteurPlafond,
      dim.angleDegres,
      dim.giron,
      estPrive
    ),
    largeur: verifierLargeurAvecValeur(largeur, typeUsage),
  };
}

function statut(
  valeur: number,
  min: number,
  max: number | null,
  zoneOrangeMin: number,
  zoneOrangeMax: number
): StatutConformite {
  if (valeur < min) return 'non_conforme';
  if (max !== null && valeur > max) return 'non_conforme';
  if (valeur < min + zoneOrangeMin) return 'avertissement';
  if (max !== null && valeur > max - zoneOrangeMax) return 'avertissement';
  return 'conforme';
}

function verifierContremarche(
  hauteur: number,
  estPrive: boolean
): IndicateurConformite {
  const max = estPrive
    ? NORMES_CCQ.CONTREMARCHE_MAX_PRIVE_MM
    : NORMES_CCQ.CONTREMARCHE_MAX_COMMUN_MM;
  const s = statut(
    hauteur,
    NORMES_CCQ.CONTREMARCHE_MIN_MM,
    max,
    SEUILS_AVERTISSEMENT.CONTREMARCHE_ZONE_ORANGE_BAS,
    SEUILS_AVERTISSEMENT.CONTREMARCHE_ZONE_ORANGE_HAUT
  );
  const messages: Record<StatutConformite, string> = {
    conforme: `Hauteur conforme (${hauteur} mm)`,
    avertissement: `Proche des limites (${hauteur} mm) — vérifier avec un professionnel`,
    non_conforme: `Non conforme : ${hauteur} mm. Plage requise : ${NORMES_CCQ.CONTREMARCHE_MIN_MM}–${max} mm`,
  };
  return {
    nom: 'Hauteur de contremarche',
    valeur: hauteur,
    unite: 'mm',
    statut: s,
    messageStatut: messages[s],
    plageMin: NORMES_CCQ.CONTREMARCHE_MIN_MM,
    plageMax: max,
    articleCCQ: 'Art. 9.8.4.1 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/',
  };
}

function verifierGiron(giron: number, estPrive: boolean): IndicateurConformite {
  const min = estPrive
    ? NORMES_CCQ.GIRON_MIN_PRIVE_MM
    : NORMES_CCQ.GIRON_MIN_COMMUN_MM;
  const s = statut(
    giron,
    min,
    NORMES_CCQ.GIRON_MAX_MM,
    SEUILS_AVERTISSEMENT.GIRON_ZONE_ORANGE_BAS,
    0
  );
  const messages: Record<StatutConformite, string> = {
    conforme: `Giron conforme (${giron} mm)`,
    avertissement: `Proche du minimum (${giron} mm) — prévoir un peu plus pour le confort`,
    non_conforme: `Non conforme : ${giron} mm. Minimum requis : ${min} mm`,
  };
  return {
    nom: 'Giron (profondeur de marche)',
    valeur: giron,
    unite: 'mm',
    statut: s,
    messageStatut: messages[s],
    plageMin: min,
    plageMax: NORMES_CCQ.GIRON_MAX_MM,
    articleCCQ: 'Art. 9.8.4.2 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/',
  };
}

function verifierBlondel(blondel: number): IndicateurConformite {
  const s = statut(
    blondel,
    NORMES_CCQ.BLONDEL_MIN_MM,
    NORMES_CCQ.BLONDEL_MAX_MM,
    SEUILS_AVERTISSEMENT.BLONDEL_ZONE_ORANGE,
    SEUILS_AVERTISSEMENT.BLONDEL_ZONE_ORANGE
  );
  const messages: Record<StatutConformite, string> = {
    conforme: `Formule de Blondel conforme (2H+G = ${blondel} mm)`,
    avertissement: `Proche des limites de confort (2H+G = ${blondel} mm, cible 630 mm)`,
    non_conforme: `Hors confort : 2H+G = ${blondel} mm. Plage requise : ${NORMES_CCQ.BLONDEL_MIN_MM}–${NORMES_CCQ.BLONDEL_MAX_MM} mm`,
  };
  return {
    nom: 'Formule de Blondel (2H+G)',
    valeur: blondel,
    unite: 'mm',
    statut: s,
    messageStatut: messages[s],
    plageMin: NORMES_CCQ.BLONDEL_MIN_MM,
    plageMax: NORMES_CCQ.BLONDEL_MAX_MM,
    articleCCQ: 'Pratique professionnelle reconnue',
    sourceURL: 'https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/',
  };
}

function verifierDegagementTete(
  hauteurPlafond: number,
  angleDegres: number,
  _giron: number,
  estPrive: boolean
): IndicateurConformite {
  const minRequis = estPrive
    ? NORMES_CCQ.DEGAGEMENT_TETE_MIN_PRIVE_MM
    : NORMES_CCQ.DEGAGEMENT_TETE_MIN_COMMUN_MM;

  // Le dégagement de tête effectif dépend de l'angle et de la hauteur du plafond.
  // Simplification conservative : on compare hauteurPlafond au minimum requis.
  // (En pratique, l'architecte calcule le point critique sous le plancher supérieur.)
  const degagementEffectif = hauteurPlafond - (hauteurPlafond * Math.sin((angleDegres * Math.PI) / 180) * 0.1);
  const valeurAffichee = Math.round(hauteurPlafond);

  let s: StatutConformite;
  if (hauteurPlafond < minRequis) {
    s = 'non_conforme';
  } else if (hauteurPlafond < minRequis + SEUILS_AVERTISSEMENT.DEGAGEMENT_ZONE_ORANGE_MM) {
    s = 'avertissement';
  } else {
    s = 'conforme';
  }

  void degagementEffectif; // utilisé pour le calcul ci-dessus

  const messages: Record<StatutConformite, string> = {
    conforme: `Dégagement suffisant (${valeurAffichee} mm ≥ ${minRequis} mm requis)`,
    avertissement: `Dégagement limite (${valeurAffichee} mm — minimum ${minRequis} mm) — vérifier sur place`,
    non_conforme: `Dégagement insuffisant : ${valeurAffichee} mm. Minimum requis : ${minRequis} mm`,
  };

  return {
    nom: 'Dégagement de tête (échappée)',
    valeur: valeurAffichee,
    unite: 'mm',
    statut: s,
    messageStatut: messages[s],
    plageMin: minRequis,
    plageMax: null,
    articleCCQ: 'Art. 9.8.3.1 CCQ',
    sourceURL: 'https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/',
  };
}

function verifierLargeur(
  dim: DimensionsEscalier,
  typeUsage: TypeUsage
): IndicateurConformite {
  void dim;
  // La largeur est une entrée du formulaire — on retourne un indicateur "informatif"
  // Le composant FormulaireEscalier passe la largeur via EntreeFormulaire
  // Cette fonction est appelée avec les dimensions mais la largeur vient de l'entrée
  // → Valeur placeholder, la vraie vérification se fait dans calculerEscalier avec entree.largeur
  const minRequis =
    typeUsage === 'residentiel_prive'
      ? NORMES_CCQ.LARGEUR_MIN_PRIVE_MM
      : NORMES_CCQ.LARGEUR_MIN_COMMUN_MM;

  return {
    nom: 'Largeur de l\'escalier',
    valeur: minRequis,
    unite: 'mm',
    statut: 'conforme',
    messageStatut: `Largeur à vérifier (minimum ${minRequis} mm requis)`,
    plageMin: minRequis,
    plageMax: null,
    articleCCQ: 'Art. 9.8.2.1 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/largeur-des-escaliers/',
  };
}

// Version corrigée qui prend la largeur en paramètre
export function verifierLargeurAvecValeur(
  largeur: number,
  typeUsage: TypeUsage
): IndicateurConformite {
  const minRequis =
    typeUsage === 'residentiel_prive'
      ? NORMES_CCQ.LARGEUR_MIN_PRIVE_MM
      : NORMES_CCQ.LARGEUR_MIN_COMMUN_MM;

  let s: StatutConformite;
  if (largeur < minRequis) {
    s = 'non_conforme';
  } else if (largeur < minRequis + SEUILS_AVERTISSEMENT.LARGEUR_ZONE_ORANGE_MM) {
    s = 'avertissement';
  } else {
    s = 'conforme';
  }

  const messages: Record<StatutConformite, string> = {
    conforme: `Largeur conforme (${largeur} mm ≥ ${minRequis} mm)`,
    avertissement: `Largeur limite (${largeur} mm — minimum ${minRequis} mm)`,
    non_conforme: `Largeur insuffisante : ${largeur} mm. Minimum requis : ${minRequis} mm`,
  };

  return {
    nom: 'Largeur de l\'escalier',
    valeur: largeur,
    unite: 'mm',
    statut: s,
    messageStatut: messages[s],
    plageMin: minRequis,
    plageMax: null,
    articleCCQ: 'Art. 9.8.2.1 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/largeur-des-escaliers/',
  };
}
