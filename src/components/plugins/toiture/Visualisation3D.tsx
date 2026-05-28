'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { ResultatsToiture } from '@/lib/toiture/types';

const ToitureScene = dynamic(() => import('./ToitureScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Chargement de la vue 3D…</span>
    </div>
  ),
});

interface Props {
  resultats: ResultatsToiture;
  longueur: number;
  largeur: number;
  penteDegres: number;
  debord: number;
}

export function Visualisation3D({ resultats, longueur, largeur, penteDegres, debord }: Props) {
  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border bg-muted/20">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Chargement…</span>
        </div>
      }>
        <ToitureScene
          resultats={resultats} longueur={longueur} largeur={largeur}
          penteDegres={penteDegres} debord={debord}
        />
      </Suspense>
    </div>
  );
}
