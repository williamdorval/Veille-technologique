'use client';

import { useState } from 'react';
import { Check, X, Pencil, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { ChampAnalyse, StatutChamp } from '@/lib/analyse-plan/types';

// ─── Sub-components ────────────────────────────────────────────────────────────

function BadgeStatut({ statut, confiance }: { statut: StatutChamp; confiance: number }) {
  if (statut === 'ok' && confiance >= 80)
    return (
      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        Trouvé · {confiance}%
      </span>
    );
  if (statut === 'incertain')
    return (
      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
        À vérifier · {confiance}%
      </span>
    );
  if (statut === 'introuvable')
    return (
      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
        Pas trouvé
      </span>
    );
  return (
    <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
      Illisible
    </span>
  );
}

function CorrectionInput({
  valeurInitiale,
  onConfirmer,
}: {
  valeurInitiale: string;
  onConfirmer: (val: string) => void;
}) {
  const [val, setVal] = useState(valeurInitiale);
  return (
    <div className="space-y-3">
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Entrez la valeur correcte"
        className="min-h-12 text-base"
        autoFocus
      />
      <Button
        onClick={() => onConfirmer(val)}
        disabled={!val.trim()}
        className="w-full min-h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
      >
        <Check className="h-4 w-4 mr-2" />
        Confirmer la correction
      </Button>
    </div>
  );
}

function SaisieObligatoire({
  valeur,
  onChangerValeur,
  onConfirmer,
}: {
  valeur: string;
  onChangerValeur: (v: string) => void;
  onConfirmer: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={valeur}
        onChange={(e) => onChangerValeur(e.target.value)}
        placeholder="ex. 196 3/8"
        className={`min-h-12 text-base ${
          !valeur.trim()
            ? 'border-red-400 focus-visible:ring-red-400'
            : 'border-green-400'
        }`}
        autoFocus
      />
      <Button
        onClick={() => onConfirmer(valeur)}
        disabled={!valeur.trim()}
        className="w-full min-h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold"
      >
        <ArrowRight className="h-4 w-4 mr-2" />
        Confirmer et continuer
      </Button>
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  champ: ChampAnalyse;
  valeurValidee: string;
  decision: boolean | null;
  estOuiNon: boolean;
  onAccepter: () => void;
  onRejeter: () => void;
  onConfirmerCorrection: (val: string) => void;
  onChangerValeur: (val: string) => void;
  onConfirmerSaisie: (val: string) => void;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CarteChamp({
  champ,
  valeurValidee,
  decision,
  estOuiNon,
  onAccepter,
  onRejeter,
  onConfirmerCorrection,
  onChangerValeur,
  onConfirmerSaisie,
}: Props) {
  const estManquant = champ.statut === 'introuvable' || champ.statut === 'illisible';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {champ.etiquette}
          </h3>
          <BadgeStatut statut={champ.statut} confiance={champ.confiance} />
        </div>

        {champ.valeur && !estManquant && (
          <div className="text-3xl font-bold text-foreground">
            {champ.valeur}
            {champ.unite ? (
              <span className="text-lg font-normal text-muted-foreground ml-1">
                {champ.unite}
              </span>
            ) : null}
          </div>
        )}

        {champ.note && (
          <p className="text-sm text-muted-foreground italic">{champ.note}</p>
        )}
      </div>

      <Separator />

      {/* Zone d'action */}
      <div className="px-6 py-5">
        {estOuiNon ? (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={onAccepter}
              variant={decision === true ? 'default' : 'outline'}
              className={
                decision === true
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'border border-green-300 text-green-700'
              }
            >
              <Check className="h-4 w-4 mr-1.5" />
              Oui
            </Button>
            <Button
              onClick={onRejeter}
              variant={decision === false ? 'default' : 'outline'}
              className={
                decision === false
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'border border-red-300 text-red-700'
              }
            >
              <X className="h-4 w-4 mr-1.5" />
              Non
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onChangerValeur('—');
                onAccepter();
              }}
              className="text-muted-foreground"
            >
              Non spécifié
            </Button>
          </div>
        ) : estManquant ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {champ.statut === 'introuvable'
                ? "Cette information n'apparaît pas sur le plan. Entrez-la manuellement."
                : "L'IA voit cette information mais ne peut pas la lire. Entrez la valeur correcte."}
            </p>
            <SaisieObligatoire
              valeur={valeurValidee}
              onChangerValeur={onChangerValeur}
              onConfirmer={onConfirmerSaisie}
            />
          </div>
        ) : decision !== false ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onAccepter}
              className="min-h-12 bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              <Check className="h-4 w-4 mr-2" />
              Oui, correct
            </Button>
            <Button
              onClick={onRejeter}
              variant="outline"
              className="min-h-12 border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Non, corriger
            </Button>
          </div>
        ) : (
          <CorrectionInput
            valeurInitiale={valeurValidee || champ.valeur?.toString() || ''}
            onConfirmer={onConfirmerCorrection}
          />
        )}
      </div>
    </div>
  );
}
