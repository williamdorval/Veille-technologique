// materiaux.ts — Liste des matériaux pour rampes et garde-corps
// Les prix sont indicatifs. Ils varient selon les fournisseurs.

import { EntreesRampe, ResultatsRampe, PieceMateriaux } from './types';
import { LABELS_MATERIAU } from './normes';

const EPAISSEUR_POTEAU_CM = 9;   // poteau typique 90×90 mm (9×9 cm) bois ou 2" métal
const DIAMETRE_BARREAU_CM = 2.5; // barreau typique 1 po (≈ 2,5 cm)

export function calculerMateriaux(
  entrees: EntreesRampe,
  resultats: ResultatsRampe,
): PieceMateriaux[] {
  const label = LABELS_MATERIAU[entrees.materiau];
  const longueurRampe = entrees.longueurRampe;
  const { longueurMainCourante, nombrePoteaux, nombreBarreaux, hauteurGardeCorpsRequise } = resultats;
  const hauteurBarreauCm = hauteurGardeCorpsRequise - EPAISSEUR_POTEAU_CM;

  const pieces: PieceMateriaux[] = [
    {
      nom: 'Poteaux',
      quantite: nombrePoteaux,
      longueur: hauteurGardeCorpsRequise,
      unite: 'unité(s)',
      materiau: label,
      noteIndicative: `Section ${EPAISSEUR_POTEAU_CM}×${EPAISSEUR_POTEAU_CM} cm`,
    },
    {
      nom: 'Barreaux verticaux',
      quantite: nombreBarreaux,
      longueur: Math.max(hauteurBarreauCm, 10),
      unite: 'unité(s)',
      materiau: label,
      noteIndicative: `Ø ${DIAMETRE_BARREAU_CM} cm`,
    },
    {
      nom: 'Main courante',
      quantite: 1,
      longueur: longueurMainCourante,
      unite: 'cm linéaires',
      materiau: label,
      noteIndicative: 'Diamètre préhensible 3,8 cm recommandé (CCQ)',
    },
    {
      nom: 'Lisse basse',
      quantite: 1,
      longueur: longueurRampe,
      unite: 'cm linéaires',
      materiau: label,
    },
  ];

  return pieces;
}
