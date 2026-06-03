'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PieceMateriaux, EstimationProjet } from '@/lib/escaliers/stair-types';

interface Props {
  materiaux: PieceMateriaux[];
  estimation: EstimationProjet;
  nombreMarches: number;
  largeurMm: number;
}

function formatDims(p: PieceMateriaux): string {
  if (p.longueur === 0) return '—';
  const parts: string[] = [];
  if (p.hauteur) parts.push(`${p.hauteur} mm`);
  if (p.largeur) parts.push(`${p.largeur} mm`);
  parts.push(`${p.longueur} mm`);
  return parts.join(' × ');
}

export function EstimationPro({ materiaux, estimation, nombreMarches, largeurMm }: Props) {
  const coutMateriaux = materiaux.reduce((s, p) => s + p.quantite * p.prixUnitaireIndicatif, 0);
  const coutMainOeuvreMin = estimation.coutMin - Math.round(coutMateriaux * 0.9);
  const coutMainOeuvreMax = estimation.coutMax - Math.round(coutMateriaux * 1.15);
  const tpsRate = 0.05; const tvqRate = 0.09975;
  const taxesMin = Math.round(estimation.coutMin * (tpsRate + tvqRate));
  const taxesMax = Math.round(estimation.coutMax * (tpsRate + tvqRate));

  return (
    <div className="space-y-4">

      {/* En-tête soumission */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Estimation — Escalier {nombreMarches} marches</CardTitle>
            <Badge variant="outline">{largeurMm} mm de largeur</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Document d&apos;estimation pour client ou soumission d&apos;entrepreneur.
          </p>
        </CardHeader>
        <CardContent>
          {/* Résumé chiffré */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Matériaux</p>
              <p className="text-xl font-bold">{Math.round(coutMateriaux)} $</p>
              <p className="text-xs text-muted-foreground">avant taxes</p>
            </div>
            <div className="text-center rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Main-d&apos;oeuvre</p>
              <p className="text-xl font-bold">{estimation.tempsHeures} h</p>
              <p className="text-xs text-muted-foreground">à 55–75 $/h</p>
            </div>
            <div className="text-center rounded-lg bg-primary/10 border border-primary p-3">
              <p className="text-xs text-muted-foreground">Total estimé</p>
              <p className="text-xl font-bold text-primary">
                {estimation.coutMin} $–{estimation.coutMax} $
              </p>
              <p className="text-xs text-muted-foreground">avant taxes</p>
            </div>
          </div>

          {/* Ligne taxes */}
          <div className="rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm mb-4">
            <p className="font-medium text-amber-800 dark:text-amber-200">Avec taxes (TPS + TVQ 14,975 %)</p>
            <p className="text-amber-700 dark:text-amber-300">
              {estimation.coutMin + taxesMin} $ – {estimation.coutMax + taxesMax} $ CAD
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des matériaux détaillée */}
      <Card>
        <CardHeader><CardTitle>Liste des matériaux — détail</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left py-2 pr-2">Pièce</th>
                  <th className="text-right py-2 px-1">Qté</th>
                  <th className="text-right py-2 px-1">Dimensions</th>
                  <th className="text-right py-2 px-1">Prix unit.</th>
                  <th className="text-right py-2 pl-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {materiaux.map((p, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-2 font-medium">{p.nom}</td>
                    <td className="py-2 px-1 text-right">{p.quantite} {p.unite !== 'mm' ? p.unite : ''}</td>
                    <td className="py-2 px-1 text-right text-muted-foreground text-xs">{formatDims(p)}</td>
                    <td className="py-2 px-1 text-right">{p.prixUnitaireIndicatif.toFixed(2)} $</td>
                    <td className="py-2 pl-1 text-right font-medium">{(p.quantite * p.prixUnitaireIndicatif).toFixed(2)} $</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td colSpan={4} className="py-2 pr-1">Sous-total matériaux</td>
                  <td className="py-2 pl-1 text-right">{coutMateriaux.toFixed(2)} $</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Separator className="my-3" />

          {/* Main-d'oeuvre */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Main-d&apos;oeuvre estimée ({estimation.tempsHeures} h)</span>
              <span>{Math.round(estimation.tempsHeures * 55)} $–{Math.round(estimation.tempsHeures * 75)} $</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total avant taxes</span>
              <span>{estimation.coutMin} $–{estimation.coutMax} $</span>
            </div>
            <div className="flex justify-between text-amber-700 dark:text-amber-400">
              <span>TPS + TVQ (14,975 %)</span>
              <span>+{taxesMin} $–{taxesMax} $</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total avec taxes</span>
              <span>{estimation.coutMin + taxesMin} $–{estimation.coutMax + taxesMax} $ CAD</span>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Disclaimer */}
          <div className="rounded bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Source des prix : Canac, Rona, BMR — Québec 2025</p>
            <p>{estimation.avertissementPrix}</p>
          </div>
        </CardContent>
      </Card>

      {/* Note pour soumission */}
      <Card>
        <CardHeader><CardTitle className="text-base">Note pour soumission</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>Cette estimation est valide pour un escalier droit standard, sans courbe ni palier.</p>
          <p>Les prix de main-d&apos;oeuvre (55–75 $/h) correspondent aux taux d&apos;un charpentier qualifié au Québec en 2025.</p>
          <p>Pour une soumission formelle, ajouter : permis de construction (~150–500 $), location d&apos;équipement si requis, et marge de profit (15–25 %).</p>
          <p className="font-medium text-foreground">Ce document est un outil d&apos;aide — pas un contrat. Toujours valider avec un professionnel certifié RBQ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
