'use client';

// StructureSupport.tsx — Poutre centrale et fondations pour la scène 3D plancher
import { useMemo } from 'react';
import { COULEUR_LVL_BEAM, COULEUR_BETON, COULEUR_SOL } from './plancher-scene-constants';

// ── PoutreCentrale ────────────────────────────────────────────────────────────

interface PoutreProps {
  L: number;
  hm: number;
}

export function PoutreCentrale({ L, hm }: PoutreProps) {
  const beamH = hm * 1.5;
  const beamB = 0.09; // 90mm
  const beamY = hm / 2 - beamH / 2;

  const hauteurPoteau = 2.4 - hm;
  const poteauY = -hm / 2 - hauteurPoteau / 2;

  const positionsPoteaux = useMemo(() => [-L / 2 + 0.3, 0, L / 2 - 0.3], [L]);

  return (
    <>
      {/* Poutre engineered beam */}
      <mesh position={[0, beamY, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamB, beamH, L]} />
        <meshStandardMaterial color={COULEUR_LVL_BEAM} roughness={0.5} />
      </mesh>
      {/* Poteaux de support */}
      {positionsPoteaux.map((z, i) => (
        <mesh key={i} position={[0, poteauY, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, hauteurPoteau, 8]} />
          <meshStandardMaterial color={COULEUR_LVL_BEAM} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
}

// ── FondationMeshes ───────────────────────────────────────────────────────────

interface FondationProps {
  L: number;
  W: number;
  hm: number;
}

export function FondationMeshes({ L, W, hm }: FondationProps) {
  const hauteurVide = 2.4;
  const solY = -hauteurVide;
  const murH = 0.3;
  const murE = 0.2;

  const totalW = W + 2 * 0.038 + murE;

  return (
    <>
      {/* Sol de la cave */}
      <mesh position={[0, solY, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={COULEUR_SOL} roughness={0.95} />
      </mesh>

      {/* Murs de fondation béton — côtés longs (parallèles à Z) */}
      {([-W / 2 - murE / 2 - 0.038, W / 2 + murE / 2 + 0.038] as number[]).map((x, i) => (
        <mesh key={`mur-long-${i}`} position={[x, -hm / 2 - murH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[murE, murH, L + 2 * murE]} />
          <meshStandardMaterial color={COULEUR_BETON} roughness={0.85} />
        </mesh>
      ))}
      {/* Murs de fondation béton — côtés transversaux (perpendiculaires à Z) */}
      {([-L / 2, L / 2] as number[]).map((z, i) => (
        <mesh key={`mur-trans-${i}`} position={[0, -hm / 2 - murH / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[totalW, murH, murE]} />
          <meshStandardMaterial color={COULEUR_BETON} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}
