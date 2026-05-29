import { MateriauLimon, TypeMarche } from '@/lib/escaliers/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MeshesProps {
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

export const MATERIAUX_PBR: Record<string, { color: string; roughness: number; metalness: number }> = {
  bois_traite:  { color: '#8B6F47', roughness: 0.7, metalness: 0 },
  epinette:     { color: '#E5D4B1', roughness: 0.6, metalness: 0 },
  bois_franc:   { color: '#6B4423', roughness: 0.4, metalness: 0 },
  acier:        { color: '#6B7280', roughness: 0.2, metalness: 0.8 },
  contrepalque: { color: '#C8A878', roughness: 0.7, metalness: 0 },
  composite:    { color: '#4A5568', roughness: 0.5, metalness: 0.1 },
};

export function getPBR(key: string) {
  return MATERIAUX_PBR[key] ?? MATERIAUX_PBR.bois_traite;
}

// ─── Valeurs par défaut ───────────────────────────────────────────────────────

export const DEFAUTS: MeshesProps = {
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
