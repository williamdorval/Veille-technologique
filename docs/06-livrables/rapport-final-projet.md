# Rapport final — Plateforme constructeurs

**Date :** 2026-05-27
**Étudiant :** William Dorval
**Cours :** Veille technologique (420-1SH-SW) — Cégep de Shawinigan

---

## Plugins livrés

### 1. Escaliers (`/plugins/escaliers`)
Calculateur complet d'escaliers droits conforme au CCQ. Entrées : hauteur totale, largeur, usage, matériaux.
Sorties : nombre de marches, giron, contremarche, 5 indicateurs CCQ (Art. 9.8.2.1, 9.8.3.1, 9.8.4.1, 9.8.4.2 + Blondel), liste de matériaux, plan de construction en 7 étapes, visualisation 3D R3F, estimation coût/temps.

### 2. Rampes et garde-corps (`/plugins/rampes`)
Calculateur de rampes pour escaliers, balcons et terrasses. Entrées : longueur, hauteur de chute, usage, matériau, type d'installation.
Sorties : hauteur de garde-corps requise (CCQ 9.8.8.1), espacement conforme des barreaux (CCQ 9.8.8.3 ≤100 mm), nombre de poteaux et barreaux, longueur de main courante (CCQ 9.8.7.4 800–965 mm), liste de matériaux avec export CSV, plan de pose en 6 étapes, visualisation 3D.

### 3. Calcul de plancher (`/plugins/plancher`)
Sélection de la dimension de solive optimale. Entrées : portée, largeur pièce, usage, type de bois, sous-plancher, élément lourd.
Sorties : dimension recommandée (2x6 à 2x12), espacement optimal (300/400/600 mm), nombre de solives, longueur totale de bois, panneaux 4×8, flèche calculée vs L/360 (CCQ 9.4.3.1), charge vive appliquée (CNB 2020 1,9 kPa), visualisation 3D structure de solives.

### 4. Estimation de toiture (`/plugins/toiture`)
Calcul de surface et de matériaux de toiture. Entrées : longueur, largeur, pente, type de toit, revêtement, région, débord.
Sorties : surface horizontale et développée, paquets de bardeaux ou surface de membrane (+15% surplus), nombre et longueur des chevrons, ventilation requise (CCQ 9.19.1.1, ratio 1/300), charge de neige de la région (CNB 2020 Annexe C, 9 régions), conformité pente minimale (CCQ 9.26), visualisation 3D bâtiment avec versants.

---

## Workflow SDD suivi

- Specs : `specs/001-home-page-3d-hero/`, `specs/002-plugin-escaliers-calculateur/`, `specs/003-plugin-rampes/`, `specs/004-plugin-plancher/`, `specs/005-plugin-toiture/`
- 14 commits sur la branche `002-plugin-escaliers` (en comptant tous les commits de session)
- Branches : `002-plugin-escaliers` (branche de travail principale — contient toutes les features)

---

## Normes du Québec documentées

Tous les fichiers sont dans `docs/04-normes-quebec/` :

| Fichier | Norme principale |
|---------|-----------------|
| `hauteur-marche.md` | CCQ 9.8.4.1 — contremarche 125–200 mm |
| `giron.md` | CCQ 9.8.4.2 — giron 210–355 mm |
| `angle-escalier.md` | Formule de Blondel 600–640 mm |
| `degagement-tete.md` | CCQ 9.8.3.1 — échappée 1 950 mm min |
| `main-courante.md` | CCQ 9.8.7.4 — main courante 800–965 mm |
| `garde-corps.md` | CCQ 9.8.8 — garde-corps selon chute |
| `main-courante-rampe.md` | CCQ 9.8.7.4 |
| `garde-corps-hauteur.md` | CCQ 9.8.8.1 — 900/1 070 mm |
| `barreaux-espacement.md` | CCQ 9.8.8.3 — ≤ 100 mm |
| `solives-plancher.md` | CCQ 9.23.4.2 / CNB 2020 A-9.23.4.2 |
| `portees-plancher.md` | CNB 2020 4.1.5.3 — 1,9 kPa, L/360 |
| `sous-plancher.md` | CCQ 9.23.15.3 — OSB 5/8 ou 3/4 po |
| `pente-toiture.md` | CCQ 9.26.1-3 — min 4/12 bardeau |
| `chevrons-toiture.md` | CCQ 9.23.8.2 |
| `charges-neige-quebec.md` | CNB 2020 Annexe C — 9 régions |
| `ventilation-toiture.md` | CCQ 9.19.1.1 — ratio 1/300 |

---

## Décisions techniques importantes

1. **Valeurs indicatives marquées explicitement** : toutes les valeurs dont la source officielle n'est pas disponible en ligne libre sont marquées "Valeur indicative (pratique standard industrie canadienne, source officielle non trouvée)".

2. **Zéro `any` TypeScript** : types stricts dans tous les fichiers lib. Union discriminée `ResultatOuErreur` pour tous les calculs.

3. **R3F avec `dynamic()` + `ssr: false`** : évite les erreurs d'hydratation Next.js pour tous les Canvas 3D.

4. **Séparation logique / UI** : toute la logique métier dans `src/lib/`, aucune valeur de norme hardcodée dans les composants.

5. **Build Next.js propre** : `npm run build` donne 0 erreurs TypeScript et 6 routes statiques générées.

---

## Limites connues

- Les calculs de plancher utilisent une formule de flèche simplifiée (charge uniformément répartie, solive simple). Pour des configurations complexes (poutres composites, portées multiples), consulter un ingénieur.
- Les charges de neige par région sont indicatives basées sur les valeurs typiques du CNB 2020 Annexe C. Les valeurs officielles exactes pour chaque municipalité requièrent un abonnement au CNB.
- La visualisation 3D de la toiture est schématique (deux versants seulement pour la forme principale, même si le type croupe ou appentis est sélectionné pour les calculs).
- Les portées de solives sont calculées par la formule de Bernoulli (flèche élastique). Le CNB 2020 utilise des tableaux basés sur des essais réels qui peuvent différer légèrement.
- Aucun backend : toutes les données sont calculées côté client, pas de sauvegarde.

---

## Comment tester

1. `npm install`
2. `npm run dev`
3. Ouvrir http://localhost:3000
4. Tester chaque plugin avec des valeurs réalistes :
   - Escaliers : hauteur 2800 mm → ~15 marches
   - Rampes : longueur 3000 mm, hauteur chute 1200 mm → garde-corps 900 mm
   - Plancher : portée 4000 mm, salon, SPF → 2×10 @ 400 mm
   - Toiture : 10000×8000 mm, pente 26°, bardeau → ~80 m² développés
5. Alterner thème clair/sombre sur chaque page
6. Console DevTools (F12) → aucune erreur rouge attendue
7. Redimensionner à 375 px pour vérifier le responsive mobile
