// stair-hook.ts — Calcul du crochet/ajustement (exercice 4 émoicq)
// Crochet = (giron + nez) - épaisseur chevêtre
// Positif = espace restant OK. Négatif = il manque de l'espace.
import { HookResult } from './stair-types';
export interface HookInput {
  availableRunMm: number; totalRunMm: number;
  treadDepthMm: number; riserHeightMm: number;
  upperBeamThicknessMm: number; noseProjectionMm?: number;
}
export function calculateHookAdjustment(h: HookInput): HookResult {
  const nose = h.noseProjectionMm ?? 28;
  const spaceLeftMm = h.availableRunMm - h.totalRunMm;
  // Formule exercice 4 émoicq
  const hookFromAboveMm = (h.treadDepthMm + nose) - h.upperBeamThicknessMm;
  const hookCanCompensate = hookFromAboveMm >= 0;
  let message: string;
  if (spaceLeftMm >= 0 && hookCanCompensate)
    message = `L'escalier entre dans l'espace disponible. Il reste ${Math.round(spaceLeftMm)} mm de jeu. Crochet haut : ${Math.round(hookFromAboveMm)} mm.`;
  else if (spaceLeftMm < 0)
    message = `Il manque ${Math.abs(Math.round(spaceLeftMm))} mm de course. Augmenter la course disponible ou réduire le nombre de marches.`;
  else
    message = `Crochet négatif (${Math.round(hookFromAboveMm)} mm). Giron insuffisant pour le chevêtre de ${Math.round(h.upperBeamThicknessMm)} mm. Revoir la conception.`;
  return { availableRunMm: h.availableRunMm, totalRunMm: h.totalRunMm, spaceLeftMm, hookFromAboveMm, hookCanCompensate, message };
}
