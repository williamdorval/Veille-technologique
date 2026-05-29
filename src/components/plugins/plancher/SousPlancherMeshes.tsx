'use client';

// SousPlancherMeshes.tsx — Panneaux de sous-plancher et clous pour la scène 3D plancher
import { useMemo } from 'react';
import { TypeSousPlancher } from '@/lib/plancher/types';
import { COULEUR_SOUS_PLANCHER, COULEUR_CLOU } from './plancher-scene-constants';

// ── SousPlancherMeshes ────────────────────────────────────────────────────────

interface SousPlancherProps {
  L: number;
  W: number;
  hm: number;
  epaisseurCm: number;
  typeSousPlancher: TypeSousPlancher;
}

export function SousPlancherMeshes({ L, W, hm, epaisseurCm, typeSousPlancher }: SousPlancherProps) {
  const ep = epaisseurCm / 100;
  const mat = COULEUR_SOUS_PLANCHER[typeSousPlancher];

  // Dimensions d'un panneau 4'x8' = 1.22m x 2.44m
  const PW = 1.22;
  const PL = 2.44;
  const GAP = 0.003;

  const nbX = Math.ceil(W / PW);
  const nbZ = Math.ceil(L / PL);

  const panneaux = useMemo(() => {
    const items: { x: number; z: number; w: number; l: number; key: string; show: boolean }[] = [];
    for (let ix = 0; ix < nbX; ix++) {
      for (let iz = 0; iz < nbZ; iz++) {
        // Quinconce: chaque rangée Z est décalée d'une demi-longueur
        const decalageZ = (ix % 2) * (PL / 2);

        const x0 = -W / 2 + ix * PW;
        const z0 = -L / 2 + iz * PL + decalageZ;

        // Clamp aux limites de la pièce
        const x1 = Math.min(x0 + PW - GAP, W / 2);
        const z1 = Math.min(z0 + PL - GAP, L / 2);
        const panW = x1 - x0;
        const panL = z1 - z0;

        if (panW <= 0 || panL <= 0) continue;

        // Vue en coupe: on n'affiche que la moitié des panneaux (côté Z > 0)
        const show = z0 >= -GAP;

        items.push({
          x: x0 + panW / 2,
          z: z0 + panL / 2,
          w: panW,
          l: panL,
          key: `${ix}-${iz}`,
          show,
        });
      }
    }
    return items;
  }, [W, L, nbX, nbZ]);

  const y = hm + ep / 2;

  return (
    <>
      {panneaux.map(({ x, z, w, l, key, show }) =>
        show ? (
          <mesh key={key} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[w, ep, l]} />
            <meshStandardMaterial
              color={mat.color}
              roughness={mat.roughness}
              transparent
              opacity={0.85}
            />
          </mesh>
        ) : null
      )}
    </>
  );
}

// ── ClousMeshes ───────────────────────────────────────────────────────────────

interface CloudsProps {
  L: number;
  W: number;
  hm: number;
  espM: number;
  nbSolives: number;
}

export function ClousMeshes({ L, W, hm, espM, nbSolives }: CloudsProps) {
  const clous = useMemo(() => {
    const items: { x: number; z: number; key: string }[] = [];
    const pas = 0.3;
    const nbClous = Math.floor(L / pas);

    for (let i = 0; i < nbSolives; i++) {
      const x = -W / 2 + i * espM;
      for (let j = 0; j < nbClous; j++) {
        const z = -L / 2 + j * pas + pas / 2;
        items.push({ x, z, key: `${i}-${j}` });
      }
    }
    return items;
  }, [L, W, espM, nbSolives]);

  const clousY = hm + 0.001;

  return (
    <>
      {clous.map(({ x, z, key }) => (
        <mesh key={key} position={[x, clousY, z]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
          <meshStandardMaterial color={COULEUR_CLOU} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}
