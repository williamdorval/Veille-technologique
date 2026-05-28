'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ResultatsRampe } from '@/lib/rampes/types';

interface MatProps {
  color: string;
  roughness: number;
  metalness: number;
  transparent?: boolean;
  opacity?: number;
}

interface Props {
  resultats: ResultatsRampe;
  matProps: MatProps;
}

function RampeMesh({ resultats, matProps }: Props) {
  const { longueurMainCourante, hauteurGardeCorpsRequise, nombrePoteaux, nombreBarreaux } = resultats;

  const L = longueurMainCourante / 1000;   // mètres
  const H = hauteurGardeCorpsRequise / 1000;
  const nbPoteaux = Math.min(nombrePoteaux, 20); // plafonner pour perfs
  const nbBarreaux = Math.min(nombreBarreaux, 80);

  const poteauEspacement = nbPoteaux > 1 ? L / (nbPoteaux - 1) : L;
  const barreauEspacement = nbBarreaux > 0 ? L / (nbBarreaux + 1) : L;

  const material = (
    <meshStandardMaterial
      color={matProps.color}
      roughness={matProps.roughness}
      metalness={matProps.metalness}
      transparent={matProps.transparent ?? false}
      opacity={matProps.opacity ?? 1}
    />
  );

  return (
    <group position={[-L / 2, 0, 0]}>
      {/* Sol */}
      <mesh position={[L / 2, -0.02, 0]} receiveShadow>
        <boxGeometry args={[L + 0.5, 0.04, 1.2]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>

      {/* Poteaux */}
      {Array.from({ length: nbPoteaux }).map((_, i) => (
        <mesh key={`poteau-${i}`} position={[i * poteauEspacement, H / 2, 0]} castShadow>
          <boxGeometry args={[0.06, H, 0.06]} />
          {material}
        </mesh>
      ))}

      {/* Barreaux verticaux */}
      {Array.from({ length: nbBarreaux }).map((_, i) => (
        <mesh key={`barreau-${i}`} position={[(i + 1) * barreauEspacement, H / 2 - 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, H - 0.1, 6]} />
          {material}
        </mesh>
      ))}

      {/* Main courante */}
      <mesh position={[L / 2, H, 0]} castShadow>
        <boxGeometry args={[L, 0.05, 0.05]} />
        {material}
      </mesh>

      {/* Lisse basse */}
      <mesh position={[L / 2, 0.06, 0]} castShadow>
        <boxGeometry args={[L, 0.04, 0.04]} />
        {material}
      </mesh>
    </group>
  );
}

export default function RampeScene({ resultats, matProps }: Props) {
  const L = (resultats.longueurMainCourante / 1000);
  const H = (resultats.hauteurGardeCorpsRequise / 1000);
  const camDist = Math.max(L, H) * 1.8 + 1;

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, H * 0.8, camDist], fov: 45 }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <RampeMesh resultats={resultats} matProps={matProps} />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
