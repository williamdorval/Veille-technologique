// conformite.ts — Fonctions de vérification de conformité CCQ
// Séparées de calculs.ts pour garder chaque fichier < 150 lignes

import {
  DimensionsEscalier,
  IndicateurConformite,
  ConformiteResultat,
  StatutConformite,
  TypeUsage,
} from './types';
import { NORMES_CCQ, SEUILS_AVERTISSEMENT } from './normes';

function evalStatut(
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

export function verifierContremarche(hauteur: number, estPrive: boolean): IndicateurConformite {
  const max = estPrive ? NORMES_CCQ.CONTREMARCHE_MAX_PRIVE_CM : NORMES_CCQ.CONTREMARCHE_MAX_COMMUN_CM;
  const s = evalStatut(hauteur, NORMES_CCQ.CONTREMARCHE_MIN_CM, max,
    SEUILS_AVERTISSEMENT.CONTREMARCHE_ZONE_ORANGE_BAS, SEUILS_AVERTISSEMENT.CONTREMARCHE_ZONE_ORANGE_HAUT);
  const msgs: Record<StatutConformite, string> = {
    conforme: `Hauteur conforme (${hauteur} cm)`,
    avertissement: `Proche des limites (${hauteur} cm) — vérifier avec un professionnel`,
    non_conforme: `Non conforme : ${hauteur} cm. Plage : ${NORMES_CCQ.CONTREMARCHE_MIN_CM}–${max} cm`,
  };
  return { nom: 'Hauteur de contremarche', valeur: hauteur, unite: 'cm', statut: s,
    messageStatut: msgs[s], plageMin: NORMES_CCQ.CONTREMARCHE_MIN_CM, plageMax: max,
    articleCCQ: 'Art. 9.8.4.1 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/' };
}

export function verifierGiron(giron: number, estPrive: boolean): IndicateurConformite {
  const min = estPrive ? NORMES_CCQ.GIRON_MIN_PRIVE_CM : NORMES_CCQ.GIRON_MIN_COMMUN_CM;
  const s = evalStatut(giron, min, NORMES_CCQ.GIRON_MAX_CM, SEUILS_AVERTISSEMENT.GIRON_ZONE_ORANGE_BAS, 0);
  const msgs: Record<StatutConformite, string> = {
    conforme: `Giron conforme (${giron} cm)`,
    avertissement: `Proche du minimum (${giron} cm) — prévoir un peu plus`,
    non_conforme: `Non conforme : ${giron} cm. Minimum : ${min} cm`,
  };
  return { nom: 'Giron (profondeur de marche)', valeur: giron, unite: 'cm', statut: s,
    messageStatut: msgs[s], plageMin: min, plageMax: NORMES_CCQ.GIRON_MAX_CM,
    articleCCQ: 'Art. 9.8.4.2 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/' };
}

export function verifierBlondel(blondel: number): IndicateurConformite {
  const s = evalStatut(blondel, NORMES_CCQ.BLONDEL_MIN_CM, NORMES_CCQ.BLONDEL_MAX_CM,
    SEUILS_AVERTISSEMENT.BLONDEL_ZONE_ORANGE, SEUILS_AVERTISSEMENT.BLONDEL_ZONE_ORANGE);
  const msgs: Record<StatutConformite, string> = {
    conforme: `Blondel conforme (2H+G = ${blondel} cm)`,
    avertissement: `Proche des limites de confort (2H+G = ${blondel} cm, cible 63)`,
    non_conforme: `Hors confort : 2H+G = ${blondel} cm. Plage : ${NORMES_CCQ.BLONDEL_MIN_CM}–${NORMES_CCQ.BLONDEL_MAX_CM} cm`,
  };
  return { nom: 'Formule de Blondel (2H+G)', valeur: blondel, unite: 'cm', statut: s,
    messageStatut: msgs[s], plageMin: NORMES_CCQ.BLONDEL_MIN_CM, plageMax: NORMES_CCQ.BLONDEL_MAX_CM,
    articleCCQ: 'Pratique professionnelle reconnue',
    sourceURL: 'https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/' };
}

export function verifierDegagementTete(hauteurPlafond: number, _angleDegres: number, estPrive: boolean): IndicateurConformite {
  const minRequis = estPrive ? NORMES_CCQ.DEGAGEMENT_TETE_MIN_PRIVE_CM : NORMES_CCQ.DEGAGEMENT_TETE_MIN_COMMUN_CM;
  let s: StatutConformite;
  if (hauteurPlafond < minRequis) s = 'non_conforme';
  else if (hauteurPlafond < minRequis + SEUILS_AVERTISSEMENT.DEGAGEMENT_ZONE_ORANGE_CM) s = 'avertissement';
  else s = 'conforme';
  const msgs: Record<StatutConformite, string> = {
    conforme: `Dégagement suffisant (${Math.round(hauteurPlafond)} cm ≥ ${minRequis} cm)`,
    avertissement: `Dégagement limite (${Math.round(hauteurPlafond)} cm — min ${minRequis} cm)`,
    non_conforme: `Insuffisant : ${Math.round(hauteurPlafond)} cm < ${minRequis} cm requis`,
  };
  return { nom: 'Dégagement de tête (échappée)', valeur: Math.round(hauteurPlafond), unite: 'cm',
    statut: s, messageStatut: msgs[s], plageMin: minRequis, plageMax: null,
    articleCCQ: 'Art. 9.8.3.1 CCQ',
    sourceURL: 'https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/' };
}

export function verifierLargeur(largeur: number, typeUsage: TypeUsage): IndicateurConformite {
  const min = typeUsage === 'residentiel_prive' ? NORMES_CCQ.LARGEUR_MIN_PRIVE_CM : NORMES_CCQ.LARGEUR_MIN_COMMUN_CM;
  let s: StatutConformite;
  if (largeur < min) s = 'non_conforme';
  else if (largeur < min + SEUILS_AVERTISSEMENT.LARGEUR_ZONE_ORANGE_CM) s = 'avertissement';
  else s = 'conforme';
  const msgs: Record<StatutConformite, string> = {
    conforme: `Largeur conforme (${largeur} cm ≥ ${min} cm)`,
    avertissement: `Largeur limite (${largeur} cm — min ${min} cm)`,
    non_conforme: `Insuffisant : ${largeur} cm < ${min} cm requis`,
  };
  return { nom: 'Largeur de l\'escalier', valeur: largeur, unite: 'cm', statut: s,
    messageStatut: msgs[s], plageMin: min, plageMax: null,
    articleCCQ: 'Art. 9.8.2.1 CCQ',
    sourceURL: 'https://www.qccodes.ca/escaliers-et-rampes/largeur-des-escaliers/' };
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
    degagementTete: verifierDegagementTete(hauteurPlafond, dim.angleDegres, estPrive),
    largeur: verifierLargeur(largeur, typeUsage),
  };
}
