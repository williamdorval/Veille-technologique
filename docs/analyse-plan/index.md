# Plugin Analyse de plan — Documentation complète

Ce dossier documente le plugin d'analyse automatique de plans de construction par intelligence artificielle.

## Fichiers de cette documentation

| Fichier | Contenu |
|---------|---------|
| [ia.md](ia.md) | Intégration Gemini : prompt, schéma JSON, niveau de confiance |
| [excel.md](excel.md) | Lecture du fichier Excel source et écriture des résultats |
| [validation.md](validation.md) | Assistant de validation séquentiel (carte par carte) |

---

## Vue d'ensemble du plugin

L'utilisateur téléverse des photos ou des croquis d'un plan de construction — même manuscrits — ainsi qu'un fichier Excel qui liste les champs à extraire (ex. : giron, contremarche, largeur). Le modèle d'IA analyse les images, tente de lire les valeurs demandées, et présente les résultats dans un assistant de validation avant de générer le fichier Excel final rempli.

### Flux complet en 4 étapes

```
1. Téléverser les photos du plan      → UploadPhotos.tsx
2. Téléverser le fichier Excel source → UploadExcel.tsx
3. Lancer l'analyse IA                → BoutonAnalyser.tsx → API route → Gemini
4. Valider champ par champ            → ListeValidation.tsx (CarteChamp.tsx)
5. Générer le fichier Excel final     → ExcelJS côté client
```

### Ce que l'app produit

- **Valeurs extraites** : chaque champ reçoit une valeur lue dans l'image (ou null si introuvable)
- **Niveau de confiance** : 0 à 100 pour chaque champ (100 = certain, <50 = à vérifier)
- **Statut** : `ok` / `incertain` / `introuvable` / `illisible`
- **Note explicative** : le modèle indique pourquoi un champ est incertain ou introuvable
- **Fichier Excel** : le fichier original est rempli aux cellules cibles et téléchargé

---

## Architecture du code

### Fichiers lib (`src/lib/analyse-plan/`)

| Fichier | Rôle |
|---------|------|
| `types.ts` | Interfaces TypeScript : `ChampExcel`, `ChampAnalyse`, `ResultatAnalyse`, `RequeteAnalyse` |
| `prompt.ts` | Construction du prompt système envoyé à Gemini, constante `MODELE_GEMINI` |
| `schema-gemini.ts` | Schéma JSON pour forcer la structure de réponse de Gemini + schéma Zod de validation |
| `image.ts` | Conversion des fichiers images en base64 pour l'API Gemini |
| `excel.ts` | Lecture du fichier Excel source (extraction des champs) et écriture des résultats |

### API route (`src/app/api/analyse-plan/route.ts`)

Route Next.js côté serveur qui reçoit les images et les champs, appelle l'API Gemini avec retry automatique (3 tentatives, 2 s d'intervalle sur erreur 503), et retourne le résultat JSON.

La route est côté serveur pour que la clé `GEMINI_API_KEY` ne soit jamais exposée dans le navigateur.

### Composants UI (`src/components/plugins/analyse-plan/`)

| Composant | Rôle |
|-----------|------|
| `AnalysePlanClient.tsx` | Wrapper client-side (désactive le SSR pour ExcelJS) |
| `AnalysePlanCalculateur.tsx` | Orchestrateur — gère l'état global et les 3 étapes visuelles |
| `UploadPhotos.tsx` | Zone de glisser-déposer pour les photos du plan |
| `UploadExcel.tsx` | Upload du fichier Excel de définition des champs |
| `BoutonAnalyser.tsx` | Bouton de lancement avec état de chargement |
| `CarteChamp.tsx` | Carte individuelle affichant un champ avec ses boutons Oui / Non / Non spécifié |
| `ListeValidation.tsx` | Assistant séquentiel : présente les champs un par un, génère le fichier Excel à la fin |

---

## Format du fichier Excel source

L'utilisateur prépare un fichier `.xlsx` avec une colonne A (noms des champs) et une colonne B (cellules cibles vides). L'analyse remplit les cellules de la colonne B selon ce que l'IA a trouvé dans les images.

Exemple de structure attendue :

| A | B |
|---|---|
| Giron | ← cellule vide (B2) |
| Contremarche | ← cellule vide (B3) |
| Largeur escalier | ← cellule vide (B4) |

Le plugin lit la colonne A pour construire la liste des champs à chercher, et retient les références de cellule de la colonne B pour écrire les valeurs validées.

---

## Configuration requise

La clé API Gemini doit être définie dans `.env.local` :

```
GEMINI_API_KEY=ta_cle_ici
```

Sans cette clé, l'API route retourne une erreur 500 avec un message explicite.
