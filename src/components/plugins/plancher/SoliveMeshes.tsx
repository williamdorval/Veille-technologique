'use client';

// SoliveMeshes.tsx — Solives intérieures, de rive et blocages pour la scène 3D plancher
import { useMemo } from 'react';
import { TypeBois } from '@/lib/plancher/types';
import { COULEUR_BOIS } from './plancher-scene-constants';

// ── SoliveMeshes ──────────────────────────────────────────────────────────────

interface SolivesProps {
  L: number;         // portée en m (direction Z)
  W: number;         // largeur en m (direction X)
  bm: number;        // largeur solive m
  hm: number;        // hauteur solive m
  espM: number;      // espacement entre solives m
  nbSolives: number;
  typeBois: TypeBois;
}

export function SoliveMeshes({ L, W, bm, hm, espM, nbSolives, typeBois }: SolivesProps) {
  const mat = COULEUR_BOIS[typeBois];
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < nbSolives; i++) {
      pts.push(-W / 2 + i * espM);
    }
    return pts;
  }, [W, espM, nbSolives]);

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bm, hm, L]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}

// ── RimJoistMeshes ────────────────────────────────────────────────────────────

interface RimJoistProps {
  L: number;
  W: number;
  bm: number;
  hm: number;
  typeBois: TypeBois;
}

export function RimJoistMeshes({ L, W, bm, hm, typeBois }: RimJoistProps) {
  const mat = COULEUR_BOIS[typeBois];
  const totalW = W + 2 * bm;

  return (
    <>
      {/* Solives de rive longitudinales (parallèles à Z, aux extrémités X) */}
      {([-W / 2 - bm / 2, W / 2 + bm / 2] as number[]).map((x, i) => (
        <mesh key={`long-${i}`} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bm, hm, L]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
      {/* Solives de rive transversales (perpendiculaires, aux extrémités Z) */}
      {([-L / 2, L / 2] as number[]).map((z, i) => (
        <mesh key={`trans-${i}`} position={[0, hm / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[totalW, hm, bm]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}

// ── BlockingMeshes ────────────────────────────────────────────────────────────

interface BlockingProps {
  W: number;
  bm: number;
  hm: number;
  espM: number;
  nbSolives: number;
  typeBois: TypeBois;
}

export function BlockingMeshes({ W, bm, hm, espM, nbSolives, typeBois }: BlockingProps) {
  const mat = COULEUR_BOIS[typeBois];
  const innerWidth = espM - bm * 2;

  const positions = useMemo(() => {
    if (nbSolives < 2 || innerWidth <= 0) return [];
    const pts: number[] = [];
    for (let i = 0; i < nbSolives - 1; i++) {
      pts.push(-W / 2 + i * espM + espM / 2);
    }
    return pts;
  }, [W, espM, nbSolives, innerWidth]);

  if (positions.length === 0) return null;

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[innerWidth, hm, bm]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}
