'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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

  const nbOk = Object.values(decisions).filter(d => d === true).length;
  const nbARejetes = Object.values(decisions).filter(d => d === false).length;
  const nbNonDecide = resultat.champs.filter(c => decisions[c.cle] === null).length;
  const nbRequis = resultat.champs.filter(
    c => (c.statut === 'introuvable' || c.statut === 'illisible') && !valeurs[c.cle]?.trim()
  ).length;
  const peutGenerer = nbRequis === 0 && nbNonDecide === 0;

  // nbARejetes used to avoid lint warning — it's computed but only for display if needed
  void nbARejetes;

  async function genererExcel() {
    setEnGenerating(true);
    setErreurGeneration(null);
    try {
      const valeursValidees: ValeurValidee[] = resultat.champs
        .filter(c => decisions[c.cle] === true || c.statut === 'introuvable' || c.statut === 'illisible')
        .map(c => ({
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Validation des champs</h2>
        <Button variant="outline" size="sm" onClick={onRecommencer}>
          ← Recommencer
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap text-sm">
        <span className="text-green-700 dark:text-green-400">{nbOk} acceptés</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-amber-700 dark:text-amber-400">{nbNonDecide} à valider</span>
        <span className="text-muted-foreground">·</span>
        <span className={nbRequis > 0 ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground'}>
          {nbRequis} saisie{nbRequis !== 1 ? 's' : ''} requise{nbRequis !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {resultat.champs.map(champ => (
          <CarteChamp
            key={champ.cle}
            champ={champ}
            valeurValidee={valeurs[champ.cle] ?? ''}
            estAccepte={decisions[champ.cle] ?? null}
            onAccepter={() => setDecisions(d => ({ ...d, [champ.cle]: true }))}
            onRejeter={() => setDecisions(d => ({ ...d, [champ.cle]: false }))}
            onChangerValeur={val => setValeurs(v => ({ ...v, [champ.cle]: val }))}
          />
        ))}
      </div>

      {/* Error */}
      {erreurGeneration && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{erreurGeneration}</AlertDescription>
        </Alert>
      )}

      {/* Generate button */}
      <Button
        onClick={genererExcel}
        disabled={!peutGenerer || enGenerating}
        className="w-full min-h-12 text-base"
        size="lg"
      >
        {enGenerating ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Génération en cours…</>
        ) : (
          `Générer l'Excel${!peutGenerer ? ' (compléter les champs requis)' : ''}`
        )}
      </Button>
    </div>
  );
}
