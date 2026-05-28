'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Vector3 } from 'three';
import { ResultatsRampe, MateriauRampe, TypeInstallation } from '@/lib/rampes/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  resultats: ResultatsRampe | null;
  materiau: MateriauRampe;
  typeInstallation: TypeInstallation;
}

// ─── Constantes matériaux PBR ─────────────────────────────────────────────────

const MAT = {
  bois:  { color: '#8B6F47', roughness: 0.7,  metalness: 0.0 },
  metal: { color: '#78909C', roughness: 0.15, metalness: 0.85 },
  verre: { color: '#B3E5FC', roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.35 },
  cable: { color: '#B0BEC5', roughness: 0.3,  metalness: 0.7 },
} as const;

const MAT_POTEAU_CABLE = { color: '#607D8B', roughness: 0.15, metalness: 0.85 };
const MAT_PLAQUE_PIED  = { color: '#90A4AE', roughness: 0.2,  metalness: 0.85 };
const MAT_SOL          = { color: '#F5F0EB', roughness: 0.85, metalness: 0.0 };
const MAT_DALLE_BOIS   = { color: '#C8A878', roughness: 0.7,  metalness: 0.0 };
const MAT_BETON        = { color: '#9E9E9E', roughness: 0.8,  metalness: 0.0 };
const MAT_SILHOUETTE   = { color: '#2D3748', roughness: 1.0,  metalness: 0.0, transparent: true, opacity: 0.5 };

// ─── Surface de support selon typeInstallation ────────────────────────────────

function SurfaceSupport({
  L,
  typeInstallation,
  materiau,
}: {
  L: number;
  typeInstallation: TypeInstallation;
  materiau: MateriauRampe;
}) {
  if (typeInstallation === 'escalier') {
    // 7 marches montant en diagonale (gauche → droite)
    const NB_MARCHES = 7;
    const marcheW = L / NB_MARCHES;
    const marcheH = 0.18; // contremarche
    const marcheD = 1.0;  // profondeur

    return (
      <group>
        {Array.from({ length: NB_MARCHES }).map((_, i) => (
          <mesh
            key={`marche-${i}`}
            position={[
              -L / 2 + i * marcheW + marcheW / 2,
              i * marcheH + marcheH / 2,
              0,
            ]}
            receiveShadow
          >
            <boxGeometry args={[marcheW + 0.01, marcheH, marcheD]} />
            <meshStandardMaterial {...MAT_DALLE_BOIS} />
          </mesh>
        ))}
      </group>
    );
  }

  // balcon / terrasse
  const dalleColor = materiau === 'bois' ? MAT_DALLE_BOIS : MAT_BETON;
  return (
    <group>
      {/* Dalle principale */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[L + 0.4, 0.18, 1.8]} />
        <meshStandardMaterial {...dalleColor} />
      </mesh>
      {/* Parapet bas (optionnel) */}
      <mesh position={[0, 0.15, -0.825]} castShadow>
        <boxGeometry args={[L + 0.2, 0.3, 0.15]} />
        <meshStandardMaterial {...MAT_BETON} />
      </mesh>
    </group>
  );
}

// ─── Poteaux ──────────────────────────────────────────────────────────────────

function PostesMeshes({
  L,
  H,
  nbPoteaux,
  materiau,
  inclinaisonY,
}: {
  L: number;
  H: number;
  nbPoteaux: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
}) {
  const espacement = nbPoteaux > 1 ? L / (nbPoteaux - 1) : L;
  const mat = materiau === 'cable' ? MAT_POTEAU_CABLE : MAT[materiau];

  return (
    <group>
      {Array.from({ length: nbPoteaux }).map((_, i) => {
        const x = i * espacement;
        const baseY = inclinaisonY(x);

        return (
          <group key={`poteau-${i}`} position={[x - L / 2, baseY, 0]}>
            {/* Plaque de pied */}
            <mesh position={[0, 0.005, 0]} castShadow>
              <boxGeometry args={[0.12, 0.01, 0.12]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>

            {/* Corps du poteau */}
            <mesh position={[0, H / 2 + 0.01, 0]} castShadow>
              {materiau === 'verre' ? (
                <boxGeometry args={[0.05, H, 0.008]} />
              ) : materiau === 'metal' ? (
                <cylinderGeometry args={[0.025, 0.025, H, 16]} />
              ) : (
                // bois ou cable
                <cylinderGeometry args={[0.03, 0.03, H, 8]} />
              )}
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Barreaux / balustres ─────────────────────────────────────────────────────

function BarreauxMeshes({
  L,
  H,
  nbPoteaux,
  nbBarreaux,
  materiau,
  inclinaisonY,
}: {
  L: number;
  H: number;
  nbPoteaux: number;
  nbBarreaux: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
}) {
  const mat = MAT[materiau];
  const espPoteaux = nbPoteaux > 1 ? L / (nbPoteaux - 1) : L;

  // ── Câble : 5 lignes horizontales entre chaque paire de poteaux
  if (materiau === 'cable') {
    const NB_LIGNES = 5;
    const elements: React.ReactNode[] = [];

    for (let p = 0; p < nbPoteaux - 1; p++) {
      const xDebut = p * espPoteaux - L / 2;
      const xFin   = (p + 1) * espPoteaux - L / 2;
      const dist   = espPoteaux;
      const xMid   = (xDebut + xFin) / 2;
      const yDebutBase = inclinaisonY(p * espPoteaux);
      const yFinBase   = inclinaisonY((p + 1) * espPoteaux);
      const yMidBase   = (yDebutBase + yFinBase) / 2;

      for (let l = 0; l < NB_LIGNES; l++) {
        const ratio = (l + 1) / (NB_LIGNES + 1);
        const yOffset = ratio * (H - 0.1) + 0.05;

        elements.push(
          <mesh
            key={`cable-${p}-${l}`}
            position={[xMid, yMidBase + yOffset, 0]}
            rotation={[0, 0, Math.atan2(yFinBase - yDebutBase, dist)]}
            castShadow
          >
            <cylinderGeometry args={[0.006, 0.006, dist, 6]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        );
      }
    }
    return <group>{elements}</group>;
  }

  // ── Verre : un panneau par inter-poteau
  if (materiau === 'verre') {
    const elements: React.ReactNode[] = [];
    for (let p = 0; p < nbPoteaux - 1; p++) {
      const xMid  = (p + 0.5) * espPoteaux - L / 2;
      const yBase = inclinaisonY((p + 0.5) * espPoteaux);
      const dist  = espPoteaux;

      elements.push(
        <mesh key={`verre-${p}`} position={[xMid, yBase + (H - 0.06) / 2 + 0.03, 0]} castShadow>
          <boxGeometry args={[dist - 0.02, H - 0.06, 0.01]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    }
    return <group>{elements}</group>;
  }

  // ── Bois / métal : barreaux verticaux
  const totalBarreaux = Math.max(nbBarreaux, 1);
  const espBarreau = L / (totalBarreaux + 1);

  return (
    <group>
      {Array.from({ length: totalBarreaux }).map((_, i) => {
        const x = (i + 1) * espBarreau;
        const baseY = inclinaisonY(x);
        const hauteurtBarreau = H - 0.08;

        return (
          <mesh
            key={`barreau-${i}`}
            position={[x - L / 2, baseY + hauteurtBarreau / 2 + 0.04, 0]}
            castShadow
          >
            {materiau === 'metal' ? (
              <cylinderGeometry args={[0.012, 0.012, hauteurtBarreau, 12]} />
            ) : (
              <cylinderGeometry args={[0.018, 0.018, hauteurtBarreau, 6]} />
            )}
            <meshStandardMaterial {...MAT[materiau]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Main courante ────────────────────────────────────────────────────────────

function MainCouranteMeshes({
  L,
  H,
  materiau,
  inclinaisonY,
  nbPoteaux,
}: {
  L: number;
  H: number;
  materiau: MateriauRampe;
  inclinaisonY: (x: number) => number;
  nbPoteaux: number;
}) {
  // Dépassement de 0.1m de chaque côté (exigence CCQ)
  const DEP = 0.1;
  const totalL = L + DEP * 2;

  // Pour escalier incliné, la main courante suit la pente
  // On place en y basé sur la mi-longueur
  const yMid = inclinaisonY(L / 2);
  const yDebut = inclinaisonY(0);
  const yFin   = inclinaisonY(L);
  const angle  = Math.atan2(yFin - yDebut, L);

  // Supports de main courante tous les ~0.6m
  const nbSupports = Math.max(2, Math.round(L / 0.6));
  const espSupport = L / (nbSupports - 1);

  const mat = MAT[materiau];

  // Profil de la main courante selon matériau
  let handrailGeom: React.ReactNode;
  if (materiau === 'bois') {
    handrailGeom = <cylinderGeometry args={[0.04, 0.035, totalL, 10]} />;
  } else if (materiau === 'metal') {
    handrailGeom = <cylinderGeometry args={[0.025, 0.025, totalL, 16]} />;
  } else {
    // verre / cable → profil plat alu
    handrailGeom = <boxGeometry args={[totalL, 0.06, 0.06]} />;
  }

  return (
    <group>
      {/* Main courante principale */}
      <mesh
        position={[0, yMid + H - 0.01, 0]}
        rotation={[0, 0, angle]}
        castShadow
      >
        {handrailGeom}
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* Supports de main courante (pattes en L) */}
      {Array.from({ length: nbSupports }).map((_, i) => {
        const x = i * espSupport;
        const baseY = inclinaisonY(x);
        return (
          <group key={`support-mc-${i}`} position={[x - L / 2, baseY + H - 0.12, 0]}>
            {/* Tige verticale */}
            <mesh position={[0, 0.05, 0.025]} castShadow>
              <boxGeometry args={[0.012, 0.1, 0.012]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>
            {/* Bras horizontal */}
            <mesh position={[0, 0.09, 0.0125]} castShadow>
              <boxGeometry args={[0.012, 0.012, 0.05]} />
              <meshStandardMaterial {...MAT_PLAQUE_PIED} />
            </mesh>
          </group>
        );
      })}

      {/* Lisse basse (bois/métal uniquement) */}
      {(materiau === 'bois' || materiau === 'metal') && (
        <mesh
          position={[0, inclinaisonY(L / 2) + 0.1, 0]}
          rotation={[0, 0, angle]}
          castShadow
        >
          <boxGeometry args={[L, 0.04, 0.04]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      )}
    </group>
  );
}

// ─── Silhouette humaine (échelle de référence) ────────────────────────────────

function SilhouetteHumaine({ L }: { L: number }) {
  const x = L / 2 + 0.55; // à côté de la rampe, légèrement à droite
  return (
    <group position={[x, 0, 0.5]}>
      {/* Corps */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.9, 4, 8]} />
        <meshStandardMaterial {...MAT_SILHOUETTE} />
      </mesh>
      {/* Tête */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial {...MAT_SILHOUETTE} />
      </mesh>
    </group>
  );
}

// ─── Annotation de hauteur (ligne + tick) ────────────────────────────────────

function AnnotationHauteur({ L, H }: { L: number; H: number }) {
  const x = -L / 2 - 0.45;
  return (
    <group position={[x, 0, 0]}>
      {/* Ligne verticale */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[0.01, H, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
      {/* Tick haut */}
      <mesh position={[0.04, H, 0]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
      {/* Tick bas */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />
        <meshStandardMaterial color="#64748B" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
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
