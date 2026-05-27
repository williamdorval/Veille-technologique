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
      `Couper les deux limons à ${Math.round(dim.longueurLimon + 150)} mm. ` +
      `Tracer les ${dim.nombreMarches} encoches avec un gabarit d'escalier : ` +
      `hauteur ${dim.hauteurContremarche} mm et giron ${dim.giron} mm par marche.`,
    dimensionsCles: [
      { label: 'Longueur du limon', valeur: `${Math.round(dim.longueurLimon + 150)} mm` },
      { label: 'Hauteur de contremarche', valeur: `${dim.hauteurContremarche} mm` },
      { label: 'Giron', valeur: `${dim.giron} mm` },
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
      { label: 'Longueur totale au sol', valeur: `${dim.longueurAuSol} mm` },
      { label: 'Largeur de l\'escalier', valeur: `${entree.largeur} mm` },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 3 : Installer les limons ────────────────────────────────────────
  etapes.push({
    numero: 3,
    titre: 'Installer les limons',
    description:
      `Poser les deux limons en parallèle, à ${entree.largeur} mm d'écartement (entre faces intérieures). ` +
      'Fixer aux supports d\'ancrage. Vérifier que les deux limons sont parfaitement parallèles.',
    dimensionsCles: [
      { label: 'Écartement intérieur', valeur: `${entree.largeur} mm` },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 4 : Fixer les contremarches (si escalier fermé) ─────────────────
  if (entree.contremargesFermees) {
    etapes.push({
      numero: 4,
      titre: 'Fixer les contremarches',
      description:
        `Couper ${dim.nombreMarches} contremarches à ${entree.largeur} mm de largeur et ` +
        `${Math.round(dim.hauteurContremarche)} mm de hauteur (19 mm d'épaisseur). ` +
        'Les fixer dans les encoches des limons. Commencer par le bas.',
      dimensionsCles: [
        { label: 'Hauteur de contremarche', valeur: `${Math.round(dim.hauteurContremarche)} mm` },
        { label: 'Largeur', valeur: `${entree.largeur} mm` },
        { label: 'Épaisseur', valeur: '19 mm' },
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
      `Couper ${dim.nombreMarches} marches à ${entree.largeur} mm de largeur et ` +
      `${dim.giron + NORMES_CCQ.NOSING_STANDARD_MM} mm de profondeur (incluant le nez de marche de ${NORMES_CCQ.NOSING_STANDARD_MM} mm). ` +
      'Fixer chaque marche avec 4 vis minimum (2 de chaque côté). Commencer par le bas.',
    dimensionsCles: [
      { label: 'Profondeur de marche (avec nez)', valeur: `${dim.giron + NORMES_CCQ.NOSING_STANDARD_MM} mm` },
      { label: 'Largeur', valeur: `${entree.largeur} mm` },
      { label: 'Épaisseur', valeur: '38 mm' },
    ],
    obligatoireSelonNormes: false,
  });

  // ── Étape 6 : Main courante (si obligatoire) ──────────────────────────────
  const mainCouranteObligatoire =
    dim.nombreMarches >= NORMES_CCQ.MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES;
  const doubleMainCourante = entree.largeur >= NORMES_CCQ.MAIN_COURANTE_DOUBLE_LARGEUR_MM;

  if (mainCouranteObligatoire) {
    const numeroMC = entree.contremargesFermees ? 6 : 5;
    etapes.push({
      numero: numeroMC,
      titre: `Installer la main courante${doubleMainCourante ? ' (deux côtés — OBLIGATOIRE)' : ''}`,
      description:
        `La main courante est OBLIGATOIRE (${dim.nombreMarches} marches ≥ ${NORMES_CCQ.MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES}). ` +
        `Hauteur : entre ${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MIN_MM} mm et ${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MAX_MM} mm, ` +
        `mesurée depuis le nez de la marche. Distance minimale du mur : ${NORMES_CCQ.MAIN_COURANTE_DISTANCE_MUR_MIN_MM} mm. ` +
        (doubleMainCourante ? `Largeur ≥ ${NORMES_CCQ.MAIN_COURANTE_DOUBLE_LARGEUR_MM} mm : main courante des DEUX côtés obligatoire. ` : ''),
      dimensionsCles: [
        { label: 'Hauteur min', valeur: `${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MIN_MM} mm` },
        { label: 'Hauteur max', valeur: `${NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MAX_MM} mm` },
        { label: 'Distance du mur', valeur: `${NORMES_CCQ.MAIN_COURANTE_DISTANCE_MUR_MIN_MM} mm min` },
      ],
      obligatoireSelonNormes: true,
    });
  }

  // ── Étape 7 : Garde-corps (si hauteur > 600mm) ────────────────────────────
  const gardeCorpsObligatoire =
    entree.hauteurTotale > NORMES_CCQ.GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM;

  if (gardeCorpsObligatoire) {
    const derniereEtape = etapes.length + 1;
    const hauteurMinGC =
      entree.hauteurTotale > 1800
        ? NORMES_CCQ.GARDE_CORPS_HAUTEUR_MIN_ELEVE_MM
        : NORMES_CCQ.GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM;

    etapes.push({
      numero: derniereEtape,
      titre: 'Installer le garde-corps (OBLIGATOIRE)',
      description:
        `Un garde-corps est OBLIGATOIRE : hauteur de chute ${Math.round(entree.hauteurTotale)} mm > ${NORMES_CCQ.GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM} mm. ` +
        `Hauteur minimale : ${hauteurMinGC} mm mesurée depuis le nez de la marche. ` +
        `Espacement maximal entre barreaux : ${NORMES_CCQ.GARDE_CORPS_BALUSTRE_MAX_MM} mm ` +
        '(aucune ouverture permettant le passage d\'une sphère de 100 mm).',
      dimensionsCles: [
        { label: 'Hauteur min garde-corps', valeur: `${hauteurMinGC} mm` },
        { label: 'Espacement max barreaux', valeur: `${NORMES_CCQ.GARDE_CORPS_BALUSTRE_MAX_MM} mm` },
      ],
      obligatoireSelonNormes: true,
    });
  }

  return etapes;
}
