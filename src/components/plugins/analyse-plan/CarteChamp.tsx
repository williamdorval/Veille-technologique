'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import type { ChampAnalyse, StatutChamp } from '@/lib/analyse-plan/types';

interface Props {
  champ: ChampAnalyse;
  valeurValidee: string;
  estAccepte: boolean | null;
  onAccepter: () => void;
  onRejeter: () => void;
  onChangerValeur: (val: string) => void;
}

interface ConfigBadge {
  label: string;
  className: string;
}

function configBadge(statut: StatutChamp, confiance: number): ConfigBadge {
  if (statut === 'introuvable') {
    return {
      label: 'Introuvable',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0',
    };
  }
  if (statut === 'illisible') {
    return {
      label: 'Illisible',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0',
    };
  }
  if (statut === 'incertain') {
    return {
      label: `Incertain ${confiance}%`,
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0',
    };
  }
  if (statut === 'ok' && confiance >= 80) {
    return {
      label: `OK ${confiance}%`,
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0',
    };
  }
  // ok but lower confidence
  return {
    label: `OK ${confiance}%`,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0',
  };
}

export function CarteChamp({
  champ,
  valeurValidee,
  estAccepte,
  onAccepter,
  onRejeter,
  onChangerValeur,
}: Props) {
  const badge = configBadge(champ.statut, champ.confiance);
  const estRequis = champ.statut === 'introuvable' || champ.statut === 'illisible';
  const afficherBoutons = !estRequis;
  const afficherInput = estRequis || estAccepte === false;
  const labelInput = champ.statut === 'introuvable' ? 'Valeur requise' : 'Valeur corrigée';
  const inputManquant = estRequis && !valeurValidee.trim();

  const carteClassName = [
    'border rounded-xl p-4 space-y-3',
    estRequis
      ? 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900'
      : 'bg-card border-border',
  ].join(' ');

  return (
    <div className={carteClassName}>
      {/* Header : label + badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-sm text-foreground leading-snug">
          {champ.etiquette}
        </span>
        <Badge className={`${badge.className} flex-shrink-0 text-xs font-semibold px-2 py-0.5`}>
          {badge.label}
        </Badge>
      </div>

      {/* Valeur proéminente */}
      <div className="space-y-0.5">
        <p className="text-xl font-bold text-foreground">
          {champ.valeur != null ? `${champ.valeur}${champ.unite ? ` ${champ.unite}` : ''}` : '—'}
        </p>
        {champ.note && (
          <p className="text-xs text-muted-foreground italic">{champ.note}</p>
        )}
      </div>

      {/* Boutons Oui / Non */}
      {afficherBoutons && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            type="button"
            className={[
              'min-h-11 font-semibold transition-all duration-150',
              estAccepte === true
                ? 'bg-green-500 hover:bg-green-600 text-white border-transparent'
                : 'bg-transparent hover:bg-green-50 dark:hover:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700',
            ].join(' ')}
            variant={estAccepte === true ? 'default' : 'outline'}
            onClick={onAccepter}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Oui
          </Button>
          <Button
            size="lg"
            type="button"
            className={[
              'min-h-11 font-semibold transition-all duration-150',
              estAccepte === false
                ? 'bg-red-500 hover:bg-red-600 text-white border-transparent'
                : 'bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700',
            ].join(' ')}
            variant={estAccepte === false ? 'default' : 'outline'}
            onClick={onRejeter}
          >
            <X className="mr-1.5 h-4 w-4" />
            Non
          </Button>
        </div>
      )}

      {/* Champ de correction / saisie requise */}
      {afficherInput && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">{labelInput}</Label>
          <Input
            value={valeurValidee}
            onChange={(e) => onChangerValeur(e.target.value)}
            placeholder={labelInput}
            className={[
              'min-h-11',
              inputManquant
                ? 'border-red-500 focus-visible:ring-red-500'
                : '',
            ].join(' ')}
          />
          {inputManquant && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Ce champ est requis pour générer l&apos;Excel
            </p>
          )}
        </div>
      )}
    </div>
  );
}
