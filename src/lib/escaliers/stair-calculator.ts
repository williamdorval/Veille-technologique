// stair-calculator.ts — Fonctions de calcul de base (exercice 1 émoicq) — tout en mm
import { StairRules } from './stair-rules';
export function calculateRiserHeight(totalHeightMm: number, riserCount: number): number {
  return totalHeightMm / riserCount;
}
export function calculateStepCount(riserCount: number, upperFloorActsAsLastStep: boolean): number {
  return upperFloorActsAsLastStep ? riserCount - 1 : riserCount;
}
export function calculateTotalRun(stepCount: number, treadDepthMm: number): number {
  return stepCount * treadDepthMm;
}
export function calculateStairAngle(totalHeightMm: number, totalRunMm: number): number {
  if (totalRunMm <= 0) return 90;
  return (Math.atan(totalHeightMm / totalRunMm) * 180) / Math.PI;
}
export function calculateStringerLength(totalHeightMm: number, totalRunMm: number): number {
  return Math.sqrt(totalHeightMm ** 2 + totalRunMm ** 2);
}
export function calculatePossibleRiserRange(totalHeightMm: number, rules: StairRules) {
  return {
    min: Math.ceil(totalHeightMm / rules.maxRiserHeightMm),
    max: Math.floor(totalHeightMm / rules.minRiserHeightMm),
  };
}
export function roundTo(value: number, decimals: number): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
