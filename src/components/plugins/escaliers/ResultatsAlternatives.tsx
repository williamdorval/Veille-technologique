'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StairResult, StairOption, QualityStatus } from '@/lib/escaliers/stair-types';
import { formatMeasurement, UnitDisplay } from '@/lib/escaliers/unit-converter';

function statusColor(s: QualityStatus): string {
  if (s === 'excellent') return 'text-green-600 dark:text-green-400';
  if (s === 'acceptable') return 'text-yellow-600 dark:text-yellow-400';
  return 'text-destructive';
}

interface Props { result: StairResult; unit: UnitDisplay; }

export function ResultatsAlternatives({ result, unit }: Props) {
  const all = [result.recommended, ...result.alternatives];
  const fmt = (mm: number) => formatMeasurement(mm, unit);

  return (
    <Card>
      <CardHeader><CardTitle>Toutes les configurations ({all.length})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 pr-2">CM</th>
                <th className="text-right py-2 px-1">Marches</th>
                <th className="text-right py-2 px-1">H CM</th>
                <th className="text-right py-2 px-1">Giron</th>
                <th className="text-right py-2 px-1">Pas</th>
                <th className="text-right py-2 px-1">Angle</th>
                <th className="text-right py-2 px-1">Score</th>
                <th className="text-right py-2 pl-1">Statut</th>
              </tr>
            </thead>
            <tbody>
              {all.map((opt: StairOption, i: number) => (
                <tr key={opt.riserCount} className={`border-b last:border-0 ${i === 0 ? 'font-semibold bg-muted/30' : ''}`}>
                  <td className="py-1.5 pr-2">{opt.riserCount} {i === 0 && <Badge variant="outline" className="text-[10px] ml-1">Rec.</Badge>}</td>
                  <td className="py-1.5 px-1 text-right">{opt.stepCount}</td>
                  <td className="py-1.5 px-1 text-right">{fmt(opt.riserHeightMm)}</td>
                  <td className="py-1.5 px-1 text-right">{fmt(opt.treadDepthMm)}</td>
                  <td className="py-1.5 px-1 text-right">{fmt(opt.stepRuleMm)}</td>
                  <td className="py-1.5 px-1 text-right">{opt.angleDeg}°</td>
                  <td className="py-1.5 px-1 text-right">{opt.score}</td>
                  <td className={`py-1.5 pl-1 text-right ${statusColor(opt.status)}`}>{opt.blondel.passedCount}/3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">CM = contremarches. Score /100. Rapport Blondel (G+H, G+2H, G×H) sur 3.</p>
      </CardContent>
    </Card>
  );
}
