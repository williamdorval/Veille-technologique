import { MAT_SILHOUETTE } from './rampe-materiaux';

// ─── Silhouette humaine (échelle de référence) ────────────────────────────────

export function SilhouetteHumaine({ L }: { L: number }) {
  const x = L / 2 + 0.55; // à côté de la rampe, légèrement à droite
  return (
    <group position={[x, 0, 0.5]}>
      {/* Corps */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.9, 4, 8]} />
        <meshStandardMaterial {...MAT_SILHOUETTE} />
      </mesh>
      {/* Tête */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial {...MAT_SILHOUETTE} />
      </mesh>
    </group>
  );
}

// ─── Annotation de hauteur (ligne + tick) ────────────────────────────────────

export function AnnotationHauteur({ L, H }: { L: number; H: number }) {
  const x = -L / 2 - 0.45;
  return (
    <group position={[x, 0, 0]}>
      {/* Ligne verticale */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[0.01, H, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
      {/* Tick haut */}
      <mesh position={[0.04, H, 0]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
      {/* Tick bas */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}
