'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  disabled: boolean;
  enChargement: boolean;
  onAnalyser: () => void;
}

export function BoutonAnalyser({ disabled, enChargement, onAnalyser }: Props) {
  return (
    <Button
      onClick={onAnalyser}
      disabled={disabled || enChargement}
      className="w-full min-h-14 text-lg font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-md transition-all duration-200"
      size="lg"
      type="button"
    >
      {enChargement ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyse en cours&hellip;
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Analyser le plan
        </>
      )}
    </Button>
  );
}
