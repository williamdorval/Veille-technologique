// materiaux.ts — Calcul des matériaux et estimation de coût
// Utilise UNIQUEMENT les constantes de normes.ts

import {
  DimensionsEscalier,
  EntreeFormulaire,
  PieceMateriaux,
  EstimationProjet,
} from './types';
import { NORMES_CCQ, PRIX_INDICATIFS_CAD } from './normes';

// ─── CALCUL DES MATÉRIAUX ────────────────────────────────────────────────────

export function calculerMateriaux(
  dim: DimensionsEscalier,
  entree: EntreeFormulaire
): PieceMateriaux[] {
  const pieces: PieceMateriaux[] = [];
  const jeuLimon = 150; // mm de jeu en plus pour les limons

  // ── Limons (2 pièces) ──────────────────────────────────────────────────────
  const longueurLimon = Math.round(dim.longueurLimon + jeuLimon);
  const prixLimon =
    PRIX_INDICATIFS_CAD.limon[entree.materiauLimon] *
    (longueurLimon / 1000);

  pieces.push({
    nom: 'Limon',
    quantite: 2,
    longueur: longueurLimon,
    largeur: entree.materiauLimon === 'acier' ? null : 235,
    hauteur: entree.materiauLimon === 'acier' ? null : 38,
    unite: 'mm',
    materiau: entree.materiauLimon,
    prixUnitaireIndicatif: Math.round(prixLimon * 100) / 100,
  });

  // ── Marches ────────────────────────────────────────────────────────────────
  const largeurMarche = entree.largeur;
  const profondeurMarche = dim.giron + NORMES_CCQ.NOSING_STANDARD_MM;

  let prixMarche: number;
  if (entree.typeMarche === 'contrepalque') {
    // Contreplaqué : calculé par feuille 4×8 pi = 1219×2438 mm
    const feuille_w = 1219;
    const feuille_h = 2438;
    const marchesParFeuille = Math.floor(feuille_w / largeurMarche) *
      Math.floor(feuille_h / profondeurMarche);
    const feuillesNecessaires = Math.ceil(dim.nombreMarches / Math.max(marchesParFeuille, 1));
    prixMarche = (feuillesNecessaires * PRIX_INDICATIFS_CAD.marche.contrepalque) / dim.nombreMarches;
  } else {
    prixMarche = PRIX_INDICATIFS_CAD.marche[entree.typeMarche] *
      (profondeurMarche / 1000);
  }

  pieces.push({
    nom: 'Marche',
    quantite: dim.nombreMarches,
    longueur: largeurMarche,
    largeur: profondeurMarche,
    hauteur: 38,
    unite: 'mm',
    materiau: entree.typeMarche,
    prixUnitaireIndicatif: Math.round(prixMarche * 100) / 100,
  });

  // ── Contremarches (si escalier fermé) ─────────────────────────────────────
  if (entree.contremargesFermees) {
    const prixContremarche =
      PRIX_INDICATIFS_CAD.marche[entree.typeMarche] *
      (dim.hauteurContremarche / 1000);

    pieces.push({
      nom: 'Contremarche',
      quantite: dim.nombreMarches,
      longueur: largeurMarche,
      largeur: Math.round(dim.hauteurContremarche),
      hauteur: 19,
      unite: 'mm',
      materiau: entree.typeMarche,
      prixUnitaireIndicatif: Math.round(prixContremarche * 100) / 100,
    });
  }

  // ── Supports d'ancrage (2 haut + 2 bas) ───────────────────────────────────
  pieces.push({
    nom: 'Support d\'ancrage',
    quantite: 4,
    longueur: 0,
    largeur: null,
    hauteur: null,
    unite: 'unité',
    materiau: 'acier galvanisé',
    prixUnitaireIndicatif: PRIX_INDICATIFS_CAD.quincaillerie.support_ancrage,
  });

  // ── Espaceurs entre limons ─────────────────────────────────────────────────
  pieces.push({
    nom: 'Espaceur de limon',
    quantite: dim.nombreMarches,
    longueur: 0,
    largeur: null,
    hauteur: null,
    unite: 'unité',
    materiau: 'bois ou métal',
    prixUnitaireIndicatif: PRIX_INDICATIFS_CAD.quincaillerie.espaceur,
  });

  // ── Vis / fixations ───────────────────────────────────────────────────────
  const nbVis = dim.nombreMarches * (entree.contremargesFermees ? 8 : 4);
  const nbBoites = Math.ceil(nbVis / 100);
  pieces.push({
    nom: 'Vis inox (boîte de 100)',
    quantite: nbBoites,
    longueur: 0,
    largeur: null,
    hauteur: null,
    unite: 'boîte',
    materiau: 'inox',
    prixUnitaireIndicatif: PRIX_INDICATIFS_CAD.quincaillerie.vis_boite,
  });

  return pieces;
}

// ─── ESTIMATION DU PROJET ────────────────────────────────────────────────────

export function calculerEstimation(
  dim: DimensionsEscalier,
  materiaux: PieceMateriaux[],
  entree: EntreeFormulaire
): EstimationProjet {
  // Temps de construction
  const tempsBaseH = 5; // traçage limons + ancrage + finition
  const tempsParMarcheMap: Record<string, number> = {
    epinette: 20 / 60,
    bois_traite: 20 / 60,
    bois_franc: 30 / 60,
    contrepalque: 20 / 60,
    composite: 25 / 60,
    acier: 45 / 60,
  };
  const tempsParMarche = tempsParMarcheMap[entree.typeMarche] ?? 20 / 60;
  const tempsBrut = tempsBaseH + dim.nombreMarches * tempsParMarche;
  // Arrondir à 0.5h
  const tempsHeures = Math.round(tempsBrut * 2) / 2;

  // Coût des matériaux
  let coutMateriaux = 0;
  for (const piece of materiaux) {
    coutMateriaux += piece.quantite * piece.prixUnitaireIndicatif;
  }

  // Fourchette ±20%
  const coutMin = Math.round(coutMateriaux * 0.8);
  const coutMax = Math.round(coutMateriaux * 1.2);

  return {
    tempsHeures,
    coutMin,
    coutMax,
    avertissementPrix:
      'Ces estimations sont indicatives (prix moyens québécois 2025). ' +
      'Les prix varient selon les fournisseurs et la région. ' +
      'Obtenez des soumissions avant d\'acheter.',
  };
}
