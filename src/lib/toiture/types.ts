// types.ts — Types TypeScript pour le calculateur de toiture

export type TypeToit = 'deux_versants' | 'croupe' | 'appentis';
export type TypeRevetement = 'bardeau_asphalte' | 'tole_acier' | 'membrane';
export type RegionQuebec =
  | 'montreal' | 'quebec_ville' | 'saguenay' | 'mauricie'
  | 'estrie' | 'outaouais' | 'abitibi' | 'cote_nord' | 'gaspesie';
export type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

export interface EntreesToiture {
  longueurBatiment: number;     // cm
  largeurBatiment: number;      // cm
  penteDegres: number;          // degrés
  typeToit: TypeToit;
  typeRevetement: TypeRevetement;
  region: RegionQuebec;
  debordToit: number;           // cm (surplomb)
}

export interface IndicateurConformiteToiture {
  conforme: boolean;
  statut: StatutConformite;
  valeurCalculee: number;
  valeurLimite: number;
  unite: string;
  article: string;
  messageStatut: string;
}

export interface ConformiteToiture {
  pente: IndicateurConformiteToiture;
}

export interface ResultatsToiture {
  surfaceHorizontale: number;       // m²
  surfaceDeveloppee: number;        // m²
  nombrePaquetsBardeaux?: number;   // pour bardeau asphalte
  surfaceMembraneM2?: number;       // pour membrane
  nombreChevrons: number;
  longueurChevrons: number;         // cm (développée)
  ventilationEntreeCm2: number;     // cm² (soffites)
  ventilationSortieCm2: number;     // cm² (faîtière)
  chargeNeige: number;              // kPa
  conformite: ConformiteToiture;
  estConforme: boolean;
  nbErreurs: number;
}

export interface ErreurCalculToiture {
  code: string;
  message: string;
}

export type ResultatOuErreur =
  | { succes: true; resultat: ResultatsToiture }
  | { succes: false; erreur: ErreurCalculToiture };
