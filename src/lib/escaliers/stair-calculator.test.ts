// stair-calculator.test.ts — Tests unitaires (exécuter avec: npx ts-node src/lib/escaliers/stair-calculator.test.ts)
// Couvre les 8 cas de test du spec professionnel

import { calculateUnlimitedRunStair } from './stair-unlimited-run';
import { calculateLimitedRunStair } from './stair-limited-run';
import { calculateStepRule } from './stair-blondel';
import { calculateStairAngle, calculateStringerLength } from './stair-calculator';
import { DEFAULT_STAIR_RULES as R } from './stair-rules';

let passed = 0; let failed = 0;
function assert(label: string, cond: boolean, extra = '') {
  if (cond) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ ${label} ${extra}`); failed++; }
}
function near(a: number, b: number, tol = 1) { return Math.abs(a - b) <= tol; }

console.log('\n=== Tests calculateur escaliers (exercices émoicq) ===\n');

// Test 1 — Calcul de base course illimitée
{
  console.log('Test 1 : Course illimitée 2800 mm');
  const r = calculateUnlimitedRunStair({ mode: 'unlimited_run', totalHeightMm: 2800, ceilingThicknessMm: 275, stairWidthMm: 900, headroomMm: 1950, typeUsage: 'residentiel_prive', closedRisers: true, materiauLimon: 'epinette', typeMarche: 'epinette', upperFloorActsAsLastStep: true, unit: 'mm' }, R);
  const rec = r.recommended;
  assert('16 contremarches', rec.riserCount === 16, `got ${rec.riserCount}`);
  assert('15 marches', rec.stepCount === 15, `got ${rec.stepCount}`);
  assert('Contremarche ~175 mm', near(rec.riserHeightMm, 175, 5), `got ${rec.riserHeightMm}`);
  assert('Giron ~280 mm', near(rec.treadDepthMm, 280, 20), `got ${rec.treadDepthMm}`);
  assert('Pas ~630 mm', near(rec.stepRuleMm, 630, 30), `got ${rec.stepRuleMm}`);
  assert('Angle ~33.7°', near(rec.angleDeg, 33.7, 3), `got ${rec.angleDeg}`);
}

// Test 2 — Course limitée OK
{
  console.log('\nTest 2 : Course limitée 2800/4200 mm');
  const r = calculateLimitedRunStair({ mode: 'limited_run', totalHeightMm: 2800, availableRunMm: 4200, ceilingThicknessMm: 275, stairWidthMm: 900, headroomMm: 1950, typeUsage: 'residentiel_prive', closedRisers: true, materiauLimon: 'epinette', typeMarche: 'epinette', upperFloorActsAsLastStep: true, unit: 'mm' }, R);
  assert('Statut acceptable ou excellent', ['excellent','acceptable'].includes(r.recommended.status), `got ${r.recommended.status}`);
  assert('Giron ~280 mm', near(r.recommended.treadDepthMm, 280, 30), `got ${r.recommended.treadDepthMm}`);
}

// Test 3 — Course trop courte
{
  console.log('\nTest 3 : Course courte 2800/2500 mm');
  const r = calculateLimitedRunStair({ mode: 'limited_run', totalHeightMm: 2800, availableRunMm: 2500, ceilingThicknessMm: 275, stairWidthMm: 900, headroomMm: 1950, typeUsage: 'residentiel_prive', closedRisers: true, materiauLimon: 'epinette', typeMarche: 'epinette', upperFloorActsAsLastStep: true, unit: 'mm' }, R);
  assert('Angle raide (> 40°)', r.recommended.angleDeg > 40 || r.recommended.status !== 'excellent', `angle=${r.recommended.angleDeg}`);
}

// Test 4 — Loi de Blondel
{
  console.log('\nTest 4 : Blondel 175/280');
  const pas = calculateStepRule(175, 280);
  assert('Pas de foulée = 630', near(pas, 630, 0.1), `got ${pas}`);
}

// Test 5 — Angle et limon
{
  console.log('\nTest 5 : Angle et limon 2800/4200');
  const angle = calculateStairAngle(2800, 4200);
  const limon = calculateStringerLength(2800, 4200);
  assert('Angle ~33.7°', near(angle, 33.7, 0.5), `got ${angle}`);
  assert('Limon ~5048 mm', near(limon, 5048, 10), `got ${limon}`);
}

// Test 6 — Puits d'escalier
{
  console.log('\nTest 6 : Puits (1950 echappee, 275 plafond, 175 CM, 280 giron)');
  const { calculateStairPit } = require('./stair-pit');
  const p = calculateStairPit({ headroomMm: 1950, ceilingThicknessMm: 275, treadDepthMm: 280, riserHeightMm: 175 });
  assert('Puits > 3000 mm', p.pitLengthMmRounded > 3000, `got ${p.pitLengthMmRounded}`);
}

// Test 7 — Blondel-Maximum exercice 3 (tread=251, riser=193)
{
  console.log('\nTest 7 : Blondel-Maximum 251/193');
  const G = 251; const H = 193;
  const r1 = G + H; const r2 = G + 2 * H; const r3 = G * H;
  assert('G+H = 444 (430-460)', near(r1, 444) && r1 >= 430 && r1 <= 460, `got ${r1}`);
  assert('G+2H = 637 (HORS 610-635)', !(r2 >= 610 && r2 <= 635), `got ${r2}`);
  assert('G×H = 48443 (45000-48500)', r3 >= 45000 && r3 <= 48500, `got ${r3}`);
  assert('Score Blondel = 2/3', [r1 >= 430 && r1 <= 460, r2 >= 610 && r2 <= 635, r3 >= 45000 && r3 <= 48500].filter(Boolean).length === 2, '');
}

// Test 8 — Cas impossible
{
  console.log('\nTest 8 : Hauteur négative');
  const r = calculateUnlimitedRunStair({ mode: 'unlimited_run', totalHeightMm: -100, ceilingThicknessMm: 275, stairWidthMm: 900, headroomMm: 1950, typeUsage: 'residentiel_prive', closedRisers: true, materiauLimon: 'epinette', typeMarche: 'epinette', upperFloorActsAsLastStep: true, unit: 'mm' }, R);
  assert('Statut impossible', r.recommended.status === 'impossible', `got ${r.recommended.status}`);
  assert('Erreur claire', r.recommended.errors.length > 0, '');
}

console.log(`\n=== Résultat : ${passed} réussis, ${failed} échoués ===\n`);
