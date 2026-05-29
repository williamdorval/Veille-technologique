// plancher-scene-constants.ts — Constantes visuelles pour la scène 3D du plancher
import { TypeBois, TypeSousPlancher, DimensionSolive } from '@/lib/plancher/types';

export const DIMS_SOLIVE: Record<DimensionSolive, { b: number; h: number }> = {
  '2x6':  { b: 0.038, h: 0.140 },
  '2x8':  { b: 0.038, h: 0.184 },
  '2x10': { b: 0.038, h: 0.235 },
  '2x12': { b: 0.038, h: 0.286 },
};

export const COULEUR_BOIS: Record<TypeBois, { color: string; roughness: number }> = {
  SPF:     { color: '#D4B896', roughness: 0.72 },
  douglas: { color: '#C4854A', roughness: 0.62 },
  LVL:     { color: '#8B6F4E', roughness: 0.52 },
};

export const COULEUR_SOUS_PLANCHER: Record<TypeSousPlancher, { color: string; roughness: number }> = {
  OSB:         { color: '#C4A882', roughness: 0.85 },
  contreplaque: { color: '#D4B896', roughness: 0.70 },
};

export const COULEUR_LVL_BEAM = '#6B5240';
export const COULEUR_BETON = '#BDBDBD';
export const COULEUR_SOL = '#7A6554';
export const COULEUR_CLOU = '#9E9E9E';
