'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ResultatsPlancher, TypeBois, TypeSousPlancher } from '@/lib/plancher/types';
import { DIMS_SOLIVE } from './plancher-scene-constants';
import { SoliveMeshes, RimJoistMeshes, BlockingMeshes } from './SoliveMeshes';
import { PoutreCentrale, FondationMeshes } from './StructureSupport';
import { SousPlancherMeshes, ClousMeshes } from './SousPlancherMeshes';

// ── Props du composant principal ──────────────────────────────────────────────

interface Props {
  resultats: ResultatsPlancher;
  portee: number;    // cm
  largeur: number;   // cm
  typeBois?: TypeBois;
  typeSousPlancher?: TypeSousPlancher;
}

// ── StructureComplete ─────────────────────────────────────────────────────────

interface StructureCompleteProps {
  resultats: ResultatsPlancher;
  porteeM: number;
  largeurM: number;
  typeBois: TypeBois;
  typeSousPlancher: TypeSousPlancher;
}

function StructureComplete({ resultats, porteeM, largeurM, typeBois, typeSousPlancher }: StructureCompleteProps) {
  const dimSolive = DIMS_SOLIVE[resultats.dimensionSoliveRecommandee];
  const bm = dimSolive.b;
  const hm = dimSolive.h;
  const espM = resultats.espacementSolive / 100; // cm → m
  const nbSolives = Math.min(resultats.nombreSolives, 40);
  const epaisseurSP = resultats.epaisseurSousPlancher; // cm
  const besoinPoutre = porteeM > 4.0;

  return (
    <>
      <SoliveMeshes
        L={porteeM}
        W={largeurM}
        bm={bm}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
        typeBois={typeBois}
      />
      <RimJoistMeshes
        L={porteeM}
        W={largeurM}
        bm={bm}
        hm={hm}
        typeBois={typeBois}
      />
      <BlockingMeshes
        W={largeurM}
        bm={bm}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
        typeBois={typeBois}
      />
      {besoinPoutre && (
        <PoutreCentrale L={porteeM} hm={hm} />
      )}
      <SousPlancherMeshes
        L={porteeM}
        W={largeurM}
        hm={hm}
        epaisseurCm={epaisseurSP}
        typeSousPlancher={typeSousPlancher}
      />
      <ClousMeshes
        L={porteeM}
        W={largeurM}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
      />
      <FondationMeshes L={porteeM} W={largeurM} hm={hm} />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function PlancherScene({
  resultats,
  portee,
  largeur,
  typeBois = 'SPF',
  typeSousPlancher = 'OSB',
}: Props) {
  const porteeM = (portee > 0 ? portee : 400) / 100;
  const largeurM = (largeur > 0 ? largeur : 500) / 100;

  const camX = largeurM * 0.8;
  const camY = Math.max(porteeM, largeurM) * 0.45 + 0.5;
  const camZ = porteeM * 0.8;

  return (
    <Canvas
      shadows
      camera={{ position: [camX, camY, camZ], fov: 40 }}
    >
      {/* Éclairage */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, -1, 0]} intensity={0.3} color="#ffe0b2" />

      <StructureComplete
        resultats={resultats}
        porteeM={porteeM}
        largeurM={largeurM}
        typeBois={typeBois}
        typeSousPlancher={typeSousPlancher}
      />

      <Environment preset="warehouse" />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={Math.max(porteeM, largeurM) * 2}
        blur={2.5}
        far={5}
      />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0.12, 0]}
      />
    </Canvas>
  );
}
