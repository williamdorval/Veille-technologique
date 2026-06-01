import { z } from 'zod';

// Schéma responseSchema pour @google/genai (force JSON valide de Gemini)
export const SCHEMA_GEMINI = {
  type: 'object',
  properties: {
    champs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cle: { type: 'string' },
          etiquette: { type: 'string' },
          valeur: { type: 'string', nullable: true }, // string pour compatibilité JSON schema
          unite: { type: 'string', nullable: true },
          confiance: { type: 'number' },
          statut: {
            type: 'string',
            enum: ['ok', 'incertain', 'introuvable', 'illisible'],
          },
          celluleCible: { type: 'string' },
          note: { type: 'string' },
        },
        required: [
          'cle',
          'etiquette',
          'confiance',
          'statut',
          'celluleCible',
          'note',
        ],
      },
    },
  },
  required: ['champs'],
};

// Schéma zod v4 pour valider la réponse côté serveur
export const schemaChampAnalyse = z.object({
  cle: z.string(),
  etiquette: z.string(),
  valeur: z.union([z.string(), z.null()]).optional().default(null),
  unite: z.string().nullable().optional().default(null),
  confiance: z.number().min(0).max(100),
  statut: z.enum(['ok', 'incertain', 'introuvable', 'illisible']),
  celluleCible: z.string(),
  note: z.string(),
});

export const schemaResultatAnalyse = z.object({
  champs: z.array(schemaChampAnalyse),
});
