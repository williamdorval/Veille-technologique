# Rapport — Tranche 2 : Plugin calculateur d'escaliers

**Date :** 2026-05-27
**Étudiant :** William Dorval
**Cours :** Veille technologique 420-1SH-SW — Cégep de Shawinigan
**Branche Git :** `002-plugin-escaliers`

---

## Tâches implémentées

**17 sur 17 tâches complétées (100%)**

| Tâche | Description | Statut |
|---|---|---|
| T001 | Dépendances npm (R3F, drei, react-hook-form, zod) | ✓ |
| T002 | Composants shadcn (badge, alert, separator, tabs, switch) | ✓ |
| T003 | Types TypeScript (types.ts) | ✓ |
| T004 | Constantes normes CCQ (normes.ts) | ✓ |
| T005 | Algorithme de calcul (calculs.ts, materiaux.ts, plan-construction.ts) | ✓ |
| T006 | FormulaireEscalier avec validation zod et debounce | ✓ |
| T007 | ResultatsConformite avec indicateurs CCQ | ✓ |
| T008 | Validation flux complet P1 | ✓ |
| T009 | ListeMateriaux avec quantités et alertes CCQ | ✓ |
| T010 | PlanConstruction 7 étapes | ✓ |
| T011 | Visualisation3D R3F avec fallback SVG | ✓ |
| T012 | Validation P2 | ✓ |
| T013 | EstimationProjet (temps + coût) | ✓ |
| T014 | CSS impression @media print | ✓ |
| T015 | Page principale /plugins/escaliers | ✓ |
| T016 | Validation TypeScript finale (0 erreurs) | ✓ |
| T017 | Rapport final | ✓ |

---

## Fonctionnalités livrées

### P1 — Dimensions et conformité ✓

- Formulaire de saisie avec 8 champs (hauteur, largeur, plafond, unité, usage, matériaux, contremarches)
- Conversion automatique mm ↔ pouces
- Recalcul automatique avec debounce 300ms + bouton Calculer
- 6 dimensions calculées : nombre de marches, hauteur contremarche, giron, longueur au sol, longueur limon, angle
- 5 indicateurs de conformité CCQ avec pastilles vert/orange/rouge :
  - Contremarche (Art. 9.8.4.1 CCQ)
  - Giron (Art. 9.8.4.2 CCQ)
  - Formule de Blondel (2H+G)
  - Dégagement de tête (Art. 9.8.3.1 CCQ)
  - Largeur (Art. 9.8.2.1 CCQ)

### P2 — Matériaux, plan et visualisation ✓

- Liste de matériaux avec quantités exactes (limons, marches, contremarches, quincaillerie)
- Alertes main courante et garde-corps si requis par le CCQ
- Plan de construction en 7 étapes avec dimensions clés
- Étapes conditionnelles (main courante ≥ 3 marches, garde-corps si chute > 600mm)
- Visualisation 3D interactive avec @react-three/fiber et OrbitControls
- Fallback SVG 2D automatique si WebGL non disponible

### P3 — Estimation et impression ✓

- Estimation du temps de construction (arrondi à 0.5h)
- Estimation du coût en fourchette CAD basse/haute
- Avertissement obligatoire sur les prix indicatifs
- Bouton Imprimer → CSS @media print optimisé (exclut 3D, formulaire, navigation)

### Avertissement légal ✓

- Alert permanente en haut de page, non effaçable
- Texte complet recommandant un professionnel certifié RBQ

---

## Normes documentées avec sources

| Norme | Résidentiel privé | Commun | Article CCQ | Source |
|---|---|---|---|---|
| Contremarche min | 125 mm | 125 mm | 9.8.4.1 | qccodes.ca |
| Contremarche max | 200 mm | 180 mm | 9.8.4.1 | plans-architecture.ca |
| Giron min | 210 mm | 280 mm | 9.8.4.2 | qccodes.ca |
| Giron max | 355 mm | 355 mm | 9.8.4.2 | qccodes.ca |
| Largeur min | 860 mm | 900 mm | 9.8.2.1 | qccodes.ca |
| Dégagement tête | 1 950 mm | 2 050 mm | 9.8.3.1 | plans-architecture.ca |
| Main courante | 800–965 mm | 800–965 mm | 9.8.7.4 | qccodes.ca |
| Garde-corps | 900 mm | 1 070 mm | 9.8.8 | qccodes.ca |
| Formule Blondel | 2H+G = 600–640 mm | — | Pratique prof. | plans-architecture.ca |

Toutes les valeurs sont dans `src/lib/escaliers/normes.ts` avec commentaires d'articles.

---

## Décisions techniques

### 1. Séparation stricte logique / UI

**Décision :** Toute la logique métier dans `src/lib/escaliers/`, zéro logique dans les composants React.

**Justification :** Maintient la testabilité. Les calculs peuvent être testés indépendamment de l'interface. Respecte le principe de séparation des responsabilités.

### 2. Algorithme Blondel pour choisir le nombre de marches

**Décision :** Tester nbMarches-1, nbMarches, nbMarches+1 et choisir celui dont `|2H+G - 630|` est minimal.

**Justification :** Maximise le confort de l'escalier. Un escalier avec 16 marches à 175mm est plus agréable qu'un avec 15 marches à 187mm même si les deux sont conformes.

### 3. Visualisation 3D avec fallback SVG

**Décision :** `dynamic()` avec `ssr: false` pour @react-three/fiber. Détection WebGL à l'exécution. Fallback SVG 2D si WebGL absent.

**Justification :** Next.js App Router ne supporte pas Three.js côté serveur. La détection WebGL assure une expérience dégradée gracieuse sur les navigateurs anciens.

### 4. Refactorisation conformite.ts

**Décision :** Extraction des fonctions de vérification CCQ dans un fichier séparé `conformite.ts`.

**Justification :** Respecter la limite de 150 lignes par fichier. `calculs.ts` est passé de 414 à 109 lignes.

### 5. Zod v4 et @hookform/resolvers

**Décision :** Le projet utilise Zod 4.4.3 (nouvelle API). Les options `invalid_type_error` n'existent plus — utiliser les messages directs.

**Justification :** Incompatibilité détectée et corrigée lors des tests TypeScript. @hookform/resolvers a été ajouté (manquant de l'installation initiale).

---

## Limites connues

1. **Escaliers droits uniquement** — pas de tournants, paliers, colimaçons (hors portée du MVP)
2. **Dégagement de tête approximatif** — le calcul utilise la hauteur de plafond brute, sans modéliser le point critique sous le plancher du niveau supérieur
3. **Prix indicatifs** — basés sur moyennes 2025, varient selon fournisseurs et région
4. **Normes CCQ** — vérifiées via sources professionnelles reconnues, non consultées dans le texte officiel intégral
5. **Visualisation 3D** — géométrie simplifiée (pas de nosing visible, pas de grain de bois)

---

## Comment tester manuellement

### Test 1 — Escalier résidentiel standard

1. Ouvrir `http://localhost:3000/plugins/escaliers`
2. Entrer : Hauteur 2800mm, Largeur 900mm, Plafond 2400mm, Type = Résidentiel privé
3. **Résultat attendu :** 16 marches, contremarche ~175mm, giron ~280mm, tous les indicateurs verts

### Test 2 — Non-conformité de largeur

1. Entrer largeur = 800mm (sous le minimum de 860mm pour résidentiel privé)
2. **Résultat attendu :** indicateur "Largeur" rouge avec message et article CCQ

### Test 3 — Hauteur insuffisante

1. Entrer hauteur = 200mm
2. **Résultat attendu :** message d'erreur "Impossible de calculer"

### Test 4 — Changement d'unité

1. Cliquer sur "Pouces", entrer 110 po
2. **Résultat attendu :** résultats identiques à 2794mm (110 × 25.4)

### Test 5 — Visualisation 3D

1. Après calcul valide, cliquer sur l'onglet "3D"
2. **Résultat attendu :** escalier 3D pivoté librement, ou SVG 2D si WebGL absent

### Test 6 — Impression

1. Cliquer "Imprimer / Enregistrer PDF"
2. **Résultat attendu :** aperçu d'impression sans formulaire ni navigation, avec conformité et matériaux

---

## Commits de la tranche 2

1. `docs: normes du Quebec pour escaliers documentees` — Étape 1
2. `docs: specification fonctionnelle complete du plugin escaliers` — Étape 2
3. `feat: specification complete plugin escaliers (specify+plan+tasks)` — SpecKit SDD
4. `feat: types TypeScript et constantes normes CCQ (escaliers)` — T003–T005
5. `feat: FormulaireEscalier avec validation zod et debounce` — T006–T008
6. `feat: ListeMateriaux, PlanConstruction et Visualisation3D escalier` — T009–T012
7. `feat: page plugin escaliers layout complet responsive` — T013–T015
8. `refactor: composants et calculs < 150 lignes, 0 erreurs TypeScript` — T016
9. `docs: rapport tranche 2 plugin escaliers complete` — T017
