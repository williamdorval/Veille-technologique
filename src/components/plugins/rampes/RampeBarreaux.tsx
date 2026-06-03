import { MateriauRampe } from '@/lib/rampes/types';
import { MAT } from './rampe-materiaux';

// ─── Barreaux / balustres ─────────────────────────────────────────────────────

interface Props {
  L: number;
  H: number;
  nbPoteaux: number;
  nbBarreaux: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
}

export function BarreauxMeshes({ L, H, nbPoteaux, nbBarreaux, materiau, inclinaisonY }: Props) {
  const mat = MAT[materiau];
  const espPoteaux = nbPoteaux > 1 ? L / (nbPoteaux - 1) : L;

  // ── Câble : 5 lignes horizontales entre chaque paire de poteaux
  if (materiau === 'cable') {
    const NB_LIGNES = 5;
    const elements: React.ReactNode[] = [];

    for (let p = 0; p < nbPoteaux - 1; p++) {
      const xDebut = p * espPoteaux - L / 2;
      const xFin   = (p + 1) * espPoteaux - L / 2;
      const dist   = espPoteaux;
      const xMid   = (xDebut + xFin) / 2;
      const yDebutBase = inclinaisonY(p * espPoteaux);
      const yFinBase   = inclinaisonY((p + 1) * espPoteaux);
      const yMidBase   = (yDebutBase + yFinBase) / 2;

      for (let l = 0; l < NB_LIGNES; l++) {
        const ratio = (l + 1) / (NB_LIGNES + 1);
        const yOffset = ratio * (H - 0.1) + 0.05;

        elements.push(
          <mesh
            key={`cable-${p}-${l}`}
            position={[xMid, yMidBase + yOffset, 0]}
            rotation={[0, 0, Math.atan2(yFinBase - yDebutBase, dist)]}
            castShadow
          >
            <cylinderGeometry args={[0.006, 0.006, dist, 6]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        );
      }
    }
    return <group>{elements}</group>;
  }

  // ── Verre : un panneau par inter-poteau
  if (materiau === 'verre') {
    const elements: React.ReactNode[] = [];
    for (let p = 0; p < nbPoteaux - 1; p++) {
      const xMid  = (p + 0.5) * espPoteaux - L / 2;
      const yBase = inclinaisonY((p + 0.5) * espPoteaux);
      const dist  = espPoteaux;

      elements.push(
        <mesh key={`verre-${p}`} position={[xMid, yBase + (H - 0.06) / 2 + 0.03, 0]} castShadow>
          <boxGeometry args={[dist - 0.02, H - 0.06, 0.01]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    }
    return <group>{elements}</group>;
  }

  // ── Bois / métal : barreaux verticaux
  const totalBarreaux = Math.max(nbBarreaux, 1);
  const espBarreau = L / (totalBarreaux + 1);

  return (
    <group>
      {Array.from({ length: totalBarreaux }).map((_, i) => {
        const x = (i + 1) * espBarreau;
        const baseY = inclinaisonY(x);
        const hauteurtBarreau = H - 0.08;

        return (
          <mesh
            key={`barreau-${i}`}
            position={[x - L / 2, baseY + hauteurtBarreau / 2 + 0.04, 0]}
            castShadow
          >
            {materiau === 'metal' ? (
              <cylinderGeometry args={[0.012, 0.012, hauteurtBarreau, 12]} />
            ) : (
              <cylinderGeometry args={[0.018, 0.018, hauteurtBarreau, 6]} />
            )}
            <meshStandardMaterial {...MAT[materiau]} />
          </mesh>
        );
      })}
    </group>
  );
}
