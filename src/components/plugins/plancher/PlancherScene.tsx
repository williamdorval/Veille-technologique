'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ResultatsPlancher } from '@/lib/plancher/types';
import { DIMENSIONS_SOLIVES } from '@/lib/plancher/normes';

interface Props {
  resultats: ResultatsPlancher;
  portee: number;
  largeur: number;
}

function PlancherMesh({ resultats, portee, largeur }: Props) {
  const { dimensionSoliveRecommandee, espacementSolive, nombreSolives, estConforme } = resultats;
  const dims = DIMENSIONS_SOLIVES[dimensionSoliveRecommandee];

  const L = portee / 1000;          // portée en mètres
  const W = largeur / 1000;         // largeur en mètres
  const bm = dims.b / 1000;         // largeur solive en m
  const hm = dims.h / 1000;         // hauteur solive en m
  const espM = espacementSolive / 1000;

  const nbSolives = Math.min(nombreSolives, 30);

  return (
    <group position={[-L / 2, 0, -W / 2]}>
      {/* Sol de référence */}
      <mesh position={[L / 2, -0.01, W / 2]} receiveShadow>
        <boxGeometry args={[L + 0.4, 0.02, W + 0.4]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.9} />
      </mesh>

      {/* Panneaux de sous-plancher (partiellement transparents) */}
      <mesh position={[L / 2, hm + 0.01, W / 2]}>
        <boxGeometry args={[L, 0.019, W]} />
        <meshStandardMaterial color="#C8A878" roughness={0.7} transparent opacity={0.65} />
      </mesh>

      {/* Solives */}
      {Array.from({ length: nbSolives }).map((_, i) => {
        const z = i * espM;
        const isNonConforme = !estConforme && i === Math.floor(nbSolives / 2);
        return (
          <mesh key={i} position={[L / 2, hm / 2, z]} castShadow>
            <boxGeometry args={[L, hm, bm]} />
            <meshStandardMaterial
              color={isNonConforme ? '#ef4444' : '#8B6F47'}
              roughness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PlancherScene({ resultats, portee, largeur }: Props) {
  const L = portee / 1000;
  const W = largeur / 1000;
  const camDist = Math.max(L, W) * 0.9 + 2;

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [L * 0.6, 1.5, camDist], fov: 45 }}
      shadows
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 8, -5]} intensity={0.4} />
      <PlancherMesh resultats={resultats} portee={portee} largeur={largeur} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={10} blur={2} far={4} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
