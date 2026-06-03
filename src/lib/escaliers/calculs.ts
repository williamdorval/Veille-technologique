// calculs.ts — Algorithme de calcul des escaliers
// Utilise UNIQUEMENT les constantes de normes.ts — jamais de valeurs hardcodées

import { EntreeFormulaire, ResultatOuErreur, DimensionsEscalier } from './types';
import { NORMES_CCQ } from './normes';
import { verifierConformiteComplete } from './conformite';
import { calculerMateriaux, calculerEstimation } from './materiaux';
import { genererPlanConstruction } from './plan-construction';

// ─── CONVERSION D'UNITÉS ────────────────────────────────────────────────────

export function poucesEnCm(pouces: number): number {
  return pouces * 2.54;
}

export function cmEnPouces(cm: number): number {
  return Math.round((cm / 2.54) * 100) / 100;
}

// ─── FONCTION PRINCIPALE ────────────────────────────────────────────────────

export function calculerEscalier(entree: EntreeFormulaire): ResultatOuErreur {
  // Validation des plages d'entrée
  if (entree.hauteurTotale < 40 || entree.hauteurTotale > 600) {
    return {
      succes: false,
      erreur: {
        code: 'HAUTEUR_INVALIDE',
        message: `La hauteur totale doit être entre 40 cm et 600 cm (valeur : ${Math.round(entree.hauteurTotale)} cm)`,
        champ: 'hauteurTotale',
      },
    };
  }

  if (entree.largeur < 60 || entree.largeur > 250) {
    return {
      succes: false,
      erreur: {
        code: 'LARGEUR_INVALIDE',
        message: `La largeur doit être entre 60 cm et 250 cm (valeur : ${Math.round(entree.largeur)} cm)`,
        champ: 'largeur',
      },
    };
  }

  // ── Calcul du nombre de marches optimal (minimise l'écart à Blondel 63 cm) ─
  const nbBase = Math.round(entree.hauteurTotale / NORMES_CCQ.CONTREMARCHE_IDEAL_CM);
  const candidats = [nbBase - 1, nbBase, nbBase + 1].filter((n) => n >= 2);

  if (candidats.length === 0) {
    return {
      succes: false,
      erreur: {
        code: 'IMPOSSIBLE_DEUX_MARCHES',
        message: `Hauteur ${Math.round(entree.hauteurTotale)} cm insuffisante pour 2 marches minimum.`,
        champ: 'hauteurTotale',
      },
    };
  }

  const gironMin = entree.typeUsage === 'residentiel_prive'
    ? NORMES_CCQ.GIRON_MIN_PRIVE_CM : NORMES_CCQ.GIRON_MIN_COMMUN_CM;

  let meilleureNb = nbBase;
  let meilleurEcart = Infinity;
  for (const n of candidats) {
    const h = entree.hauteurTotale / n;
    const g = Math.min(Math.max(NORMES_CCQ.BLONDEL_CIBLE_CM - 2 * h, gironMin), NORMES_CCQ.GIRON_MAX_CM);
    const ecart = Math.abs(2 * h + g - NORMES_CCQ.BLONDEL_CIBLE_CM);
    if (ecart < meilleurEcart) { meilleurEcart = ecart; meilleureNb = n; }
  }

  const nombreMarches = meilleureNb;
  const hauteurContremarche = Math.round((entree.hauteurTotale / nombreMarches) * 10) / 10;
  const gironBrut = NORMES_CCQ.BLONDEL_CIBLE_CM - 2 * hauteurContremarche;
  const giron = Math.round(Math.min(Math.max(gironBrut, gironMin), NORMES_CCQ.GIRON_MAX_CM) * 10) / 10;
  const longueurAuSol = Math.round(nombreMarches * giron);
  const longueurLimon = Math.round(Math.sqrt(longueurAuSol ** 2 + entree.hauteurTotale ** 2) * 10) / 10;
  const angleDegres = Math.round(Math.atan2(entree.hauteurTotale, longueurAuSol) * (180 / Math.PI) * 10) / 10;
  const blondel = Math.round((2 * hauteurContremarche + giron) * 10) / 10;

  const dimensions: DimensionsEscalier = {
    nombreMarches, hauteurContremarche, giron, longueurAuSol, longueurLimon, angleDegres, blondel,
  };

  // ── Vérification de conformité ─────────────────────────────────────────────
  const conformite = verifierConformiteComplete(dimensions, entree.typeUsage, entree.hauteurPlafond, entree.largeur);

  // ── Matériaux, plan, estimation ────────────────────────────────────────────
  const materiaux = calculerMateriaux(dimensions, entree);
  const etapesConstruction = genererPlanConstruction(dimensions, entree, conformite);
  const estimation = calculerEstimation(dimensions, materiaux, entree);

  // ── Méta-indicateurs ───────────────────────────────────────────────────────
  const indicateurs = Object.values(conformite);
  const nbErreurs = indicateurs.filter((i) => i.statut === 'non_conforme').length;
  const nbAvertissements = indicateurs.filter((i) => i.statut === 'avertissement').length;

  return {
    succes: true,
    resultat: {
      nombreMarches, hauteurContremarche, giron, longueurAuSol, longueurLimon, angleDegres, blondel,
      conformite, materiaux, etapesConstruction, estimation,
      estConforme: nbErreurs === 0 && nbAvertissements === 0,
      nbAvertissements,
      nbErreurs,
    },
  };
}
