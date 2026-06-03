// stair-validation.ts — Validation d'une configuration selon les règles CCQ
import { StairOption, QualityStatus } from './stair-types';
import { StairRules } from './stair-rules';
export interface ValidationResult { errors: string[]; warnings: string[]; status: QualityStatus; }
export function validateStair(option: StairOption, rules: StairRules): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (option.riserCount <= 0 || option.riserHeightMm <= 0 || option.treadDepthMm <= 0)
    return { errors: ['Configuration impossible : valeurs négatives ou nulles.'], warnings: [], status: 'impossible' };
  if (option.riserHeightMm < rules.minRiserHeightMm)
    errors.push(`Contremarche ${Math.round(option.riserHeightMm)} mm trop basse (min ${rules.minRiserHeightMm} mm — CCQ 9.8.4.1).`);
  if (option.riserHeightMm > rules.maxRiserHeightMm)
    errors.push(`Contremarche ${Math.round(option.riserHeightMm)} mm trop haute (max ${rules.maxRiserHeightMm} mm — CCQ 9.8.4.1).`);
  else if (option.riserHeightMm > 190)
    warnings.push(`Contremarche de ${Math.round(option.riserHeightMm)} mm proche du maximum. Ajouter une contremarche améliorerait le confort.`);
  if (option.treadDepthMm < rules.minTreadDepthMm)
    errors.push(`Giron ${Math.round(option.treadDepthMm)} mm trop court (min ${rules.minTreadDepthMm} mm — CCQ 9.8.4.2).`);
  if (option.stepRuleMm < rules.minStepRuleMm)
    warnings.push(`Pas de foulée ${Math.round(option.stepRuleMm)} mm sous la plage de confort (${rules.minStepRuleMm}-${rules.maxStepRuleMm} mm).`);
  if (option.stepRuleMm > rules.maxStepRuleMm)
    warnings.push(`Pas de foulée ${Math.round(option.stepRuleMm)} mm au-dessus de la plage de confort.`);
  if (option.angleDeg > rules.hardMaxAngleDeg)
    errors.push(`Angle ${option.angleDeg.toFixed(1)}° dépasse le maximum absolu ${rules.hardMaxAngleDeg}°.`);
  else if (option.angleDeg > rules.maxAcceptableAngleDeg)
    warnings.push(`Angle ${option.angleDeg.toFixed(1)}° est raide (max recommandé ${rules.maxIdealAngleDeg}°).`);
  const status: QualityStatus = errors.length > 0 ? 'non_conforme' : warnings.length > 0 ? 'acceptable' : 'excellent';
  return { errors, warnings, status };
}
