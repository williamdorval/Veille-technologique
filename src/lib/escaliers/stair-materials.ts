// stair-materials.ts — Calcul des matériaux
// Prix approximatifs 2025, relevés dans les quincailleries québécoises (Canac, Rona, BMR).
// Ces prix varient selon la région, la qualité et les promotions.
import { PieceMateriaux, EstimationProjet, MateriauLimon, TypeMarche } from './stair-types';
import { DEFAULT_STAIR_RULES as R } from './stair-rules';

// ─── Prix indicatifs 2025 (CAD, taxes non incluses) ──────────────────────────
// Limons : $/m linéaire (planche 2×10 ou profil selon matériau)
const PRIX_LIMON_PAR_M: Record<MateriauLimon, number> = {
  epinette:   8.00,   // 2×10 épinette-pin-sapin, ~28$ / 10 pi chez Canac
  bois_franc: 16.00,  // limon bois franc fini, ~55$ / 10 pi chez spécialiste
  acier:      25.00,  // profil C acier galvanisé, ~85$ / 10 pi
  composite:  28.00,  // composite PVC/bois, ~95$ / 10 pi
};

// Marches : $/m² de surface de marche
const PRIX_MARCHE_PAR_M2: Record<TypeMarche, number> = {
  epinette:    42.00,  // 2×12 épinette, ~35$ / feuille 4×8 = 42$/m²
  bois_traite: 55.00,  // 2×10 traité ACQ, ~28$ / 10 pi
  bois_franc:  98.00,  // marche chêne ou érable finie, ~85$ / marche standard
  contrepalque: 22.00, // contreplaqué 3/4", ~75$ / feuille 4×8 pi
  composite:   85.00,  // composite antidérapant, ~75$ / marche standard
};

// Contremarches : $/m² (panneaux de recouvrement vertical)
const PRIX_CONTREMARCHE_PAR_M2: Record<TypeMarche, number> = {
  epinette:    35.00,
  bois_traite: 38.00,
  bois_franc:  75.00,
  contrepalque: 18.00,
  composite:   60.00,
};

// Quincaillerie
const PRIX_QUINCAILLERIE = {
  vis_boite:        28.00,  // boîte 100 vis inox 3", ~28$ chez Rona
  support_ancrage:  10.50,  // support d'ancrage pour limon, ~10.50$ / paire chez Canac
  espaceur:          3.50,  // espaceur entretoise, ~3.50$ chez BMR
};

// Taux horaire charpentier (estimation 2025, Québec)
const TAUX_HORAIRE_MIN = 55;
const TAUX_HORAIRE_MAX = 75;

export function calculerMateriaux(
  dim: { nombreMarches: number; hauteurContremarche: number; giron: number; longueurLimon: number },
  entree: { largeur: number; materiauLimon: MateriauLimon; typeMarche: TypeMarche; contremargesFermees: boolean }
): PieceMateriaux[] {
  const pieces: PieceMateriaux[] = [];
  const jeuLimon = 150; // mm marge pour ancrages

  // ─── Limons (2 pièces) ───────────────────────────────────────────────────
  const longueurLimonMm = Math.round(dim.longueurLimon + jeuLimon);
  const longueurLimonM = longueurLimonMm / 1000;
  const prixLimon = PRIX_LIMON_PAR_M[entree.materiauLimon] * longueurLimonM;

  pieces.push({
    nom: 'Limon',
    quantite: 2,
    longueur: longueurLimonMm,
    largeur: entree.materiauLimon === 'acier' ? null : 235,
    hauteur: entree.materiauLimon === 'acier' ? null : 38,
    unite: 'mm',
    materiau: entree.materiauLimon,
    prixUnitaireIndicatif: Math.round(prixLimon * 100) / 100,
  });

  // ─── Marches ──────────────────────────────────────────────────────────────
  const nosing = R.defaultNoseProjectionMm;
  const profondeurMm = dim.giron + nosing;
  const largeurM = entree.largeur / 1000;
  const profondeurM = profondeurMm / 1000;

  let prixMarche: number;
  if (entree.typeMarche === 'contrepalque') {
    // Contreplaqué : calculé par feuille 4×8 pi (1219×2438 mm)
    const feuille_m2 = 1.219 * 2.438;
    const m2_par_marche = largeurM * profondeurM;
    const feuilles = Math.ceil((dim.nombreMarches * m2_par_marche * 1.1) / feuille_m2);
    prixMarche = (feuilles * 75.00) / dim.nombreMarches; // 75$ / feuille 3/4"
  } else {
    prixMarche = PRIX_MARCHE_PAR_M2[entree.typeMarche] * largeurM * profondeurM;
  }

  pieces.push({
    nom: 'Marche',
    quantite: dim.nombreMarches,
    longueur: entree.largeur,
    largeur: profondeurMm,
    hauteur: 38,
    unite: 'mm',
    materiau: entree.typeMarche,
    prixUnitaireIndicatif: Math.round(prixMarche * 100) / 100,
  });

  // ─── Contremarches (si escalier fermé) ───────────────────────────────────
  if (entree.contremargesFermees) {
    const hautM = dim.hauteurContremarche / 1000;
    const prixCM = PRIX_CONTREMARCHE_PAR_M2[entree.typeMarche] * largeurM * hautM;
    pieces.push({
      nom: 'Contremarche',
      quantite: dim.nombreMarches,
      longueur: entree.largeur,
      largeur: Math.round(dim.hauteurContremarche),
      hauteur: 19,
      unite: 'mm',
      materiau: entree.typeMarche,
      prixUnitaireIndicatif: Math.round(prixCM * 100) / 100,
    });
  }

  // ─── Quincaillerie ────────────────────────────────────────────────────────
  pieces.push({ nom: 'Supports d\'ancrage', quantite: 4, longueur: 0, largeur: null, hauteur: null, unite: 'unité', materiau: 'acier galvanisé', prixUnitaireIndicatif: PRIX_QUINCAILLERIE.support_ancrage });
  pieces.push({ nom: 'Espaceurs de limon', quantite: dim.nombreMarches, longueur: 0, largeur: null, hauteur: null, unite: 'unité', materiau: 'bois ou métal', prixUnitaireIndicatif: PRIX_QUINCAILLERIE.espaceur });

  const nbVis = dim.nombreMarches * (entree.contremargesFermees ? 8 : 4);
  pieces.push({ nom: 'Vis inox 3" (boîte 100)', quantite: Math.ceil(nbVis / 100), longueur: 0, largeur: null, hauteur: null, unite: 'boîte', materiau: 'inox', prixUnitaireIndicatif: PRIX_QUINCAILLERIE.vis_boite });

  return pieces;
}

export function calculerEstimation(
  dim: { nombreMarches: number },
  materiaux: PieceMateriaux[],
  entree: { typeMarche: string }
): EstimationProjet {
  // Temps : base 5h + temps par marche selon matériau
  const tpp: Record<string, number> = {
    epinette: 25/60, bois_traite: 25/60, bois_franc: 40/60,
    contrepalque: 25/60, composite: 30/60, acier: 50/60,
  };
  const tempsH = Math.round((5 + dim.nombreMarches * (tpp[entree.typeMarche] ?? 25/60)) * 2) / 2;

  const coutMateriaux = materiaux.reduce((s, p) => s + p.quantite * p.prixUnitaireIndicatif, 0);
  const mainOeuvreMin = tempsH * TAUX_HORAIRE_MIN;
  const mainOeuvreMax = tempsH * TAUX_HORAIRE_MAX;

  return {
    tempsHeures: tempsH,
    coutMin: Math.round((coutMateriaux + mainOeuvreMin) * 0.9),
    coutMax: Math.round((coutMateriaux + mainOeuvreMax) * 1.15),
    avertissementPrix:
      'Prix indicatifs relevés en 2025 dans les quincailleries québécoises (Canac, Rona, BMR). ' +
      'Ces estimations n\'incluent pas les taxes (TPS + TVQ = 14,975 %). ' +
      'Les prix varient selon la région, la qualité et les promotions. ' +
      'Obtenir des soumissions avant d\'acheter.',
  };
}

export const TAUX_HORAIRE = { min: TAUX_HORAIRE_MIN, max: TAUX_HORAIRE_MAX };
