'use client';

export const HAUTEUR_MURS = 2.4; // mètres

// ─── BatimentMeshes (murs + dalle + fenêtres) ──────────────────────────────

interface BatimentProps {
  longueur: number;  // mètres
  largeur: number;   // mètres
}

export function BatimentMeshes({ longueur, largeur }: BatimentProps) {
  return (
    <group>
      {/* Dalle béton */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[longueur + 0.4, 0.2, largeur + 0.4]} />
        <meshStandardMaterial color="#9E9E9E" roughness={0.9} />
      </mesh>

      {/* Mur avant (z négatif) */}
      <mesh position={[0, HAUTEUR_MURS / 2, -largeur / 2]} receiveShadow castShadow>
        <boxGeometry args={[longueur, HAUTEUR_MURS, 0.2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.9} />
      </mesh>

      {/* Mur arrière (z positif) */}
      <mesh position={[0, HAUTEUR_MURS / 2, largeur / 2]} receiveShadow castShadow>
        <boxGeometry args={[longueur, HAUTEUR_MURS, 0.2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.9} />
      </mesh>

      {/* Mur gauche (x négatif) */}
      <mesh position={[-longueur / 2, HAUTEUR_MURS / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, HAUTEUR_MURS, largeur]} />
        <meshStandardMaterial color="#DDD5C5" roughness={0.9} />
      </mesh>

      {/* Mur droit (x positif) */}
      <mesh position={[longueur / 2, HAUTEUR_MURS / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, HAUTEUR_MURS, largeur]} />
        <meshStandardMaterial color="#DDD5C5" roughness={0.9} />
      </mesh>

      {/* Fenêtres – mur avant */}
      {[-longueur / 4, longueur / 4].map((x, i) => (
        <mesh key={`fen-av-${i}`} position={[x, HAUTEUR_MURS * 0.55, -largeur / 2 - 0.01]}>
          <boxGeometry args={[1.0, 0.8, 0.05]} />
          <meshStandardMaterial color="#90CAF9" roughness={0.1} metalness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Fenêtre – mur gauche */}
      <mesh position={[-longueur / 2 - 0.01, HAUTEUR_MURS * 0.55, 0]}>
        <boxGeometry args={[0.05, 0.8, 1.0]} />
        <meshStandardMaterial color="#90CAF9" roughness={0.1} metalness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Sol terre */}
      <mesh position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8B7355" roughness={0.95} />
      </mesh>
    </group>
  );
}
