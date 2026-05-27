'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultatCalcul, EntreeFormulaire } from '@/lib/escaliers/types';

// Chargement dynamique pour éviter les erreurs SSR (Three.js utilise window)
const EscalierScene = dynamic(
  () => import('./EscalierScene').then((m) => m.EscalierScene),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Chargement de la 3D…</div> }
);

interface Props {
  resultat: ResultatCalcul;
  entree: EntreeFormulaire;
}

// SVG fallback — coupe latérale 2D simple
function EscalierSVG({ resultat }: { resultat: ResultatCalcul }) {
  const { nombreMarches, hauteurContremarche, giron } = resultat;
  const S = 0.25; // échelle: mm → px (réduit pour tenir dans la vue)
  const largeurSVG = Math.min(nombreMarches * giron * S + 40, 500);
  const hauteurSVG = nombreMarches * hauteurContremarche * S + 40;

  const points: string[] = [`20,${hauteurSVG - 20}`];
  for (let i = 0; i < nombreMarches; i++) {
    const x = 20 + i * giron * S;
    const y = hauteurSVG - 20 - i * hauteurContremarche * S;
    points.push(`${x},${y}`);
    points.push(`${x + giron * S},${y}`);
  }
  points.push(`${20 + nombreMarches * giron * S},${hauteurSVG - 20}`);

  return (
    <svg width={largeurSVG} height={hauteurSVG} viewBox={`0 0 ${largeurSVG} ${hauteurSVG}`}
      className="max-w-full border rounded bg-background">
      <polyline points={points.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="10" y={hauteurSVG - 5} fontSize="10" fill="currentColor" opacity="0.5">
        Vue 2D (WebGL non disponible)
      </text>
    </svg>
  );
}

export function Visualisation3D({ resultat, entree }: Props) {
  const [webglSupporte, setWebglSupporte] = useState<boolean | null>(null);
  const [cle, setCle] = useState(0); // pour réinitialiser la vue
  const canvasTestRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Détecter WebGL
    try {
      const canvas = document.createElement('canvas');
      canvasTestRef.current = canvas;
      const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupporte(!!ctx);
    } catch {
      setWebglSupporte(false);
    }
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Visualisation</span>
          {webglSupporte && (
            <Button variant="outline" size="sm" onClick={() => setCle((k) => k + 1)}>
              Réinitialiser la vue
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {webglSupporte === null && (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Détection du navigateur…
          </div>
        )}

        {webglSupporte === false && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              WebGL non disponible — vue 2D (coupe latérale) :
            </p>
            <EscalierSVG resultat={resultat} />
          </div>
        )}

        {webglSupporte === true && (
          <div className="w-full" style={{ height: '320px' }}>
            <EscalierScene key={cle} resultat={resultat} entree={entree} />
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          {webglSupporte
            ? 'Cliquer et faire glisser pour pivoter. Molette pour zoomer.'
            : 'Vue schématique — les proportions sont indicatives.'}
        </p>
      </CardContent>
    </Card>
  );
}
