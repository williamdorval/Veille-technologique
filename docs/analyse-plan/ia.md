# Intelligence artificielle — Intégration Gemini

## Modèle utilisé

Le plugin utilise **Gemini 2.0 Flash** (`gemini-2.0-flash`), un modèle multimodal capable de lire du texte et des images dans la même requête. Il est défini comme constante dans `prompt.ts` :

```ts
export const MODELE_GEMINI = 'gemini-2.0-flash';
```

Flash a été choisi pour sa rapidité et son coût réduit sur l'API gratuite. Pour des plans très détaillés ou une meilleure précision, on pourrait passer à `gemini-1.5-pro`.

---

## Prompt système

Le prompt est construit par la fonction `construirePromptSysteme(champs)` dans `src/lib/analyse-plan/prompt.ts`. Il reçoit la liste des champs à extraire et produit un texte d'instruction complet.

### Ce que le prompt dit au modèle

1. **Son rôle** : expert en lecture de croquis manuscrits de chantier québécois (balcons, escaliers, rampes/garde-corps)
2. **La tâche** : extraire les valeurs des champs listés depuis les images fournies
3. **Les champs à chercher** : liste avec nom et clé pour chaque champ
4. **Les règles strictes** :
   - Ne jamais deviner une valeur non visible dans l'image
   - Utiliser `introuvable` si le champ n'apparaît pas dans les images
   - Utiliser `illisible` si le champ est présent mais impossible à lire
   - Les valeurs sont toujours en pouces (notation québécoise de chantier)
5. **Le format de réponse** : JSON strict selon le schéma défini

### Pourquoi mentionner le Québec dans le prompt

Les croquis de chantier québécois utilisent des termes et des notations spécifiques. Par exemple, les mesures sont souvent en pieds-pouces avec la notation `5' 6"` plutôt que `167 cm`. Le modèle doit reconnaître ces conventions pour lire correctement les dimensions.

---

## Schéma de réponse forcé

Pour éviter que le modèle retourne du texte libre impossible à parser, un schéma JSON strict est passé dans la requête. Il est défini dans `src/lib/analyse-plan/schema-gemini.ts`.

### Structure de la réponse

```json
{
  "champs": [
    {
      "cle": "giron",
      "etiquette": "Giron",
      "valeur": "10",
      "unite": "po",
      "confiance": 85,
      "statut": "ok",
      "note": "Valeur visible clairement sur le plan"
    },
    {
      "cle": "largeur",
      "etiquette": "Largeur escalier",
      "valeur": null,
      "unite": null,
      "confiance": 0,
      "statut": "introuvable",
      "note": "Dimension non indiquée sur les images fournies"
    }
  ]
}
```

### Signification du niveau de confiance

| Confiance | Interprétation |
|-----------|---------------|
| 90 – 100 | Valeur lue clairement, chiffre visible et non ambigu |
| 70 – 89 | Probablement correct mais écriture un peu difficile à lire |
| 50 – 69 | Incertain — plusieurs interprétations possibles |
| 0 – 49 | Très incertain ou valeur devinée — à vérifier absolument |
| 0 + statut `introuvable` | Champ absent des images |

L'interface affiche un code couleur selon ce niveau pour guider l'utilisateur pendant la validation.

---

## Envoi des images

Les images sont converties en base64 dans `src/lib/analyse-plan/image.ts` avant d'être envoyées. L'API Gemini reçoit les images en `inlineData` avec leur type MIME :

```ts
{
  inlineData: {
    mimeType: "image/jpeg",
    data: "<base64>"
  }
}
```

Plusieurs images peuvent être envoyées dans la même requête. C'est utile quand le plan est photographié en plusieurs parties.

---

## Gestion des erreurs 503

L'API Gemini peut retourner une erreur 503 (service surchargé) en période de forte demande. La route API implémente un mécanisme de retry automatique :

- 3 tentatives maximum
- 2 secondes d'attente entre chaque tentative
- Si les 3 tentatives échouent, l'erreur est retournée au client avec un message explicite

Ce comportement est défini dans `src/app/api/analyse-plan/route.ts` avec les constantes `MAX_RETRIES = 3` et `DELAI_RETRY_MS = 2000`.
