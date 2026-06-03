'use client';

import { useRef, ReactElement } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MateriauLimon, TypeMarche } from '@/lib/escaliers/types';
import { COULEURS_MATERIAUX } from '@/lib/escaliers/normes';

interface Props {
  nombreMarches: number;
  hauteurContremarche: number;
  giron: number;
  largeur: number;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
  avecContremarches: boolean;
}

// Convertit mm en unités 3D (1 unité = 100mm pour une échelle lisible)
const S = 0.01;

export function EscalierMesh({
  nombreMarches,
  hauteurContremarche,
  giron,
  largeur,
  materiauLimon,
  typeMarche,
  avecContremarches,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);

  // Dimensions en unités 3D
  const hC = hauteurContremarche * S;
  const g = giron * S;
  const l = largeur * S;
  const epaisseurMarche = 0.038; // 38mm
  const longueurTotale = nombreMarches * g;
  const hauteurTotale = nombreMarches * hC;

  const couleurLimon = COULEURS_MATERIAUX.limon[materiauLimon];
  const couleurMarche = COULEURS_MATERIAUX.marche[typeMarche];
  const estAcier = materiauLimon === 'acier';

  const marches: ReactElement[] = [];

  for (let i = 0; i < nombreMarches; i++) {
    const x = i * g + g / 2;
    const y = i * hC + epaisseurMarche / 2;

    // Marche
    marches.push(
      <mesh key={`marche-${i}`} position={[x, y, 0]}>
        <boxGeometry args={[g, epaisseurMarche, l]} />
        <meshStandardMaterial color={couleurMarche} roughness={0.7} />
      </mesh>
    );

    // Contremarche (si escalier fermé)
    if (avecContremarches && i > 0) {
      marches.push(
        <mesh key={`contremarche-${i}`} position={[i * g, i * hC - hC / 2, 0]}>
          <boxGeometry args={[0.019, hC, l]} />
          <meshStandardMaterial color={couleurMarche} roughness={0.8} />
        </mesh>
      );
    }
  }

  // Limons (×2)
  const limonEpaisseur = estAcier ? 0.05 : 0.038;
  const limonHauteur = estAcier ? 0.15 : 0.235;
  const longueurLimon = Math.sqrt(longueurTotale * longueurTotale + hauteurTotale * hauteurTotale);
  const angle = Math.atan2(hauteurTotale, longueurTotale);

  const limonProps = {
    args: [longueurLimon, limonHauteur, limonEpaisseur] as [number, number, number],
    color: couleurLimon,
    metalness: estAcier ? 0.8 : 0,
    roughness: estAcier ? 0.2 : 0.7,
  };

  const limonOffsetZ = l / 2 + limonEpaisseur / 2;

  return (
    <group ref={groupRef} position={[-longueurTotale / 2, -hauteurTotale / 2, 0]}>
      {/* Marches */}
      {marches}

      {/* Limon gauche */}
      <mesh
        position={[longueurTotale / 2, hauteurTotale / 2, -limonOffsetZ]}
        rotation={[0, 0, -angle]}
      >
        <boxGeometry args={limonProps.args} />
        <meshStandardMaterial color={limonProps.color} metalness={limonProps.metalness} roughness={limonProps.roughness} />
      </mesh>

      {/* Limon droit */}
      <mesh
        position={[longueurTotale / 2, hauteurTotale / 2, limonOffsetZ]}
        rotation={[0, 0, -angle]}
      >
        <boxGeometry args={limonProps.args} />
        <meshStandardMaterial color={limonProps.color} metalness={limonProps.metalness} roughness={limonProps.roughness} />
      </mesh>
    </group>
  );
}

// Petit composant auto-rotate optionnel pour la vue initiale
export function AutoRotate() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return <group ref={ref} />;
}
