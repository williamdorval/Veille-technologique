'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Vector3 } from 'three';
import { ResultatsRampe, MateriauRampe, TypeInstallation } from '@/lib/rampes/types';
import { MAT_SOL } from './rampe-materiaux';
import { SurfaceSupport } from './RampeSurface';
import { PostesMeshes } from './RampePoteaux';
import { BarreauxMeshes } from './RampeBarreaux';
import { MainCouranteMeshes } from './RampeMainCourante';
import { SilhouetteHumaine, AnnotationHauteur } from './RampeAnnotations';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  resultats: ResultatsRampe | null;
  materiau: MateriauRampe;
  typeInstallation: TypeInstallation;
}

// ─── Scène complète ───────────────────────────────────────────────────────────

function RampeGroup({
  L,
  H,
  nbPoteaux,
  nbBarreaux,
  materiau,
  typeInstallation,
}: {
  L: number;
  H: number;
  nbPoteaux: number;
  nbBarreaux: number;
  materiau: MateriauRampe;
  typeInstallation: TypeInstallation;
}) {
  // Fonction d'inclinaison Y : pour escalier, la base monte linéairement
  const inclinaisonY = useMemo(() => {
    if (typeInstallation === 'escalier') {
      const NB_MARCHES = 7;
      const montee = NB_MARCHES * 0.18; // hauteur totale des marches
      return (x: number) => (x / L) * montee;
    }
    return (_x: number) => 0;
  }, [typeInstallation, L]);

  return (
    <group>
      {/* Surface de support */}
      <SurfaceSupport L={L} typeInstallation={typeInstallation} materiau={materiau} />

      {/* Poteaux */}
      <PostesMeshes
        L={L}
        H={H}
        nbPoteaux={nbPoteaux}
        materiau={materiau}
        inclinaisonY={inclinaisonY}
      />

      {/* Barreaux */}
      <BarreauxMeshes
        L={L}
        H={H}
        nbPoteaux={nbPoteaux}
        nbBarreaux={nbBarreaux}
        materiau={materiau}
        inclinaisonY={inclinaisonY}
      />

      {/* Main courante + supports + lisse basse */}
      <MainCouranteMeshes
        L={L}
        H={H}
        materiau={materiau}
        inclinaisonY={inclinaisonY}
        nbPoteaux={nbPoteaux}
      />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial {...MAT_SOL} />
      </mesh>

      {/* Silhouette humaine d'échelle */}
      <SilhouetteHumaine L={L} />

      {/* Annotation de hauteur */}
      <AnnotationHauteur L={L} H={H} />
    </group>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────

export default function RampeScene({ resultats, materiau, typeInstallation }: Props) {
  // Valeurs par défaut si resultats est null
  const L = resultats ? resultats.longueurMainCourante / 1000 : 3.0;
  const H = resultats ? resultats.hauteurGardeCorpsRequise / 1000 : 1.07;
  const nbPoteaux  = resultats ? Math.min(resultats.nombrePoteaux, 20)  : 4;
  const nbBarreaux = resultats ? Math.min(resultats.nombreBarreaux, 100) : 25;

  // Position caméra adaptée à la taille de la rampe
  const camPos: [number, number, number] = [
    L * 0.8,
    H * 2.5,
    L * 1.5,
  ];

  const target = new Vector3(0, H / 2, 0);

  return (
    <Canvas
      shadows
      camera={{ position: camPos, fov: 45 }}
      frameloop="demand"
    >
      {/* Éclairage */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 6, -4]} intensity={0.4} />

      {/* Scène */}
      <RampeGroup
        L={L}
        H={H}
        nbPoteaux={nbPoteaux}
        nbBarreaux={nbBarreaux}
        materiau={materiau}
        typeInstallation={typeInstallation}
      />

      {/* Ombres au contact */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.45}
        scale={12}
        blur={2.5}
        far={5}
      />

      {/* Environnement HDR ville */}
      <Environment preset="city" />

      {/* Contrôles */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI * 0.8}
        target={target}
      />
    </Canvas>
  );
}
