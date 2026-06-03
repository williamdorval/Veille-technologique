# Rapport de développement Web

| | |
|---|---|
| **Présenté à** | Nicolas Bourré |
| **Présenté par** | William Dorval |
| **Cours** | 420-1SH-SW — Développement Web |
| **Établissement** | Cégep Shawinigan |
| **Remis le** | 3 juin 2026 |

---

## 1.0 Introduction

Dans le domaine de la construction résidentielle au Québec, les professionnels doivent constamment jongler avec les exigences du Code de construction du Québec (CCQ) et du Code national du bâtiment (CNB 2020). Ces calculs, qui portent sur des éléments comme les escaliers, les rampes ou les solives de plancher, sont souvent effectués manuellement ou à l'aide de tableaux Excel peu fiables. Une erreur dans ces calculs peut entraîner des travaux non conformes, des risques pour la sécurité et des coûts de correction importants.

Ce projet propose une alternative concrète : une plateforme web regroupant plusieurs calculateurs spécialisés, chacun centré sur un élément de construction. L'utilisateur entre ses mesures, l'application effectue les calculs selon les normes en vigueur, indique si le résultat est conforme ou non, et produit une visualisation 3D ainsi qu'un plan de construction détaillé.

---

## 2.0 Description du projet

### 2.1 Contexte et objectif

La plateforme est conçue comme un ensemble de plugins indépendants, accessibles depuis une interface web. Le MVP comprend cinq plugins : escaliers, rampes et garde-corps, plancher, toiture, et un outil d'analyse de plans par intelligence artificielle. Tous les calculs se font côté client, sans base de données ni serveur, ce qui garantit un déploiement simple et une utilisation possible sans connexion internet.

### 2.2 Méthode de développement (SDD)

Le projet suit la méthode SDD (Specification Driven Development), une approche qui oblige à rédiger une spécification complète avant d'écrire une seule ligne de code. Cette méthode réduit les erreurs d'implémentation, facilite la revue de code et documente les décisions de conception. Chaque fonctionnalité passe par cinq étapes : spécification, plan technique, liste de tâches, implémentation et validation.

---

## 3.0 Plugin Escaliers

### 3.1 Fonctionnement

Le plugin d'escaliers est le plus complet de la plateforme. Il calcule toutes les dimensions d'un escalier intérieur et vérifie leur conformité avec le CCQ. L'utilisateur entre la hauteur totale à monter et la longueur disponible au sol. L'application calcule automatiquement le nombre de contremarches, la hauteur de chaque contremarche, la profondeur du giron, et applique la formule de Blondel pour s'assurer que l'escalier sera confortable à monter.

Un système de codes couleur indique l'état de chaque paramètre : vert (conforme), orange (proche de la limite), rouge (non conforme). Des recommandations sont générées automatiquement. Le plugin produit aussi une visualisation 3D interactive et un plan de construction avec liste de matériaux.

### 3.2 Normes appliquées (CCQ)

| Élément | Valeur / Norme |
|---------|---------------|
| Contremarche (Art. 9.8.4) | Min. 12,5 cm — Max. 20 cm |
| Giron (Art. 9.8.4) | Min. 22 cm — Max. 35,5 cm (privé) |
| Formule de Blondel | 2H + G entre 60 et 64 cm (cible : 63 cm) |
| Dégagement en hauteur | Min. 195 cm (privé), 205 cm (commun) |
| Main courante (Art. 9.8.7) | Hauteur : 86,5 à 96,5 cm |
| Garde-corps (Art. 9.8.8) | Min. 92 cm, obligatoire si chute > 60 cm |
| Espacement barreaux | Max. 10 cm |
| Tolérance d'uniformité (Art. 9.8.4.4) | 5 mm entre contremarches consécutives |

### 3.3 Librairies et outils

| Librairie | Rôle |
|-----------|------|
| React Three Fiber | Rendu 3D de l'escalier dans le navigateur |
| Three.js | Moteur graphique 3D sous-jacent |
| Zod | Validation des données saisies par l'utilisateur |
| React Hook Form | Gestion du formulaire de saisie |
| shadcn/ui | Composants d'interface |
| Tailwind CSS v4 | Mise en page et styles visuels |

### 3.4 Sources YouTube — émoicq

La logique de calcul vient entièrement de la série de vidéos de la chaîne émoicq sur YouTube. Les cinq exercices couvrent l'ensemble des formules implémentées dans le code.

| Exercice | Sujet | Fichier créé |
|----------|-------|-------------|
| Exercice 1 [[1]](#ref-1) | Calculs de base : contremarche, giron, longueur du limon, angle | `stair-calculator.ts` |
| Exercice 2 [[2]](#ref-2) | Loi de Blondel : 2H + G ≈ 63 cm (confort de montée) | `stair-blondel.ts` |
| Exercice 3 [[3]](#ref-3) | Blondel-Maximum : trois rapports qualité + score /100 | `stair-scoring.ts` |
| Exercice 4 [[4]](#ref-4) | Course limitée + crochet sous le chevêtre | `stair-limited-run.ts` |
| Exercice 5 [[5]](#ref-5) | Calcul du puits d'escalier dans le plancher supérieur | `stair-pit.ts` |

---

## 4.0 Plugin Rampes et garde-corps

### 4.1 Fonctionnement

Ce plugin calcule les dimensions d'une rampe ou d'un garde-corps selon le contexte d'utilisation (usage privé ou commun). L'utilisateur entre la longueur de la rampe, la hauteur de chute, choisit le type d'installation et le matériau. Le plugin vérifie que les hauteurs requises sont respectées, calcule la longueur de la main courante avec les prolongements obligatoires aux extrémités, et génère un plan de construction étape par étape.

Quatre types de matériaux sont supportés, chacun générant une visualisation 3D différente : bois, métal, verre et câble.

### 4.2 Normes appliquées (CCQ)

| Élément | Valeur / Norme |
|---------|---------------|
| Hauteur garde-corps | Min. 92 cm (privé), 107 cm si chute > 180 cm |
| Obligation garde-corps | Obligatoire si chute > 60 cm |
| Main courante | Hauteur : 86,5 à 96,5 cm |
| Espacement barreaux | Max. 10 cm |
| Prolongement main courante | Requis aux deux extrémités |

### 4.3 Librairies et outils

| Librairie | Rôle |
|-----------|------|
| React Three Fiber | Visualisation 3D de la rampe et du garde-corps |
| Three.js | Moteur graphique pour les géométries 3D |
| Zod | Validation des entrées |
| shadcn/ui + Tailwind | Interface utilisateur |

---

## 5.0 Plugin Plancher

### 5.1 Fonctionnement

Le plugin de plancher calcule la dimension de solive nécessaire pour supporter un plancher selon la portée, la charge et l'essence de bois. Il utilise la formule de flexion d'Euler-Bernoulli (δ = 5wL⁴/384EI) pour vérifier que la déflexion reste sous la limite L/360 imposée par le CCQ. L'algorithme teste différentes combinaisons de dimensions (2×6 à 2×12) et d'espacements (300, 400 et 600 mm) pour trouver la solution la plus économique conforme aux normes.

### 5.2 Normes appliquées (CNB 2020 / CCQ)

| Élément | Valeur / Norme |
|---------|---------------|
| Limite de déflexion | L/360 (CCQ 9.4.3.1) sous charge vive |
| Charge vive résidentielle | 1,9 kPa (CNB 2020, Table 4.1.5.3) |
| Charge vive commercial/garage | 2,4 kPa |
| Charge morte estimée | 0,5 kPa (fini + isolant + plafond) |
| Sous-plancher ≤ 400 mm | 15,9 mm (5/8") — CCQ 9.23.15.3 |
| Sous-plancher 600 mm | 19,0 mm (3/4") |

### 5.3 Librairies et outils

| Librairie | Rôle |
|-----------|------|
| TypeScript | Formule d'Euler-Bernoulli implémentée en TypeScript |
| React Three Fiber | Visualisation 3D de la section de plancher |
| shadcn/ui + Tailwind | Interface et résultats visuels |

Essences de bois supportées : SPF (E = 9 500 MPa), Douglas fir (E = 12 000 MPa), LVL (E = 13 800 MPa).

---

## 6.0 Plugin Toiture

### 6.1 Fonctionnement

Le plugin de toiture calcule les quantités de matériaux nécessaires pour couvrir un toit selon ses dimensions, sa pente et son type. Trois formes de toit sont supportées : deux versants, à croupe et en appentis. Le plugin calcule la surface horizontale et la surface développée, le nombre de chevrons requis, les quantités de bardeaux ou de membrane, et les surfaces de ventilation selon le CCQ.

La charge de neige est calculée selon la région du Québec (CNB 2020, Annexe C). Trois types de revêtements sont supportés : bardeaux d'asphalte, tôle d'acier et membrane.

### 6.2 Normes appliquées (CCQ)

| Élément | Valeur / Norme |
|---------|---------------|
| Pente minimale | Selon revêtement — CCQ 9.26.1 |
| Ventilation (CCQ 9.19.1.1) | 1/300 de la surface de plafond, moitié entrée / moitié sortie |
| Charge de neige | CNB 2020, Annexe C, Tableau C-2 selon région QC |
| Surplus matériaux | +15 % pour coupes et chevauchements (bardeaux) |

---

## 7.0 Plugin Analyse de plan (intelligence artificielle)

### 7.1 Fonctionnement

Ce plugin se distingue des autres par l'utilisation d'un modèle d'intelligence artificielle. L'utilisateur téléverse des photos ou des croquis d'un plan de construction — même manuscrits — et joint un fichier Excel qui liste les champs à extraire. L'IA analyse les images et tente de lire les valeurs correspondantes, en attribuant un niveau de confiance (0 à 100) et un statut à chaque champ : `ok`, `incertain`, `introuvable` ou `illisible`.

Un mécanisme de réessai automatique gère les erreurs 503 de l'API Gemini (service temporairement surchargé) avec 3 tentatives et 2 secondes d'intervalle.

### 7.2 Librairies et outils

| Librairie | Rôle |
|-----------|------|
| @google/genai | SDK officiel Google Gemini (modèle multimodal) [[9]](#ref-9) |
| ExcelJS | Lecture du fichier Excel source et écriture du résultat |
| Next.js API Route | Endpoint serveur pour cacher la clé API |
| shadcn/ui + Tailwind | Interface de l'assistant de validation |
| Lucide React | Icônes (vérification, avertissement, export) |

### 7.3 Assistant de validation séquentielle

Après l'analyse IA, les résultats s'affichent champ par champ. Pour chaque champ, l'utilisateur voit la valeur trouvée, le niveau de confiance, le statut et une note explicative du modèle. Trois boutons : **Oui** (valeur correcte), **Non** (saisie manuelle), **Non spécifié** (cellule laissée vide).

### 7.4 Format du fichier Excel source

| Colonne | Rôle |
|---------|------|
| Colonne A | Nom du champ à extraire (ex. Giron, Contremarche, Largeur) |
| Colonne B vide | Cellule cible : l'IA écrit la valeur ici après validation |
| Reste du fichier | Non modifié — formules et mise en forme conservées |

---

## 8.0 Architecture technique

### 8.1 Stack technologique

| Catégorie | Technologie |
|-----------|------------|
| Framework | Next.js 16 App Router [[10]](#ref-10) |
| Interface | React 19 + TypeScript strict |
| Styles | Tailwind CSS v4 + shadcn/ui |
| 3D | React Three Fiber + Three.js [[11]](#ref-11) |
| Formulaires | React Hook Form + Zod |
| IA | Google Gemini via @google/genai |
| Excel | ExcelJS |
| Thème | next-themes (mode clair/sombre) |

### 8.2 Structure du code

Chaque plugin suit la même organisation interne. La logique métier (calculs, normes, types) est séparée dans `src/lib/[plugin]/`, tandis que l'interface est dans `src/components/plugins/[plugin]/`. Cette séparation permet de tester la logique indépendamment de l'affichage et de maintenir chaque composant sous la limite de 200 lignes.

Les constantes de normes ne sont jamais codées directement dans les composants ; elles sont toujours importées depuis le fichier `normes.ts` du plugin concerné.

---

## 9.0 Sources de recherche

### 9.1 Calculs de charpenterie — émoicq (YouTube)

La série YouTube émoicq est la source principale des algorithmes du plugin Escaliers. Les cinq exercices couvrent toutes les formules implémentées dans le code, des calculs de base jusqu'au puits dans le plancher supérieur. Les formules proviennent directement du Code de construction du Québec.

Mots-clés utilisés : *calcul escalier québec charpenterie*, *émoicq escalier*, *calcul contremarche giron québec*.

### 9.2 Normes de construction (CCQ / RBQ / CNB 2020)

| Source | Contenu consulté |
|--------|-----------------|
| rbq.gouv.qc.ca [[6]](#ref-6) | Articles du CCQ — escaliers, rampes, garde-corps |
| qccodes.ca | Version lisible du code, recherche par article |
| plans-architecture.ca | Fiches pratiques sur les dimensions réglementaires |
| escalierinterieur.ca | Tableau normes résidentielles vs commerciales |
| nrc-cnrc.gc.ca — CNB 2020 [[7]](#ref-7) | Charges structurelles, neige par région du Québec |

### 9.3 Intelligence artificielle — Gemini

| Source | Contenu consulté |
|--------|-----------------|
| ai.google.dev/docs [[9]](#ref-9) | Documentation API Gemini : modèles, appel, structured output |
| Google AI Studio | Interface pour tester les prompts en direct avant de coder |
| ai.google.dev — vision | Guide analyse d'images : inlineData, base64, multi-images |
| ai.google.dev — structured-output | Forcer un JSON de structure fixe en réponse |

### 9.4 Technologies web

| Source | Contenu consulté |
|--------|-----------------|
| nextjs.org/docs [[10]](#ref-10) | App Router, routes API, désactivation SSR |
| docs.pmnd.rs/react-three-fiber [[11]](#ref-11) | Canvas 3D, hooks, géométries, lumières |
| threejs.org/docs | API Three.js : géométries, matériaux PBR, OrbitControls |
| ui.shadcn.com | Composants React copiés dans le projet |
| github.com/exceljs/exceljs | Lecture et écriture de fichiers .xlsx côté client |
| zod.dev | Validation de schéma TypeScript-first |

---

## 10.0 Conclusion

Ce projet démontre qu'il est possible de produire un outil professionnel utile dans le cadre d'un cours collégial, à condition d'utiliser une méthode de développement rigoureuse. La combinaison de la méthode SDD, de TypeScript strict et d'une architecture modulaire a permis de livrer cinq plugins fonctionnels sans accumulation de dette technique.

Les calculateurs de normes de construction répondent à un besoin réel : les professionnels sur le terrain n'ont pas toujours accès à un ingénieur ou à un logiciel spécialisé pour vérifier rapidement si une configuration est conforme. Cette plateforme web, accessible sur téléphone ou tablette, représente une solution légère et concrète.

Pour la suite, les pistes d'amélioration les plus intéressantes seraient l'ajout d'un mode impression pour produire des rapports directement depuis l'application, la localisation en anglais pour rejoindre les constructeurs hors Québec, et l'intégration de mises à jour automatiques lorsque le Code de construction est modifié.

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

    <a id="ref-10"></a>**[10]** Vercel, "Next.js 16 — Documentation officielle," 2024. [Online]. Available: [https://nextjs.org/docs](https://nextjs.org/docs). [Accessed: Jun. 3, 2026].

    <a id="ref-11"></a>**[11]** Poimandres, "React Three Fiber — Documentation," 2024. [Online]. Available: [https://docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber). [Accessed: Jun. 3, 2026].
