// R3F mesh component — no 'use client' needed (used inside Canvas only)

interface EnvironnementProps {
  l: number;  // largeur en unités Three.js
  hT: number; // hauteur totale en unités Three.js
  lH: number; // longueur horizontale en unités Three.js
}

export function EscalierEnvironnement({ l, hT, lH }: EnvironnementProps) {
  const silhouetteZ = -lH * 0.15;

  return (
    <>
      {/* ── Mur gauche (semi-transparent) ── */}
      <mesh position={[l / 2 + 0.075 + 0.08, hT / 2 + 0.5, lH / 2]} receiveShadow>
        <boxGeometry args={[0.15, hT + 1, lH + 0.5]} />
        <meshStandardMaterial color="#D4C5A9" roughness={0.9} transparent opacity={0.2} />
      </mesh>

      {/* ── Mur droit (semi-transparent) ── */}
      <mesh position={[-l / 2 - 0.075 - 0.08, hT / 2 + 0.5, lH / 2]} receiveShadow>
        <boxGeometry args={[0.15, hT + 1, lH + 0.5]} />
        <meshStandardMaterial color="#D4C5A9" roughness={0.9} transparent opacity={0.2} />
      </mesh>

      {/* ── Mur du fond en haut de l'escalier ── */}
      <mesh position={[0, hT / 2 + 1.5, lH + 0.075]} receiveShadow>
        <boxGeometry args={[l + 0.5, 3, 0.15]} />
        <meshStandardMaterial color="#D4C5A9" roughness={0.9} transparent opacity={0.2} />
      </mesh>

      {/* ── Dalle / plafond (montre le dégagement de tête) ── */}
      <mesh position={[0, hT + 0.15, lH / 2 + 0.5]}>
        <boxGeometry args={[l + 0.5, 0.3, lH + 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.15} />
      </mesh>

      {/* ── Plancher de départ ── */}
      <mesh position={[0, -0.075, -1]} receiveShadow>
        <boxGeometry args={[l + 0.5, 0.15, 2]} />
        <meshStandardMaterial color="#C8A878" roughness={0.8} metalness={0} />
      </mesh>

      {/* ── Palier d'arrivée en haut ── */}
      <mesh position={[0, hT - 0.075, lH + 0.75]} receiveShadow>
        <boxGeometry args={[l + 0.5, 0.15, 1.5]} />
        <meshStandardMaterial color="#C8A878" roughness={0.8} metalness={0} />
      </mesh>

      {/* ── Sol ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, lH / 2]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F0EB" roughness={0.95} />
      </mesh>

      {/* ── Silhouette humaine (référence d'échelle 1750 mm) ── */}
      <group position={[l / 4, 0, silhouetteZ]}>
        {/* Corps */}
        <mesh position={[0, 0.875, 0]} castShadow>
          <capsuleGeometry args={[0.18, 1.05, 4, 8]} />
          <meshStandardMaterial color="#2D3748" roughness={0.8} transparent opacity={0.6} />
        </mesh>
        {/* Tête */}
        <mesh position={[0, 1.65, 0]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#2D3748" roughness={0.8} transparent opacity={0.6} />
        </mesh>
      </group>
    </>
  );
}
