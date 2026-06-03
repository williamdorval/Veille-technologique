// stair-recommendations.ts — Recommandations textuelles en français
import { StairOption } from './stair-types';
import { StairRules } from './stair-rules';
export function generateRecommendations(rec: StairOption, input: { totalHeightMm: number }, rules: StairRules): string[] {
  const recs: string[] = [];
  const H = rec.riserHeightMm; const G = rec.treadDepthMm; const n = rec.riserCount;
  if (H > 190) {
    const h2 = Math.round(input.totalHeightMm / (n + 1));
    recs.push(`Contremarche de ${Math.round(H)} mm élevée. Passer à ${n + 1} contremarches donnerait ${h2} mm et améliorerait le confort.`);
  }
  if (H < 160 && n > 2) {
    const h2 = Math.round(input.totalHeightMm / (n - 1));
    recs.push(`Contremarche de ${Math.round(H)} mm basse. Passer à ${n - 1} contremarches donnerait ${h2} mm et réduirait la course.`);
  }
  if (G < rules.minTreadDepthMm) recs.push(`Giron de ${Math.round(G)} mm sous le minimum CCQ (${rules.minTreadDepthMm} mm). Augmenter la course disponible ou réduire le nombre de marches.`);
  if (rec.stepRuleMm < rules.minStepRuleMm) recs.push(`Pas de foulée de ${Math.round(rec.stepRuleMm)} mm trop court. L'escalier sera fatigant. Réduire le nombre de contremarches.`);
  if (rec.stepRuleMm > rules.maxStepRuleMm) recs.push(`Pas de foulée de ${Math.round(rec.stepRuleMm)} mm trop long. Augmenter le nombre de contremarches.`);
  if (rec.angleDeg > rules.maxAcceptableAngleDeg) recs.push(`Escalier raide (${rec.angleDeg.toFixed(1)}°). Envisager un palier ou un escalier en L.`);
  if (rec.blondel.passedCount < 2) recs.push(`Seulement ${rec.blondel.passedCount}/3 rapports Blondel-Maximum dans les plages optimales. Ajuster le nombre de contremarches.`);
  return recs;
}
