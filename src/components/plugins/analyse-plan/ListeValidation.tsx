'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Loader2,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ecrireValeursExcel } from '@/lib/analyse-plan/excel';
import type { ResultatAnalyse, ValeurValidee, ChampAnalyse } from '@/lib/analyse-plan/types';
import { CarteChamp } from './CarteChamp';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOT_CLES_OUI_NON = [
  'livraison',
  'installation',
  'démolition',
  'demolition',
  'pick-up',
  'pickup',
  'pick up',
];

function estChampOuiNon(champ: ChampAnalyse): boolean {
  const etiq = champ.etiquette.toLowerCase();
  return MOT_CLES_OUI_NON.some((mot) => etiq.includes(mot));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  resultat: ResultatAnalyse;
  excelBuffer: ArrayBuffer;
  onRecommencer: () => void;
}

type Ecran = 'intro' | 'validation' | 'recapitulatif';

// ─── Écran intro ──────────────────────────────────────────────────────────────

function EcranIntro({
  nbTrouves,
  nbManquants,
  onRecommencer,
  onCommencer,
}: {
  nbTrouves: number;
  nbManquants: number;
  onRecommencer: () => void;
  onCommencer: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
          <ClipboardCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold">Analyse terminée</h2>
        <p className="text-muted-foreground">
          {nbTrouves} valeur{nbTrouves > 1 ? 's' : ''} détectée{nbTrouves > 1 ? 's' : ''} à confirmer,{' '}
          {nbManquants} champ{nbManquants > 1 ? 's' : ''} à compléter manuellement.
        </p>
      </div>
      <div className="flex justify-center gap-3 flex-wrap">
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0 px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          {nbTrouves} valeurs trouvées
        </Badge>
        {nbManquants > 0 && (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0 px-3 py-1">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            {nbManquants} à compléter
          </Badge>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" onClick={onRecommencer} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Recommencer
        </Button>
        <Button
          onClick={onCommencer}
          className="flex-1 min-h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
        >
          Commencer la validation
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Écran récapitulatif ──────────────────────────────────────────────────────

function EcranRecapitulatif({
  champs,
  valeurs,
  erreur,
  enGenerating,
  onRetour,
  onGenerer,
}: {
  champs: ChampAnalyse[];
  valeurs: Record<string, string>;
  erreur: string | null;
  enGenerating: boolean;
  onRetour: () => void;
  onGenerer: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">Récapitulatif</h2>
        <p className="text-muted-foreground text-sm">
          Vérifiez les valeurs avant de générer l'Excel
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {champs.map((c) => {
            const valeurFinale = valeurs[c.cle] ?? '';
            const vide = !valeurFinale.trim();
            return (
              <div
                key={c.cle}
                className={`flex items-center justify-between px-4 py-3 ${
                  vide ? 'bg-red-50/50 dark:bg-red-950/10' : ''
                }`}
              >
                <span className="text-sm text-muted-foreground">{c.etiquette}</span>
                <span
                  className={`text-sm font-medium ${
                    vide ? 'text-red-500 italic' : 'text-foreground'
                  }`}
                >
                  {vide ? '— non rempli' : `${valeurFinale}${c.unite ? ` ${c.unite}` : ''}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {erreur && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{erreur}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onRetour} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Corriger
        </Button>
        <Button
          onClick={onGenerer}
          disabled={enGenerating}
          className="flex-1 min-h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
        >
          {enGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération…
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Générer l'Excel
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Orchestrateur principal ──────────────────────────────────────────────────

export function ListeValidation({ resultat, excelBuffer, onRecommencer }: Props) {
  const champsOrdonnes = useMemo(
    () => [
      ...resultat.champs.filter((c) => c.statut === 'ok' || c.statut === 'incertain'),
      ...resultat.champs.filter((c) => c.statut === 'introuvable' || c.statut === 'illisible'),
    ],
    [resultat.champs]
  );

  const [ecran, setEcran] = useState<Ecran>('intro');
  const [indexCourant, setIndexCourant] = useState(0);

  // Bug fix A : introuvable/illisible → toujours vide
  const [valeurs, setValeurs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const c of resultat.champs) {
      init[c.cle] =
        c.statut === 'introuvable' || c.statut === 'illisible'
          ? ''
          : (c.valeur?.toString() ?? '');
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

  const nbTrouves = resultat.champs.filter(
    (c) => c.statut === 'ok' || c.statut === 'incertain'
  ).length;
  const nbManquants = resultat.champs.filter(
    (c) => c.statut === 'introuvable' || c.statut === 'illisible'
  ).length;

  function avancer() {
    if (indexCourant < champsOrdonnes.length - 1) {
      setIndexCourant((i) => i + 1);
    } else {
      setEcran('recapitulatif');
    }
  }

  function reculer() {
    if (indexCourant > 0) setIndexCourant((i) => i - 1);
    else setEcran('intro');
  }

  // Bug fix B : inclure champs corrigés (decision === false + valeur saisie)
  async function genererExcel() {
    setEnGenerating(true);
    setErreurGeneration(null);
    try {
      const valeursValidees: ValeurValidee[] = champsOrdonnes
        .filter((c) => {
          if (c.statut === 'introuvable' || c.statut === 'illisible')
            return (valeurs[c.cle]?.trim().length ?? 0) > 0;
          if (decisions[c.cle] === true) return true;
          if (decisions[c.cle] === false && valeurs[c.cle]?.trim()) return true;
          return false;
        })
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

  const champCourant = champsOrdonnes[indexCourant];

  if (ecran === 'intro') {
    return (
      <EcranIntro
        nbTrouves={nbTrouves}
        nbManquants={nbManquants}
        onRecommencer={onRecommencer}
        onCommencer={() => setEcran('validation')}
      />
    );
  }

  if (ecran === 'recapitulatif') {
    return (
      <EcranRecapitulatif
        champs={champsOrdonnes}
        valeurs={valeurs}
        erreur={erreurGeneration}
        enGenerating={enGenerating}
        onRetour={() => {
          setEcran('validation');
          setIndexCourant(champsOrdonnes.length - 1);
        }}
        onGenerer={genererExcel}
      />
    );
  }

  // Écran validation
  const pctProgression = Math.round((indexCourant / champsOrdonnes.length) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Barre de progression */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Champ {indexCourant + 1} sur {champsOrdonnes.length}
          </span>
          <span>{pctProgression}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${pctProgression}%` }}
          />
        </div>
      </div>

      {/* Carte courante */}
      <CarteChamp
        champ={champCourant}
        valeurValidee={valeurs[champCourant.cle] ?? ''}
        decision={decisions[champCourant.cle]}
        estOuiNon={estChampOuiNon(champCourant)}
        onAccepter={() => {
          setDecisions((d) => ({ ...d, [champCourant.cle]: true }));
          avancer();
        }}
        onRejeter={() => {
          setDecisions((d) => ({ ...d, [champCourant.cle]: false }));
        }}
        onConfirmerCorrection={(val: string) => {
          setValeurs((v) => ({ ...v, [champCourant.cle]: val }));
          setDecisions((d) => ({ ...d, [champCourant.cle]: false }));
          avancer();
        }}
        onChangerValeur={(val: string) => {
          setValeurs((v) => ({ ...v, [champCourant.cle]: val }));
        }}
        onConfirmerSaisie={(val: string) => {
          setValeurs((v) => ({ ...v, [champCourant.cle]: val }));
          avancer();
        }}
      />

      {/* Navigation bas */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={reculer} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        {(champCourant.statut === 'ok' || champCourant.statut === 'incertain') && (
          <Button variant="ghost" onClick={avancer} className="text-muted-foreground">
            Passer
          </Button>
        )}
      </div>

      <Separator />

      {/* Lien vers récap */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEcran('recapitulatif')}
          className="text-muted-foreground text-xs gap-1"
        >
          <Check className="h-3.5 w-3.5" />
          Voir le récapitulatif
        </Button>
      </div>
    </div>
  );
}
