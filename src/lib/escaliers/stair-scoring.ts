// stair-scoring.ts — Score qualité d'une configuration (0-100)
import { StairOption } from './stair-types';
import { StairRules } from './stair-rules';
export function scoreStairOption(option: StairOption, rules: StairRules): number {
  let score = 100;
  score -= Math.abs(option.stepRuleMm - rules.idealStepRule) * 0.5;
  if (option.treadDepthMm < rules.idealTreadDepthMm) score -= (rules.idealTreadDepthMm - option.treadDepthMm) * 0.1;
  if (option.riserHeightMm > 190) score -= (option.riserHeightMm - 190) * 2;
  if (option.riserHeightMm < 160) score -= (160 - option.riserHeightMm) * 2;
  if (option.angleDeg > rules.maxIdealAngleDeg) score -= (option.angleDeg - rules.maxIdealAngleDeg) * 3;
  if (option.angleDeg < rules.minIdealAngleDeg) score -= (rules.minIdealAngleDeg - option.angleDeg) * 2;
  score -= (3 - option.blondel.passedCount) * 20;
  if (option.status === 'non_conforme') score -= 50;
  if (option.stepRuleMm >= 625 && option.stepRuleMm <= 635) score += 5;
  if (option.angleDeg >= 32 && option.angleDeg <= 35) score += 5;
  if (option.blondel.passedCount === 3) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}
