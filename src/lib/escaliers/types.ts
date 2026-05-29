// types.ts — Types TypeScript pour le calculateur d'escaliers (professionnel)
// Unité interne : millimètres (mm)

import { UnitDisplay } from './unit-converter';

// ─── Modes de calcul ──────────────────────────────────────────────────────────

export type StairMode = 'unlimited_run' | 'limited_run';
export type TypeUsage = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
export type MateriauLimon = 'epinette' | 'bois_franc' | 'acier' | 'composite';
export type TypeMarche = 'bois_traite' | 'epinette' | 'bois_franc' | 'contrepalque' | 'composite';
export type QualityStatus = 'excellent' | 'acceptable' | 'limite' | 'non_conforme' | 'impossible';

// ─── Entrée formulaire ────────────────────────────────────────────────────────

export interface StairInput {
  mode: StairMode;
  totalHeightMm: number;              // hauteur totale à monter
  availableRunMm?: number;            // course disponible (mode limité seulement)
  ceilingThicknessMm: number;         // épaisseur plafond/chevêtre (pour puits)
  stairWidthMm: number;               // largeur/emmarchement
  headroomMm: number;                 // échappée souhaitée (défaut 1950)
  typeUsage: TypeUsage;
  closedRisers: boolean;              // avec contremarches fermées
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
  upperFloorActsAsLastStep: boolean;  // plancher supérieur = dernière marche
  unit: UnitDisplay;                  // unité d'affichage choisie par l'utilisateur
}

// ─── Option de configuration (une combinaison riser count) ───────────────────

export interface BlondelCheck {
  ratio1: number;           // G + H
  ratio1Ok: boolean;        // entre 430-460
  ratio2: number;           // G + 2H
  ratio2Ok: boolean;        // entre 610-635
  ratio3: number;           // G × H
  ratio3Ok: boolean;        // entre 45000-48500
  passedCount: number;      // 0, 1, 2 ou 3
}

export interface StairOption {
  riserCount: number;           // nombre de contremarches
  stepCount: number;            // nombre de marches (riserCount - 1 si plancher = dernière)
  riserHeightMm: number;        // hauteur contremarche
  treadDepthMm: number;         // giron
  totalRunMm: number;           // course totale
  stringerLengthMm: number;     // longueur du limon
  angleDeg: number;             // angle en degrés
  stepRuleMm: number;           // pas de foulée (2H + G)
  blondel: BlondelCheck;        // vérification 3 rapports Blondel-Maximum
  score: number;                // 0-100
  status: QualityStatus;
  errors: string[];
  warnings: string[];
}

// ─── Résultats du calcul du crochet ──────────────────────────────────────────

export interface HookResult {
  availableRunMm: number;
  totalRunMm: number;
  spaceLeftMm: number;          // positif = espace restant, négatif = manque
  hookFromAboveMm: number;      // (giron + nez) - épaisseur chevêtre
  hookCanCompensate: boolean;
  message: string;
}

// ─── Résultats du calcul du puits d'escalier ─────────────────────────────────

export interface PitResult {
  pitLengthMm: number;          // longueur du puits (formule officielle exercice 5)
  pitLengthMmRounded: number;
  criticalStep: number;         // numéro de la marche critique
  criticalPositionMm: number;   // position horizontale de la marche critique
  formula: string;              // formule appliquée (texte)
  message: string;
}

// ─── Résultat principal ───────────────────────────────────────────────────────

export interface StairResult {
  mode: StairMode;
  input: StairInput;
  recommended: StairOption;
  alternatives: StairOption[];    // 3-5 autres options, triées par score
  hookAdjustment?: HookResult;    // seulement en mode limité
  pit: PitResult;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// ─── Types legacy (matériaux + plan de construction) ─────────────────────────

export interface PieceMateriaux {
  nom: string;
  quantite: number;
  longueur: number;             // mm
  largeur: number | null;
  hauteur: number | null;
  unite: string;
  materiau: string;
  prixUnitaireIndicatif: number;
}

export interface EtapeConstruction {
  numero: number;
  titre: string;
  description: string;
  dimensionsCles: { label: string; valeur: string }[];
  obligatoireSelonNormes: boolean;
}

export interface EstimationProjet {
  tempsHeures: number;
  coutMin: number;
  coutMax: number;
  avertissementPrix: string;
}

// ─── Types legacy (compatibilité anciens composants UI) ──────────────────────
// Ces types seront retirés quand tous les composants auront migré vers StairInput/StairResult
export type UniteMesure = 'mm' | 'cm' | 'm' | 'po';
export type TypeUsageLegacy = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
export type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

export interface DimensionsEscalier {
  nombreMarches: number;
  hauteurContremarche: number;
  giron: number;
  longueurAuSol: number;
  longueurLimon: number;
  angleDegres: number;
  blondel: number;
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

export interface EntreeFormulaire {
  hauteurTotale: number;
  hauteurTotaleSaisie: number;
  uniteMesure: UniteMesure;
  largeur: number;
  hauteurPlafond: number;
  typeUsage: TypeUsageLegacy;
  contremargesFermees: boolean;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
}

export interface ResultatCalcul {
  nombreMarches: number;
  hauteurContremarche: number;
  giron: number;
  longueurAuSol: number;
  longueurLimon: number;
  angleDegres: number;
  blondel: number;
  conformite: ConformiteResultat;
  materiaux: PieceMateriaux[];
  etapesConstruction: EtapeConstruction[];
  estimation: EstimationProjet;
  estConforme: boolean;
  nbAvertissements: number;
  nbErreurs: number;
}

export interface ErreurCalcul {
  code: string;
  message: string;
  champ?: string;
}

export type ResultatOuErreur =
  | { succes: true; resultat: ResultatCalcul }
  | { succes: false; erreur: ErreurCalcul };
