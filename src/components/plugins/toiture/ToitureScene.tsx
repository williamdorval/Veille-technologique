'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { ResultatsToiture, TypeToit, TypeRevetement } from '@/lib/toiture/types';
import { HAUTEUR_MURS, BatimentMeshes, ChevronsMeshes, ToitureMeshes } from './ToitureMeshes';

// ─── Props ─────────────────────────────────────────────────────────────────

interface ToitureSceneProps {
  resultats: ResultatsToiture;
  longueur: number;       // mm
  largeur: number;        // mm
  penteDegres: number;    // degrés
  debord: number;         // mm
  typeToit: TypeToit;
  typeRevetement: TypeRevetement;
}

// ─── Composant principal ───────────────────────────────────────────────────

export default function ToitureScene({
  resultats,
  longueur,
  largeur,
  penteDegres,
  debord,
  typeToit,
  typeRevetement,
}: ToitureSceneProps) {
  // Valeurs par défaut si données manquantes
  const lon = longueur > 0 ? longueur / 1000 : 8;      // mètres
  const lar = largeur > 0 ? largeur / 1000 : 6;         // mètres
  const pDeg = penteDegres > 0 ? penteDegres : 26.6;
  const deb = debord >= 0 ? debord / 1000 : 0.5;        // mètres
  const tToit: TypeToit = typeToit ?? 'deux_versants';
  const tRev: TypeRevetement = typeRevetement ?? 'bardeau_asphalte';

  void tToit; // utilisé pour extensions futures (croupe, appentis)

  const pente = useMemo(() => (pDeg * Math.PI) / 180, [pDeg]);

  // hauteur du faîtage au-dessus des murs
  const hauteurFaitage = useMemo(() => (lar / 2) * Math.tan(pente), [lar, pente]);

  // longueur développée du chevron (demi-largeur + débord)
  const longueurChevron = useMemo(
    () => (lar / 2 + deb) / Math.cos(pente),
    [lar, deb, pente]
  );

  // Point cible OrbitControls : centre du bâtiment à mi-hauteur faîtage
  const targetY = HAUTEUR_MURS + hauteurFaitage / 2;

  // Position caméra
  const camX = lon * 1.5;
  const camY = HAUTEUR_MURS + hauteurFaitage + lon * 0.8;
  const camZ = lar * 2;

  void resultats; // disponible pour extensions futures

  return (
    <Canvas
      shadows
      camera={{ position: [camX, camY, camZ], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 10, -8]} intensity={0.4} color="#e3f2fd" />

      <BatimentMeshes longueur={lon} largeur={lar} />

      <ChevronsMeshes
        longueur={lon}
        largeur={lar}
        pente={pente}
        hauteurFaitage={hauteurFaitage}
        longueurChevron={longueurChevron}
        debord={deb}
      />

      <ToitureMeshes
        longueur={lon}
        largeur={lar}
        pente={pente}
        hauteurFaitage={hauteurFaitage}
        longueurChevron={longueurChevron}
        debord={deb}
        typeRevetement={tRev}
      />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={30} blur={2} />

      <Environment preset="sunset" />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minDistance={5}
        maxDistance={40}
        target={[0, targetY, 0]}
      />
    </Canvas>
  );
}
