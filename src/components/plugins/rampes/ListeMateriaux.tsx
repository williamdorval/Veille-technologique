'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieceMateriaux } from '@/lib/rampes/types';

interface Props {
  pieces: PieceMateriaux[];
}

function cmEnMetres(cm: number): string {
  return (cm / 100).toFixed(2);
}

function exportCSV(pieces: PieceMateriaux[]): void {
  const header = 'Pièce,Quantité,Longueur (cm),Longueur (m),Unité,Matériau,Note';
  const lignes = pieces.map(p =>
    `"${p.nom}",${p.quantite},${p.longueur},${cmEnMetres(p.longueur)},"${p.unite}","${p.materiau}","${p.noteIndicative ?? ''}"`
  );
  const csv = [header, ...lignes].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'materiaux-rampe.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function ListeMateriaux({ pieces }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des matériaux</CardTitle>
        <button
          onClick={() => exportCSV(pieces)}
          className="text-xs px-3 py-1 rounded border hover:bg-muted transition-colors"
        >
          Exporter CSV
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium text-muted-foreground">Pièce</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Qté</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Longueur</th>
                <th className="py-2 text-left font-medium text-muted-foreground pl-3">Matériau</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p) => (
                <tr key={p.nom} className="border-b last:border-0">
                  <td className="py-2">
                    <div>{p.nom}</div>
                    {p.noteIndicative && (
                      <div className="text-xs text-muted-foreground">{p.noteIndicative}</div>
                    )}
                  </td>
                  <td className="py-2 text-right">{p.quantite} {p.unite}</td>
                  <td className="py-2 text-right">{p.longueur} cm</td>
                  <td className="py-2 text-left pl-3 text-muted-foreground">{p.materiau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Quantités calculées automatiquement. Ajouter 10 % de surplus pour les coupes.
          Prix non inclus — variables selon fournisseur.
        </p>
      </CardContent>
    </Card>
  );
}
