'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EtapePose } from '@/lib/rampes/types';

interface Props {
  etapes: EtapePose[];
}

export function PlanConstruction({ etapes }: Props) {
  const [terminees, setTerminees] = useState<Set<number>>(new Set());

  function toggleEtape(num: number) {
    setTerminees(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan de pose</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {etapes.map((etape) => {
            const terminee = terminees.has(etape.numero);
            return (
              <li key={etape.numero}
                className={`flex gap-3 cursor-pointer group ${terminee ? 'opacity-60' : ''}`}
                onClick={() => toggleEtape(etape.numero)}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${terminee ? 'bg-construction-succes text-white border-construction-succes' : 'border-border text-muted-foreground group-hover:border-primary'}`}>
                  {terminee ? '✓' : etape.numero}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${terminee ? 'line-through' : ''}`}>
                      {etape.titre}
                    </span>
                    {etape.obligatoireSelonNormes && (
                      <Badge variant="outline" className="text-xs">CCQ requis</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{etape.description}</p>
                  {etape.dimensionsCles.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {etape.dimensionsCles.map(({ label, valeur }) => (
                        <li key={label} className="text-xs flex gap-1">
                          <span className="text-muted-foreground">{label} :</span>
                          <span className="font-medium">{valeur}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-muted-foreground mt-4">
          Cliquer sur une étape pour la marquer comme terminée.
        </p>
      </CardContent>
    </Card>
  );
}
