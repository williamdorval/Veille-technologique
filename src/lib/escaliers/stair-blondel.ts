// stair-blondel.ts — Loi de Blondel et évaluation du pas de foulée (exercice 2 émoicq)
// Formule : 2H + G = idéalement 630 mm (plage idéale 610-635 mm, acceptable 600-650 mm)
import { StairRules } from './stair-rules';
export type BlondelStatus = 'excellent' | 'acceptable' | 'limite' | 'non_conforme';
export interface BlondelEvaluation {
  stepRuleMm: number;
  status: BlondelStatus;
  message: string;
  deviation: number;
}
export function calculateStepRule(riserHeightMm: number, treadDepthMm: number): number {
  return 2 * riserHeightMm + treadDepthMm;
}
export function evaluateStepRule(stepRuleMm: number, rules: StairRules): BlondelEvaluation {
  const deviation = stepRuleMm - rules.idealStepRule;
  const mm = Math.round(stepRuleMm);
  let status: BlondelStatus;
  let message: string;
  if (Math.abs(deviation) <= 5 || (stepRuleMm >= rules.idealStepRuleMin && stepRuleMm <= rules.idealStepRuleMax)) {
    status = 'excellent';
    message = `Pas de foulée excellent (${mm} mm, cible ${rules.idealStepRule} mm).`;
  } else if (stepRuleMm >= rules.minStepRuleMm && stepRuleMm <= rules.maxStepRuleMm) {
    status = 'acceptable';
    message = `Pas de foulée acceptable (${mm} mm). Plage idéale : ${rules.idealStepRuleMin}-${rules.idealStepRuleMax} mm.`;
  } else if (stepRuleMm >= 590 && stepRuleMm < rules.minStepRuleMm) {
    status = 'limite';
    message = `Pas de foulée limite (${mm} mm). Minimum de confort : ${rules.minStepRuleMm} mm. L'escalier sera légèrement raide.`;
  } else if (stepRuleMm > rules.maxStepRuleMm && stepRuleMm <= 660) {
    status = 'limite';
    message = `Pas de foulée limite (${mm} mm). Maximum de confort : ${rules.maxStepRuleMm} mm. L'escalier sera légèrement plat.`;
  } else if (deviation < 0) {
    status = 'non_conforme';
    message = `Pas de foulée de ${mm} mm hors plage (${rules.minStepRuleMm}-${rules.maxStepRuleMm} mm). Escalier trop raide.`;
  } else {
    status = 'non_conforme';
    message = `Pas de foulée de ${mm} mm hors plage (${rules.minStepRuleMm}-${rules.maxStepRuleMm} mm). Escalier trop plat.`;
  }
  return { stepRuleMm, status, message, deviation };
}
