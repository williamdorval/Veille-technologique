import { MateriauRampe, TypeInstallation } from '@/lib/rampes/types';
import { MAT_DALLE_BOIS, MAT_BETON } from './rampe-materiaux';

// ─── Surface de support selon typeInstallation ────────────────────────────────

interface Props {
  L: number;
  typeInstallation: TypeInstallation;
  materiau: MateriauRampe;
}

export function SurfaceSupport({ L, typeInstallation, materiau }: Props) {
  if (typeInstallation === 'escalier') {
    const NB_MARCHES = 7;
    const montee = NB_MARCHES * 0.18;
    const angle = Math.atan2(montee, L);
    const hypLen = Math.sqrt(L * L + montee * montee);
    return (
      <mesh
        position={[0, montee / 2 - 0.04, 0]}
        rotation={[0, 0, angle]}
        receiveShadow
      >
        <boxGeometry args={[hypLen + 0.1, 0.1, 1.0]} />
        <meshStandardMaterial {...MAT_DALLE_BOIS} />
      </mesh>
    );
  }

  // balcon / terrasse
  const dalleColor = materiau === 'bois' ? MAT_DALLE_BOIS : MAT_BETON;
  return (
    <group>
      {/* Dalle principale */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[L + 0.4, 0.18, 1.8]} />
        <meshStandardMaterial {...dalleColor} />
      </mesh>
      {/* Parapet bas (optionnel) */}
      <mesh position={[0, 0.15, -0.825]} castShadow>
        <boxGeometry args={[L + 0.2, 0.3, 0.15]} />
        <meshStandardMaterial {...MAT_BETON} />
      </mesh>
    </group>
  );
}
