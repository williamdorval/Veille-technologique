'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ResultatCalcul, EntreeFormulaire } from '@/lib/escaliers/types';
import { DEFAUTS, MeshesProps } from './escalier-scene-types';
import { EscalierMeshes } from './EscalierStructure';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SceneProps {
  resultat: ResultatCalcul;
  entree: EntreeFormulaire;
}

// ─── Composant principal exporté ──────────────────────────────────────────────

export function EscalierScene({ resultat, entree }: SceneProps) {
  // Sécurité : valeurs par défaut si données manquantes
  const nombreMarches       = resultat?.nombreMarches       ?? DEFAUTS.nombreMarches;
  const hauteurContremarche = resultat?.hauteurContremarche ?? DEFAUTS.hauteurContremarche;
  const giron               = resultat?.giron               ?? DEFAUTS.giron;
  const largeur             = entree?.largeur               ?? DEFAUTS.largeur;
  const hauteurTotale       = nombreMarches * hauteurContremarche;
  const longueurHorizontale = nombreMarches * giron;
  const materiauLimon       = entree?.materiauLimon         ?? DEFAUTS.materiauLimon;
  const typeMarche          = entree?.typeMarche            ?? DEFAUTS.typeMarche;
  const avecContremarches   = entree?.contremargesFermees   ?? DEFAUTS.avecContremarches;

  // Position caméra adaptée aux dimensions
  const lH     = longueurHorizontale / 100;
  const hT     = hauteurTotale / 100;
  const camX   = lH * 1.5;
  const camY   = hT * 1.2;
  const camZ   = lH * 2;
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

export default EscalierScene;
