// types.ts — Types TypeScript pour le calculateur d'escaliers
// Aucune valeur de norme ici — toutes dans normes.ts

export type UniteMesure = 'cm' | 'pouces';
export type TypeUsage = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
export type MateriauLimon = 'epinette' | 'bois_franc' | 'acier' | 'composite';
export type TypeMarche = 'bois_traite' | 'epinette' | 'bois_franc' | 'contrepalque' | 'composite';
export type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

export interface EntreeFormulaire {
  hauteurTotale: number;        // toujours en cm (converti si pouces saisis)
  hauteurTotaleSaisie: number;  // valeur brute saisie par l'utilisateur
  uniteMesure: UniteMesure;
  largeur: number;              // cm
  hauteurPlafond: number;       // cm
  typeUsage: TypeUsage;
  contremargesFermees: boolean;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
}

export interface IndicateurConformite {
  nom: string;
  valeur: number;
  unite: string;
  statut: StatutConformite;
  messageStatut: string;
  plageMin: number;
  plageMax: number | null;
  articleCCQ: string;
  sourceURL: string;
}

export interface ConformiteResultat {
  contremarche: IndicateurConformite;
  giron: IndicateurConformite;
  blondel: IndicateurConformite;
  degagementTete: IndicateurConformite;
  largeur: IndicateurConformite;
}

export interface DimensionsEscalier {
  nombreMarches: number;
  hauteurContremarche: number;  // cm, arrondi 1 décimale
  giron: number;                // cm, arrondi 1 décimale
  longueurAuSol: number;        // cm
  longueurLimon: number;        // cm, arrondi 1 décimale
  angleDegres: number;          // degrés, arrondi 1 décimale
  blondel: number;              // 2H + G en cm
}

export interface PieceMateriaux {
  nom: string;
  quantite: number;
  longueur: number;             // cm
  largeur: number | null;       // cm
  hauteur: number | null;       // cm
  unite: string;
  materiau: string;
  prixUnitaireIndicatif: number; // CAD/unité
}

export interface EtapeConstruction {
  numero: number;
  titre: string;
  description: string;
  dimensionsCles: { label: string; valeur: string }[];
  obligatoireSelonNormes: boolean;
}

export interface EstimationProjet {
  tempsHeures: number;         // arrondi à 0.5h
  coutMin: number;             // CAD
  coutMax: number;             // CAD
  avertissementPrix: string;   // message obligatoire à afficher
}

export interface ResultatCalcul {
  // Dimensions
  nombreMarches: number;
  hauteurContremarche: number;
  giron: number;
  longueurAuSol: number;
  longueurLimon: number;
  angleDegres: number;
  blondel: number;

  // Conformité
  conformite: ConformiteResultat;

  // Matériaux
  materiaux: PieceMateriaux[];

  // Construction
  etapesConstruction: EtapeConstruction[];

  // Estimation
  estimation: EstimationProjet;

  // Méta
  estConforme: boolean;         // true si tous les indicateurs sont verts
  nbAvertissements: number;     // nombre d'indicateurs orange
  nbErreurs: number;            // nombre d'indicateurs rouges
}

export interface ErreurCalcul {
  code: string;
  message: string;              // en français, lisible par l'utilisateur
  champ?: string;               // champ du formulaire concerné
}

export type ResultatOuErreur =
  | { succes: true; resultat: ResultatCalcul }
  | { succes: false; erreur: ErreurCalcul };

// Schéma zod est dans FormulaireEscalier.tsx (client component)
// Les valeurs min/max utilisées dans le schéma viennent de normes.ts
