# Cahier de recherche — Plateforme d'outils pour constructeurs québécois

Ce document regroupe toutes les sources consultées pendant le développement du projet, organisées par sujet. Chaque section indique ce qui a été trouvé, où, et comment ça a été utilisé dans le code.

---

## 1. Calculs d'escaliers — Série émoicq (YouTube)

La majeure partie de la logique du plugin Escaliers vient d'une série de vidéos YouTube de la chaîne **émoicq**, qui explique en détail comment calculer un escalier selon les normes de charpenterie québécoise.

| Exercice | Sujet de la vidéo | Lien | Fichier créé |
|----------|-------------------|------|-------------|
| Exercice 1 [[1]](#ref-1) | Calculs de base : contremarche, giron, longueur du limon, angle | [youtu.be/FtOEy_KEyFs](https://youtu.be/FtOEy_KEyFs) | `stair-calculator.ts` |
| Exercice 2 [[2]](#ref-2) | Loi de Blondel : 2H + G ≈ 63 cm (confort de montée) | [youtu.be/yLXnYgljJRI](https://youtu.be/yLXnYgljJRI) | `stair-blondel.ts` |
| Exercice 3 [[3]](#ref-3) | Blondel-Maximum : trois rapports (G+H, G+2H, G×H) et score qualité | [youtu.be/VFw7MHE6OGU](https://youtu.be/VFw7MHE6OGU) | `stair-scoring.ts`, `stair-unlimited-run.ts` |
| Exercice 4 [[4]](#ref-4) | Course limitée + crochet sous le chevêtre du plancher supérieur | [youtu.be/8ESmgof7HT8](https://youtu.be/8ESmgof7HT8) | `stair-limited-run.ts`, `stair-hook.ts` |
| Exercice 5 [[5]](#ref-5) | Calcul du puits d'escalier dans le plancher supérieur | [youtu.be/57S3aSGK38I](https://youtu.be/57S3aSGK38I) | `stair-pit.ts` |

**Comment trouvé :** recherche YouTube avec les mots-clés *calcul escalier québec charpenterie*, *émoicq escalier*, *calcul contremarche giron québec*.

Les vidéos montrent les formules sur papier avec des exemples réels de chantier. L'avantage de cette série : les formules sont directement issues du Code de construction du Québec, donc le code qui en découle est automatiquement conforme.

---

## 2. Normes de construction du Québec (CCQ / RBQ)

Le Code de construction du Québec (CCQ) et la Régie du bâtiment du Québec (RBQ) imposent des dimensions minimales et maximales pour chaque élément de construction. Ces valeurs sont toutes centralisées dans les fichiers `normes.ts` de chaque plugin.

### Sources consultées

| Source | Contenu | Utilisé pour |
|--------|---------|-------------|
| rbq.gouv.qc.ca [[6]](#ref-6) | Règlements en vigueur, articles du CCQ | Escaliers, rampes, garde-corps |
| qccodes.ca | Version lisible du code avec recherche par article | Vérification des valeurs |
| plans-architecture.ca | Fiches pratiques sur les dimensions réglementaires | Dégagement en hauteur, largeur minimale |
| escalierinterieur.ca | Tableau des normes résidentielles vs commerciales | Comparaison privé / commun |
| CNB 2020 — nrc-cnrc.gc.ca [[7]](#ref-7) | Charges structurelles, coefficients de sécurité | Plancher, toiture |

### Normes clés retrouvées

**Escaliers (CCQ Art. 9.8.4)**

- Contremarche : 12,5 cm min — 20 cm max
- Giron : 22 cm min (résidentiel), formule Blondel : 2H + G entre 60 et 64 cm
- Dégagement en hauteur : 195 cm (usage privé), 205 cm (usage commun)
- Tolérance d'uniformité : 5 mm entre contremarches consécutives (Art. 9.8.4.4)

**Garde-corps et rampes (CCQ Art. 9.8.8)**

- Obligatoire si chute > 60 cm
- Hauteur minimum : 92 cm (privé), 107 cm si chute > 180 cm
- Espacement barreaux : 10 cm maximum

**Main courante (CCQ Art. 9.8.7)**

- Hauteur : 86,5 à 96,5 cm
- Obligatoire à partir de 3 marches

**Plancher (CNB 2020 / CCQ 9.4.3.1)**

- Limite de déflexion : L/360 sous charge vive
- Charges vives : 1,9 kPa (résidentiel), 2,4 kPa (garage / commercial)

**Toiture (CCQ 9.26.1 / 9.19.1.1)**

- Pente minimale selon le type de revêtement
- Ventilation : 1/300 de la surface de plafond, répartie moitié entrée / moitié sortie
- Charges de neige par région (CNB 2020, Annexe C, Tableau C-2)

---

## 3. Intelligence artificielle — Analyse de photos de plans

### Pourquoi Gemini et pas un autre modèle

La fonctionnalité d'analyse de plan nécessite un modèle multimodal capable de lire des images. Gemini a été choisi pour trois raisons : gratuit avec un quota suffisant pour le développement, API simple avec le SDK officiel `@google/genai`, et performances solides sur la lecture de texte manuscrit.

### Sources consultées

| Source | Contenu | Utilisé pour |
|--------|---------|-------------|
| ai.google.dev/docs [[9]](#ref-9) | Documentation officielle de l'API Gemini | Appel API, modèles disponibles, structured output |
| Google AI Studio | Interface pour tester les prompts en direct | Mise au point du prompt système |
| ai.google.dev — vision | Guide sur l'analyse d'images | Envoi des images en base64, format inlineData |
| ai.google.dev — structured-output | Structured output avec schéma JSON | Forcer le JSON de retour dans le bon format |

### Ce qui a été appris sur le prompt engineering

Pour qu'un modèle d'IA lise correctement un croquis de chantier québécois :

- Il faut lui donner le **rôle exact** : « expert en lecture de croquis manuscrits d'une entreprise qui fabrique des balcons, escaliers et rampes au Québec »
- Il faut lui donner la **liste précise des champs à chercher** avec leur nom et leur clé
- Il faut lui dire de **ne jamais deviner** et de mettre le statut `introuvable` si un champ n'est pas visible
- La **terminologie québécoise** est importante : « marche », « giron », « contremarche »
- Il faut demander un **niveau de confiance (0-100)** pour que l'utilisateur sache quels champs vérifier

### Problème 503 rencontré

L'API Gemini retourne parfois une erreur 503 (service temporairement surchargé). La solution : retry automatique avec 3 tentatives et 2 secondes d'attente entre chaque.

---

## 4. Export Excel

### Source consultée

| Source | Contenu |
|--------|---------|
| github.com/exceljs/exceljs [[10]](#ref-10) | Documentation ExcelJS — lecture, écriture, manipulation de cellules |

ExcelJS permet de lire un fichier `.xlsx` existant côté client, de modifier des cellules spécifiques par leur référence (ex. `B4`), et de télécharger le résultat. Le fichier de définition des champs utilise une convention simple : la colonne A contient le nom du champ, et la cellule vide adjacente en colonne B indique l'emplacement où écrire la valeur.

---

## 5. Technologies web

### Next.js et App Router

| Source | Contenu |
|--------|---------|
| nextjs.org/docs [[11]](#ref-11) | Documentation officielle Next.js 16 App Router |
| nextjs.org/docs — routing | Système de routes de l'App Router |
| nextjs.org/docs — route.ts | API Routes avec `route.ts` |

### React Three Fiber et Three.js (visualisation 3D)

| Source | Contenu |
|--------|---------|
| docs.pmnd.rs/react-three-fiber [[12]](#ref-12) | Documentation R3F — Canvas, hooks, géométries |
| threejs.org/docs | API Three.js (géométries, matériaux, lumières) |

### shadcn/ui et Tailwind CSS

| Source | Contenu |
|--------|---------|
| ui.shadcn.com [[8]](#ref-8) | Composants React accessibles avec Radix UI |
| tailwindcss.com/docs | Utilitaires CSS, système de thème v4 |

---

## Références

!!! quote "Références IEEE"

    <a id="ref-1"></a>**[1]** émoicq, "Exercice 1, l'introduction," *YouTube*. [Online video]. Available: [https://youtu.be/FtOEy_KEyFs](https://youtu.be/FtOEy_KEyFs). [Accessed: Jun. 3, 2026].

    <a id="ref-2"></a>**[2]** émoicq, "Exercice 2, calcul du pas," *YouTube*. [Online video]. Available: [https://youtu.be/yLXnYgljJRI](https://youtu.be/yLXnYgljJRI). [Accessed: Jun. 3, 2026].

    <a id="ref-3"></a>**[3]** émoicq, "Exercice 3, calculs d'escalier avec course illimitée," *YouTube*. [Online video]. Available: [https://youtu.be/VFw7MHE6OGU](https://youtu.be/VFw7MHE6OGU). [Accessed: Jun. 3, 2026].

    <a id="ref-4"></a>**[4]** émoicq, "Exercice 4, calculs de la course et du crochet," *YouTube*. [Online video]. Available: [https://youtu.be/8ESmgof7HT8](https://youtu.be/8ESmgof7HT8). [Accessed: Jun. 3, 2026].

    <a id="ref-5"></a>**[5]** émoicq, "Exercice 5, calcul du puits d'escalier," *YouTube*. [Online video]. Available: [https://youtu.be/57S3aSGK38I](https://youtu.be/57S3aSGK38I). [Accessed: Jun. 3, 2026].

    <a id="ref-6"></a>**[6]** Gouvernement du Québec, "Code de construction du Québec (CCQ)," *Régie du bâtiment du Québec*, 2023. [Online]. Available: [https://www.rbq.gouv.qc.ca](https://www.rbq.gouv.qc.ca). [Accessed: Jun. 3, 2026].

    <a id="ref-7"></a>**[7]** Conseil national de recherches Canada, "Code national du bâtiment — Canada 2020 (CNB 2020)," *CNRC*, 2020. [Online]. Available: [https://www.nrc-cnrc.gc.ca](https://www.nrc-cnrc.gc.ca). [Accessed: Jun. 3, 2026].

    <a id="ref-8"></a>**[8]** shadcn, "shadcn/ui — Composants React accessibles," 2024. [Online]. Available: [https://ui.shadcn.com](https://ui.shadcn.com). [Accessed: Jun. 3, 2026].

    <a id="ref-9"></a>**[9]** Google LLC, "Gemini API Documentation," *Google AI for Developers*, 2024. [Online]. Available: [https://ai.google.dev/docs](https://ai.google.dev/docs). [Accessed: Jun. 3, 2026].

    <a id="ref-10"></a>**[10]** ExcelJS Contributors, "ExcelJS Documentation," *GitHub*, 2024. [Online]. Available: [https://github.com/exceljs/exceljs](https://github.com/exceljs/exceljs). [Accessed: Jun. 3, 2026].

    <a id="ref-11"></a>**[11]** Vercel, "Next.js 16 — Documentation officielle," 2024. [Online]. Available: [https://nextjs.org/docs](https://nextjs.org/docs). [Accessed: Jun. 3, 2026].

    <a id="ref-12"></a>**[12]** Poimandres, "React Three Fiber — Documentation," 2024. [Online]. Available: [https://docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber). [Accessed: Jun. 3, 2026].
