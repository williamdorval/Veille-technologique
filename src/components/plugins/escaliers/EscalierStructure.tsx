import { useMemo, ReactElement } from 'react';
import { MeshesProps, getPBR } from './escalier-scene-types';
import { buildGardeCourante } from './EscalierGardeCourante';
import { EscalierEnvironnement } from './EscalierEnvironnement';

// R3F mesh component — no 'use client' needed (used inside Canvas only)

export function EscalierMeshes(props: MeshesProps) {
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
  const longueurDiag    = Math.sqrt(lH * lH + hT * hT);
  const angleEscalier   = Math.atan2(hT, lH);
  const epaisseurMarche = 0.04; // 40 mm
  const nesDeMarche     = 0.025; // débord nez de marche 25 mm

  // Limons
  const limonEpaisseur = estAcier ? 0.05 : 0.04;
  const limonHauteur   = estAcier ? 0.20 : 0.28;
  const limonOffsetZ   = l / 2 + limonEpaisseur / 2;
  const limonCenterY   = hT / 2;
  const limonCenterZ   = lH / 2;

  // ── Marches + contremarches ─────────────────────────────────────────────────
  const marcheMeshes = useMemo(() => {
    const elements: ReactElement[] = [];

    for (let i = 0; i < nombreMarches; i++) {
      const posX = 0;
      const posY = i * hC + epaisseurMarche / 2;
      const posZ = i * g + (g + nesDeMarche) / 2;

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

      if (avecContremarches) {
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

  // ── Garde-corps (poteaux + balustres) ──────────────────────────────────────
  const { poteaux, balustres, avecGarde, hauteurGarde } = buildGardeCourante({
    nombreMarches,
    estAcier,
    pbrLimonColor: pbrLimon.color,
    pbrLimonRoughness: pbrLimon.roughness,
    pbrLimonMetalness: pbrLimon.metalness,
    hT,
    lH,
    l,
    g,
    hC,
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── Marches + contremarches ── */}
      {marcheMeshes}

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

      {/* ── Murs, sol, planchers, silhouette ── */}
      <EscalierEnvironnement l={l} hT={hT} lH={lH} />
    </group>
  );
}
