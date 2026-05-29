// stair-construction-plan.ts — Plan de construction étape par étape (valeurs en mm)
import { EtapeConstruction } from './stair-types';
import { DEFAULT_STAIR_RULES as R } from './stair-rules';
export function genererPlanConstruction(
  dim: { nombreMarches: number; hauteurContremarche: number; giron: number; longueurLimon: number; angleDegres: number; longueurAuSol: number },
  entree: { largeur: number; contremargesFermees: boolean; typeMarche: string; hauteurTotale: number }
): EtapeConstruction[] {
  const etapes: EtapeConstruction[] = [];
  const nose = R.defaultNoseProjectionMm;
  const jeu = 150; // mm
  etapes.push({ numero: 1, titre: 'Préparer et tracer les limons', description: `Couper les deux limons à ${Math.round(dim.longueurLimon + jeu)} mm. Tracer les ${dim.nombreMarches} encoches avec un gabarit : hauteur ${Math.round(dim.hauteurContremarche)} mm et giron ${Math.round(dim.giron)} mm par marche.`, dimensionsCles: [{ label: 'Longueur du limon', valeur: `${Math.round(dim.longueurLimon + jeu)} mm` }, { label: 'Hauteur contremarche', valeur: `${Math.round(dim.hauteurContremarche)} mm` }, { label: 'Giron', valeur: `${Math.round(dim.giron)} mm` }, { label: 'Angle', valeur: `${dim.angleDegres}°` }], obligatoireSelonNormes: false });
  etapes.push({ numero: 2, titre: 'Installer les supports d\'ancrage', description: 'Fixer 2 supports au bas et 2 supports en haut. Vérifier l\'aplomb et le niveau.', dimensionsCles: [{ label: 'Course totale', valeur: `${Math.round(dim.longueurAuSol)} mm` }, { label: 'Largeur', valeur: `${entree.largeur} mm` }], obligatoireSelonNormes: false });
  etapes.push({ numero: 3, titre: 'Installer les limons', description: `Poser les deux limons à ${entree.largeur} mm d'écartement (faces intérieures). Fixer aux supports.`, dimensionsCles: [{ label: 'Écartement intérieur', valeur: `${entree.largeur} mm` }], obligatoireSelonNormes: false });
  let num = 4;
  if (entree.contremargesFermees) {
    etapes.push({ numero: num++, titre: 'Fixer les contremarches', description: `Couper ${dim.nombreMarches} contremarches à ${entree.largeur} mm de largeur et ${Math.round(dim.hauteurContremarche)} mm de hauteur (19 mm d'épaisseur). Fixer dans les encoches en commençant par le bas.`, dimensionsCles: [{ label: 'Hauteur contremarche', valeur: `${Math.round(dim.hauteurContremarche)} mm` }, { label: 'Épaisseur', valeur: '19 mm' }], obligatoireSelonNormes: false });
  }
  etapes.push({ numero: num++, titre: 'Fixer les marches', description: `Couper ${dim.nombreMarches} marches à ${entree.largeur} mm de largeur et ${Math.round(dim.giron + nose)} mm de profondeur (nez inclus). Fixer avec 4 vis min. par côté.`, dimensionsCles: [{ label: 'Profondeur (avec nez)', valeur: `${Math.round(dim.giron + nose)} mm` }, { label: 'Épaisseur', valeur: '38 mm' }], obligatoireSelonNormes: false });
  if (dim.nombreMarches >= R.mainCouranteObligatoireMinMarches) {
    const double = entree.largeur >= R.mainCouranteDoubleLargeurMm;
    etapes.push({ numero: num++, titre: `Installer la main courante${double ? ' (deux côtés — OBLIGATOIRE)' : ''}`, description: `Main courante OBLIGATOIRE (${dim.nombreMarches} marches). Hauteur : ${R.mainCouranteHauteurMinMm}-${R.mainCouranteHauteurMaxMm} mm depuis le nez de marche. Distance mur min : ${R.mainCouranteDistanceMurMinMm} mm.${double ? ` Largeur ≥ ${R.mainCouranteDoubleLargeurMm} mm : deux côtés obligatoires.` : ''}`, dimensionsCles: [{ label: 'Hauteur min', valeur: `${R.mainCouranteHauteurMinMm} mm` }, { label: 'Hauteur max', valeur: `${R.mainCouranteHauteurMaxMm} mm` }], obligatoireSelonNormes: true });
  }
  if (entree.hauteurTotale > R.gardeCorpsObligatoireHauteurMm) {
    const hGC = entree.hauteurTotale > 1800 ? R.gardeCorpsHauteurMinEleveMm : R.gardeCorpsHauteurMinPriveMm;
    etapes.push({ numero: num, titre: 'Installer le garde-corps (OBLIGATOIRE)', description: `Garde-corps OBLIGATOIRE : chute ${Math.round(entree.hauteurTotale)} mm > ${R.gardeCorpsObligatoireHauteurMm} mm. Hauteur min : ${hGC} mm. Espacement barreaux max : ${R.gardeCorpsBalustreMaxMm} mm.`, dimensionsCles: [{ label: 'Hauteur min', valeur: `${hGC} mm` }, { label: 'Espacement barreaux', valeur: `${R.gardeCorpsBalustreMaxMm} mm` }], obligatoireSelonNormes: true });
  }
  return etapes;
}
