# Cahier de recherche — Plateforme d'outils pour constructeurs québécois

Ce document regroupe toutes les sources consultées pendant le développement du projet, organisées par sujet. Chaque section indique ce qui a été trouvé, où, et comment ça a été utilisé dans le code.

---

## 1. Calculs d'escaliers — Série émoicq (YouTube)

La majeure partie de la logique du plugin Escaliers vient d'une série de vidéos YouTube de la chaîne **émoicq**, qui explique en détail comment calculer un escalier selon les normes de charpenterie québécoise.

| Exercice | Sujet de la vidéo | Fichier créé |
|----------|-------------------|--------------|
| Exercice 1 | Calculs de base : contremarche, giron, longueur du limon, angle | `stair-calculator.ts` |
| Exercice 2 | Loi de Blondel : 2H + G ≈ 63 cm (confort de montée) | `stair-blondel.ts` |
| Exercice 3 | Blondel-Maximum : trois rapports (G+H, G+2H, G×H) et score qualité | `stair-scoring.ts`, `stair-unlimited-run.ts` |
| Exercice 4 | Course limitée + crochet sous le chevêtre du plancher supérieur | `stair-limited-run.ts`, `stair-hook.ts` |
| Exercice 5 | Calcul du puits d'escalier dans le plancher supérieur | `stair-pit.ts` |

**Chaîne YouTube :** émoicq  
**Comment trouvé :** recherche YouTube « calcul escalier québec charpenterie »

Les vidéos montrent les formules sur papier, avec des exemples réels de chantier. L'avantage de cette série : les formules sont directement issues du Code de construction du Québec, donc le code qui en découle est automatiquement conforme.

---

## 2. Normes de construction du Québec (CCQ / RBQ)

Le Code de construction du Québec (CCQ) et la Régie du bâtiment du Québec (RBQ) imposent des dimensions minimales et maximales pour chaque élément de construction. Ces valeurs sont toutes centralisées dans les fichiers `normes.ts` de chaque plugin.

### Sources consultées

| Source | Contenu | Utilisé pour |
|--------|---------|--------------|
| rbq.gouv.qc.ca | Règlements en vigueur, articles du CCQ | Escaliers, rampes, garde-corps |
| qccodes.ca | Version lisible du code avec recherche par article | Vérification des valeurs |
| plans-architecture.ca | Fiches pratiques sur les dimensions réglementaires | Dégagement en hauteur, largeur minimale |
| escalierinterieur.ca | Tableau des normes résidentielles vs commerciales | Comparaison privé / commun |
| CNB 2020 (Code national du bâtiment) | Charges structurelles, coefficients de sécurité | Plancher, toiture |

### Normes clés retrouvées

**Escaliers (CCQ Art. 9.8.4)**
- Contremarche : 12,5 cm min — 20 cm max
- Giron : 22 cm min (résidentiel), formule Blondel : 2H + G entre 60 et 64 cm
- Dégagement en hauteur : 195 cm (usage privé), 205 cm (usage commun)
- Tolérance d'uniformité : 5 mm entre contremarches consécutives (Art. 9.8.4.4)

**Garde-corps et rampes (CCQ Art. 9.8.8)**
- Obligatoire si chute > 60 cm
- Hauteur minimum : 92 cm (privé), 107 cm si chute > 180 cm
- Espacement barreaux : 10 cm maximum (enfant ne doit pas passer)

**Main courante (CCQ Art. 9.8.7)**
- Hauteur : 86,5 à 96,5 cm
- Obligatoire à partir de 3 marches

**Plancher (CNB 2020 / CCQ 9.4.3.1)**
- Limite de déflexion : L/360 sous charge vive
- Charges vives : 1,9 kPa (résidentiel), 2,4 kPa (garage / commercial)
- Propriétés structurelles du bois : module d'élasticité et résistance à la flexion par essence

**Toiture (CCQ 9.26.1 / 9.19.1.1)**
- Pente minimale selon le type de revêtement (bardeaux, tôle, membrane)
- Ventilation : 1/300 de la surface de plafond, répartie moitié entrée / moitié sortie
- Charges de neige par région (CNB 2020, Annexe C, Tableau C-2)

---

## 3. Intelligence artificielle — Analyse de photos de plans

### Pourquoi Gemini et pas un autre modèle

La fonctionnalité d'analyse de plan nécessite un modèle multimodal capable de lire des images. Gemini a été choisi pour trois raisons :

1. Gratuit avec un quota suffisant pour le développement
2. API simple avec le SDK officiel `@google/genai`
3. Performances solides sur la lecture de texte manuscrit dans des images

### Sources consultées

| Source | Contenu | Utilisé pour |
|--------|---------|--------------|
| ai.google.dev/docs | Documentation officielle de l'API Gemini | Appel API, modèles disponibles, structured output |
| Google AI Studio | Interface pour tester les prompts en direct | Mise au point du prompt système |
| ai.google.dev/gemini-api/docs/vision | Guide sur l'analyse d'images | Envoi des images en base64, format inlineData |
| ai.google.dev/gemini-api/docs/structured-output | Structured output avec schéma JSON | Forcer le JSON de retour dans le bon format |

### Ce qui a été appris sur le prompt engineering

Pour qu'un modèle d'IA lise correctement un croquis de chantier québécois :

- Il faut lui donner le **rôle exact** : « expert en lecture de croquis manuscrits d'une entreprise qui fabrique des balcons, escaliers et rampes au Québec »
- Il faut lui donner la **liste précise des champs à chercher** avec leur nom et leur clé
- Il faut lui dire de **ne jamais deviner** et de mettre le statut `introuvable` si un champ n'est pas visible
- La **terminologie québécoise** est importante : « marche », « giron », « contremarche » plutôt que des termes anglais
- Il faut demander un **niveau de confiance (0-100)** pour que l'utilisateur sache quels champs vérifier

### Problème 503 rencontré

L'API Gemini retourne parfois une erreur 503 (service temporairement surchargé), surtout en dehors des heures creuses. La solution trouvée : un mécanisme de retry automatique avec 3 tentatives et 2 secondes d'attente entre chaque.

---

## 4. Export Excel

Les résultats de l'analyse doivent être exportés dans un fichier Excel existant, en remplissant les cellules cibles que l'utilisateur avait définies dans son fichier de départ.

### Source consultée

| Source | Contenu |
|--------|---------|
| github.com/exceljs/exceljs | Documentation ExcelJS — lecture, écriture, manipulation de cellules |

### Ce qui a été appris

ExcelJS permet de lire un fichier `.xlsx` existant côté client (dans le navigateur), de modifier des cellules spécifiques par leur référence (ex. `B4`), et de télécharger le résultat. Le fichier de définition des champs utilise une convention simple : la colonne A contient le nom du champ, et la cellule vide adjacente en colonne B indique l'emplacement où écrire la valeur.

---

## 5. Technologies web

### Next.js et App Router

| Source | Contenu |
|--------|---------|
| nextjs.org/docs | Documentation officielle Next.js 16 App Router |
| nextjs.org/docs/app/building-your-application/routing | Système de routes de l'App Router |
| nextjs.org/docs/app/api-reference/file-conventions/route | API Routes avec `route.ts` |

L'App Router est utilisé pour toute la navigation entre plugins et pour l'API route qui appelle Gemini côté serveur (nécessaire pour ne pas exposer la clé API dans le navigateur).

### React Three Fiber et Three.js (visualisation 3D)

| Source | Contenu |
|--------|---------|
| docs.pmnd.rs/react-three-fiber | Documentation R3F — Canvas, hooks, géométries |
| threejs.org/docs | API Three.js (géométries, matériaux, lumières) |
| youtube.com — Wawa Sensei | Tutoriels Three.js en français pour débutants |

La visualisation 3D est utilisée dans les plugins Escaliers, Rampes et Plancher. Chaque plugin a une scène 3D séparée avec des lumières, des matériaux PBR et des contrôles orbitaux pour tourner autour du modèle.

### shadcn/ui et Tailwind CSS

| Source | Contenu |
|--------|---------|
| ui.shadcn.com | Composants React accessibles avec Radix UI |
| tailwindcss.com/docs | Utilitaires CSS, système de thème v4 |

shadcn/ui a été choisi parce que les composants sont copiés directement dans le projet (pas de dépendance externe fragile) et peuvent être modifiés facilement. Le thème clair/sombre est géré par `next-themes`.

### React Hook Form et Zod

| Source | Contenu |
|--------|---------|
| react-hook-form.com | Gestion des formulaires sans re-renders inutiles |
| zod.dev | Validation de schéma TypeScript-first |

Zod est utilisé pour valider les données saisies par l'utilisateur avant de lancer les calculs. Chaque plugin a son propre schéma Zod qui correspond aux plages de valeurs valides (ex. : hauteur brute entre 50 cm et 600 cm).

---

## 6. Médiagraphie

Chaîne YouTube émoicq. (s.d.). *Série de calculs d'escaliers québécois* [vidéos en ligne]. YouTube.

Gouvernement du Québec. (2023). *Code de construction du Québec (CCQ)*. Régie du bâtiment du Québec. https://www.rbq.gouv.qc.ca

Conseil national de recherches Canada. (2020). *Code national du bâtiment — Canada 2020 (CNB 2020)*. https://www.nrc-cnrc.gc.ca

Google LLC. (2024). *Gemini API — Documentation officielle*. Google AI for Developers. https://ai.google.dev/docs

ExcelJS Contributors. (2024). *ExcelJS — Documentation GitHub*. https://github.com/exceljs/exceljs

Vercel. (2024). *Next.js 16 — Documentation officielle*. https://nextjs.org/docs

Poimandres. (2024). *React Three Fiber — Documentation*. https://docs.pmnd.rs/react-three-fiber

Three.js Authors. (2024). *Three.js — Documentation*. https://threejs.org/docs

shadcn. (2024). *shadcn/ui — Composants React*. https://ui.shadcn.com
