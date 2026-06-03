// stair-unlimited-run.ts — Mode course illimitée (exercice 3 émoicq)
// On propose la meilleure configuration à partir de la hauteur totale seulement.
import { StairInput, StairResult } from './stair-types';
import { StairRules } from './stair-rules';
import { calculatePossibleRiserRange, roundTo } from './stair-calculator';
import { calculateStairPit } from './stair-pit';
import { generateRecommendations } from './stair-recommendations';
import { buildOption, makeImpossible } from './stair-builder';
export function calculateUnlimitedRunStair(input: StairInput, rules: StairRules): StairResult {
  if (input.totalHeightMm <= 0) {
    const imp = makeImpossible('La hauteur totale doit être positive.');
    return { mode: 'unlimited_run', input, recommended: imp, alternatives: [],
      pit: { pitLengthMm: 0, pitLengthMmRounded: 0, criticalStep: 0, criticalPositionMm: 0, formula: '', message: 'Hauteur invalide.' },
      errors: imp.errors, warnings: [], recommendations: [] };
  }
  const { min, max } = calculatePossibleRiserRange(input.totalHeightMm, rules);
  const options = [];
  for (let n = min; n <= max; n++) {
    const H = input.totalHeightMm / n;
    let G = roundTo(rules.idealStepRule - 2 * H, 0);
    if (G < rules.minTreadDepthMm) G = rules.minTreadDepthMm;
    if (G > 400) G = 400;
    options.push(buildOption(n, G, input, rules));
  }
  options.sort((a, b) => b.score - a.score);
  const recommended = options[0] ?? makeImpossible('Aucune configuration possible pour cette hauteur.');
  const alternatives = options.slice(1, 6);
  const pit = calculateStairPit({ headroomMm: input.headroomMm, ceilingThicknessMm: input.ceilingThicknessMm, treadDepthMm: recommended.treadDepthMm, riserHeightMm: recommended.riserHeightMm });
  const recommendations = generateRecommendations(recommended, input, rules);
  return { mode: 'unlimited_run', input, recommended, alternatives, pit, errors: recommended.errors, warnings: recommended.warnings, recommendations };
}
