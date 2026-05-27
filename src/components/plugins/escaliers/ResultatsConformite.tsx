'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResultatCalcul, IndicateurConformite, StatutConformite } from '@/lib/escaliers/types';

interface Props {
  resultat: ResultatCalcul;
}

function mmEnPouces(mm: number): string {
  return (mm / 25.4).toFixed(2);
}

function badgeVariant(statut: StatutConformite): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (statut === 'conforme') return 'default';
  if (statut === 'avertissement') return 'secondary';
  return 'destructive';
}

function badgeLabel(statut: StatutConformite): string {
  if (statut === 'conforme') return '✓ Conforme';
  if (statut === 'avertissement') return '⚠ Avertissement';
  return '✗ Non conforme';
}

function IndicateurCard({ indicateur }: { indicateur: IndicateurConformite }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-medium">{indicateur.nom}</span>
        <Badge variant={badgeVariant(indicateur.statut)}>
          {badgeLabel(indicateur.statut)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{indicateur.messageStatut}</p>
      <p className="text-xs text-muted-foreground italic">{indicateur.articleCCQ}</p>
    </div>
  );
}

export function ResultatsConformite({ resultat }: Props) {
  const { nombreMarches, hauteurContremarche, giron, longueurAuSol, longueurLimon, angleDegres } = resultat;

  const lignesDimensions = [
    { label: 'Nombre de marches', valeur: `${nombreMarches}`, unite: '' },
    { label: 'Hauteur de contremarche', valeur: `${hauteurContremarche}`, unite: `mm (${mmEnPouces(hauteurContremarche)} po)` },
    { label: 'Giron (profondeur)', valeur: `${giron}`, unite: `mm (${mmEnPouces(giron)} po)` },
    { label: 'Longueur au sol', valeur: `${longueurAuSol}`, unite: `mm (${mmEnPouces(longueurAuSol)} po)` },
    { label: 'Longueur du limon', valeur: `${longueurLimon}`, unite: `mm (${mmEnPouces(longueurLimon)} po)` },
    { label: 'Angle', valeur: `${angleDegres}°`, unite: '' },
  ];

  const indicateurs = [
    resultat.conformite.contremarche,
    resultat.conformite.giron,
    resultat.conformite.blondel,
    resultat.conformite.degagementTete,
    resultat.conformite.largeur,
  ];

  return (
    <div className="space-y-4">
      {/* Résumé global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dimensions calculées
            {resultat.estConforme ? (
              <Badge variant="default">✓ Tout conforme</Badge>
            ) : resultat.nbErreurs > 0 ? (
              <Badge variant="destructive">{resultat.nbErreurs} erreur{resultat.nbErreurs > 1 ? 's' : ''}</Badge>
            ) : (
              <Badge variant="secondary">{resultat.nbAvertissements} avertissement{resultat.nbAvertissements > 1 ? 's' : ''}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {lignesDimensions.map(({ label, valeur, unite }) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="py-1.5 text-muted-foreground">{label}</td>
                  <td className="py-1.5 font-medium text-right">
                    {valeur} <span className="text-muted-foreground font-normal">{unite}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Indicateurs de conformité */}
      <Card>
        <CardHeader>
          <CardTitle>Conformité CCQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {indicateurs.map((ind, i) => (
              <div key={i}>
                <IndicateurCard indicateur={ind} />
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            Sources : Code de construction du Québec (CCQ), Chapitre I — Bâtiment, Partie 9.
            Vérifier avec la version officielle en vigueur (rbq.gouv.qc.ca).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
