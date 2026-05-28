// materiaux.ts — Liste des matériaux pour rampes et garde-corps
// Les prix sont indicatifs. Ils varient selon les fournisseurs.

import { EntreesRampe, ResultatsRampe, PieceMateriaux } from './types';
import { LABELS_MATERIAU } from './normes';

const EPAISSEUR_POTEAU_MM = 90;   // poteau typique 90×90 mm bois ou 2" métal
const DIAMETRE_BARREAU_MM = 25;   // barreau typique 1 po

export function calculerMateriaux(
  entrees: EntreesRampe,
  resultats: ResultatsRampe,
): PieceMateriaux[] {
  const label = LABELS_MATERIAU[entrees.materiau];
  const longueurRampe = entrees.longueurRampe;
  const { longueurMainCourante, nombrePoteaux, nombreBarreaux, hauteurGardeCorpsRequise } = resultats;
  const hauteurBarreauMm = hauteurGardeCorpsRequise - EPAISSEUR_POTEAU_MM;

  const pieces: PieceMateriaux[] = [
    {
      nom: 'Poteaux',
      quantite: nombrePoteaux,
      longueur: hauteurGardeCorpsRequise,
      unite: 'unité(s)',
      materiau: label,
      noteIndicative: `Section ${EPAISSEUR_POTEAU_MM}×${EPAISSEUR_POTEAU_MM} mm`,
    },
    {
      nom: 'Barreaux verticaux',
      quantite: nombreBarreaux,
      longueur: Math.max(hauteurBarreauMm, 100),
      unite: 'unité(s)',
      materiau: label,
      noteIndicative: `Ø ${DIAMETRE_BARREAU_MM} mm`,
    },
    {
      nom: 'Main courante',
      quantite: 1,
      longueur: longueurMainCourante,
      unite: 'mm linéaires',
      materiau: label,
      noteIndicative: 'Diamètre préhensible 38 mm recommandé (CCQ)',
    },
    {
      nom: 'Lisse basse',
      quantite: 1,
      longueur: longueurRampe,
      unite: 'mm linéaires',
      materiau: label,
    },
  ];

  return pieces;
}
