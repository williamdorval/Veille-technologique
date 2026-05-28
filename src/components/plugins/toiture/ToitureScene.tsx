'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { ResultatsToiture, TypeToit, TypeRevetement } from '@/lib/toiture/types';

// â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ToitureSceneProps {
  resultats: ResultatsToiture;
  longueur: number;       // mm
  largeur: number;        // mm
  penteDegres: number;    // degrÃ©s
  debord: number;         // mm
  typeToit: TypeToit;
  typeRevetement: TypeRevetement;
}

// â”€â”€â”€ Constantes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const HAUTEUR_MURS = 2.4; // mÃ¨tres

function couleurRevetement(type: TypeRevetement): { color: string; roughness: number; metalness: number } {
  switch (type) {
    case 'bardeau_asphalte': return { color: '#2D2D2D', roughness: 0.9, metalness: 0 };
    case 'tole_acier':        return { color: '#607D8B', roughness: 0.3, metalness: 0.6 };
    case 'membrane':          return { color: '#455A64', roughness: 0.8, metalness: 0 };
  }
}

// â”€â”€â”€ BÃ¢timent (murs + dalle + fenÃªtres) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface BatimentProps {
  longueur: number;  // mÃ¨tres
  largeur: number;   // mÃ¨tres
}

function BatimentMeshes({ longueur, largeur }: BatimentProps) {
  return (
    <group>
      {/* Dalle bÃ©ton */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[longueur + 0.4, 0.2, largeur + 0.4]} />
        <meshStandardMaterial color="#9E9E9E" roughness={0.9} />
      </mesh>

      {/* Mur avant (z nÃ©gatif) */}
      <mesh position={[0, HAUTEUR_MURS / 2, -largeur / 2]} receiveShadow castShadow>
        <boxGeometry args={[longueur, HAUTEUR_MURS, 0.2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.9} />
      </mesh>

      {/* Mur arriÃ¨re (z positif) */}
      <mesh position={[0, HAUTEUR_MURS / 2, largeur / 2]} receiveShadow castShadow>
        <boxGeometry args={[longueur, HAUTEUR_MURS, 0.2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.9} />
      </mesh>

      {/* Mur gauche (x nÃ©gatif) */}
      <mesh position={[-longueur / 2, HAUTEUR_MURS / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, HAUTEUR_MURS, largeur]} />
        <meshStandardMaterial color="#DDD5C5" roughness={0.9} />
      </mesh>

      {/* Mur droit (x positif) */}
      <mesh position={[longueur / 2, HAUTEUR_MURS / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, HAUTEUR_MURS, largeur]} />
        <meshStandardMaterial color="#DDD5C5" roughness={0.9} />
      </mesh>

      {/* FenÃªtres â€” mur avant */}
      {[-longueur / 4, longueur / 4].map((x, i) => (
        <mesh key={`fen-av-${i}`} position={[x, HAUTEUR_MURS * 0.55, -largeur / 2 - 0.01]}>
          <boxGeometry args={[1.0, 0.8, 0.05]} />
          <meshStandardMaterial color="#90CAF9" roughness={0.1} metalness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* FenÃªtre â€” mur gauche */}
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

// â”€â”€â”€ Chevrons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ChevronsProps {
  longueur: number;        // mÃ¨tres
  largeur: number;         // mÃ¨tres
  pente: number;           // radians
  hauteurFaitage: number;  // mÃ¨tres
  longueurChevron: number; // mÃ¨tres (dÃ©veloppÃ©e)
  debord: number;          // mÃ¨tres
}

function ChevronsMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord }: ChevronsProps) {
  const espacement = 0.5; // mÃ¨tres
  const nbChevrons = Math.round(longueur / espacement) + 1;
  const positions: number[] = [];
  for (let i = 0; i < nbChevrons; i++) {
    positions.push(-longueur / 2 + i * (longueur / (nbChevrons - 1)));
  }

  // Centre vertical du chevron : milieu entre l'about de l'about (eave) et le faÃ®tage
  const yCentreVersant = HAUTEUR_MURS + (largeur / 2 - debord) * Math.tan(pente) / 2;
  // Centre Z du versant depuis l'axe faÃ®tage : quart de la largeur totale
  const zOffsetVersant = (largeur / 4 + debord / 2);

  return (
    <group>
      {positions.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Versant gauche â€” descend vers z nÃ©gatif */}
          <mesh
            position={[0, yCentreVersant, -zOffsetVersant]}
            rotation={[-pente, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, 0.09, longueurChevron]} />
            <meshStandardMaterial color="#8B6F47" roughness={0.8} />
          </mesh>
          {/* Versant droit â€” descend vers z positif */}
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

// â”€â”€â”€ Toiture (versants + faÃ®tiÃ¨re + solin) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ToitureProps {
  longueur: number;        // mÃ¨tres
  largeur: number;         // mÃ¨tres
  pente: number;           // radians
  hauteurFaitage: number;  // mÃ¨tres
  longueurChevron: number; // mÃ¨tres (dÃ©veloppÃ©e)
  debord: number;          // mÃ¨tres
  typeRevetement: TypeRevetement;
}

function ToitureMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord, typeRevetement }: ToitureProps) {
  const mat = couleurRevetement(typeRevetement);
  const longueurRevÃªtement = longueur + debord * 2;
  // Largeur dÃ©veloppÃ©e du panneau = longueur du chevron + un peu de dÃ©bord en gouttiÃ¨re
  const largeurPanneau = longueurChevron + 0.15;
  // Position Y du centre du panneau : entre sommet murs et faÃ®tage
  const yCentre = HAUTEUR_MURS + (largeur / 2 - debord) * Math.tan(pente) / 2;
  // Position Z du centre du panneau (centre du versant)
  const zCentrePanneau = (largeur / 4 + debord / 2);
  // Solin de faÃ®tiÃ¨re
  const yFaitage = HAUTEUR_MURS + hauteurFaitage;

  return (
    <group>
      {/* Versant gauche (z nÃ©gatif, descend vers z-) */}
      {/* Versant gauche (z négatif) */}
      <mesh
        position={[0, yCentre, -zCentrePanneau]}
        rotation={[-pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[longueurRevÃªtement, 0.04, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </mesh>

      {/* Versant droit (z positif) — rotation [+pente] : -Z local pointe vers le faîtage */}
      <mesh
        position={[0, yCentre, zCentrePanneau]}
        rotation={[pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[longueurRevÃªtement, 0.04, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </mesh>

      {/* FaÃ®tiÃ¨re (ridge board) */}
      <mesh position={[0, yFaitage, 0]} castShadow>
        <boxGeometry args={[longueurRevÃªtement, 0.05, 0.15]} />
        <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
      </mesh>

      {/* Solin de faÃ®tiÃ¨re */}
      <mesh position={[0, yFaitage + 0.04, 0]}>
        <boxGeometry args={[longueurRevÃªtement, 0.03, 0.3]} />
        <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
      </mesh>
    </group>
  );
}

// â”€â”€â”€ Composant principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ToitureScene({
  resultats,
  longueur,
  largeur,
  penteDegres,
  debord,
  typeToit,
  typeRevetement,
}: ToitureSceneProps) {
  // Valeurs par dÃ©faut si donnÃ©es manquantes
  const lon = longueur > 0 ? longueur / 1000 : 8;      // mÃ¨tres
  const lar = largeur > 0 ? largeur / 1000 : 6;         // mÃ¨tres
  const pDeg = penteDegres > 0 ? penteDegres : 26.6;
  const deb = debord >= 0 ? debord / 1000 : 0.5;        // mÃ¨tres
  const tToit: TypeToit = typeToit ?? 'deux_versants';
  const tRev: TypeRevetement = typeRevetement ?? 'bardeau_asphalte';

  void tToit; // utilisÃ© pour extensions futures (croupe, appentis)

  const pente = useMemo(() => (pDeg * Math.PI) / 180, [pDeg]);

  // hauteur du faÃ®tage au-dessus des murs
  const hauteurFaitage = useMemo(() => (lar / 2) * Math.tan(pente), [lar, pente]);

  // longueur dÃ©veloppÃ©e du chevron (demi-largeur + dÃ©bord)
  const longueurChevron = useMemo(
    () => (lar / 2 + deb) / Math.cos(pente),
    [lar, deb, pente]
  );

  // Point cible OrbitControls : centre du bÃ¢timent Ã  mi-hauteur faÃ®tage
  const targetY = HAUTEUR_MURS + hauteurFaitage / 2;

  // Position camÃ©ra
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

