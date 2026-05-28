'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ResultatsRampe } from '@/lib/rampes/types';
import { MateriauRampe } from '@/lib/rampes/types';
import { COULEURS_3D } from '@/lib/rampes/normes';

// Chargement dynamique pour éviter les erreurs SSR avec Three.js
const RampeScene = dynamic(() => import('./RampeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Chargement de la vue 3D…</span>
    </div>
  ),
});

interface Props {
  resultats: ResultatsRampe;
  materiau: MateriauRampe;
}

export function Visualisation3D({ resultats, materiau }: Props) {
  const mat = COULEURS_3D[materiau];
  return (
    <div className="w-full h-72 rounded-lg overflow-hidden border bg-muted/20">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Chargement…</span>
        </div>
      }>
        <RampeScene resultats={resultats} matProps={mat} />
      </Suspense>
    </div>
  );
}
