'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ResultatsRampe, MateriauRampe, TypeInstallation } from '@/lib/rampes/types';

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
  resultats: ResultatsRampe | null;
  materiau: MateriauRampe;
  typeInstallation: TypeInstallation;
}

export function Visualisation3D({ resultats, materiau, typeInstallation }: Props) {
  return (
    <div className="w-full h-72 rounded-lg overflow-hidden border bg-muted/20">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Chargement…</span>
        </div>
      }>
        <RampeScene
          resultats={resultats}
          materiau={materiau}
          typeInstallation={typeInstallation}
        />
      </Suspense>
    </div>
  );
}
