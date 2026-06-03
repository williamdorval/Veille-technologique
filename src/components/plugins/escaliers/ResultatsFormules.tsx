'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StairResult } from '@/lib/escaliers/stair-types';
import { formatMeasurement, convertFromMm, UnitDisplay } from '@/lib/escaliers/unit-converter';

interface Props { result: StairResult; unit: UnitDisplay; }

export function ResultatsFormules({ result, unit }: Props) {
  const rec = result.recommended;
  const H = rec.riserHeightMm;
  const G = rec.treadDepthMm;
  const N = rec.riserCount;
  const steps = rec.stepCount;
  const hTotal = result.input.totalHeightMm;
  const pit = result.pit;
  const fmt = (mm: number) => formatMeasurement(mm, unit);

  // Valeur de Blondel cible dans l'unité choisie
  const blondelCible = convertFromMm(630, unit).toFixed(unit === 'mm' ? 0 : 1);

  const formules = [
    {
      label: 'Hauteur contremarche',
      expr: `${fmt(hTotal)} ÷ ${N}`,
      result: fmt(H),
    },
    {
      label: 'Giron (Blondel)',
      expr: `${blondelCible} ${unit} − 2 × ${fmt(H)}`,
      result: fmt(G),
    },
    {
      label: 'Pas de foulée (2H + G)',
      expr: `2 × ${fmt(H)} + ${fmt(G)}`,
      result: fmt(rec.stepRuleMm),
    },
    {
      label: 'Course totale',
      expr: `${steps} marches × ${fmt(G)}`,
      result: fmt(rec.totalRunMm),
    },
    {
      label: 'Angle de l\'escalier',
      expr: `atan(${fmt(hTotal)} ÷ ${fmt(rec.totalRunMm)}) × 180/π`,
      result: `${rec.angleDeg}°`,
    },
    {
      label: 'Longueur du limon',
      expr: `√(${fmt(hTotal)}² + ${fmt(rec.totalRunMm)}²)`,
      result: fmt(rec.stringerLengthMm),
    },
    {
      label: 'Rapport G + H',
      expr: `${fmt(G)} + ${fmt(H)}`,
      result: `${fmt(rec.blondel.ratio1)} ${rec.blondel.ratio1Ok ? '✓' : '✗'} (plage : ${formatMeasurement(430, unit)}–${formatMeasurement(460, unit)})`,
    },
    {
      label: 'Rapport G + 2H',
      expr: `${fmt(G)} + 2×${fmt(H)}`,
      result: `${fmt(rec.blondel.ratio2)} ${rec.blondel.ratio2Ok ? '✓' : '✗'} (plage : ${formatMeasurement(610, unit)}–${formatMeasurement(635, unit)})`,
    },
    {
      label: 'Puits d\'escalier',
      expr: `((échappée + plafond) × giron) ÷ CM + 50`,
      result: fmt(pit.pitLengthMm),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formules appliquées — valeurs réelles</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Toutes les valeurs affichées en <strong>{unit}</strong>. Changer l&apos;unité dans le formulaire à gauche.
        </p>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground text-xs">
              <th className="text-left py-2 pr-2">Calcul</th>
              <th className="text-left py-2 px-2">Formule</th>
              <th className="text-right py-2 pl-2">Résultat</th>
            </tr>
          </thead>
          <tbody>
            {formules.map(({ label, expr, result: res }) => (
              <tr key={label} className="border-b last:border-0">
                <td className="py-2 pr-2 text-muted-foreground text-xs">{label}</td>
                <td className="py-2 px-2 font-mono text-xs">{expr}</td>
                <td className="py-2 pl-2 text-right font-semibold text-xs">{res}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3">
          Sources : exercices 1–5 émoicq (YouTube) + CCQ Partie 9.
        </p>
      </CardContent>
    </Card>
  );
}
