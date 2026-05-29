# Plugin Escaliers — Documentation complète

Ce dossier documente le plugin calculateur d'escaliers professionnel.

## Fichiers de cette documentation

| Fichier | Contenu |
|---------|---------|
| [calculs.md](calculs.md) | Algorithme complet : Blondel, Blondel-Maximum, modes, scoring |
| [normes.md](normes.md) | Règles CCQ expliquées en langage simple |
| [scene-3d.md](scene-3d.md) | Visualisation 3D (React Three Fiber + Three.js) |
| [plan-construction.md](plan-construction.md) | Génération du plan de construction étape par étape |
| [estimation.md](estimation.md) | Calcul des matériaux et estimation de coût (Canac, Rona 2025) |

---

## Vue d'ensemble du plugin

L'utilisateur entre les dimensions de son escalier, le calculateur propose automatiquement la meilleure configuration conforme au CCQ, avec estimation de coût pour client ou soumission.

### Deux modes de calcul

| Mode | Quand l'utiliser | Ce qui se passe |
|------|-----------------|-----------------|
| **Course illimitée** | Tu as de la place, tu connais juste la hauteur | Le calculateur choisit lui-même le meilleur giron |
| **Course limitée** | Tu as un espace fixe au sol (ex. 420 cm) | Le giron s'adapte à cet espace, le crochet vérifie sous le chevêtre |

### Ce que l'app produit

- **Recommandation** : meilleure configuration avec score /100 et 3 rapports Blondel-Maximum
- **Alternatives** : 5 autres options classées par score
- **Crochet** (mode limité) : vérifie si l'escalier rentre sous la structure du plancher supérieur
- **Puits** : longueur de l'ouverture nécessaire dans le plancher supérieur
- **Formules** : tous les calculs avec les vraies valeurs pour vérification
- **Estimation $** : liste de matériaux + coût total avec taxes (Canac/Rona 2025)
- **Plan de construction** : étapes séquentielles avec dimensions exactes
- **Vue 3D** : visualisation interactive de l'escalier

---

## Architecture du code

### Fichiers lib (`src/lib/escaliers/`)

| Fichier | Rôle | Exercice source |
|---------|------|----------------|
| `unit-converter.ts` | Conversion mm ↔ cm ↔ m ↔ po | — |
| `stair-rules.ts` | Constantes CCQ et normes en mm | CCQ + émoicq |
| `stair-types.ts` | Types TypeScript (StairInput, StairOption, etc.) | — |
| `stair-calculator.ts` | Fonctions de base pures (riser, angle, limon) | Exercice 1 |
| `stair-blondel.ts` | Loi de Blondel, évaluation du pas de foulée | Exercice 2 |
| `stair-builder.ts` | Construction d'une option à partir d'un riser count | — |
| `stair-unlimited-run.ts` | Mode course illimitée, toutes configurations | Exercice 3 |
| `stair-scoring.ts` | Score qualité 0-100 | Exercice 3 |
| `stair-limited-run.ts` | Mode course limitée | Exercice 4 |
| `stair-hook.ts` | Calcul du crochet (sous le chevêtre) | Exercice 4 |
| `stair-pit.ts` | Calcul du puits d'escalier | Exercice 5 |
| `stair-validation.ts` | Validation CCQ (erreurs et avertissements) | — |
| `stair-recommendations.ts` | Recommandations textuelles en français | — |
| `stair-materials.ts` | Matériaux + prix Canac/Rona 2025 | — |
| `stair-construction-plan.ts` | Plan de construction étape par étape | — |

### Composants UI (`src/components/plugins/escaliers/`)

| Composant | Rôle |
|-----------|------|
| `FormulaireEscalierPro.tsx` | Formulaire principal avec boutons `?` sur chaque champ |
| `HelpButton.tsx` | Bouton `?` réutilisable avec explication au clic |
| `EscalierCalculateurPro.tsx` | Orchestrateur (8 onglets de résultats) |
| `ResultatsRecommandation.tsx` | Config recommandée + score + 3 rapports Blondel |
| `ResultatsAlternatives.tsx` | Tableau de toutes les options triées |
| `ResultatsCrochet.tsx` | Calcul du crochet (mode limité) |
| `ResultatsPuits.tsx` | Longueur du puits d'escalier |
| `ResultatsFormules.tsx` | Toutes les formules avec valeurs réelles |
| `EstimationPro.tsx` | Estimation professionnelle avec taxes pour client/soumission |
| `ListeMateriaux.tsx` | Liste des matériaux (ancien composant) |
| `PlanConstruction.tsx` | Plan de construction étape par étape |
| `Visualisation3D.tsx` | Scène 3D avec React Three Fiber |

### Scènes 3D

| Fichier | Rôle |
|---------|------|
| `EscalierScene.tsx` | Canvas + lumières + OrbitControls |
| `EscalierStructure.tsx` | Marches, contremarches, limons |
| `EscalierEnvironnement.tsx` | Murs, sol, silhouette humaine |
| `EscalierGardeCourante.tsx` | Poteaux et balustres |
| `escalier-scene-types.ts` | Types et constantes PBR partagés |

---

## Source des exercices

Le calculateur reproduit exactement la logique des exercices 1 à 5 de la série **émoicq** (YouTube) sur les calculs de charpenterie québécoise.

- **Exercice 1** : calculs de base (contremarche, giron, limon, angle)
- **Exercice 2** : loi de Blondel (pas de foulée = 2H + G ≈ 63 cm)
- **Exercice 3** : Blondel-Maximum (3 rapports G+H, G+2H, G×H)
- **Exercice 4** : course limitée + crochet sous le chevêtre
- **Exercice 5** : calcul du puits d'escalier dans le plancher supérieur
