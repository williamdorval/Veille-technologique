// types.ts — Types TypeScript pour le calculateur de rampes et garde-corps
// Aucune valeur de norme ici — toutes dans normes.ts

export type TypeUsageRampe = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
export type MateriauRampe = 'bois' | 'metal' | 'verre' | 'cable';
export type TypeInstallation = 'escalier' | 'balcon' | 'terrasse';
export type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

export interface EntreesRampe {
  longueurRampe: number;       // mm
  hauteurChute: number;        // mm
  typeUsage: TypeUsageRampe;
  materiau: MateriauRampe;
  typeInstallation: TypeInstallation;
}

export interface IndicateurConformiteRampe {
  conforme: boolean;
  statut: StatutConformite;
  valeurCalculee: number;
  valeurLimite: number;
  unite: string;
  article: string;
  source: string;
  messageStatut: string;
}

export interface ConformiteRampe {
  hauteurGardeCorps: IndicateurConformiteRampe;
  espacementBarreaux: IndicateurConformiteRampe;
  hauteurMainCourante: IndicateurConformiteRampe;
}

export interface ResultatsRampe {
  hauteurGardeCorpsRequise: number;   // mm
  hauteurMainCouranteMin: number;     // mm
  hauteurMainCouranteMax: number;     // mm
  espacementBarreaux: number;         // mm (valeur calculée, ≤ 100 mm)
  nombrePoteaux: number;
  nombreBarreaux: number;
  longueurMainCourante: number;       // mm (inclut dépassements)
  conformite: ConformiteRampe;
  estConforme: boolean;
  nbErreurs: number;
  nbAvertissements: number;
}

export interface PieceMateriaux {
  nom: string;
  quantite: number;
  longueur: number;      // mm
  unite: string;
  materiau: string;
  noteIndicative?: string;
}

export interface EtapePose {
  numero: number;
  titre: string;
  description: string;
  dimensionsCles: { label: string; valeur: string }[];
  obligatoireSelonNormes: boolean;
}

export interface ErreurCalculRampe {
  code: string;
  message: string;
  champ?: string;
}

export type ResultatOuErreur =
  | { succes: true; resultat: ResultatsRampe }
  | { succes: false; erreur: ErreurCalculRampe };
