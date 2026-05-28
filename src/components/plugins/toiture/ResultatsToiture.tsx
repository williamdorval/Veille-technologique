'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResultatsToiture, StatutConformite } from '@/lib/toiture/types';

interface Props {
  resultats: ResultatsToiture;
}

function badgeVariant(statut: StatutConformite): 'default' | 'secondary' | 'destructive' {
  if (statut === 'conforme') return 'default';
  if (statut === 'avertissement') return 'secondary';
  return 'destructive';
}

export function ResultatsToiture({ resultats }: Props) {
  const {
    surfaceHorizontale, surfaceDeveloppee, nombrePaquetsBardeaux, surfaceMembraneM2,
    nombreChevrons, longueurChevrons, ventilationEntreeCm2, ventilationSortieCm2, chargeNeige,
  } = resultats;

  const lignes = [
    { label: 'Surface horizontale', valeur: `${surfaceHorizontale} m²` },
    { label: 'Surface développée (revêtement)', valeur: `${surfaceDeveloppee} m²` },
    ...(nombrePaquetsBardeaux !== undefined
      ? [{ label: 'Paquets de bardeaux (avec surplus 15 %)', valeur: `${nombrePaquetsBardeaux} paquets` }]
      : []),
    ...(surfaceMembraneM2 !== undefined
      ? [{ label: 'Surface membrane (avec surplus 15 %)', valeur: `${surfaceMembraneM2} m²` }]
      : []),
    { label: 'Nombre de chevrons', valeur: `${nombreChevrons}` },
    { label: 'Longueur des chevrons', valeur: `${longueurChevrons} mm` },
    { label: 'Ventilation entrée (soffites)', valeur: `${ventilationEntreeCm2} cm²` },
    { label: 'Ventilation sortie (faîtière)', valeur: `${ventilationSortieCm2} cm²` },
    { label: 'Charge de neige — région', valeur: `${chargeNeige} kPa` },
  ];

  const ind = resultats.conformite.pente;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Résultats de l&apos;estimation
            {resultats.estConforme
              ? <Badge variant="default">✓ Pente conforme</Badge>
              : <Badge variant="destructive">Pente insuffisante</Badge>
            }
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
        <CardHeader><CardTitle>Conformité CCQ</CardTitle></CardHeader>
        <CardContent>
          <div className="py-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium">Pente minimale du toit</span>
              <Badge variant={badgeVariant(ind.statut)}>
                {ind.statut === 'conforme' ? '✓ Conforme' : ind.statut === 'avertissement' ? '⚠ Attention' : '✗ Non conforme'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{ind.messageStatut}</p>
            <p className="text-xs text-muted-foreground italic mt-1">{ind.article}</p>
          </div>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            Sources : CCQ 9.26, CCQ 9.19.1, CNB 2020 Annexe C.
            Charge de neige indicative — valeurs officielle dans CNB 2020 Tableau C-2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
