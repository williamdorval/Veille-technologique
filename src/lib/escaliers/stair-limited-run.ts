// stair-limited-run.ts — Mode course limitée (exercice 4 émoicq)
// Le giron est imposé par la course disponible.
import { StairInput, StairResult } from './stair-types';
import { StairRules } from './stair-rules';
import { calculatePossibleRiserRange, calculateStepCount, calculateRiserHeight, roundTo } from './stair-calculator';
import { calculateStairPit } from './stair-pit';
import { calculateHookAdjustment } from './stair-hook';
import { generateRecommendations } from './stair-recommendations';
import { buildOption, makeImpossible } from './stair-builder';
export function calculateLimitedRunStair(input: StairInput, rules: StairRules): StairResult {
  const availableRun = input.availableRunMm ?? 0;
  if (input.totalHeightMm <= 0 || availableRun <= 0) {
    const imp = makeImpossible('Hauteur et course doivent être positives.');
    return { mode: 'limited_run', input, recommended: imp, alternatives: [],
      pit: { pitLengthMm: 0, pitLengthMmRounded: 0, criticalStep: 0, criticalPositionMm: 0, formula: '', message: 'Entrées invalides.' },
      errors: imp.errors, warnings: [], recommendations: [] };
  }
  const { min, max } = calculatePossibleRiserRange(input.totalHeightMm, rules);
  const options = [];
  for (let n = min; n <= max; n++) {
    const stepCount = calculateStepCount(n, input.upperFloorActsAsLastStep);
    const G = stepCount > 0 ? roundTo(availableRun / stepCount, 1) : 0;
    options.push(buildOption(n, G, input, rules));
  }
  options.sort((a, b) => b.score - a.score);
  const recommended = options[0] ?? makeImpossible('Aucune configuration possible.');
  const alternatives = options.slice(1, 6);
  const pit = calculateStairPit({ headroomMm: input.headroomMm, ceilingThicknessMm: input.ceilingThicknessMm, treadDepthMm: recommended.treadDepthMm, riserHeightMm: recommended.riserHeightMm });
  const hookAdjustment = calculateHookAdjustment({ availableRunMm: availableRun, totalRunMm: recommended.totalRunMm, treadDepthMm: recommended.treadDepthMm, riserHeightMm: recommended.riserHeightMm, upperBeamThicknessMm: input.ceilingThicknessMm });
  const recommendations = generateRecommendations(recommended, input, rules);
  return { mode: 'limited_run', input, recommended, alternatives, hookAdjustment, pit, errors: recommended.errors, warnings: recommended.warnings, recommendations };
}
