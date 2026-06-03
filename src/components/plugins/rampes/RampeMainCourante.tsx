import { MateriauRampe } from '@/lib/rampes/types';
import { MAT, MAT_PLAQUE_PIED } from './rampe-materiaux';

// ─── Main courante ────────────────────────────────────────────────────────────

interface Props {
  L: number;
  H: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
  nbPoteaux: number;
}

export function MainCouranteMeshes({ L, H, materiau, inclinaisonY }: Props) {
  // Dépassement de 0.1m de chaque côté (exigence CCQ)
  const DEP = 0.1;
  const totalL = L + DEP * 2;

  // Pour escalier incliné, la main courante suit la pente
  const yMid   = inclinaisonY(L / 2);
  const yDebut = inclinaisonY(0);
  const yFin   = inclinaisonY(L);
  const angle  = Math.atan2(yFin - yDebut, L);

  // Supports de main courante tous les ~0.6m
  const nbSupports = Math.max(2, Math.round(L / 0.6));
  const espSupport = L / (nbSupports - 1);

  const mat = MAT[materiau];

  // Profil de la main courante selon matériau
  let handrailGeom: React.ReactNode;
  if (materiau === 'bois') {
    handrailGeom = <cylinderGeometry args={[0.04, 0.035, totalL, 10]} />;
  } else if (materiau === 'metal') {
    handrailGeom = <cylinderGeometry args={[0.025, 0.025, totalL, 16]} />;
  } else {
    // verre / cable → profil plat alu
    handrailGeom = <boxGeometry args={[totalL, 0.06, 0.06]} />;
  }

  return (
    <group>
      {/* Main courante principale */}
      <mesh
        position={[0, yMid + H - 0.01, 0]}
        rotation={[0, 0, angle]}
        castShadow
      >
        {handrailGeom}
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* Supports de main courante (pattes en L) */}
      {Array.from({ length: nbSupports }).map((_, i) => {
        const x = i * espSupport;
        const baseY = inclinaisonY(x);
        return (
          <group key={`support-mc-${i}`} position={[x - L / 2, baseY + H - 0.12, 0]}>
            {/* Tige verticale */}
            <mesh position={[0, 0.05, 0.025]} castShadow>
              <boxGeometry args={[0.012, 0.1, 0.012]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>
            {/* Bras horizontal */}
            <mesh position={[0, 0.09, 0.0125]} castShadow>
              <boxGeometry args={[0.012, 0.012, 0.05]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>
          </group>
        );
      })}

      {/* Lisse basse (bois/métal uniquement) */}
      {(materiau === 'bois' || materiau === 'metal') && (
        <mesh
          position={[0, inclinaisonY(L / 2) + 0.1, 0]}
          rotation={[0, 0, angle]}
          castShadow
        >
          <boxGeometry args={[L, 0.04, 0.04]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      )}
    </group>
  );
}
