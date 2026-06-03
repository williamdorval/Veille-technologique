// stair-pit.ts — Calcul du puits d'escalier (exercice 5 émoicq)
// Formule : longueurPuits = ((echappee + epaisseurPlafond) × giron) / contremarche + (nez + 50)
// Exemple exercice 5 : ((1950+275)×251)/193 + 50 = 2943 mm
import { PitResult } from './stair-types';
export interface PitInput {
  headroomMm: number; ceilingThicknessMm: number;
  treadDepthMm: number; riserHeightMm: number;
  noseProjectionMm?: number;
}
export function calculateStairPit(input: PitInput): PitResult {
  const { headroomMm, ceilingThicknessMm, treadDepthMm, riserHeightMm } = input;
  const nose = input.noseProjectionMm ?? 50;
  if (riserHeightMm <= 0 || treadDepthMm <= 0) {
    return { pitLengthMm: 0, pitLengthMmRounded: 0, criticalStep: 0, criticalPositionMm: 0, formula: '', message: 'Valeurs invalides.' };
  }
  const pitLengthMm = ((headroomMm + ceilingThicknessMm) * treadDepthMm) / riserHeightMm + nose;
  const pitLengthMmRounded = Math.round(pitLengthMm);
  // Marche critique par itération
  let criticalStep = 0;
  let criticalPositionMm = 0;
  for (let i = 1; i <= 40; i++) {
    const clearance = ceilingThicknessMm + headroomMm - (i - 1) * riserHeightMm;
    if (clearance < headroomMm && criticalStep === 0) {
      criticalStep = i;
      criticalPositionMm = Math.round(i * treadDepthMm);
    }
  }
  const formula = `((${Math.round(headroomMm)} + ${Math.round(ceilingThicknessMm)}) × ${Math.round(treadDepthMm)}) / ${Math.round(riserHeightMm)} + ${nose} = ${pitLengthMmRounded} mm`;
  return { pitLengthMm, pitLengthMmRounded, criticalStep, criticalPositionMm, formula,
    message: `Longueur minimale du puits : ${pitLengthMmRounded} mm. Formule : ${formula}` };
}
