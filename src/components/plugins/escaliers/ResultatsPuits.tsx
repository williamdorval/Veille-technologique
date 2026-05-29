'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PitResult } from '@/lib/escaliers/stair-types';

interface Props { pit: PitResult; }

export function ResultatsPuits({ pit }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>Puits d&apos;escalier (exercice 5)</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-center py-4">{pit.pitLengthMmRounded} mm</div>
        <p className="text-sm text-center text-muted-foreground">Longueur minimale du puits depuis le nez de la 1re marche en haut</p>
        <div className="rounded bg-muted p-3 font-mono text-xs">{pit.formula}</div>
        {pit.criticalStep > 0 && (
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="py-1.5 text-muted-foreground">Marche critique</td><td className="py-1.5 text-right font-medium">Marche {pit.criticalStep}</td></tr>
              <tr><td className="py-1.5 text-muted-foreground">Position horizontale</td><td className="py-1.5 text-right font-medium">{Math.round(pit.criticalPositionMm)} mm depuis le bas</td></tr>
            </tbody>
          </table>
        )}
        <p className="text-xs text-muted-foreground">Source : formule exercice 5 émoicq.</p>
      </CardContent>
    </Card>
  );
}
