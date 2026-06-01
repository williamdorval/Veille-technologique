import { GoogleGenAI } from '@google/genai';
import { construirePromptSysteme, MODELE_GEMINI } from '@/lib/analyse-plan/prompt';
import { SCHEMA_GEMINI, schemaResultatAnalyse } from '@/lib/analyse-plan/schema-gemini';
import type { RequeteAnalyse, ResultatAnalyse } from '@/lib/analyse-plan/types';

export async function POST(req: Request): Promise<Response> {
  // 1. Vérifier la clé API
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { erreur: 'GEMINI_API_KEY manquante — configurer dans .env.local' },
      { status: 500 }
    );
  }

  // 2. Parser le body
  let body: RequeteAnalyse;
  try {
    body = await req.json() as RequeteAnalyse;
  } catch {
    return Response.json(
      { erreur: 'Body JSON invalide' },
      { status: 400 }
    );
  }

  const { images, champs } = body;

  if (!images?.length) {
    return Response.json({ erreur: 'Au moins une image est requise' }, { status: 400 });
  }
  if (!champs?.length) {
    return Response.json({ erreur: 'La liste des champs Excel est requise' }, { status: 400 });
  }

  // 3. Appeler Gemini
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = construirePromptSysteme(champs);

    const response = await ai.models.generateContent({
      model: MODELE_GEMINI,
      contents: [
        { text: prompt },
        ...images.map((img) => ({
          inlineData: { mimeType: img.mimeType, data: img.base64 },
        })),
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMA_GEMINI,
      },
    });

    // 4. Valider la réponse avec zod
    let donneesRaw: unknown;
    try {
      donneesRaw = JSON.parse(response.text ?? '');
    } catch {
      return Response.json(
        { erreur: 'Réponse Gemini non parseable en JSON' },
        { status: 502 }
      );
    }

    const validation = schemaResultatAnalyse.safeParse(donneesRaw);
    if (!validation.success) {
      return Response.json(
        { erreur: 'Réponse Gemini invalide', details: validation.error.message },
        { status: 502 }
      );
    }

    const resultat: ResultatAnalyse = validation.data;
    return Response.json(resultat);

  } catch (erreur: unknown) {
    // Erreurs réseau, quota Gemini, etc.
    const message = erreur instanceof Error ? erreur.message : 'Erreur inconnue';
    // Ne jamais logger la clé API
    const messageSanitise = message.replace(apiKey, '[REDACTED]');
    return Response.json(
      { erreur: `Erreur Gemini : ${messageSanitise}` },
      { status: 502 }
    );
  }
}
