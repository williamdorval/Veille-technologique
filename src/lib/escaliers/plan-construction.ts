// plan-construction.ts — Génération du plan de construction étape par étape

import {
  DimensionsEscalier,
  EntreeFormulaire,
  ConformiteResultat,
  EtapeConstruction,
} from './types';
import { NORMES_CCQ } from './normes';

export function genererPlanConstruction(
  dim: DimensionsEscalier,
  entree: EntreeFormulaire,
  conformite: ConformiteResultat
): EtapeConstruction[] {
  void conformite; // utilisé pour les vérifications conditionnelles futures
  const etapes: EtapeConstruction[] = [];

  // ── Étape 1 : Préparer et tracer les limons ────────────────────────────────
  etapes.push({
    numero: 1,
    titre: 'Préparer et tracer les limons',
    description:
      `Couper les deux limons à ${Math.round(dim.longueurLimon + 15)} cm. ` +
      `Tracer les ${dim.nombreMarches} encoches avec un gabarit d'escalier : ` +
      `hauteur ${dim.hauteurContremarche} cm et giron ${dim.giron} cm par marche.`,
    dimensionsCles: [
      { label: 'Longueur du limon', valeur: `${Math.round(dim.longueurLimon + 15)} cm` },
      { label: 'Hauteur de contremarche', valeur: `${dim.hauteurContremarche} cm` },
      { label: 'Giron', valeur: `${dim.giron} cm` },
      { label: 'Angle', valeur: `${dim.angleDegres}°` },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 2 : Poser les supports d'ancrage ─────────────────────────────────
  etapes.push({
    numero: 2,
    titre: 'Installer les supports d\'ancrage',
    description:
      'Fixer 2 supports au bas (sur le plancher ou la dalle) et 2 supports en haut ' +
      '(sur le plancher ou la charpente). Vérifier l\'aplomb et le niveau avant de fixer définitivement.',
    dimensionsCles: [
      { label: 'Longueur totale au sol', valeur: `${dim.longueurAuSol} cm` },
      { label: 'Largeur de l\'escalier', valeur: `${entree.largeur} cm` },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 3 : Installer les limons ────────────────────────────────────────
  etapes.push({
    numero: 3,
    titre: 'Installer les limons',
    description:
      `Poser les deux limons en parallèle, à ${entree.largeur} cm d'écartement (entre faces intérieures). ` +
      'Fixer aux supports d\'ancrage. Vérifier que les deux limons sont parfaitement parallèles.',
    dimensionsCles: [
      { label: 'Écartement intérieur', valeur: `${entree.largeur} cm` },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 4 : Fixer les contremarches (si escalier fermé) ─────────────────
  if (entree.contremargesFermees) {
    etapes.push({
      numero: 4,
      titre: 'Fixer les contremarches',
      description:
        `Couper ${dim.nombreMarches} contremarches à ${entree.largeur} cm de largeur et ` +
        `${Math.round(dim.hauteurContremarche)} cm de hauteur (1.9 cm d'épaisseur). ` +
        'Les fixer dans les encoches des limons. Commencer par le bas.',
      dimensionsCles: [
        { label: 'Hauteur de contremarche', valeur: `${Math.round(dim.hauteurContremarche)} cm` },
        { label: 'Largeur', valeur: `${entree.largeur} cm` },
        { label: 'Épaisseur', valeur: '1.9 cm' },
      ],
      obligatoireSelonNormes: false,
    });
  }

  // ── Étape 5 : Fixer les marches ───────────────────────────────────────────
  const numeroEtape = entree.contremargesFermees ? 5 : 4;
  etapes.push({
    numero: numeroEtape,
    titre: 'Fixer les marches',
    description:
      `Couper ${dim.nombreMarches} marches à ${entree.largeur} cm de largeur et ` +
      `${dim.giron + NORMES_CCQ.NOSING_STANDARD_CM} cm de profondeur (incluant le nez de marche de ${NORMES_CCQ.NOSING_STANDARD_CM} cm). ` +
      'Fixer chaque marche avec 4 vis minimum (2 de chaque côté). Commencer par le bas.',
    dimensionsCles: [
      { label: 'Profondeur de marche (avec nez)', valeur: `${dim.giron + NORMES_CCQ.NOSING_STANDARD_CM} cm` },
      { label: 'Largeur', valeur: `${entree.largeur} cm` },
      { label: 'Épaisseur', valeur: '3.8 cm' },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 6 : Main courante (si obligatoire) ──────────────────────────────
  const mainCouranteObligatoire =
    dim.nombreMarches >= NORMES_CCQ.MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES;
  const doubleMainCourante = entree.largeur >= NORMES_CCQ.MAIN_COURANTE_DOUBLE_LARGEUR_CM;

  if (mainCouranteObligatoire) {
    const numeroMC = entree.contremargesFermees ? 6 : 5;
    etapes.push({
      numero: numeroMC,
      titre: `Installer la main courante${doubleMainCourante ? ' (deux côtés — OBLIGATOIRE)' : ''}`,
      description:
        `La main courante est OBLIGATOIRE (${dim.nombreMarches} marches ≥ ${NORMES_CCQ.MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES}). ` +
        `Hauteur : entre ${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MIN_CM} cm et ${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MAX_CM} cm, ` +
        `mesurée depuis le nez de la marche. Distance minimale du mur : ${NORMES_CCQ.MAIN_COURANTE_DISTANCE_MUR_MIN_CM} cm. ` +
        (doubleMainCourante ? `Largeur ≥ ${NORMES_CCQ.MAIN_COURANTE_DOUBLE_LARGEUR_CM} cm : main courante des DEUX côtés obligatoire. ` : ''),
      dimensionsCles: [
        { label: 'Hauteur min', valeur: `${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MIN_CM} cm` },
        { label: 'Hauteur max', valeur: `${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MAX_CM} cm` },
        { label: 'Distance du mur', valeur: `${NORMES_CCQ.MAIN_COURANTE_DISTANCE_MUR_MIN_CM} cm min` },
      ],
      obligatoireSelonNormes: true,
    });
  }

  // ── Étape 7 : Garde-corps (si hauteur > 60 cm) ────────────────────────────
  const gardeCorpsObligatoire =
    entree.hauteurTotale > NORMES_CCQ.GARDE_CORPS_OBLIGATOIRE_HAUTEUR_CM;

  if (gardeCorpsObligatoire) {
    const derniereEtape = etapes.length + 1;
    const hauteurMinGC =
      entree.hauteurTotale > 180
        ? NORMES_CCQ.GARDE_CORPS_HAUTEUR_MIN_ELEVE_CM
        : NORMES_CCQ.GARDE_CORPS_HAUTEUR_MIN_PRIVE_CM;

    etapes.push({
      numero: derniereEtape,
      titre: 'Installer le garde-corps (OBLIGATOIRE)',
      description:
        `Un garde-corps est OBLIGATOIRE : hauteur de chute ${Math.round(entree.hauteurTotale)} cm > ${NORMES_CCQ.GARDE_CORPS_OBLIGATOIRE_HAUTEUR_CM} cm. ` +
        `Hauteur minimale : ${hauteurMinGC} cm mesurée depuis le nez de la marche. ` +
        `Espacement maximal entre barreaux : ${NORMES_CCQ.GARDE_CORPS_BALUSTRE_MAX_CM} cm ` +
        '(aucune ouverture permettant le passage d\'une sphère de 10 cm).',
      dimensionsCles: [
        { label: 'Hauteur min garde-corps', valeur: `${hauteurMinGC} cm` },
        { label: 'Espacement max barreaux', valeur: `${NORMES_CCQ.GARDE_CORPS_BALUSTRE_MAX_CM} cm` },
      ],
      obligatoireSelonNormes: true,
    });
  }

  return etapes;
}
