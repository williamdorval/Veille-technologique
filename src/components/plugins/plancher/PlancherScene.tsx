'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ResultatsPlancher, TypeBois, TypeSousPlancher, DimensionSolive } from '@/lib/plancher/types';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Props {
  resultats: ResultatsPlancher;
  portee: number;    // mm
  largeur: number;   // mm
  typeBois?: TypeBois;
  typeSousPlancher?: TypeSousPlancher;
}

// ── Constantes ────────────────────────────────────────────────────────────────

const DIMS_SOLIVE: Record<DimensionSolive, { b: number; h: number }> = {
  '2x6':  { b: 0.038, h: 0.140 },
  '2x8':  { b: 0.038, h: 0.184 },
  '2x10': { b: 0.038, h: 0.235 },
  '2x12': { b: 0.038, h: 0.286 },
};

const COULEUR_BOIS: Record<TypeBois, { color: string; roughness: number }> = {
  SPF:     { color: '#D4B896', roughness: 0.72 },
  douglas: { color: '#C4854A', roughness: 0.62 },
  LVL:     { color: '#8B6F4E', roughness: 0.52 },
};

const COULEUR_SOUS_PLANCHER: Record<TypeSousPlancher, { color: string; roughness: number }> = {
  OSB:         { color: '#C4A882', roughness: 0.85 },
  contreplaque: { color: '#D4B896', roughness: 0.70 },
};

const COULEUR_LVL_BEAM = '#6B5240';
const COULEUR_BETON = '#BDBDBD';
const COULEUR_SOL = '#7A6554';
const COULEUR_CLOU = '#9E9E9E';

// ── Sous-composants ───────────────────────────────────────────────────────────

interface SolivesProps {
  L: number;         // portée en m (direction Z)
  W: number;         // largeur en m (direction X)
  bm: number;        // largeur solive m
  hm: number;        // hauteur solive m
  espM: number;      // espacement entre solives m
  nbSolives: number;
  typeBois: TypeBois;
}

function SoliveMeshes({ L, W, bm, hm, espM, nbSolives, typeBois }: SolivesProps) {
  const mat = COULEUR_BOIS[typeBois];
  // Positions: de -W/2 à +W/2, la première et dernière sont les solives de rive intérieures
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < nbSolives; i++) {
      pts.push(-W / 2 + i * espM);
    }
    return pts;
  }, [W, espM, nbSolives]);

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bm, hm, L]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}

interface RimJoistProps {
  L: number;
  W: number;
  bm: number;
  hm: number;
  typeBois: TypeBois;
}

function RimJoistMeshes({ L, W, bm, hm, typeBois }: RimJoistProps) {
  const mat = COULEUR_BOIS[typeBois];
  const totalW = W + 2 * bm; // largeur totale incluant les rives longitudinales

  return (
    <>
      {/* Solives de rive longitudinales (parallèles à Z, aux extrémités X) */}
      {([-W / 2 - bm / 2, W / 2 + bm / 2] as number[]).map((x, i) => (
        <mesh key={`long-${i}`} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bm, hm, L]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
      {/* Solives de rive transversales (perpendiculaires, aux extrémités Z) */}
      {([-L / 2, L / 2] as number[]).map((z, i) => (
        <mesh key={`trans-${i}`} position={[0, hm / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[totalW, hm, bm]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}

interface BlockingProps {
  W: number;
  bm: number;
  hm: number;
  espM: number;
  nbSolives: number;
  typeBois: TypeBois;
}

function BlockingMeshes({ W, bm, hm, espM, nbSolives, typeBois }: BlockingProps) {
  const mat = COULEUR_BOIS[typeBois];
  const innerWidth = espM - bm * 2;

  // useMemo appelé inconditionnellement (règles des hooks)
  const positions = useMemo(() => {
    if (nbSolives < 2 || innerWidth <= 0) return [];
    const pts: number[] = [];
    for (let i = 0; i < nbSolives - 1; i++) {
      pts.push(-W / 2 + i * espM + espM / 2);
    }
    return pts;
  }, [W, espM, nbSolives, innerWidth]);

  if (positions.length === 0) return null;

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, hm / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[innerWidth, hm, bm]} />
          <meshStandardMaterial color={mat.color} roughness={mat.roughness} />
        </mesh>
      ))}
    </>
  );
}

interface PoutreProps {
  L: number;
  hm: number;
}

function PoutreCentrale({ L, hm }: PoutreProps) {
  const beamH = hm * 1.5;
  const beamB = 0.09; // 90mm
  const beamY = hm / 2 - beamH / 2; // bas des solives moins la moitié de la hauteur poutre

  // Poteaux sous la poutre (hauteur vide sanitaire = 2.4m sous solives)
  const hauteurPoteau = 2.4 - hm;
  const poteauY = -hm / 2 - hauteurPoteau / 2;

  const positionsPoteaux = useMemo(() => [-L / 2 + 0.3, 0, L / 2 - 0.3], [L]);

  return (
    <>
      {/* Poutre engineered beam */}
      <mesh position={[0, beamY, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamB, beamH, L]} />
        <meshStandardMaterial color={COULEUR_LVL_BEAM} roughness={0.5} />
      </mesh>
      {/* Poteaux de support */}
      {positionsPoteaux.map((z, i) => (
        <mesh key={i} position={[0, poteauY, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, hauteurPoteau, 8]} />
          <meshStandardMaterial color={COULEUR_LVL_BEAM} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
}

interface SousPlancherProps {
  L: number;
  W: number;
  hm: number;
  epaisseurMm: number;
  typeSousPlancher: TypeSousPlancher;
}

function SousPlancherMeshes({ L, W, hm, epaisseurMm, typeSousPlancher }: SousPlancherProps) {
  const ep = epaisseurMm / 1000; // épaisseur en m
  const mat = COULEUR_SOUS_PLANCHER[typeSousPlancher];

  // Dimensions d'un panneau 4'x8' = 1.22m x 2.44m
  const PW = 1.22;
  const PL = 2.44;
  const GAP = 0.003; // joint de 3mm

  const nbX = Math.ceil(W / PW);
  const nbZ = Math.ceil(L / PL);

  const panneaux = useMemo(() => {
    const items: { x: number; z: number; w: number; l: number; key: string; show: boolean }[] = [];
    for (let ix = 0; ix < nbX; ix++) {
      for (let iz = 0; iz < nbZ; iz++) {
        // Quinconce: chaque rangée Z est décalée d'une demi-longueur
        const decalageZ = (ix % 2) * (PL / 2);

        const x0 = -W / 2 + ix * PW;
        const z0 = -L / 2 + iz * PL + decalageZ;

        // Clamp aux limites de la pièce
        const x1 = Math.min(x0 + PW - GAP, W / 2);
        const z1 = Math.min(z0 + PL - GAP, L / 2);
        const panW = x1 - x0;
        const panL = z1 - z0;

        if (panW <= 0 || panL <= 0) continue;

        // Vue en coupe: on n'affiche que la moitié des panneaux (côté Z > 0)
        const show = z0 >= -GAP; // montre seulement la moitié Z+

        items.push({
          x: x0 + panW / 2,
          z: z0 + panL / 2,
          w: panW,
          l: panL,
          key: `${ix}-${iz}`,
          show,
        });
      }
    }
    return items;
  }, [W, L, nbX, nbZ]);

  const y = hm + ep / 2;

  return (
    <>
      {panneaux.map(({ x, z, w, l, key, show }) =>
        show ? (
          <mesh key={key} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[w, ep, l]} />
            <meshStandardMaterial
              color={mat.color}
              roughness={mat.roughness}
              transparent
              opacity={0.85}
            />
          </mesh>
        ) : null
      )}
    </>
  );
}

interface CloudsProps {
  L: number;
  W: number;
  hm: number;
  espM: number;
  nbSolives: number;
}

function ClousMeshes({ L, W, hm, espM, nbSolives }: CloudsProps) {
  const clous = useMemo(() => {
    const items: { x: number; z: number; key: string }[] = [];
    const pas = 0.3; // un clou tous les 30cm
    const nbClous = Math.floor(L / pas);

    for (let i = 0; i < nbSolives; i++) {
      const x = -W / 2 + i * espM;
      for (let j = 0; j < nbClous; j++) {
        const z = -L / 2 + j * pas + pas / 2;
        items.push({ x, z, key: `${i}-${j}` });
      }
    }
    return items;
  }, [L, W, espM, nbSolives]);

  const clousY = hm + 0.001; // juste au dessus des solives

  return (
    <>
      {clous.map(({ x, z, key }) => (
        <mesh key={key} position={[x, clousY, z]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
          <meshStandardMaterial color={COULEUR_CLOU} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

interface FondationProps {
  L: number;
  W: number;
  hm: number;
}

function FondationMeshes({ L, W, hm }: FondationProps) {
  const hauteurVide = 2.4; // vide sanitaire en m
  const solY = -hauteurVide; // sol de la cave
  const murH = 0.3;
  const murE = 0.2; // épaisseur mur béton

  const totalW = W + 2 * 0.038 + murE; // inclure rim joist + mur

  return (
    <>
      {/* Sol de la cave */}
      <mesh position={[0, solY, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={COULEUR_SOL} roughness={0.95} />
      </mesh>

      {/* Murs de fondation béton — 4 côtés */}
      {/* Côtés longs (parallèles à Z) */}
      {([-W / 2 - murE / 2 - 0.038, W / 2 + murE / 2 + 0.038] as number[]).map((x, i) => (
        <mesh key={`mur-long-${i}`} position={[x, -hm / 2 - murH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[murE, murH, L + 2 * murE]} />
          <meshStandardMaterial color={COULEUR_BETON} roughness={0.85} />
        </mesh>
      ))}
      {/* Côtés transversaux (perpendiculaires à Z) */}
      {([-L / 2, L / 2] as number[]).map((z, i) => (
        <mesh key={`mur-trans-${i}`} position={[0, -hm / 2 - murH / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[totalW, murH, murE]} />
          <meshStandardMaterial color={COULEUR_BETON} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

// ── Scène principale ──────────────────────────────────────────────────────────

function StructureComplete({ resultats, porteeM, largeurM, typeBois, typeSousPlancher }: {
  resultats: ResultatsPlancher;
  porteeM: number;
  largeurM: number;
  typeBois: TypeBois;
  typeSousPlancher: TypeSousPlancher;
}) {
  const dimSolive = DIMS_SOLIVE[resultats.dimensionSoliveRecommandee];
  const bm = dimSolive.b;
  const hm = dimSolive.h;
  const espM = resultats.espacementSolive / 1000;
  const nbSolives = Math.min(resultats.nombreSolives, 40);
  const epaisseurSP = resultats.epaisseurSousPlancher; // mm
  const besoinPoutre = porteeM > 4.0;

  return (
    <>
      {/* Solives intérieures */}
      <SoliveMeshes
        L={porteeM}
        W={largeurM}
        bm={bm}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
        typeBois={typeBois}
      />

      {/* Solives de rive (périmètre) */}
      <RimJoistMeshes
        L={porteeM}
        W={largeurM}
        bm={bm}
        hm={hm}
        typeBois={typeBois}
      />

      {/* Blocages au milieu de la portée */}
      <BlockingMeshes
        W={largeurM}
        bm={bm}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
        typeBois={typeBois}
      />

      {/* Poutre centrale si portée > 4m */}
      {besoinPoutre && (
        <PoutreCentrale L={porteeM} hm={hm} />
      )}

      {/* Sous-plancher en quinconce (vue en coupe: moitié visible) */}
      <SousPlancherMeshes
        L={porteeM}
        W={largeurM}
        hm={hm}
        epaisseurMm={epaisseurSP}
        typeSousPlancher={typeSousPlancher}
      />

      {/* Clous de fixation */}
      <ClousMeshes
        L={porteeM}
        W={largeurM}
        hm={hm}
        espM={espM}
        nbSolives={nbSolives}
      />

      {/* Fondation + sol de cave */}
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
  // Valeurs par défaut si null/0
  const porteeM = (portee > 0 ? portee : 4000) / 1000;
  const largeurM = (largeur > 0 ? largeur : 5000) / 1000;

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

      {/* Structure complète */}
      <StructureComplete
        resultats={resultats}
        porteeM={porteeM}
        largeurM={largeurM}
        typeBois={typeBois}
        typeSousPlancher={typeSousPlancher}
      />

      {/* Environment HDR warehouse */}
      <Environment preset="warehouse" />

      {/* Ombres de contact (sur le dessus des solives) */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={Math.max(porteeM, largeurM) * 2}
        blur={2.5}
        far={5}
      />

      {/* Contrôles caméra */}
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
