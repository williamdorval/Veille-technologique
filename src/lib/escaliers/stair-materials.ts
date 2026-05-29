// stair-materials.ts — Calcul des matériaux (adapté, valeurs en mm)
import { PieceMateriaux, EstimationProjet, MateriauLimon, TypeMarche } from './stair-types';
import { DEFAULT_STAIR_RULES as R } from './stair-rules';
const PRIX: Record<string, Record<string, number>> = {
  limon: { epinette: 3.50, bois_franc: 8.00, acier: 12.00, composite: 15.00 },
  marche: { bois_traite: 4.50, epinette: 3.00, bois_franc: 7.50, contrepalque: 45.00, composite: 15.00 },
  quincaillerie: { vis_boite: 25.00, support_ancrage: 8.00, espaceur: 3.00 },
};
export function calculerMateriaux(
  dim: { nombreMarches: number; hauteurContremarche: number; giron: number; longueurLimon: number },
  entree: { largeur: number; materiauLimon: MateriauLimon; typeMarche: TypeMarche; contremargesFermees: boolean }
): PieceMateriaux[] {
  const pieces: PieceMateriaux[] = [];
  const jeuLimon = 150; // mm
  const longueurLimon = Math.round(dim.longueurLimon + jeuLimon);
  const prixLimon = (PRIX.limon[entree.materiauLimon] ?? 3.50) * (longueurLimon / 1000);
  pieces.push({ nom: 'Limon', quantite: 2, longueur: longueurLimon, largeur: entree.materiauLimon === 'acier' ? null : 235, hauteur: entree.materiauLimon === 'acier' ? null : 38, unite: 'mm', materiau: entree.materiauLimon, prixUnitaireIndicatif: Math.round(prixLimon * 100) / 100 });
  const nosing = R.defaultNoseProjectionMm;
  const profondeurMarche = dim.giron + nosing;
  let prixMarche: number;
  if (entree.typeMarche === 'contrepalque') {
    const fw = 1219; const fh = 2438;
    const mpp = Math.floor(fw / entree.largeur) * Math.floor(fh / profondeurMarche);
    const feuilles = Math.ceil(dim.nombreMarches / Math.max(mpp, 1));
    prixMarche = (feuilles * PRIX.marche.contrepalque) / dim.nombreMarches;
  } else {
    prixMarche = (PRIX.marche[entree.typeMarche] ?? 3.00) * (profondeurMarche / 1000);
  }
  pieces.push({ nom: 'Marche', quantite: dim.nombreMarches, longueur: entree.largeur, largeur: profondeurMarche, hauteur: 38, unite: 'mm', materiau: entree.typeMarche, prixUnitaireIndicatif: Math.round(prixMarche * 100) / 100 });
  if (entree.contremargesFermees) {
    const prixCM = (PRIX.marche[entree.typeMarche] ?? 3.00) * (dim.hauteurContremarche / 1000);
    pieces.push({ nom: 'Contremarche', quantite: dim.nombreMarches, longueur: entree.largeur, largeur: Math.round(dim.hauteurContremarche), hauteur: 19, unite: 'mm', materiau: entree.typeMarche, prixUnitaireIndicatif: Math.round(prixCM * 100) / 100 });
  }
  pieces.push({ nom: 'Support ancrage', quantite: 4, longueur: 0, largeur: null, hauteur: null, unite: 'unité', materiau: 'acier galvanisé', prixUnitaireIndicatif: PRIX.quincaillerie.support_ancrage });
  pieces.push({ nom: 'Espaceur de limon', quantite: dim.nombreMarches, longueur: 0, largeur: null, hauteur: null, unite: 'unité', materiau: 'bois ou métal', prixUnitaireIndicatif: PRIX.quincaillerie.espaceur });
  const nbVis = dim.nombreMarches * (entree.contremargesFermees ? 8 : 4);
  pieces.push({ nom: 'Vis inox (boîte 100)', quantite: Math.ceil(nbVis / 100), longueur: 0, largeur: null, hauteur: null, unite: 'boîte', materiau: 'inox', prixUnitaireIndicatif: PRIX.quincaillerie.vis_boite });
  return pieces;
}
export function calculerEstimation(dim: { nombreMarches: number }, materiaux: PieceMateriaux[], entree: { typeMarche: string }): EstimationProjet {
  const tpp: Record<string, number> = { epinette: 20/60, bois_traite: 20/60, bois_franc: 30/60, contrepalque: 20/60, composite: 25/60, acier: 45/60 };
  const temps = 5 + dim.nombreMarches * (tpp[entree.typeMarche] ?? 20/60);
  const cout = materiaux.reduce((s, p) => s + p.quantite * p.prixUnitaireIndicatif, 0);
  return { tempsHeures: Math.round(temps * 2) / 2, coutMin: Math.round(cout * 0.8), coutMax: Math.round(cout * 1.2), avertissementPrix: 'Estimations indicatives (prix moyens québécois 2025). Obtenez des soumissions avant d\'acheter.' };
}
