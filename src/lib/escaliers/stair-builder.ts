// stair-builder.ts — Construction d'une option à partir d'un riserCount
import { StairInput, StairOption, BlondelCheck, QualityStatus } from './stair-types';
import { StairRules } from './stair-rules';
import { calculateRiserHeight, calculateStepCount, calculateTotalRun, calculateStairAngle, calculateStringerLength, roundTo } from './stair-calculator';
import { calculateStepRule } from './stair-blondel';
import { validateStair } from './stair-validation';
import { scoreStairOption } from './stair-scoring';
export function checkBlondel(G: number, H: number, rules: StairRules): BlondelCheck {
  const ratio1 = roundTo(G + H, 1); const ratio2 = roundTo(G + 2 * H, 1); const ratio3 = Math.round(G * H);
  const r1Ok = ratio1 >= rules.blondelRange1Min && ratio1 <= rules.blondelRange1Max;
  const r2Ok = ratio2 >= rules.blondelRange2Min && ratio2 <= rules.blondelRange2Max;
  const r3Ok = ratio3 >= rules.blondelRange3Min && ratio3 <= rules.blondelRange3Max;
  return { ratio1, ratio1Ok: r1Ok, ratio2, ratio2Ok: r2Ok, ratio3, ratio3Ok: r3Ok, passedCount: [r1Ok, r2Ok, r3Ok].filter(Boolean).length };
}
export function buildOption(n: number, treadDepthMm: number, input: StairInput, rules: StairRules): StairOption {
  const riserHeightMm = roundTo(calculateRiserHeight(input.totalHeightMm, n), 1);
  const stepCount = calculateStepCount(n, input.upperFloorActsAsLastStep);
  const totalRunMm = roundTo(calculateTotalRun(stepCount, treadDepthMm), 0);
  const angleDeg = roundTo(calculateStairAngle(input.totalHeightMm, totalRunMm), 1);
  const stringerLengthMm = roundTo(calculateStringerLength(input.totalHeightMm, totalRunMm), 0);
  const stepRuleMm = roundTo(calculateStepRule(riserHeightMm, treadDepthMm), 1);
  const blondel = checkBlondel(treadDepthMm, riserHeightMm, rules);
  const draft: StairOption = {
    riserCount: n, stepCount, riserHeightMm, treadDepthMm, totalRunMm, stringerLengthMm, angleDeg, stepRuleMm, blondel,
    score: 0, status: 'acceptable' as QualityStatus, errors: [], warnings: [],
  };
  const v = validateStair(draft, rules);
  draft.errors = v.errors; draft.warnings = v.warnings; draft.status = v.status;
  draft.score = scoreStairOption(draft, rules);
  return draft;
}
export function makeImpossible(message: string): StairOption {
  return {
    riserCount: 0, stepCount: 0, riserHeightMm: 0, treadDepthMm: 0,
    totalRunMm: 0, stringerLengthMm: 0, angleDeg: 0, stepRuleMm: 0,
    blondel: { ratio1: 0, ratio1Ok: false, ratio2: 0, ratio2Ok: false, ratio3: 0, ratio3Ok: false, passedCount: 0 },
    score: 0, status: 'impossible', errors: [message], warnings: [],
  };
}
