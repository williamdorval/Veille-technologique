'use client';
import { Loader2 } from 'lucide-react';
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
      className="w-full min-h-12 text-base"
      size="lg"
      type="button"
    >
      {enChargement ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyse du plan en cours…
        </>
      ) : (
        'Analyser le plan'
      )}
    </Button>
  );
}
