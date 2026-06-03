'use client';

import type { TypeRevetement } from '@/lib/toiture/types';
import { HAUTEUR_MURS } from './BatimentMeshes';

export { HAUTEUR_MURS } from './BatimentMeshes';
export { BatimentMeshes } from './BatimentMeshes';

// ─── Helpers ───────────────────────────────────────────────────────────────

export function couleurRevetement(type: TypeRevetement): { color: string; roughness: number; metalness: number } {
  switch (type) {
    case 'bardeau_asphalte': return { color: '#2D2D2D', roughness: 0.9, metalness: 0 };
    case 'tole_acier':        return { color: '#607D8B', roughness: 0.3, metalness: 0.6 };
    case 'membrane':          return { color: '#455A64', roughness: 0.8, metalness: 0 };
  }
}

// ─── ChevronsMeshes ────────────────────────────────────────────────────────

interface ChevronsProps {
  longueur: number;        // mètres
  largeur: number;         // mètres
  pente: number;           // radians
  hauteurFaitage: number;  // mètres
  longueurChevron: number; // mètres (développée)
  debord: number;          // mètres
}

export function ChevronsMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord }: ChevronsProps) {
  void hauteurFaitage;
  const espacement = 0.5; // mètres
  const nbChevrons = Math.round(longueur / espacement) + 1;
  const positions: number[] = [];
  for (let i = 0; i < nbChevrons; i++) {
    positions.push(-longueur / 2 + i * (longueur / (nbChevrons - 1)));
  }

  // Centre vertical du chevron : milieu entre l'about (eave) et le faîtage
  const yCentreVersant = HAUTEUR_MURS + (largeur / 2 - debord) * Math.tan(pente) / 2;
  // Centre Z du versant depuis l'axe faîtage : quart de la largeur totale
  const zOffsetVersant = (largeur / 4 + debord / 2);

  return (
    <group>
      {positions.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Versant gauche – descend vers z négatif */}
          <mesh
            position={[0, yCentreVersant, -zOffsetVersant]}
            rotation={[-pente, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, 0.09, longueurChevron]} />
            <meshStandardMaterial color="#8B6F47" roughness={0.8} />
          </mesh>
          {/* Versant droit – descend vers z positif */}
          <mesh
            position={[0, yCentreVersant, zOffsetVersant]}
            rotation={[pente, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, 0.09, longueurChevron]} />
            <meshStandardMaterial color="#8B6F47" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── ToitureMeshes (versants + faîtière + solin) ──────────────────────────

interface ToitureProps {
  longueur: number;        // mètres
  largeur: number;         // mètres
  pente: number;           // radians
  hauteurFaitage: number;  // mètres
  longueurChevron: number; // mètres (développée)
  debord: number;          // mètres
  typeRevetement: TypeRevetement;
}

export function ToitureMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord, typeRevetement }: ToitureProps) {
  const mat = couleurRevetement(typeRevetement);
  const longueurRevêtement = longueur + debord * 2;
  // Largeur développée du panneau = longueur du chevron + un peu de débord en gouttière
  const largeurPanneau = longueurChevron + 0.15;
  // Position Y du centre du panneau : entre sommet murs et faîtage
  const yCentre = HAUTEUR_MURS + (largeur / 2 - debord) * Math.tan(pente) / 2;
  // Position Z du centre du panneau (centre du versant)
  const zCentrePanneau = (largeur / 4 + debord / 2);
  // Solin de faîtière
  const yFaitage = HAUTEUR_MURS + hauteurFaitage;

  return (
    <group>
      {/* Versant gauche (z négatif) */}
      <mesh
        position={[0, yCentre, -zCentrePanneau]}
        rotation={[-pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[longueurRevêtement, 0.04, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </mesh>

      {/* Versant droit (z positif) - rotation [+pente] */}
      <mesh
        position={[0, yCentre, zCentrePanneau]}
        rotation={[pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[longueurRevêtement, 0.04, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </mesh>

      {/* Faîtière (ridge board) */}
      <mesh position={[0, yFaitage, 0]} castShadow>
        <boxGeometry args={[longueurRevêtement, 0.05, 0.15]} />
        <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
      </mesh>

      {/* Solin de faîtière */}
      <mesh position={[0, yFaitage + 0.04, 0]}>
        <boxGeometry args={[longueurRevêtement, 0.03, 0.3]} />
        <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
      </mesh>
    </group>
  );
}
