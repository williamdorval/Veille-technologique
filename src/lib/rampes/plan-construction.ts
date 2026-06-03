// plan-construction.ts — Étapes de pose d'une rampe ou garde-corps

import { EntreesRampe, ResultatsRampe, EtapePose } from './types';

export function genererEtapesPose(
  entrees: EntreesRampe,
  resultats: ResultatsRampe,
): EtapePose[] {
  const { nombrePoteaux, hauteurGardeCorpsRequise, espacementBarreaux, longueurMainCourante } = resultats;
  const espPoteau = Math.round((entrees.longueurRampe / (nombrePoteaux - 1)));

  const etapes: EtapePose[] = [
    {
      numero: 1,
      titre: 'Planification et marquage',
      description: 'Marquer l\'emplacement de chaque poteau sur la structure. Vérifier que les points d\'ancrage sont solides. Percer les trous aux emplacements prévus.',
      dimensionsCles: [
        { label: 'Nombre de poteaux', valeur: `${nombrePoteaux}` },
        { label: 'Espacement entre poteaux', valeur: `${espPoteau} cm` },
      ],
      obligatoireSelonNormes: true,
    },
    {
      numero: 2,
      titre: 'Pose des poteaux',
      description: 'Fixer chaque poteau à sa base avec des ancrages appropriés. Vérifier l\'aplomb (vertical) avec un niveau. Les poteaux doivent être parfaitement droits.',
      dimensionsCles: [
        { label: 'Hauteur poteau (au-dessus appui)', valeur: `${hauteurGardeCorpsRequise} cm` },
        { label: 'Espacement max poteaux', valeur: `120 cm` },
      ],
      obligatoireSelonNormes: true,
    },
    {
      numero: 3,
      titre: 'Installation de la lisse basse',
      description: 'Fixer la lisse basse entre les poteaux à la base. Elle sert d\'appui pour les barreaux. La hauteur entre le sol et la lisse basse ne doit pas dépasser 10 cm (CCQ 9.8.8.3).',
      dimensionsCles: [
        { label: 'Hauteur max lisse basse', valeur: '10 cm (CCQ)' },
      ],
      obligatoireSelonNormes: true,
    },
    {
      numero: 4,
      titre: 'Pose des barreaux',
      description: 'Installer les barreaux verticaux entre la lisse basse et la main courante. Respecter l\'espacement pour qu\'une sphère de 10 cm ne puisse pas passer entre deux barreaux (CCQ 9.8.8.3).',
      dimensionsCles: [
        { label: 'Espacement entre barreaux', valeur: `${espacementBarreaux} cm (≤ 10 cm)` },
      ],
      obligatoireSelonNormes: true,
    },
    {
      numero: 5,
      titre: 'Installation de la main courante',
      description: 'Fixer la main courante au sommet des poteaux. Sa hauteur doit être entre 80 et 96,5 cm mesurée verticalement depuis le sol ou le nez de marche (CCQ 9.8.7.4). Elle doit dépasser de chaque côté en haut d\'un escalier.',
      dimensionsCles: [
        { label: 'Longueur main courante', valeur: `${longueurMainCourante} cm` },
        { label: 'Hauteur min–max', valeur: '80–96,5 cm (CCQ 9.8.7.4)' },
      ],
      obligatoireSelonNormes: true,
    },
    {
      numero: 6,
      titre: 'Vérification finale',
      description: 'Tester la solidité de chaque poteau. Vérifier toutes les hauteurs avec un ruban à mesurer. Appliquer une finition (peinture, lasure, galvanisation) si requis pour protéger contre la corrosion.',
      dimensionsCles: [
        { label: 'Hauteur garde-corps', valeur: `≥ ${hauteurGardeCorpsRequise} cm` },
        { label: 'Espacement barreaux', valeur: `≤ 10 cm` },
      ],
      obligatoireSelonNormes: false,
    },
  ];

  return etapes;
}
