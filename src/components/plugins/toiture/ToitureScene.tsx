'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { ResultatsToiture } from '@/lib/toiture/types';

interface Props {
  resultats: ResultatsToiture;
  longueur: number;
  largeur: number;
  penteDegres: number;
  debord: number;
}

function ToitureMesh({ longueur, largeur, penteDegres, debord, nombreChevrons }: {
  longueur: number; largeur: number; penteDegres: number; debord: number; nombreChevrons: number;
}) {
  const L = longueur / 1000 + 2 * debord / 1000;
  const W = largeur / 1000 + 2 * debord / 1000;
  const hauteurFaite = (W / 2) * Math.tan((penteDegres * Math.PI) / 180);
  const murs_h = 2.5;  // hauteur murs m

  const nbChev = Math.min(nombreChevrons, 25);
  const chevronEsp = L / (nbChev - 1);

  return (
    <group>
      {/* Murs du bâtiment */}
      {[
        { pos: [0, murs_h / 2, W / 2] as [number, number, number], size: [L, murs_h, 0.15] as [number, number, number] },
        { pos: [0, murs_h / 2, -W / 2] as [number, number, number], size: [L, murs_h, 0.15] as [number, number, number] },
        { pos: [L / 2, murs_h / 2, 0] as [number, number, number], size: [0.15, murs_h, W] as [number, number, number] },
        { pos: [-L / 2, murs_h / 2, 0] as [number, number, number], size: [0.15, murs_h, W] as [number, number, number] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#d1d5db" roughness={0.8} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Sol */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[L + 0.5, 0.02, W + 0.5]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>

      {/* Versant gauche du toit */}
      <mesh position={[0, murs_h + hauteurFaite / 2, W / 4]}
        rotation={[-Math.atan(hauteurFaite / (W / 2)), 0, 0]}>
        <boxGeometry args={[L, 0.04, Math.sqrt(Math.pow(W / 2, 2) + Math.pow(hauteurFaite, 2))]} />
        <meshStandardMaterial color="#6B7280" roughness={0.7} transparent opacity={0.75} />
      </mesh>

      {/* Versant droit */}
      <mesh position={[0, murs_h + hauteurFaite / 2, -W / 4]}
        rotation={[Math.atan(hauteurFaite / (W / 2)), 0, 0]}>
        <boxGeometry args={[L, 0.04, Math.sqrt(Math.pow(W / 2, 2) + Math.pow(hauteurFaite, 2))]} />
        <meshStandardMaterial color="#6B7280" roughness={0.7} transparent opacity={0.75} />
      </mesh>

      {/* Faîtière */}
      <mesh position={[0, murs_h + hauteurFaite, 0]}>
        <boxGeometry args={[L, 0.06, 0.06]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.6} />
      </mesh>

      {/* Chevrons */}
      {Array.from({ length: nbChev }).map((_, i) => {
        const x = -L / 2 + i * chevronEsp;
        const chevLen = Math.sqrt(Math.pow(W / 2, 2) + Math.pow(hauteurFaite, 2));
        const angle = Math.atan(hauteurFaite / (W / 2));
        return (
          <group key={i} position={[x, murs_h + hauteurFaite / 2, 0]}>
            {/* versant gauche */}
            <mesh position={[0, 0, W / 4]} rotation={[-angle, 0, 0]}>
              <boxGeometry args={[0.04, 0.10, chevLen]} />
              <meshStandardMaterial color="#8B6F47" roughness={0.7} />
            </mesh>
            {/* versant droit */}
            <mesh position={[0, 0, -W / 4]} rotation={[angle, 0, 0]}>
              <boxGeometry args={[0.04, 0.10, chevLen]} />
              <meshStandardMaterial color="#8B6F47" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ToitureScene({ resultats, longueur, largeur, penteDegres, debord }: Props) {
  const L = longueur / 1000;
  const W = largeur / 1000;
  const camDist = Math.max(L, W) * 0.85 + 3;

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [L * 0.7, 5, camDist], fov: 45 }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <ToitureMesh
        longueur={longueur} largeur={largeur} penteDegres={penteDegres}
        debord={debord} nombreChevrons={resultats.nombreChevrons}
      />
      <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={15} blur={2} far={6} />
      <OrbitControls
        autoRotate autoRotateSpeed={0.3}
        enableZoom enablePan={false}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
