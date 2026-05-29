'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PitResult } from '@/lib/escaliers/stair-types';
import { formatMeasurement, UnitDisplay } from '@/lib/escaliers/unit-converter';

interface Props { pit: PitResult; unit: UnitDisplay; }

export function ResultatsPuits({ pit, unit }: Props) {
  const fmt = (mm: number) => formatMeasurement(mm, unit);
  return (
    <Card>
      <CardHeader><CardTitle>Puits d&apos;escalier (exercice 5)</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-center py-4">{fmt(pit.pitLengthMm)}</div>
        <p className="text-sm text-center text-muted-foreground">
          Longueur minimale de l&apos;ouverture dans le plancher supérieur
        </p>
        <div className="rounded bg-muted p-3 font-mono text-xs">
          ((échappée + épaisseur plafond) × giron) ÷ contremarche + 50 mm
        </div>
        {pit.criticalStep > 0 && (
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="py-1.5 text-muted-foreground">Marche critique</td><td className="py-1.5 text-right font-medium">Marche {pit.criticalStep}</td></tr>
              <tr><td className="py-1.5 text-muted-foreground">Position horizontale</td><td className="py-1.5 text-right font-medium">{fmt(pit.criticalPositionMm)} depuis le bas</td></tr>
            </tbody>
          </table>
        )}
        <p className="text-xs text-muted-foreground">Source : formule exercice 5 émoicq.</p>
      </CardContent>
    </Card>
  );
}
