'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StairResult, QualityStatus } from '@/lib/escaliers/stair-types';
import { formatMeasurement, UnitDisplay } from '@/lib/escaliers/unit-converter';
import { evaluateStepRule } from '@/lib/escaliers/stair-blondel';
import { DEFAULT_STAIR_RULES as R } from '@/lib/escaliers/stair-rules';

function statusBadge(s: QualityStatus) {
  const map: Record<QualityStatus, { variant: 'default'|'secondary'|'destructive'|'outline'; label: string }> = {
    excellent: { variant: 'default', label: 'Excellent' },
    acceptable: { variant: 'secondary', label: 'Acceptable' },
    limite: { variant: 'secondary', label: 'Limite' },
    non_conforme: { variant: 'destructive', label: 'Non conforme' },
    impossible: { variant: 'destructive', label: 'Impossible' },
  };
  const { variant, label } = map[s];
  return <Badge variant={variant}>{label}</Badge>;
}

interface Props { result: StairResult; unit: UnitDisplay; }

export function ResultatsRecommandation({ result, unit }: Props) {
  const rec = result.recommended;
  const blondelEval = evaluateStepRule(rec.stepRuleMm, R);
  const fmt = (mm: number) => formatMeasurement(mm, unit);

  const lignes = [
    { label: 'Contremarches', valeur: `${rec.riserCount}` },
    { label: 'Marches', valeur: `${rec.stepCount}` },
    { label: 'Hauteur contremarche', valeur: fmt(rec.riserHeightMm) },
    { label: 'Giron', valeur: fmt(rec.treadDepthMm) },
    { label: 'Course totale', valeur: fmt(rec.totalRunMm) },
    { label: 'Longueur du limon', valeur: fmt(rec.stringerLengthMm) },
    { label: 'Angle', valeur: `${rec.angleDeg}°` },
    { label: 'Pas de foulée (Blondel)', valeur: fmt(rec.stepRuleMm) },
  ];

  const blondelRows = [
    { label: 'G + H', valeur: Math.round(rec.blondel.ratio1), ok: rec.blondel.ratio1Ok, plage: '430-460 mm' },
    { label: 'G + 2H', valeur: Math.round(rec.blondel.ratio2), ok: rec.blondel.ratio2Ok, plage: '610-635 mm' },
    { label: 'G × H', valeur: Math.round(rec.blondel.ratio3), ok: rec.blondel.ratio3Ok, plage: '45000-48500' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
            <span>Configuration recommandée</span>
            <div className="flex items-center gap-2">
              {statusBadge(rec.status)}
              <Badge variant="outline">Score {rec.score}/100</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {lignes.map(({ label, valeur }) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="py-1.5 text-muted-foreground">{label}</td>
                  <td className="py-1.5 font-medium text-right">{valeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Blondel-Maximum (exercice 3)</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Rapport</th><th className="text-right py-2">Valeur</th><th className="text-right py-2">Plage</th><th className="text-right py-2">Statut</th></tr></thead>
            <tbody>
              {blondelRows.map(({ label, valeur, ok, plage }) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="py-1.5">{label}</td>
                  <td className="py-1.5 text-right font-medium">{valeur}</td>
                  <td className="py-1.5 text-right text-muted-foreground text-xs">{plage}</td>
                  <td className="py-1.5 text-right">{ok ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-2">{blondelEval.message}</p>
          {rec.errors.map((e, i) => <p key={i} className="text-xs text-destructive mt-1">{e}</p>)}
          {rec.warnings.map((w, i) => <p key={i} className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{w}</p>)}
        </CardContent>
      </Card>

      {result.recommendations.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recommandations</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {result.recommendations.map((r, i) => <p key={i} className="text-sm">{r}</p>)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
