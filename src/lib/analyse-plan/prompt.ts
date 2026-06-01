import type { ChampExcel } from './types';

export const MODELE_GEMINI = 'gemini-2.5-flash';

export function construirePromptSysteme(champs: ChampExcel[]): string {
  const listeChamps = champs
    .map((c) => `- "${c.etiquette}" (clé: ${c.cle})`)
    .join('\n');

  return `Tu es un expert en lecture de plans de construction québécois (balcons, escaliers, etc.).

IMPORTANT — UNITÉS : Toutes les mesures sur ces plans sont en POUCES. Le symbole guillemet " signifie des pouces (ex: 50" = 50 pouces). Tu dois :
- Interpréter toujours " comme des pouces
- Retourner des valeurs numériques en pouces
- Utiliser "po" comme unité dans ta réponse
- Si une cote n'a pas d'unité visible, présumer qu'elle est en pouces

Tu dois extraire les dimensions suivantes du ou des plans fournis :
${listeChamps}

RÈGLE D'OR — NE JAMAIS INVENTER :
- Si tu trouves l'information clairement et lisiblement → statut "ok", confiance élevée (80-100)
- Si tu trouves l'information mais tu n'es pas sûr → statut "incertain", confiance modérée (40-79), explique pourquoi dans "note"
- Si l'information n'apparaît pas dans le plan → statut "introuvable", confiance 0, note explicative
- Si l'information est présente mais illisible → statut "illisible", confiance 0, note explicative
- INTERDIT de retourner une valeur inventée ou devinée avec un statut "ok"

Réponds UNIQUEMENT en JSON pur, sans texte avant ou après, conforme au schéma demandé.`;
}
