// stair-rules.ts — Règles CCQ + pratique québécoise, toutes valeurs en mm
// Source : RBQ Chapitre I Bâtiment Partie 9 + exercices émoicq
export const DEFAULT_STAIR_RULES = {
  // Contremarche — CCQ 9.8.4.1
  minRiserHeightMm: 125, maxRiserHeightMm: 200, idealRiserHeightMm: 185,
  // Giron — CCQ 9.8.4.2
  minTreadDepthMm: 235, idealTreadDepthMm: 250,
  // Pas de foulée — Blondel
  minStepRuleMm: 600, idealStepRuleMin: 610, idealStepRule: 630, idealStepRuleMax: 635, maxStepRuleMm: 650,
  // Nez de marche — CCQ 9.8.4.3
  minNoseProjectionMm: 25, maxNoseProjectionMm: 38, defaultNoseProjectionMm: 28,
  // Constance — CCQ 9.8.4.4
  maxRiserVariationMm: 9.5,
  // Angles
  minIdealAngleDeg: 30, maxIdealAngleDeg: 37, maxAcceptableAngleDeg: 40, hardMaxAngleDeg: 45,
  // Echappée — CCQ 9.8.3.1
  minHeadroomMm: 1950, recommendedHeadroomMm: 2050,
  // Largeur — CCQ 9.8.2.1
  minStairWidthMm: 860, recommendedStairWidthMm: 900,
  // Blondel-Maximum exercice 3 émoicq : 3 rapports G/H
  blondelRange1Min: 430, blondelRange1Max: 460,   // G + H
  blondelRange2Min: 610, blondelRange2Max: 635,   // G + 2H (principal)
  blondelRange3Min: 45000, blondelRange3Max: 48500, // G × H
  // Comportement
  upperFloorActsAsLastStep: true,
  // Main courante — CCQ 9.8.7.4
  mainCouranteHauteurMinMm: 800, mainCouranteHauteurMaxMm: 965,
  mainCouranteDistanceMurMinMm: 50, mainCouranteObligatoireMinMarches: 3,
  mainCouranteDoubleLargeurMm: 1100,
  // Garde-corps — CCQ 9.8.8
  gardeCorpsHauteurMinPriveMm: 900, gardeCorpsHauteurMinEleveMm: 1070,
  gardeCorpsObligatoireHauteurMm: 600, gardeCorpsBalustreMaxMm: 100,
  hauteurMaxVoleeMm: 3700,
} as const;
export type StairRules = typeof DEFAULT_STAIR_RULES;
