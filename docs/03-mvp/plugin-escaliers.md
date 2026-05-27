# Plugin calculateur d'escaliers

## Description

Le calculateur d'escaliers est le premier plugin de la plateforme. Il aide les constructeurs québécois amateurs à planifier un escalier droit conforme au Code de construction du Québec (CCQ).

L'application ne remplace pas un professionnel certifié. Un avertissement légal est affiché en permanence sur la page.

---

## Entrées du formulaire

### Section 1 — Mesures de base

| Champ | Type | Unité | Plage valide | Obligatoire |
|---|---|---|---|---|
| Hauteur totale à monter | Nombre | mm ou pouces | 400–6 000 mm | Oui |
| Unité de mesure | Sélection | mm / pouces | — | Oui |
| Largeur souhaitée | Nombre | mm | 600–2 500 mm | Oui |
| Hauteur du plafond (dégagement) | Nombre | mm | 1 800–4 000 mm | Oui |

### Section 2 — Type d'usage

| Valeur | Description |
|---|---|
| `residentiel_prive` | Maison individuelle, escalier intérieur d'un seul logement |
| `residentiel_commun` | Escalier de corridor, immeuble d'appartements |
| `commercial` | Usage commercial ou institutionnel |

### Section 3 — Options de construction

| Champ | Type | Description |
|---|---|---|
| Contremarches fermées | Booléen | Si false = escalier ouvert (sans contremarches) |
| Matériau du limon | Sélection | Épinette, bois franc, acier, composite |
| Type de marches | Sélection | Bois traité, épinette, bois franc, contreplaqué, composite |

---

## Sorties — Priorité 1 (P1) : Dimensions et conformité

Ces résultats s'affichent immédiatement après le calcul.

### Dimensions calculées

| Résultat | Formule |
|---|---|
| Nombre de marches | `round(hauteurTotale / hauteurContremarche_cible)` |
| Hauteur de contremarche | `hauteurTotale / nombreMarches` |
| Giron | `BLONDEL_CIBLE - 2 * hauteurContremarche` (ajusté aux bornes) |
| Longueur au sol | `nombreMarches * giron` |
| Longueur du limon | `sqrt(longueurAuSol² + hauteurTotale²)` |
| Angle | `atan2(hauteurTotale, longueurAuSol) * (180/π)` |

### Indicateurs de conformité

Chaque indicateur affiche une pastille colorée avec la valeur, la norme applicable et la source.

| Indicateur | Vert | Orange | Rouge |
|---|---|---|---|
| Hauteur contremarche | Dans les normes | Proche des limites (±5mm) | Hors normes |
| Giron | Dans les normes | Proche des limites | Hors normes |
| Formule de Blondel (2H+G) | 600–640mm | 590–600 ou 640–650mm | < 590 ou > 650mm |
| Dégagement de tête | ≥ min requis | 50mm sous le min | < min requis |
| Largeur | ≥ min requis | 20mm sous le min | < min requis |

---

## Sorties — Priorité 2 (P2) : Matériaux et plan

### Liste de matériaux

Quantités calculées automatiquement :

| Élément | Formule de calcul |
|---|---|
| Limons (2) | `longueurLimon + 150mm de jeu` × 2 pièces |
| Marches | `nombreMarches` pièces, dimensions `largeur × (giron + nosing)` |
| Contremarches | `nombreMarches` pièces (si fermé), dimensions `largeur × hauteurContremarche` |
| Vis/boulons | Quantité standard selon matériau (voir `src/lib/escaliers/materiaux.ts`) |
| Quincaillerie d'ancrage | 2 supports bas + 2 supports haut |

### Plan de construction étape par étape

Étapes générées automatiquement selon les paramètres :

1. Préparer les limons (tracé et découpe)
2. Poser les supports d'ancrage (bas et haut)
3. Installer les limons
4. Fixer les contremarches (si fermé)
5. Fixer les marches
6. Installer la main courante (si ≥ 3 marches)
7. Installer le garde-corps (si hauteur de chute > 600mm)

### Visualisation 3D

- Rendu avec @react-three/fiber + @react-three/drei
- Vue orbite (rotation libre) + zoom
- Couleurs par matériau (voir section technique)
- Fallback SVG 2D si le navigateur ne supporte pas WebGL

---

## Sorties — Priorité 3 (P3) : Estimation et impression

### Estimation de temps (valeurs indicatives)

| Activité | Base de calcul |
|---|---|
| Traçage et coupe des limons | 2–3h |
| Pose des limons | 1h |
| Pose des marches/contremarches | 15–20 min par marche |
| Finition et main courante | 2–4h |
| **Total estimé** | Calculé automatiquement |

> Ces valeurs sont indicatives pour un constructeur amateur avec outils standard.

### Estimation de coût

| Poste | Base de calcul |
|---|---|
| Bois / matériau | Prix unitaire par essence (valeur indicative 2025) |
| Quincaillerie | Forfait selon nombre de marches |
| **Total estimé** | Fourchette basse–haute |

> Avertissement visible : "Les prix varient selon les fournisseurs. Obtenir des soumissions." 

### Impression

- Bouton "Imprimer / Enregistrer PDF" (print CSS optimisé)
- Inclut : dimensions, conformité, liste de matériaux, plan de construction
- Exclut : visualisation 3D (non imprimable)

---

## Avertissement légal (obligatoire, permanent)

Affiché en haut de page en tout temps, jamais effaçable :

> **Ce calculateur est un outil d'aide à la planification uniquement.**
> Il ne remplace pas l'expertise d'un professionnel certifié (architecte, ingénieur ou entrepreneur licencié RBQ).
> Avant de construire, consultez un professionnel et vérifiez les exigences de permis auprès de votre municipalité.
> Les normes présentées sont basées sur le Code de construction du Québec (CCQ) — vérifiez toujours avec la version en vigueur.

---

## Structure technique

### Fichiers source

```
src/
├── app/plugins/escaliers/
│   └── page.tsx                    ← page principale du plugin
├── components/plugins/escaliers/
│   ├── FormulaireEscalier.tsx      ← formulaire react-hook-form + zod
│   ├── ResultatsConformite.tsx     ← indicateurs vert/orange/rouge
│   ├── ListeMateriaux.tsx          ← tableau de matériaux
│   ├── PlanConstruction.tsx        ← étapes de construction
│   ├── Visualisation3D.tsx         ← wrapper R3F + fallback SVG
│   └── EscalierMesh.tsx            ← géométrie Three.js
└── lib/escaliers/
    ├── types.ts                    ← types TypeScript
    ├── normes.ts                   ← constantes de normes avec sources
    ├── calculs.ts                  ← algorithme de calcul
    ├── materiaux.ts                ← calcul des quantités
    └── plan-construction.ts        ← génération des étapes
```

### Couleurs des matériaux (visualisation 3D)

| Matériau | Couleur hex | Propriétés Three.js |
|---|---|---|
| Bois traité | `#8B6F47` | roughness 0.8 |
| Épinette | `#E5D4B1` | roughness 0.7 |
| Bois franc | `#6B4423` | roughness 0.6 |
| Acier | `#6B7280` | metalness 0.8, roughness 0.2 |
| Contreplaqué | `#C8A878` | roughness 0.8 |
| Composite | `#4A5568` | roughness 0.5 |

### Dépendances npm requises

- `@react-three/fiber` — moteur 3D React
- `@react-three/drei` — helpers Three.js (OrbitControls, etc.)
- `react-hook-form` — gestion du formulaire
- `zod` — validation des entrées
- `three` (déjà inclus via R3F)
- `@types/three` (dev dependency)

### Layout de la page

```
┌─────────────────────────────────────────┐
│  ⚠️ AVERTISSEMENT LÉGAL (permanent)     │
├─────────────────────────────────────────┤
│  Titre + description du plugin          │
├──────────────────┬──────────────────────┤
│                  │                      │
│   FORMULAIRE     │   RÉSULTATS          │
│   (gauche)       │   - Dimensions       │
│                  │   - Conformité       │
│   Mesures        │   - Matériaux        │
│   Type d'usage   │   - Plan             │
│   Options        │   - Visualisation 3D │
│                  │   - Estimation       │
│   [Calculer]     │   [Imprimer]         │
│                  │                      │
└──────────────────┴──────────────────────┘
```

Mobile (< 768px) : formulaire en haut, résultats en bas, 1 colonne.

---

## Limites connues (dans la portée du MVP)

- Escaliers droits uniquement (pas de tournants, pas de paliers intermédiaires)
- Pas de calcul pour les escaliers colimaçons ou balancés
- Pas de calcul de résistance structurale (hors portée)
- Les prix estimés sont indicatifs et non mis à jour en temps réel
- Le calculateur ne tient pas compte des exigences de permis municipaux (variables)
