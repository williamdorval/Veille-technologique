'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResultatsRampe, IndicateurConformiteRampe, StatutConformite } from '@/lib/rampes/types';

interface Props {
  resultats: ResultatsRampe;
}

function badgeVariant(statut: StatutConformite): 'default' | 'secondary' | 'destructive' {
  if (statut === 'conforme') return 'default';
  if (statut === 'avertissement') return 'secondary';
  return 'destructive';
}

function badgeLabel(statut: StatutConformite): string {
  if (statut === 'conforme') return '✓ Conforme';
  if (statut === 'avertissement') return '⚠ Avertissement';
  return '✗ Non conforme';
}

function IndicateurCard({ indicateur, nom }: { indicateur: IndicateurConformiteRampe; nom: string }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-medium">{nom}</span>
        <Badge variant={badgeVariant(indicateur.statut)}>{badgeLabel(indicateur.statut)}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{indicateur.messageStatut}</p>
      <p className="text-xs text-muted-foreground italic">{indicateur.article}</p>
    </div>
  );
}

export function ResultatsConformite({ resultats }: Props) {
  const {
    hauteurGardeCorpsRequise, hauteurMainCouranteMin, hauteurMainCouranteMax,
    espacementBarreaux, nombrePoteaux, nombreBarreaux, longueurMainCourante,
  } = resultats;

  const dimensions = [
    { label: 'Hauteur garde-corps requise', valeur: `${hauteurGardeCorpsRequise} mm` },
    { label: 'Hauteur main courante', valeur: `${hauteurMainCouranteMin}–${hauteurMainCouranteMax} mm` },
    { label: 'Espacement des barreaux', valeur: `${espacementBarreaux} mm` },
    { label: 'Nombre de poteaux', valeur: `${nombrePoteaux}` },
    { label: 'Nombre de barreaux', valeur: `${nombreBarreaux}` },
    { label: 'Longueur main courante', valeur: `${longueurMainCourante} mm` },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dimensions calculées
            {resultats.estConforme
              ? <Badge variant="default">✓ Tout conforme</Badge>
              : resultats.nbErreurs > 0
                ? <Badge variant="destructive">{resultats.nbErreurs} erreur(s)</Badge>
                : <Badge variant="secondary">{resultats.nbAvertissements} avertissement(s)</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {dimensions.map(({ label, valeur }) => (
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
        <CardHeader>
          <CardTitle>Conformité CCQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <IndicateurCard indicateur={resultats.conformite.hauteurGardeCorps} nom="Hauteur garde-corps" />
            <IndicateurCard indicateur={resultats.conformite.espacementBarreaux} nom="Espacement barreaux" />
            <IndicateurCard indicateur={resultats.conformite.hauteurMainCourante} nom="Hauteur main courante" />
          </div>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            Sources : Code de construction du Québec (CCQ), Chapitre I – Bâtiment, Articles 9.8.7.4, 9.8.8.1, 9.8.8.3.
            Vérifier avec la version officielle (rbq.gouv.qc.ca).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
