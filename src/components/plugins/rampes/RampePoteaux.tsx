import { MateriauRampe } from '@/lib/rampes/types';
import { MAT, MAT_POTEAU_CABLE, MAT_PLAQUE_PIED } from './rampe-materiaux';

// ─── Poteaux ──────────────────────────────────────────────────────────────────

interface Props {
  L: number;
  H: number;
  nbPoteaux: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
}

export function PostesMeshes({ L, H, nbPoteaux, materiau, inclinaisonY }: Props) {
  const espacement = nbPoteaux > 1 ? L / (nbPoteaux - 1) : L;
  const mat = materiau === 'cable' ? MAT_POTEAU_CABLE : MAT[materiau];

  return (
    <group>
      {Array.from({ length: nbPoteaux }).map((_, i) => {
        const x = i * espacement;
        const baseY = inclinaisonY(x);

        return (
          <group key={`poteau-${i}`} position={[x - L / 2, baseY, 0]}>
            {/* Plaque de pied */}
            <mesh position={[0, 0.005, 0]} castShadow>
              <boxGeometry args={[0.12, 0.01, 0.12]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>

            {/* Corps du poteau */}
            <mesh position={[0, H / 2 + 0.01, 0]} castShadow>
              {materiau === 'verre' ? (
                <boxGeometry args={[0.05, H, 0.008]} />
              ) : materiau === 'metal' ? (
                <cylinderGeometry args={[0.025, 0.025, H, 16]} />
              ) : (
                // bois ou cable
                <cylinderGeometry args={[0.03, 0.03, H, 8]} />
              )}
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
