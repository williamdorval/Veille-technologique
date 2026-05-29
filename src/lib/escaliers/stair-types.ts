// stair-types.ts — Types TypeScript pour le calculateur d'escaliers professionnel
// Unité interne : millimètres (mm)
import { UnitDisplay } from './unit-converter';
export type StairMode = 'unlimited_run' | 'limited_run';
export type TypeUsage = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
export type MateriauLimon = 'epinette' | 'bois_franc' | 'acier' | 'composite';
export type TypeMarche = 'bois_traite' | 'epinette' | 'bois_franc' | 'contrepalque' | 'composite';
export type QualityStatus = 'excellent' | 'acceptable' | 'limite' | 'non_conforme' | 'impossible';
export interface StairInput {
  mode: StairMode;
  totalHeightMm: number;
  availableRunMm?: number;
  ceilingThicknessMm: number;
  stairWidthMm: number;
  headroomMm: number;
  typeUsage: TypeUsage;
  closedRisers: boolean;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
  upperFloorActsAsLastStep: boolean;
  unit: UnitDisplay;
}
export interface BlondelCheck {
  ratio1: number; ratio1Ok: boolean;
  ratio2: number; ratio2Ok: boolean;
  ratio3: number; ratio3Ok: boolean;
  passedCount: number;
}
export interface StairOption {
  riserCount: number; stepCount: number;
  riserHeightMm: number; treadDepthMm: number;
  totalRunMm: number; stringerLengthMm: number;
  angleDeg: number; stepRuleMm: number;
  blondel: BlondelCheck;
  score: number; status: QualityStatus;
  errors: string[]; warnings: string[];
}
export interface HookResult {
  availableRunMm: number; totalRunMm: number;
  spaceLeftMm: number; hookFromAboveMm: number;
  hookCanCompensate: boolean; message: string;
}
export interface PitResult {
  pitLengthMm: number; pitLengthMmRounded: number;
  criticalStep: number; criticalPositionMm: number;
  formula: string; message: string;
}
export interface StairResult {
  mode: StairMode; input: StairInput;
  recommended: StairOption; alternatives: StairOption[];
  hookAdjustment?: HookResult; pit: PitResult;
  errors: string[]; warnings: string[]; recommendations: string[];
}
export interface PieceMateriaux {
  nom: string; quantite: number;
  longueur: number; largeur: number | null; hauteur: number | null;
  unite: string; materiau: string; prixUnitaireIndicatif: number;
}
export interface EtapeConstruction {
  numero: number; titre: string; description: string;
  dimensionsCles: { label: string; valeur: string }[];
  obligatoireSelonNormes: boolean;
}
export interface EstimationProjet {
  tempsHeures: number; coutMin: number; coutMax: number; avertissementPrix: string;
}
