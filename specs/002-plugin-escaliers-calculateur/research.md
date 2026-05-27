# Research: Calculateur d'escaliers — Plugin complet

**Date**: 2026-05-27  
**Feature**: Plugin escaliers (Tranche 2)

---

## Décision 1 — Algorithme de calcul du nombre de marches

**Décision**: Arrondir `hauteurTotale / hauteurCible` au plus proche, puis ajuster ±1 pour maximiser la conformité à Blondel.

**Raisonnement**:
- Hauteur cible = 180 mm (valeur de confort reconnue CCQ résidentiel)
- `nbMarches = Math.round(hauteurTotale / 180)` comme point de départ
- Tester nbMarches-1, nbMarches, nbMarches+1 → choisir celui dont le résultat 2H+G est le plus proche de 630
- Minimum absolu = 2 marches (en dessous, pas d'escalier)

**Alternatives considérées**:
- Math.ceil → toujours plus de marches, contremarches plus petites
- Math.floor → toujours moins de marches, contremarches plus grandes
- Choix : Math.round avec optimisation Blondel pour meilleur confort

---

## Décision 2 — Gestion des unités (mm vs pouces)

**Décision**: Toute la logique interne travaille en millimètres. La conversion se fait à l'entrée (pouces → mm) et à la sortie (mm → pouces arrondi 2 décimales).

**Facteur de conversion**: 1 pouce = 25.4 mm (exact)

**Raisonnement**: Évite les erreurs d'arrondi en gardant une seule unité interne. L'affichage dual (mm / po) est généré à partir des valeurs mm.

---

## Décision 3 — Visualisation 3D avec @react-three/fiber

**Décision**: Utiliser `@react-three/fiber` avec `@react-three/drei` pour OrbitControls. Composant marqué `'use client'` avec lazy loading via `dynamic()` pour éviter les erreurs SSR.

**Fallback**: Détection WebGL via `canvas.getContext('webgl')` → si null, afficher SVG 2D (coupe latérale de l'escalier).

**Géométrie**: 
- Limons : BoxGeometry (longueurLimon × 38 mm × 235 mm)
- Marches : BoxGeometry (largeur × 38 mm × giron+nosing)
- Contremarches (si fermé) : BoxGeometry (largeur × hauteurContremarche × 19 mm)

**Raisonnement**: R3F est la bibliothèque standard pour Three.js dans React. `dynamic()` avec `ssr: false` est le pattern officiel Next.js pour les composants WebGL.

---

## Décision 4 — Validation du formulaire (react-hook-form + zod)

**Décision**: Schema zod unique `entreeFormulaireSchema` dans `src/lib/escaliers/types.ts`. Validation côté client uniquement (pas de backend).

**Messages d'erreur**: Tous en français, format court (ex. : "Hauteur doit être entre 400 et 6000 mm").

**Debounce**: useEffect avec setTimeout(300ms) sur les valeurs du formulaire pour déclencher le calcul automatique.

---

## Décision 5 — Architecture des composants

**Décision**: Séparation stricte logique / UI :
- `src/lib/escaliers/` → tout l'algorithmique (calculs, normes, matériaux)
- `src/components/plugins/escaliers/` → uniquement la présentation

**Max 150 lignes par composant** : si dépassement, extraire sous-composants.

**Composant principal** `page.tsx` : orchestrateur léger qui passe props aux sous-composants.

---

## Décision 6 — Calcul des matériaux

**Décision**: Quantités standard pour escalier droit :
- Limons : 2 pièces × (longueurLimon + 150 mm) → section 38×235 mm (épinette/bois) ou profil C (acier)
- Marches : nbMarches pièces × (largeur × (giron + 25 mm nosing) × 38 mm épaisseur)
- Contremarches : nbMarches pièces × (largeur × hauteurContremarche × 19 mm épaisseur) si fermé
- Vis inox : 40 vis par marche (fixation contremarche + marche)
- Supports d'ancrage : 4 (2 haut + 2 bas)
- Espaceurs : 2 par marche pour maintenir l'écartement des limons

**Prix indicatifs 2025 (source : pratique commerciale québécoise standard)** :
- Épinette : 3,50 $/m linéaire (38×235)
- Bois franc : 8,00 $/m linéaire
- Bois traité : 4,50 $/m linéaire (marches)
- Acier (profil C) : 12,00 $/m linéaire
- Contreplaqué : 45 $/feuille 4×8 pi
- Composite : 15,00 $/m linéaire

> Ces prix sont indicatifs. Mention obligatoire dans l'interface.

---

## Décision 7 — Indicateurs de conformité : seuils orange

**Décision**: Orange = valeur à moins de 10 mm d'une limite, ou Blondel entre 590–600 / 640–650 mm.

| Indicateur | Rouge | Orange | Vert |
|---|---|---|---|
| Contremarche (privé) | < 125 ou > 200 | 125–135 ou 190–200 | 135–190 |
| Giron (privé) | < 210 ou > 355 | 210–225 | 225–355 |
| Blondel | < 590 ou > 650 | 590–600 ou 640–650 | 600–640 |
| Dégagement | < min | min à min+50 | > min+50 |
| Largeur | < min | min à min+20 | > min+20 |

---

## Décision 8 — Estimation de temps de construction

**Décision**: Formule basée sur nombre de marches :
- Base fixe : 5h (traçage limons + ancrage + finition)
- Par marche : 20 min (épinette/bois traité) ou 30 min (bois franc) ou 45 min (acier)
- Résultat arrondi à la demi-heure

> Valeur indicative — non réglementée, basée sur pratique de chantier standard.

---

## Résumé des dépendances npm à installer

```
npm install @react-three/fiber @react-three/drei react-hook-form zod
npm install -D @types/three
```

Three.js est une dépendance transitive de @react-three/fiber.
