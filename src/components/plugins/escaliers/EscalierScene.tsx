'use client';

import { useMemo, ReactElement } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ResultatCalcul, EntreeFormulaire, MateriauLimon, TypeMarche } from '@/lib/escaliers/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SceneProps {
  resultat: ResultatCalcul;
  entree: EntreeFormulaire;
}

interface MeshesProps {
  nombreMarches: number;
  hauteurContremarche: number; // mm
  giron: number;               // mm
  largeur: number;             // mm
  hauteurTotale: number;       // mm
  longueurHorizontale: number; // mm
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
  avecContremarches: boolean;
}

// ─── Constantes matériaux PBR ─────────────────────────────────────────────────

const MATERIAUX_PBR: Record<string, { color: string; roughness: number; metalness: number }> = {
  bois_traite:  { color: '#8B6F47', roughness: 0.7, metalness: 0 },
  epinette:     { color: '#E5D4B1', roughness: 0.6, metalness: 0 },
  bois_franc:   { color: '#6B4423', roughness: 0.4, metalness: 0 },
  acier:        { color: '#6B7280', roughness: 0.2, metalness: 0.8 },
  contrepalque: { color: '#C8A878', roughness: 0.7, metalness: 0 },
  composite:    { color: '#4A5568', roughness: 0.5, metalness: 0.1 },
};

function getPBR(key: string) {
  return MATERIAUX_PBR[key] ?? MATERIAUX_PBR.bois_traite;
}

// ─── Valeurs par défaut ───────────────────────────────────────────────────────

const DEFAUTS: MeshesProps = {
  nombreMarches: 14,
  hauteurContremarche: 200,
  giron: 250,
  largeur: 900,
  hauteurTotale: 2800,
  longueurHorizontale: 3500,
  materiauLimon: 'epinette',
  typeMarche: 'bois_traite',
  avecContremarches: true,
};

// ─── Composant des meshes 3D ──────────────────────────────────────────────────

function EscalierMeshes(props: MeshesProps) {
  const {
    nombreMarches,
    hauteurContremarche,
    giron,
    largeur,
    hauteurTotale,
    longueurHorizontale,
    materiauLimon,
    typeMarche,
    avecContremarches,
  } = props;

  // Conversion mm → unités Three.js (÷100)
  const hC = hauteurContremarche / 100;
  const g  = giron / 100;
  const l  = largeur / 100;
  const hT = hauteurTotale / 100;
  const lH = longueurHorizontale / 100;

  // Matériaux
  const pbrMarche = getPBR(typeMarche);
  const pbrLimon  = getPBR(materiauLimon);
  const estAcier  = materiauLimon === 'acier';

  // Géométrie limon
  const longueurDiag = Math.sqrt(lH * lH + hT * hT);
  const angleEscalier = Math.atan2(hT, lH);
  const epaisseurMarche = 0.04; // 40 mm
  const nesDeMarche = 0.025;    // débord nez de marche 25 mm

  // Silhouette humaine — positionnée devant l'escalier
  const silhouetteY = 0;
  const silhouetteZ = -lH * 0.15;

  const meshes = useMemo(() => {
    const elements: ReactElement[] = [];

    // ── Marches + contremarches ──────────────────────────────────────────────
    for (let i = 0; i < nombreMarches; i++) {
      const posX = 0;
      const posY = i * hC + epaisseurMarche / 2;
      const posZ = i * g + (g + nesDeMarche) / 2;

      // Marche (avec nez débordant)
      elements.push(
        <mesh key={`marche-${i}`} position={[posX, posY, posZ]} castShadow receiveShadow>
          <boxGeometry args={[l, epaisseurMarche, g + nesDeMarche]} />
          <meshStandardMaterial
            color={pbrMarche.color}
            roughness={pbrMarche.roughness}
            metalness={pbrMarche.metalness}
          />
        </mesh>
      );

      // Contremarche (face verticale entre deux marches)
      if (avecContremarches && i < nombreMarches) {
        const cmPosY = i * hC - hC / 2;
        const cmPosZ = i * g;
        elements.push(
          <mesh key={`contremarche-${i}`} position={[posX, cmPosY, cmPosZ]} castShadow receiveShadow>
            <boxGeometry args={[l, hC, 0.02]} />
            <meshStandardMaterial
              color={pbrMarche.color}
              roughness={pbrMarche.roughness + 0.1}
              metalness={pbrMarche.metalness}
            />
          </mesh>
        );
      }
    }

    return elements;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreMarches, hC, g, l, epaisseurMarche, nesDeMarche, avecContremarches,
      pbrMarche.color, pbrMarche.roughness, pbrMarche.metalness]);

  // ── Limons (boards latéraux inclinés) ──────────────────────────────────────
  const limonEpaisseur = estAcier ? 0.05 : 0.04;
  const limonHauteur   = estAcier ? 0.20 : 0.28;
  const limonOffsetZ   = l / 2 + limonEpaisseur / 2;
  const limonCenterX   = 0;
  const limonCenterY   = hT / 2;
  const limonCenterZ   = lH / 2;

  // ── Main courante + poteaux + balustres ─────────────────────────────────────
  const avecGarde = nombreMarches >= 3;
  const hauteurGarde = 0.9; // 900 mm au-dessus du nez de marche

  const poteaux: ReactElement[] = [];
  const balustres: ReactElement[] = [];

  if (avecGarde) {
    // Poteaux tous les 3 marches
    for (let i = 0; i <= nombreMarches; i += 3) {
      const idx = Math.min(i, nombreMarches - 1);
      const pzBase = idx * g;
      const pyBase = idx * hC;
      const hauteurPoteau = hauteurGarde + epaisseurMarche;

      poteaux.push(
        <mesh
          key={`poteau-${i}`}
          position={[l / 2 + 0.015, pyBase + hauteurPoteau / 2, pzBase]}
          castShadow
        >
          <cylinderGeometry args={[0.015, 0.015, hauteurPoteau, 8]} />
          <meshStandardMaterial
            color={estAcier ? '#6B7280' : pbrLimon.color}
            roughness={estAcier ? 0.2 : pbrLimon.roughness}
            metalness={estAcier ? 0.9 : pbrLimon.metalness}
          />
        </mesh>
      );
      // Côté opposé
      poteaux.push(
        <mesh
          key={`poteau-neg-${i}`}
          position={[-l / 2 - 0.015, pyBase + hauteurPoteau / 2, pzBase]}
          castShadow
        >
          <cylinderGeometry args={[0.015, 0.015, hauteurPoteau, 8]} />
          <meshStandardMaterial
            color={estAcier ? '#6B7280' : pbrLimon.color}
            roughness={estAcier ? 0.2 : pbrLimon.roughness}
            metalness={estAcier ? 0.9 : pbrLimon.metalness}
          />
        </mesh>
      );
    }

    // Balustres verticaux (espacement ~100 mm = 0.1 unité)
    const espacementBalustre = 0.1;
    const nbBalustres = Math.floor(lH / espacementBalustre);
    for (let i = 1; i < nbBalustres; i++) {
      const frac = i / nbBalustres;
      const bz = frac * lH;
      const by = frac * hT;
      const hauteurBalustre = hauteurGarde;

      balustres.push(
        <mesh key={`balustre-g-${i}`} position={[l / 2 + 0.01, by + hauteurBalustre / 2, bz]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, hauteurBalustre, 6]} />
          <meshStandardMaterial
            color={estAcier ? '#9CA3AF' : pbrLimon.color}
            roughness={estAcier ? 0.3 : 0.6}
            metalness={estAcier ? 0.7 : 0}
          />
        </mesh>
      );
      balustres.push(
        <mesh key={`balustre-d-${i}`} position={[-l / 2 - 0.01, by + hauteurBalustre / 2, bz]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, hauteurBalustre, 6]} />
          <meshStandardMaterial
            color={estAcier ? '#9CA3AF' : pbrLimon.color}
            roughness={estAcier ? 0.3 : 0.6}
            metalness={estAcier ? 0.7 : 0}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ── Marches + contremarches ── */}
      {meshes}

      {/* ── Limon gauche ── */}
      <mesh
        position={[limonOffsetZ, limonCenterY, limonCenterZ]}
        rotation={[angleEscalier, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[limonEpaisseur, limonHauteur, longueurDiag]} />
        <meshStandardMaterial
          color={pbrLimon.color}
          roughness={pbrLimon.roughness}
          metalness={pbrLimon.metalness}
        />
      </mesh>

      {/* ── Limon droit ── */}
      <mesh
        position={[-limonOffsetZ, limonCenterY, limonCenterZ]}
        rotation={[angleEscalier, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[limonEpaisseur, limonHauteur, longueurDiag]} />
        <meshStandardMaterial
          color={pbrLimon.color}
          roughness={pbrLimon.roughness}
          metalness={pbrLimon.metalness}
        />
      </mesh>

      {/* ── Main courante gauche ── */}
      {avecGarde && (
        <mesh
          position={[l / 2 + 0.015, hauteurGarde + hT / 2, lH / 2]}
          rotation={[angleEscalier, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.022, 0.022, longueurDiag, 10]} />
          <meshStandardMaterial
            color={estAcier ? '#6B7280' : pbrLimon.color}
            roughness={estAcier ? 0.15 : pbrLimon.roughness}
            metalness={estAcier ? 0.9 : pbrLimon.metalness}
          />
        </mesh>
      )}

      {/* ── Main courante droite ── */}
      {avecGarde && (
        <mesh
          position={[-l / 2 - 0.015, hauteurGarde + hT / 2, lH / 2]}
          rotation={[angleEscalier, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.022, 0.022, longueurDiag, 10]} />
          <meshStandardMaterial
            color={estAcier ? '#6B7280' : pbrLimon.color}
            roughness={estAcier ? 0.15 : pbrLimon.roughness}
            metalness={estAcier ? 0.9 : pbrLimon.metalness}
          />
        </mesh>
      )}

      {/* ── Poteaux ── */}
      {poteaux}

      {/* ── Balustres ── */}
      {balustres}

      {/* ── Mur gauche (semi-transparent) ── */}
      <mesh
        position={[l / 2 + 0.075 + 0.08, hT / 2 + 0.5, lH / 2]}
        receiveShadow
      >
        <boxGeometry args={[0.15, hT + 1, lH + 0.5]} />
        <meshStandardMaterial
          color="#D4C5A9"
          roughness={0.9}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* ── Mur droit (semi-transparent) ── */}
      <mesh
        position={[-l / 2 - 0.075 - 0.08, hT / 2 + 0.5, lH / 2]}
        receiveShadow
      >
        <boxGeometry args={[0.15, hT + 1, lH + 0.5]} />
        <meshStandardMaterial
          color="#D4C5A9"
          roughness={0.9}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* ── Mur du fond en haut de l'escalier ── */}
      <mesh position={[0, hT / 2 + 1.5, lH + 0.075]} receiveShadow>
        <boxGeometry args={[l + 0.5, 3, 0.15]} />
        <meshStandardMaterial
          color="#D4C5A9"
          roughness={0.9}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* ── Dalle / plafond (montre le dégagement de tête) ── */}
      <mesh position={[0, hT + 0.15, lH / 2 + 0.5]}>
        <boxGeometry args={[l + 0.5, 0.3, lH + 1]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.9}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* ── Plancher de départ ── */}
      <mesh position={[0, -0.075, -1]} receiveShadow>
        <boxGeometry args={[l + 0.5, 0.15, 2]} />
        <meshStandardMaterial color="#C8A878" roughness={0.8} metalness={0} />
      </mesh>

      {/* ── Palier d'arrivée en haut ── */}
      <mesh position={[0, hT - 0.075, lH + 0.75]} receiveShadow>
        <boxGeometry args={[l + 0.5, 0.15, 1.5]} />
        <meshStandardMaterial color="#C8A878" roughness={0.8} metalness={0} />
      </mesh>

      {/* ── Sol ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, lH / 2]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F0EB" roughness={0.95} />
      </mesh>

      {/* ── Silhouette humaine (référence d'échelle 1750 mm) ── */}
      <group position={[l / 4, silhouetteY, silhouetteZ]}>
        {/* Corps */}
        <mesh position={[0, 0.875, 0]} castShadow>
          <capsuleGeometry args={[0.18, 1.05, 4, 8]} />
          <meshStandardMaterial
            color="#2D3748"
            roughness={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Tête */}
        <mesh position={[0, 1.65, 0]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial
            color="#2D3748"
            roughness={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── Composant principal exporté ──────────────────────────────────────────────

export function EscalierScene({ resultat, entree }: SceneProps) {
  // Sécurité : valeurs par défaut si données manquantes
  const nombreMarches      = resultat?.nombreMarches      ?? DEFAUTS.nombreMarches;
  const hauteurContremarche = resultat?.hauteurContremarche ?? DEFAUTS.hauteurContremarche;
  const giron              = resultat?.giron              ?? DEFAUTS.giron;
  const largeur            = entree?.largeur              ?? DEFAUTS.largeur;
  const hauteurTotale      = nombreMarches * hauteurContremarche;
  const longueurHorizontale = nombreMarches * giron;
  const materiauLimon      = entree?.materiauLimon        ?? DEFAUTS.materiauLimon;
  const typeMarche         = entree?.typeMarche           ?? DEFAUTS.typeMarche;
  const avecContremarches  = entree?.contremargesFermees  ?? DEFAUTS.avecContremarches;

  // Position caméra adaptée aux dimensions
  const lH = longueurHorizontale / 100;
  const hT = hauteurTotale / 100;
  const camX = lH * 1.5;
  const camY = hT * 1.2;
  const camZ = lH * 2;
  const targetX = lH / 2;
  const targetY = hT / 2;
  const targetZ = lH / 2;

  const meshProps: MeshesProps = {
    nombreMarches,
    hauteurContremarche,
    giron,
    largeur,
    hauteurTotale,
    longueurHorizontale,
    materiauLimon,
    typeMarche,
    avecContremarches,
  };

  return (
    <Canvas
      shadows
      camera={{ position: [camX, camY, camZ], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* ── Éclairage ── */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={new THREE.Vector2(2048, 2048)}
      />
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.4}
        color="#fff8e7"
      />
      <pointLight
        position={[0, hT + 2, lH - 1]}
        intensity={0.3}
        color="#fffde7"
      />

      {/* ── Scène ── */}
      <EscalierMeshes {...meshProps} />

      {/* ── Ombres de contact au sol ── */}
      <ContactShadows
        position={[0, -0.14, lH / 2]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
      />

      {/* ── Environnement HDR ── */}
      <Environment preset="apartment" />

      {/* ── Contrôles orbitaux ── */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI * 0.85}
        target={[targetX, targetY, targetZ]}
      />
    </Canvas>
  );
}
