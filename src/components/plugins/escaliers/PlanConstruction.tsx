'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EtapeConstruction } from '@/lib/escaliers/types';

interface Props {
  etapes: EtapeConstruction[];
}

export function PlanConstruction({ etapes }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Plan généré automatiquement selon vos paramètres. Les dimensions sont calculées
        pour votre escalier spécifique. Toujours vérifier avec un professionnel avant de construire.
      </p>

      {etapes.map((etape) => (
        <Card key={etape.numero} className={etape.obligatoireSelonNormes ? 'border-amber-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {etape.numero}
              </span>
              {etape.titre}
              {etape.obligatoireSelonNormes && (
                <Badge variant="secondary" className="text-xs">Exigé par le CCQ</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{etape.description}</p>
            {etape.dimensionsCles.length > 0 && (
              <div className="bg-muted rounded p-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Dimensions clés :</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  {etape.dimensionsCles.map(({ label, valeur }) => (
                    <div key={label} className="flex justify-between text-xs gap-2">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{valeur}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
