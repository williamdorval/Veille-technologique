import { ReactElement } from 'react';

// R3F mesh component — no 'use client' needed (used inside Canvas only)

export interface GardeCorouanteProps {
  nombreMarches: number;
  estAcier: boolean;
  pbrLimonColor: string;
  pbrLimonRoughness: number;
  pbrLimonMetalness: number;
  hT: number;
  lH: number;
  l: number;
  g: number;
  hC: number;
}

export interface GardeCorouanteResult {
  poteaux: ReactElement[];
  balustres: ReactElement[];
  avecGarde: boolean;
  hauteurGarde: number;
}

export function buildGardeCourante(props: GardeCorouanteProps): GardeCorouanteResult {
  const {
    nombreMarches,
    estAcier,
    pbrLimonColor,
    pbrLimonRoughness,
    pbrLimonMetalness,
    hT,
    lH,
    l,
    g,
    hC,
  } = props;

  const epaisseurMarche = 0.04;
  const avecGarde = nombreMarches >= 3;
  const hauteurGarde = 0.9; // 900 mm au-dessus du nez de marche

  const poteaux: ReactElement[] = [];
  const balustres: ReactElement[] = [];

  if (!avecGarde) {
    return { poteaux, balustres, avecGarde, hauteurGarde };
  }

  // ── Poteaux tous les 3 marches ──────────────────────────────────────────────
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
          color={estAcier ? '#6B7280' : pbrLimonColor}
          roughness={estAcier ? 0.2 : pbrLimonRoughness}
          metalness={estAcier ? 0.9 : pbrLimonMetalness}
        />
      </mesh>
    );
    poteaux.push(
      <mesh
        key={`poteau-neg-${i}`}
        position={[-l / 2 - 0.015, pyBase + hauteurPoteau / 2, pzBase]}
        castShadow
      >
        <cylinderGeometry args={[0.015, 0.015, hauteurPoteau, 8]} />
        <meshStandardMaterial
          color={estAcier ? '#6B7280' : pbrLimonColor}
          roughness={estAcier ? 0.2 : pbrLimonRoughness}
          metalness={estAcier ? 0.9 : pbrLimonMetalness}
        />
      </mesh>
    );
  }

  // ── Balustres verticaux (espacement ~100 mm = 0.1 unités) ──────────────────
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
          color={estAcier ? '#9CA3AF' : pbrLimonColor}
          roughness={estAcier ? 0.3 : 0.6}
          metalness={estAcier ? 0.7 : 0}
        />
      </mesh>
    );
    balustres.push(
      <mesh key={`balustre-d-${i}`} position={[-l / 2 - 0.01, by + hauteurBalustre / 2, bz]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, hauteurBalustre, 6]} />
        <meshStandardMaterial
          color={estAcier ? '#9CA3AF' : pbrLimonColor}
          roughness={estAcier ? 0.3 : 0.6}
          metalness={estAcier ? 0.7 : 0}
        />
      </mesh>
    );
  }

  return { poteaux, balustres, avecGarde, hauteurGarde };
}
