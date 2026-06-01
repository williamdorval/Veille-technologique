'use client';

import { useState } from 'react';
import { Loader2, Download, ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ecrireValeursExcel } from '@/lib/analyse-plan/excel';
import type { ResultatAnalyse, ValeurValidee } from '@/lib/analyse-plan/types';
import { CarteChamp } from './CarteChamp';

interface Props {
  resultat: ResultatAnalyse;
  excelBuffer: ArrayBuffer;
  onRecommencer: () => void;
}

export function ListeValidation({ resultat, excelBuffer, onRecommencer }: Props) {
  const [valeurs, setValeurs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const c of resultat.champs) {
      init[c.cle] = c.valeur?.toString() ?? '';
    }
    return init;
  });

  const [decisions, setDecisions] = useState<Record<string, boolean | null>>(() => {
    const init: Record<string, boolean | null> = {};
    for (const c of resultat.champs) {
      init[c.cle] = c.statut === 'ok' && c.confiance >= 80 ? true : null;
    }
    return init;
  });

  const [enGenerating, setEnGenerating] = useState(false);
  const [erreurGeneration, setErreurGeneration] = useState<string | null>(null);

  const nbOk = Object.values(decisions).filter((d) => d === true).length;
  const nbNonDecide = resultat.champs.filter((c) => decisions[c.cle] === null).length;
  const nbRequis = resultat.champs.filter(
    (c) =>
      (c.statut === 'introuvable' || c.statut === 'illisible') && !valeurs[c.cle]?.trim()
  ).length;
  const peutGenerer = nbRequis === 0 && nbNonDecide === 0;

  async function genererExcel() {
    setEnGenerating(true);
    setErreurGeneration(null);
    try {
      const valeursValidees: ValeurValidee[] = resultat.champs
        .filter(
          (c) =>
            decisions[c.cle] === true ||
            c.statut === 'introuvable' ||
            c.statut === 'illisible'
        )
        .map((c) => ({
          celluleCible: c.celluleCible,
          valeur: valeurs[c.cle] ?? '',
        }));

      const bufferResultat = await ecrireValeursExcel(excelBuffer, valeursValidees);

      const blob = new Blob([bufferResultat], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `plan-analyse-${dateStr}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setErreurGeneration(e instanceof Error ? e.message : 'Erreur lors de la génération');
    } finally {
      setEnGenerating(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-foreground">Validation des champs</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRecommencer}
          className="text-muted-foreground hover:text-foreground gap-1.5"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Recommencer
        </Button>
      </div>

      {/* Récap badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {nbOk} accepté{nbOk !== 1 ? 's' : ''}
        </Badge>
        {nbNonDecide > 0 && (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            {nbNonDecide} à valider
          </Badge>
        )}
        {nbRequis > 0 && (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold">
            <AlertCircle className="h-3.5 w-3.5" />
            {nbRequis} saisie{nbRequis !== 1 ? 's' : ''} requise{nbRequis !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Cartes de champs */}
      <div className="space-y-3">
        {resultat.champs.map((champ) => (
          <CarteChamp
            key={champ.cle}
            champ={champ}
            valeurValidee={valeurs[champ.cle] ?? ''}
            estAccepte={decisions[champ.cle] ?? null}
            onAccepter={() => setDecisions((d) => ({ ...d, [champ.cle]: true }))}
            onRejeter={() => setDecisions((d) => ({ ...d, [champ.cle]: false }))}
            onChangerValeur={(val) => setValeurs((v) => ({ ...v, [champ.cle]: val }))}
          />
        ))}
      </div>

      {/* Erreur génération */}
      {erreurGeneration && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de génération</AlertTitle>
          <AlertDescription>{erreurGeneration}</AlertDescription>
        </Alert>
      )}

      {/* Bouton Générer */}
      <Button
        onClick={genererExcel}
        disabled={!peutGenerer || enGenerating}
        className="w-full min-h-14 text-lg font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-md transition-all duration-200"
        size="lg"
        type="button"
      >
        {enGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Génération en cours&hellip;
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            {peutGenerer ? "Générer l'Excel" : "Compléter les champs requis"}
          </>
        )}
      </Button>
    </div>
  );
}
