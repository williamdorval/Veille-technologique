'use client';

import { UniteSaisie } from '@/lib/shared/use-unite';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  unite: UniteSaisie;
  onChangerUnite: (u: UniteSaisie) => void;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const UNITES: UniteSaisie[] = ['mm', 'cm', 'm', 'po'];

export function SelecteurUnite({ unite, onChangerUnite }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Unité de mesure :</span>
      <div className="flex gap-1">
        {UNITES.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => onChangerUnite(u)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              unite === u
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-muted'
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}
