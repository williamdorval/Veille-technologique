// types.ts — Types TypeScript pour le calculateur de plancher
// Aucune valeur de norme ici — toutes dans normes.ts

export type DimensionSolive = '2x6' | '2x8' | '2x10' | '2x12';
export type EspacementSolive = 30 | 40 | 60;  // cm (≈ 12, 16, 24 pouces)
export type TypeUsagePlancher = 'chambre' | 'salon' | 'salleBain' | 'garage' | 'commercial';
export type TypeBois = 'SPF' | 'douglas' | 'LVL';
export type TypeSousPlancher = 'OSB' | 'contreplaque';
export type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

export interface EntreesPlancher {
  longueur: number;             // cm (portée de la solive)
  largeur: number;              // cm (largeur de la pièce)
  typeUsage: TypeUsagePlancher;
  typeBois: TypeBois;
  typeSousPlancher: TypeSousPlancher;
  presenceElementLourd: boolean; // baignoire, piano, etc.
}

export interface IndicateurConformitePlancher {
  conforme: boolean;
  statut: StatutConformite;
  valeurCalculee: number;
  valeurLimite: number;
  unite: string;
  article: string;
  messageStatut: string;
}

export interface ConformitePlancher {
  portee: IndicateurConformitePlancher;
  fleche: IndicateurConformitePlancher;
}

export interface ResultatsPlancher {
  dimensionSoliveRecommandee: DimensionSolive;
  espacementSolive: EspacementSolive;
  nombreSolives: number;
  longueurTotaleBoisM: number;        // mètres linéaires totaux
  quantitePanneaux: number;           // panneaux 4x8
  epaisseurSousPlancher: number;      // cm
  fleche: number;                     // cm à mi-portée (calculée)
  flecheMax: number;                  // cm admissible (L/360)
  chargeVive: number;                 // kPa
  conformite: ConformitePlancher;
  estConforme: boolean;
  nbErreurs: number;
  nbAvertissements: number;
}

export interface ErreurCalculPlancher {
  code: string;
  message: string;
}

export type ResultatOuErreur =
  | { succes: true; resultat: ResultatsPlancher }
  | { succes: false; erreur: ErreurCalculPlancher };
