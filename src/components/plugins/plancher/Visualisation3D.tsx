'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ResultatsPlancher } from '@/lib/plancher/types';

const PlancherScene = dynamic(() => import('./PlancherScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Chargement de la vue 3D…</span>
    </div>
  ),
});

interface Props {
  resultats: ResultatsPlancher;
  portee: number;
  largeur: number;
}

export function Visualisation3D({ resultats, portee, largeur }: Props) {
  return (
    <div className="w-full h-72 rounded-lg overflow-hidden border bg-muted/20">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Chargement…</span>
        </div>
      }>
        <PlancherScene resultats={resultats} portee={portee} largeur={largeur} />
      </Suspense>
    </div>
  );
}
