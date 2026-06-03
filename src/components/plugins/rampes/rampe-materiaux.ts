// ─── Constantes matériaux PBR ─────────────────────────────────────────────────
// Utilisées par tous les sous-composants de la scène 3D.

export const MAT = {
  bois:  { color: '#8B6F47', roughness: 0.7,  metalness: 0.0 },
  metal: { color: '#78909C', roughness: 0.15, metalness: 0.85 },
  verre: { color: '#B3E5FC', roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.35 },
  cable: { color: '#B0BEC5', roughness: 0.3,  metalness: 0.7 },
} as const;

export const MAT_POTEAU_CABLE = { color: '#607D8B', roughness: 0.15, metalness: 0.85 };
export const MAT_PLAQUE_PIED  = { color: '#90A4AE', roughness: 0.2,  metalness: 0.85 };
export const MAT_SOL          = { color: '#F5F0EB', roughness: 0.85, metalness: 0.0 };
export const MAT_DALLE_BOIS   = { color: '#C8A878', roughness: 0.7,  metalness: 0.0 };
export const MAT_BETON        = { color: '#9E9E9E', roughness: 0.8,  metalness: 0.0 };
export const MAT_SILHOUETTE   = { color: '#2D3748', roughness: 1.0,  metalness: 0.0, transparent: true, opacity: 0.5 };
