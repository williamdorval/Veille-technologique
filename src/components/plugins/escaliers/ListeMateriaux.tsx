'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PieceMateriaux, EstimationProjet } from '@/lib/escaliers/types';
import { NORMES_CCQ, LABELS_MATERIAU_LIMON, LABELS_TYPE_MARCHE } from '@/lib/escaliers/normes';

interface Props {
  materiaux: PieceMateriaux[];
  estimation: EstimationProjet;
  nombreMarches: number;
  largeurEscalier: number;
  hauteurChute: number;
}

function nomMateriau(m: string): string {
  return (
    (LABELS_MATERIAU_LIMON as Record<string, string>)[m] ||
    (LABELS_TYPE_MARCHE as Record<string, string>)[m] ||
    m
  );
}

function formatDimensions(piece: PieceMateriaux): string {
  if (piece.longueur === 0) return '—';
  const dims: string[] = [];
  if (piece.hauteur) dims.push(`${piece.hauteur} mm`);
  if (piece.largeur) dims.push(`${piece.largeur} mm`);
  dims.push(`${piece.longueur} mm`);
  return dims.join(' × ');
}

export function ListeMateriaux({ materiaux, estimation, nombreMarches, largeurEscalier, hauteurChute }: Props) {
  const coutTotal = materiaux.reduce((sum, p) => sum + p.quantite * p.prixUnitaireIndicatif, 0);
  const mainCouranteRequise = nombreMarches >= NORMES_CCQ.MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES;
  const gardeCorpsRequis = hauteurChute > NORMES_CCQ.GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM;
  const doubleMainCourante = largeurEscalier >= NORMES_CCQ.MAIN_COURANTE_DOUBLE_LARGEUR_MM;

  return (
    <div className="space-y-4">
      {/* Alertes normes */}
      {(mainCouranteRequise || gardeCorpsRequis) && (
        <div className="flex flex-wrap gap-2">
          {mainCouranteRequise && (
            <Badge variant="secondary">
              ⚠ Main courante requise (Art. 9.8.7.4 CCQ)
              {doubleMainCourante ? ' — deux côtés' : ''}
            </Badge>
          )}
          {gardeCorpsRequis && (
            <Badge variant="secondary">
              ⚠ Garde-corps requis (Art. 9.8.8 CCQ)
            </Badge>
          )}
        </div>
      )}

      {/* Tableau de matériaux */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des matériaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-3">Pièce</th>
                  <th className="text-right py-2 px-2">Qté</th>
                  <th className="text-right py-2 px-2">Dimensions</th>
                  <th className="text-right py-2 pl-2">Matériau</th>
                </tr>
              </thead>
              <tbody>
                {materiaux.map((piece, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{piece.nom}</td>
                    <td className="py-2 px-2 text-right">{piece.quantite} {piece.unite !== 'mm' ? piece.unite : ''}</td>
                    <td className="py-2 px-2 text-right text-muted-foreground text-xs">{formatDimensions(piece)}</td>
                    <td className="py-2 pl-2 text-right text-muted-foreground">{nomMateriau(piece.materiau)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-3" />

          {/* Coût estimé */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Coût estimé des matériaux</span>
              <span>{estimation.coutMin} $ – {estimation.coutMax} $ CAD</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Sous-total calculé</span>
              <span>{Math.round(coutTotal)} $ CAD</span>
            </div>
          </div>

          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">{estimation.avertissementPrix}</p>
        </CardContent>
      </Card>

      {/* Rappel main courante / garde-corps */}
      {(mainCouranteRequise || gardeCorpsRequis) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Éléments de sécurité requis par le CCQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {mainCouranteRequise && (
              <div>
                <p className="font-medium">Main courante (Art. 9.8.7.4)</p>
                <p className="text-muted-foreground">
                  Hauteur : {NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MIN_MM}–{NORMES_CCQ.MAIN_COURANTE_HAUTEUR_MAX_MM} mm
                  depuis le nez de marche.
                  {doubleMainCourante && ' Escalier ≥ 1 100 mm : main courante des deux côtés obligatoire.'}
                </p>
              </div>
            )}
            {gardeCorpsRequis && (
              <div>
                <p className="font-medium">Garde-corps (Art. 9.8.8)</p>
                <p className="text-muted-foreground">
                  Hauteur minimale : {NORMES_CCQ.GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM} mm.
                  Espacement max entre barreaux : {NORMES_CCQ.GARDE_CORPS_BALUSTRE_MAX_MM} mm.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
