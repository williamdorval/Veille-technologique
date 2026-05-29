'use client';
import { useState } from 'react';

interface Props { texte: string; }

export function HelpButton({ texte }: Props) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold leading-none hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
        aria-label="Aide"
      >
        ?
      </button>
      {ouvert && (
        <div className="absolute z-20 left-5 top-0 w-72 rounded-md border bg-popover text-popover-foreground p-3 text-sm shadow-md">
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="absolute top-1.5 right-2 text-muted-foreground hover:text-foreground text-base leading-none"
          >
            ×
          </button>
          <p className="pr-4 leading-relaxed">{texte}</p>
        </div>
      )}
    </span>
  );
}
