'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { ResultatsToiture, TypeToit, TypeRevetement } from '@/lib/toiture/types';

// ─── Props ───────────────────────────────────────────────────────────────────

interface ToitureSceneProps {
  resultats: ResultatsToiture;
  longueur: number;       // mm
  largeur: number;        // mm
  penteDegres: number;    // degrés
  debord: number;         // mm
  typeToit: TypeToit;
  typeRevetement: TypeRevetement;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const HAUTEUR_MURS = 2.4; // mètres

function couleurRevetement(type: TypeRevetement): { color: string; roughness: number; metalness: number } {
  switch (type) {
    case 'bardeau_asphalte': return { color: '#2D2D2D', roughness: 0.9, metalness: 0 };
    case 'tole_acier':        return { color: '#607D8B', roughness: 0.3, metalness: 0.6 };
    case 'membrane':          return { color: '#455A64', roughness: 0.8, metalness: 0 };
  }
}

// ─── Bâtiment (murs + dalle + fenêtres) ──────────────────────────────────────

interface BatimentProps {
  longueur: number;  // mètres
  largeur: number;   // mètres
}

function BatimentMeshes({ longueur, largeur }: BatimentProps) {
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

      {/* Fenêtres — mur avant */}
      {[-longueur / 4, longueur / 4].map((x, i) => (
        <mesh key={`fen-av-${i}`} position={[x, HAUTEUR_MURS * 0.55, -largeur / 2 - 0.01]}>
          <boxGeometry args={[1.0, 0.8, 0.05]} />
          <meshStandardMaterial color="#90CAF9" roughness={0.1} metalness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Fenêtre — mur gauche */}
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

// ─── Chevrons ────────────────────────────────────────────────────────────────

interface ChevronsProps {
  longueur: number;        // mètres
  largeur: number;         // mètres
  pente: number;           // radians
  hauteurFaitage: number;  // mètres
  longueurChevron: number; // mètres (développée)
  debord: number;          // mètres
}

function ChevronsMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord }: ChevronsProps) {
  const espacement = 0.5; // mètres
  const nbChevrons = Math.round(longueur / espacement) + 1;
  const positions: number[] = [];
  for (let i = 0; i < nbChevrons; i++) {
    positions.push(-longueur / 2 + i * (longueur / (nbChevrons - 1)));
  }

  // Centre vertical du chevron : mi-hauteur entre sommet des murs et faîtage
  const yCentreVersant = HAUTEUR_MURS + hauteurFaitage / 2;
  // Centre Z du versant depuis l'axe faîtage : quart de la largeur totale
  const zOffsetVersant = (largeur / 4 + debord / 2);

  return (
    <group>
      {positions.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Versant gauche — descend vers z négatif */}
          <mesh
            position={[0, yCentreVersant, -zOffsetVersant]}
            rotation={[pente, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, 0.09, longueurChevron]} />
            <meshStandardMaterial color="#8B6F47" roughness={0.8} />
          </mesh>
          {/* Versant droit — descend vers z positif */}
          <mesh
            position={[0, yCentreVersant, zOffsetVersant]}
            rotation={[-pente, 0, 0]}
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

// ─── Toiture (versants + faîtière + solin) ───────────────────────────────────

interface ToitureProps {
  longueur: number;        // mètres
  largeur: number;         // mètres
  pente: number;           // radians
  hauteurFaitage: number;  // mètres
  longueurChevron: number; // mètres (développée)
  debord: number;          // mètres
  typeRevetement: TypeRevetement;
}

function ToitureMeshes({ longueur, largeur, pente, hauteurFaitage, longueurChevron, debord, typeRevetement }: ToitureProps) {
  const mat = couleurRevetement(typeRevetement);
  const longueurRevêtement = longueur + debord * 2;
  // Largeur développée du panneau = longueur du chevron + un peu de débord en gouttière
  const largeurPanneau = longueurChevron + 0.15;
  // Position Y du centre du panneau : entre sommet murs et faîtage
  const yCentre = HAUTEUR_MURS + hauteurFaitage / 2;
  // Position Z du centre du panneau (centre du versant)
  const zCentrePanneau = (largeur / 4 + debord / 2);
  // Solin de faîtière
  const yFaitage = HAUTEUR_MURS + hauteurFaitage;

  return (
    <group>
      {/* Versant gauche (z négatif, descend vers z-) */}
      {/* rotation X = pente → le côté z+ du panneau monte vers le faîtage */}
      <mesh
        position={[0, yCentre, -zCentrePanneau]}
        rotation={[pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[longueurRevêtement, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          side={2}
        />
      </mesh>

      {/* Versant droit (z positif, descend vers z+) */}
      {/* rotation X = -pente → le côté z- du panneau monte vers le faîtage */}
      <mesh
        position={[0, yCentre, zCentrePanneau]}
        rotation={[-pente, 0, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[longueurRevêtement, largeurPanneau]} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          side={2}
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

// ─── Composant principal ─────────────────────────────────────────────────────

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
