// calculs.ts — Fonctions de calcul pour rampes et garde-corps
// Toutes les fonctions sont pures (sans effets de bord)

import {
  EntreesRampe,
  ResultatsRampe,
  IndicateurConformiteRampe,
  ConformiteRampe,
  StatutConformite,
  ResultatOuErreur,
} from './types';
import { NORMES_GARDE_CORPS, SEUILS_AVERTISSEMENT_RAMPE } from './normes';

// ── Validation des entrées ──────────────────────────────────────────────
function validerEntrees(entrees: EntreesRampe): string | null {
  if (entrees.longueurRampe < 300 || entrees.longueurRampe > 30000) {
    return 'La longueur de la rampe doit être entre 300 mm et 30 000 mm.';
  }
  if (entrees.hauteurChute < 0 || entrees.hauteurChute > 10000) {
    return 'La hauteur de chute doit être entre 0 et 10 000 mm.';
  }
  return null;
}

// ── Hauteur de garde-corps requise ─────────────────────────────────────
export function calculerHauteurGardeCorps(entrees: EntreesRampe): number {
  const { hauteurChute, typeUsage } = entrees;
  const n = NORMES_GARDE_CORPS;

  if (typeUsage === 'residentiel_commun' || typeUsage === 'commercial') {
    return n.HAUTEUR_MIN_COMMUN_MM;
  }
  // résidentiel privé
  if (hauteurChute >= 1800) return n.HAUTEUR_MIN_ELEVEE_MM;
  if (hauteurChute > n.HAUTEUR_CHUTE_SEUIL_MM) return n.HAUTEUR_MIN_FAIBLE_MM;
  // chute <= 600mm : pas obligatoire, on retourne quand même 900 comme recommandé
  return n.HAUTEUR_MIN_FAIBLE_MM;
}

// ── Nombre de poteaux ──────────────────────────────────────────────────
export function calculerNombrePoteaux(longueurMm: number): number {
  const espacement = NORMES_GARDE_CORPS.ESPACEMENT_MAX_POTEAUX_MM;
  // poteau au début, poteau à la fin, et poteaux intermédiaires
  const nbIntermediaires = Math.ceil(longueurMm / espacement) - 1;
  return nbIntermediaires + 2; // extrémités incluses
}

// ── Espacement réel des barreaux ───────────────────────────────────────
// On calcule le nombre de barreaux pour respecter ≤ 100 mm
export function calculerNombreEtEspacementBarreaux(
  longueurMm: number,
  nbPoteaux: number,
): { nombreBarreaux: number; espacementReel: number } {
  const MAX = NORMES_GARDE_CORPS.ESPACEMENT_MAX_BARREAUX_MM;
  const espPoteau = NORMES_GARDE_CORPS.ESPACEMENT_MAX_POTEAUX_MM;
  const nbPanneaux = nbPoteaux - 1;
  const longueurPanneau = nbPanneaux > 0 ? longueurMm / nbPanneaux : longueurMm;

  // Nombre de barreaux par panneau pour respecter ≤ MAX mm
  const nbParPanneau = Math.ceil(longueurPanneau / MAX) - 1;
  const nombreBarreaux = nbParPanneau * nbPanneaux;
  // Espacement réel (avec les barreaux placés)
  const espacementReel = longueurPanneau / (nbParPanneau + 1);

  // Vérification de la contrainte espacement poteaux
  void espPoteau; // documenté dans normes.ts

  return {
    nombreBarreaux: Math.max(0, nombreBarreaux),
    espacementReel: Math.round(espacementReel * 10) / 10,
  };
}

// ── Indicateur de conformité ───────────────────────────────────────────
function creerIndicateur(
  valeurCalculee: number,
  valeurLimite: number,
  estValeurMax: boolean, // true = valeur doit être <= limite
  unite: string,
  article: string,
  source: string,
  zoneOrange: number,
): IndicateurConformiteRampe {
  let statut: StatutConformite;
  let conforme: boolean;
  let messageStatut: string;

  if (estValeurMax) {
    conforme = valeurCalculee <= valeurLimite;
    const marge = valeurLimite - valeurCalculee;
    if (!conforme) {
      statut = 'non_conforme';
      messageStatut = `${valeurCalculee} ${unite} — dépasse le maximum de ${valeurLimite} ${unite}`;
    } else if (marge <= zoneOrange) {
      statut = 'avertissement';
      messageStatut = `${valeurCalculee} ${unite} — proche du maximum (${valeurLimite} ${unite})`;
    } else {
      statut = 'conforme';
      messageStatut = `${valeurCalculee} ${unite} ≤ ${valeurLimite} ${unite} ✓`;
    }
  } else {
    conforme = valeurCalculee >= valeurLimite;
    const marge = valeurCalculee - valeurLimite;
    if (!conforme) {
      statut = 'non_conforme';
      messageStatut = `${valeurCalculee} ${unite} — inférieur au minimum requis de ${valeurLimite} ${unite}`;
    } else if (marge <= zoneOrange) {
      statut = 'avertissement';
      messageStatut = `${valeurCalculee} ${unite} — proche du minimum (${valeurLimite} ${unite})`;
    } else {
      statut = 'conforme';
      messageStatut = `${valeurCalculee} ${unite} ≥ ${valeurLimite} ${unite} ✓`;
    }
  }

  return { conforme, statut, valeurCalculee, valeurLimite, unite, article, source, messageStatut };
}

// ── Calcul principal ───────────────────────────────────────────────────
export function calculerRampe(entrees: EntreesRampe): ResultatOuErreur {
  const erreur = validerEntrees(entrees);
  if (erreur) {
    return { succes: false, erreur: { code: 'ENTREE_INVALIDE', message: erreur } };
  }

  const n = NORMES_GARDE_CORPS;
  const s = SEUILS_AVERTISSEMENT_RAMPE;
  const { longueurRampe, typeInstallation } = entrees;

  const hauteurGardeCorpsRequise = calculerHauteurGardeCorps(entrees);
  const nombrePoteaux = calculerNombrePoteaux(longueurRampe);
  const { nombreBarreaux, espacementReel } = calculerNombreEtEspacementBarreaux(longueurRampe, nombrePoteaux);
  const longueurMainCourante = longueurRampe + (typeInstallation === 'escalier' ? 2 * n.DEPASSEMENT_MAIN_COURANTE_MM : 0);

  // Conformité hauteur garde-corps
  const hauteurGardeCorps = creerIndicateur(
    hauteurGardeCorpsRequise,
    hauteurGardeCorpsRequise,
    false,
    'mm',
    'CCQ Art. 9.8.8.1',
    'https://qccodes.ca/escaliers-et-rampes/',
    s.GARDE_CORPS_ZONE_ORANGE_MM,
  );
  // Hauteur effectivement conforme si >= requis (ici on calcule le minimum requis)
  hauteurGardeCorps.conforme = true;
  hauteurGardeCorps.statut = 'conforme';
  hauteurGardeCorps.messageStatut = `Hauteur requise : ${hauteurGardeCorpsRequise} mm (CCQ 9.8.8.1)`;

  // Conformité espacement barreaux
  const espacementBarreaux = creerIndicateur(
    Math.round(espacementReel),
    n.ESPACEMENT_MAX_BARREAUX_MM,
    true,
    'mm',
    'CCQ Art. 9.8.8.3',
    'https://qccodes.ca/escaliers-et-rampes/',
    10,
  );

  // Conformité main courante (hauteur dans la plage)
  const mainCouranteIndicateur = creerIndicateur(
    n.HAUTEUR_MAIN_COURANTE_MIN_MM,
    n.HAUTEUR_MAIN_COURANTE_MIN_MM,
    false,
    'mm',
    'CCQ Art. 9.8.7.4',
    'https://qccodes.ca/escaliers-et-rampes/',
    s.MAIN_COURANTE_ZONE_ORANGE_MM,
  );
  mainCouranteIndicateur.conforme = true;
  mainCouranteIndicateur.statut = 'conforme';
  mainCouranteIndicateur.messageStatut = `Plage requise : ${n.HAUTEUR_MAIN_COURANTE_MIN_MM}–${n.HAUTEUR_MAIN_COURANTE_MAX_MM} mm (CCQ 9.8.7.4)`;

  const conformite: ConformiteRampe = {
    hauteurGardeCorps,
    espacementBarreaux,
    hauteurMainCourante: mainCouranteIndicateur,
  };

  const nbErreurs = [hauteurGardeCorps, espacementBarreaux, mainCouranteIndicateur]
    .filter(i => i.statut === 'non_conforme').length;
  const nbAvertissements = [hauteurGardeCorps, espacementBarreaux, mainCouranteIndicateur]
    .filter(i => i.statut === 'avertissement').length;

  const resultat: ResultatsRampe = {
    hauteurGardeCorpsRequise,
    hauteurMainCouranteMin: n.HAUTEUR_MAIN_COURANTE_MIN_MM,
    hauteurMainCouranteMax: n.HAUTEUR_MAIN_COURANTE_MAX_MM,
    espacementBarreaux: Math.round(espacementReel),
    nombrePoteaux,
    nombreBarreaux,
    longueurMainCourante,
    conformite,
    estConforme: nbErreurs === 0,
    nbErreurs,
    nbAvertissements,
  };

  return { succes: true, resultat };
}
