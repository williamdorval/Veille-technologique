'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StairResult } from '@/lib/escaliers/stair-types';

interface Props { result: StairResult; }

export function ResultatsFormules({ result }: Props) {
  const rec = result.recommended;
  const H = rec.riserHeightMm; const G = rec.treadDepthMm;
  const N = rec.riserCount; const steps = rec.stepCount;
  const hTotal = result.input.totalHeightMm;
  const pit = result.pit;

  const formules = [
    { label: 'Hauteur contremarche', expr: `${Math.round(hTotal)} / ${N}`, result: `= ${H.toFixed(1)} mm` },
    { label: 'Giron (Blondel)', expr: `630 - 2 × ${H.toFixed(1)}`, result: `= ${G.toFixed(1)} mm` },
    { label: 'Pas de foulée', expr: `2 × ${H.toFixed(1)} + ${G.toFixed(1)}`, result: `= ${rec.stepRuleMm.toFixed(1)} mm` },
    { label: 'Course totale', expr: `${steps} × ${G.toFixed(1)}`, result: `= ${Math.round(rec.totalRunMm)} mm` },
    { label: 'Angle', expr: `atan(${Math.round(hTotal)} / ${Math.round(rec.totalRunMm)}) × 180/π`, result: `= ${rec.angleDeg}°` },
    { label: 'Longueur du limon', expr: `√(${Math.round(hTotal)}² + ${Math.round(rec.totalRunMm)}²)`, result: `= ${Math.round(rec.stringerLengthMm)} mm` },
    { label: 'Rapport G + H', expr: `${G.toFixed(1)} + ${H.toFixed(1)}`, result: `= ${rec.blondel.ratio1.toFixed(1)} mm ${rec.blondel.ratio1Ok ? '✓' : '✗'} (430-460)` },
    { label: 'Rapport G + 2H', expr: `${G.toFixed(1)} + 2×${H.toFixed(1)}`, result: `= ${rec.blondel.ratio2.toFixed(1)} mm ${rec.blondel.ratio2Ok ? '✓' : '✗'} (610-635)` },
    { label: 'Rapport G × H', expr: `${G.toFixed(1)} × ${H.toFixed(1)}`, result: `= ${rec.blondel.ratio3} ${rec.blondel.ratio3Ok ? '✓' : '✗'} (45000-48500)` },
    { label: 'Puits d\'escalier', expr: pit.formula, result: `= ${pit.pitLengthMmRounded} mm` },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Formules appliquées (valeurs réelles)</CardTitle></CardHeader>
      <CardContent>
        <table className="w-full text-xs font-mono">
          <thead><tr className="border-b text-muted-foreground text-[10px]"><th className="text-left py-2 pr-2">Calcul</th><th className="text-left py-2 px-2">Formule</th><th className="text-right py-2 pl-2">Résultat</th></tr></thead>
          <tbody>
            {formules.map(({ label, expr, result: res }) => (
              <tr key={label} className="border-b last:border-0">
                <td className="py-1.5 pr-2 text-muted-foreground text-[10px] font-sans">{label}</td>
                <td className="py-1.5 px-2">{expr}</td>
                <td className="py-1.5 pl-2 text-right font-semibold">{res}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3">Toutes les valeurs sont en mm (millimètres). Sources : exercices 1-5 émoicq + CCQ Partie 9.</p>
      </CardContent>
    </Card>
  );
}
