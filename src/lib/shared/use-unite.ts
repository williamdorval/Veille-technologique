'use client';

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UniteSaisie = 'mm' | 'cm' | 'm' | 'po';

// ─── Facteurs de conversion depuis cm ─────────────────────────────────────────

const FACTEURS_DEPUIS_CM: Record<UniteSaisie, number> = {
  mm: 10,
  cm: 1,
  m: 0.01,
  po: 1 / 2.54,
};

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

/** Convertit cm → unité d'affichage */
export function cmVers(cm: number, unite: UniteSaisie): number {
  return cm * FACTEURS_DEPUIS_CM[unite];
}

/** Convertit une valeur saisie dans l'unité choisie → cm */
export function versCm(valeur: number, unite: UniteSaisie): number {
  return valeur / FACTEURS_DEPUIS_CM[unite];
}

/** Formate pour affichage avec le bon nombre de décimales selon l'unité */
export function formatValeur(cm: number, unite: UniteSaisie): string {
  const decimales: Record<UniteSaisie, number> = {
    mm: 0,
    cm: 1,
    m: 3,
    po: 2,
  };
  return cmVers(cm, unite).toFixed(decimales[unite]);
}

/** Retourne le label d'affichage de l'unité */
export function labelUnite(unite: UniteSaisie): string {
  const labels: Record<UniteSaisie, string> = {
    mm: 'mm',
    cm: 'cm',
    m: 'm',
    po: 'po',
  };
  return labels[unite];
}

/** Retourne le step suggéré pour un <input type="number"> selon l'unité */
export function stepUnite(unite: UniteSaisie): string {
  const steps: Record<UniteSaisie, string> = {
    mm: '1',
    cm: '0.1',
    m: '0.001',
    po: '0.25', // 1/4 de pouce — précision courante en construction
  };
  return steps[unite];
}

// ─── Hook React ───────────────────────────────────────────────────────────────

/**
 * Gère l'état de l'unité d'affichage avec persistance localStorage.
 * @param pluginKey - Clé unique du plugin (ex. 'escaliers', 'plancher')
 */
export function useUnite(pluginKey: string): {
  unite: UniteSaisie;
  choisirUnite: (u: UniteSaisie) => void;
} {
  const storageKey = `constructeurs-unite-${pluginKey}`;

  // Initialiser avec 'cm' pour éviter l'erreur SSR
  const [unite, setUnite] = useState<UniteSaisie>('cm');

  // Lire localStorage côté client seulement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const valeurSauvegardee = window.localStorage.getItem(storageKey);
    if (
      valeurSauvegardee === 'mm' ||
      valeurSauvegardee === 'cm' ||
      valeurSauvegardee === 'm' ||
      valeurSauvegardee === 'po'
    ) {
      setUnite(valeurSauvegardee);
    }
  }, [storageKey]);

  const choisirUnite = (u: UniteSaisie) => {
    setUnite(u);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, u);
    }
  };

  return {
    unite,
    choisirUnite,
  };
}
