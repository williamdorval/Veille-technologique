'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChampAnalyse, StatutChamp } from '@/lib/analyse-plan/types';

interface Props {
  champ: ChampAnalyse;
  valeurValidee: string;
  estAccepte: boolean | null;
  onAccepter: () => void;
  onRejeter: () => void;
  onChangerValeur: (val: string) => void;
}

function configBadge(statut: StatutChamp, confiance: number): { label: string; className: string } {
  if (statut === 'ok' && confiance >= 80) {
    return { label: `OK ${confiance}%`, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0' };
  }
  if (statut === 'incertain') {
    return { label: `Incertain ${confiance}%`, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0' };
  }
  if (statut === 'introuvable') {
    return { label: 'Introuvable', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0' };
  }
  if (statut === 'illisible') {
    return { label: 'Illisible', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0' };
  }
  // ok but lower confidence
  return { label: `OK ${confiance}%`, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0' };
}

export function CarteChamp({ champ, valeurValidee, estAccepte, onAccepter, onRejeter, onChangerValeur }: Props) {
  const badge = configBadge(champ.statut, champ.confiance);
  const estRequis = champ.statut === 'introuvable' || champ.statut === 'illisible';
  const afficherBoutons = !estRequis;
  const afficherInput = estRequis || estAccepte === false;

  const labelInput = champ.statut === 'introuvable' ? 'Valeur requise' : 'Valeur corrigée';
  const inputManquant = estRequis && !valeurValidee.trim();

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm">{champ.etiquette}</span>
        <Badge className={badge.className}>{badge.label}</Badge>
      </div>

      {/* Value line */}
      <div className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">
          {champ.valeur ?? '—'}
          {champ.unite ? ` ${champ.unite}` : ''}
        </span>
        {' '}
        <span className="text-xs">({champ.confiance}%)</span>
      </div>

      {/* Note */}
      {champ.note && (
        <p className="text-xs text-muted-foreground italic">{champ.note}</p>
      )}

      {/* Decision zone */}
      <div className="space-y-2">
        {afficherBoutons && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={estAccepte === true ? 'default' : 'outline'}
              className={estAccepte === true ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              onClick={onAccepter}
            >
              Oui
            </Button>
            <Button
              size="sm"
              variant={estAccepte === false ? 'default' : 'outline'}
              className={estAccepte === false ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
              onClick={onRejeter}
            >
              Non
            </Button>
          </div>
        )}

        {afficherInput && (
          <div className="space-y-1">
            <Label className="text-xs">{labelInput}</Label>
            <Input
              value={valeurValidee}
              onChange={e => onChangerValeur(e.target.value)}
              placeholder={labelInput}
              className={inputManquant ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}
