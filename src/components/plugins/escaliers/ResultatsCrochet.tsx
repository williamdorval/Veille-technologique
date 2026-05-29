'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HookResult } from '@/lib/escaliers/stair-types';
import { formatMeasurement, UnitDisplay } from '@/lib/escaliers/unit-converter';

interface Props { hook: HookResult; unit: UnitDisplay; }

export function ResultatsCrochet({ hook, unit }: Props) {
  const ok = hook.spaceLeftMm >= 0 && hook.hookCanCompensate;
  const fmt = (mm: number) => formatMeasurement(mm, unit);
  return (
    <Card>
      <CardHeader><CardTitle>Calcul du crochet (exercice 4)</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`rounded p-3 text-sm ${ok ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200'}`}>
          {hook.message}
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b"><td className="py-1.5 text-muted-foreground">Course disponible</td><td className="py-1.5 text-right font-medium">{fmt(hook.availableRunMm)}</td></tr>
            <tr className="border-b"><td className="py-1.5 text-muted-foreground">Course calculée</td><td className="py-1.5 text-right font-medium">{fmt(hook.totalRunMm)}</td></tr>
            <tr className="border-b"><td className="py-1.5 text-muted-foreground">Espace restant</td>
              <td className={`py-1.5 text-right font-medium ${hook.spaceLeftMm >= 0 ? 'text-green-600' : 'text-destructive'}`}>{fmt(Math.abs(hook.spaceLeftMm))} {hook.spaceLeftMm >= 0 ? 'de jeu' : 'manquant'}</td></tr>
            <tr><td className="py-1.5 text-muted-foreground">Crochet haut</td>
              <td className={`py-1.5 text-right font-medium ${hook.hookCanCompensate ? 'text-green-600' : 'text-destructive'}`}>{fmt(hook.hookFromAboveMm)} {hook.hookCanCompensate ? '✓' : '✗'}</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">Formule : (giron + nez) − épaisseur chevêtre. Source : exercice 4 émoicq.</p>
      </CardContent>
    </Card>
  );
}
