'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResultatsPlancher, IndicateurConformitePlancher, StatutConformite } from '@/lib/plancher/types';
import { DIMENSIONS_SOLIVES } from '@/lib/plancher/normes';

interface Props {
  resultats: ResultatsPlancher;
}

function badgeVariant(statut: StatutConformite): 'default' | 'secondary' | 'destructive' {
  if (statut === 'conforme') return 'default';
  if (statut === 'avertissement') return 'secondary';
  return 'destructive';
}

function IndicateurCard({ indicateur, nom }: { indicateur: IndicateurConformitePlancher; nom: string }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-medium">{nom}</span>
        <Badge variant={badgeVariant(indicateur.statut)}>
          {indicateur.statut === 'conforme' ? '✓ Conforme' : indicateur.statut === 'avertissement' ? '⚠ Attention' : '✗ Problème'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{indicateur.messageStatut}</p>
      <p className="text-xs text-muted-foreground italic">{indicateur.article}</p>
    </div>
  );
}

export function ResultatsPlancher({ resultats }: Props) {
  const {
    dimensionSoliveRecommandee, espacementSolive, nombreSolives,
    longueurTotaleBoisM, quantitePanneaux, epaisseurSousPlancher,
    fleche, flecheMax, chargeVive,
  } = resultats;

  const dims = DIMENSIONS_SOLIVES[dimensionSoliveRecommandee];

  const lignes = [
    { label: 'Solive recommandée', valeur: `${dimensionSoliveRecommandee} (${dims.b}×${dims.h} mm)` },
    { label: 'Espacement des solives', valeur: `${espacementSolive} mm (${Math.round(espacementSolive / 25.4)}")` },
    { label: 'Nombre de solives', valeur: `${nombreSolives}` },
    { label: 'Bois total (solives)', valeur: `${longueurTotaleBoisM} m linéaires` },
    { label: 'Panneaux de sous-plancher', valeur: `${quantitePanneaux} panneaux 4×8 pi` },
    { label: 'Épaisseur sous-plancher', valeur: `${epaisseurSousPlancher} mm` },
    { label: 'Flèche calculée', valeur: `${fleche} mm` },
    { label: 'Flèche maximale (L/360)', valeur: `${flecheMax} mm` },
    { label: 'Charge vive appliquée', valeur: `${chargeVive} kPa` },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Résultats de dimensionnement
            {resultats.estConforme
              ? <Badge variant="default">✓ Tout conforme</Badge>
              : <Badge variant="destructive">{resultats.nbErreurs} erreur(s)</Badge>
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
        <CardHeader><CardTitle>Conformité CNB / CCQ</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y">
            <IndicateurCard indicateur={resultats.conformite.portee} nom="Portée admissible" />
            <IndicateurCard indicateur={resultats.conformite.fleche} nom="Flèche (L/360)" />
          </div>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            Calculs basés sur CNB 2020 (Tableau A-9.23.4.2) et CCQ 9.4.3.1.
            Ces résultats sont préliminaires. Consultez un ingénieur pour la conception finale.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
