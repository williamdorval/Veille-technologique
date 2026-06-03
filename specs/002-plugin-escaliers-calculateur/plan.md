# Implementation Plan: Calculateur d'escaliers — Plugin complet (Tranche 2)

**Branche**: `002-plugin-escaliers`
**Date**: 2026-05-27
**Répertoire spec**: `specs/002-plugin-escaliers-calculateur/`

---

## Contexte technique

| Élément | Valeur |
|---|---|
| Framework | Next.js 16 App Router |
| Langage | TypeScript strict (noImplicitAny: true) |
| Styling | Tailwind v4 |
| Composants UI | shadcn/ui |
| Formulaire | react-hook-form + zod |
| 3D | @react-three/fiber + @react-three/drei |
| Thème | next-themes (déjà installé) |

## Vérification constitution

- Pas de backend : tout côté client ✓
- Pas d'authentification ✓
- Escaliers droits uniquement ✓
- Normes depuis normes.ts uniquement ✓
- Pas d'IA dans les calculs ✓
- Composants max 150 lignes ✓ (à respecter pendant l'implémentation)
- TypeScript strict, aucun any ✓

---

## Phase 1 — Infrastructure et types (T01–T03)

### T01 — Installer les dépendances et composants shadcn

**But** : Avoir toutes les dépendances disponibles avant d'écrire du code.

**Actions** :
```bash
npm install @react-three/fiber @react-three/drei react-hook-form zod
npm install -D @types/three
npx shadcn@latest add form badge alert separator
```
Si un composant shadcn échoue : implémenter manuellement dans src/components/ui/.

**Commit** : `chore: installer dependances plugin escaliers (r3f, rhf, zod)`

---

### T02 — Types TypeScript et constantes de normes

**But** : Définir les types et constantes une seule fois. Tous les autres fichiers en dépendent.

**Fichiers** :
- `src/lib/escaliers/types.ts`
- `src/lib/escaliers/normes.ts`

**Validation** : `npx tsc --noEmit` → 0 erreurs

**Commit** : `feat: types TypeScript et constantes normes CCQ (escaliers)`

---

### T03 — Algorithme de calcul principal

**But** : Implémenter la logique de calcul pure, sans UI.

**Fichiers** :
- `src/lib/escaliers/calculs.ts`
- `src/lib/escaliers/materiaux.ts`
- `src/lib/escaliers/plan-construction.ts`

**Algorithme** :
1. nbMarches = Math.round(hauteurTotale / 180), tester ±1, choisir le meilleur Blondel
2. hauteurContremarche = hauteurTotale / nbMarches
3. giron = clamp(630 - 2*H, GIRON_MIN, GIRON_MAX)
4. longueurAuSol = nbMarches * giron
5. longueurLimon = sqrt(longueurAuSol² + hauteurTotale²)
6. angle = atan2(hauteurTotale, longueurAuSol) * (180/PI)

**Commit** : `feat: algorithme calcul escalier et verification conformite CCQ`

---

## Phase 2 — Composants UI (T04–T08)

### T04 — FormulaireEscalier

**Fichier** : `src/components/plugins/escaliers/FormulaireEscalier.tsx`
- react-hook-form + zod resolver
- Debounce 300ms + bouton Calculer
- Conversion mm/pouces
- Messages d'erreur français

**Commit** : `feat: FormulaireEscalier avec validation zod et debounce`

---

### T05 — ResultatsConformite

**Fichier** : `src/components/plugins/escaliers/ResultatsConformite.tsx`
- Tableau dimensions (marches, contremarche, giron, longueur, angle)
- 5 indicateurs Badge shadcn vert/orange/rouge
- Article CCQ cité pour chaque indicateur

**Commit** : `feat: ResultatsConformite avec indicateurs CCQ vert/orange/rouge`

---

### T06 — ListeMateriaux et PlanConstruction

**Fichiers** :
- `src/components/plugins/escaliers/ListeMateriaux.tsx`
- `src/components/plugins/escaliers/PlanConstruction.tsx`

**Commit** : `feat: ListeMateriaux et PlanConstruction etapes`

---

### T07 — Visualisation3D (R3F + fallback SVG)

**Fichiers** :
- `src/components/plugins/escaliers/Visualisation3D.tsx` — wrapper lazy + détection WebGL
- `src/components/plugins/escaliers/EscalierScene.tsx` — Canvas R3F
- `src/components/plugins/escaliers/EscalierMesh.tsx` — géométrie

Couleurs : bois_traite=#8B6F47, epinette=#E5D4B1, bois_franc=#6B4423, acier=#6B7280, contrepalque=#C8A878, composite=#4A5568

Si R3F échoue après 3 tentatives : SVG 2D uniquement + documenter dans rapport.

**Commit** : `feat: Visualisation3D escalier avec R3F et fallback SVG`

---

### T08 — Page principale /plugins/escaliers

**Fichier** : `src/app/plugins/escaliers/page.tsx`
- Alert permanente avertissement légal
- Grid 2 colonnes desktop / 1 colonne mobile
- Tabs résultats : Conformité / Matériaux / Plan / 3D / Estimation
- Bouton Imprimer

**Commit** : `feat: page plugin escaliers layout complet responsive`

---

## Phase 3 — Finition (T09–T10)

### T09 — EstimationProjet + CSS impression

- `calculerEstimation()` dans materiaux.ts
- `src/components/plugins/escaliers/EstimationProjet.tsx`
- CSS @media print dans globals.css

**Commit** : `feat: estimation projet et styles impression PDF`

---

### T10 — Validation TypeScript et rapport

1. `npx tsc --noEmit` → 0 erreurs
2. Vérifier max 150 lignes par composant
3. Tester cas : 2800mm résidentiel, 3500mm commun, 200mm (erreur)
4. Créer `docs/06-livrables/rapport-tranche-2-plugin-escaliers.md`

**Commit** : `docs: rapport tranche 2 plugin escaliers complete`

---

## Artefacts

| Fichier | Tâche |
|---|---|
| src/lib/escaliers/types.ts | T02 |
| src/lib/escaliers/normes.ts | T02 |
| src/lib/escaliers/calculs.ts | T03 |
| src/lib/escaliers/materiaux.ts | T03, T09 |
| src/lib/escaliers/plan-construction.ts | T03 |
| src/components/plugins/escaliers/FormulaireEscalier.tsx | T04 |
| src/components/plugins/escaliers/ResultatsConformite.tsx | T05 |
| src/components/plugins/escaliers/ListeMateriaux.tsx | T06 |
| src/components/plugins/escaliers/PlanConstruction.tsx | T06 |
| src/components/plugins/escaliers/Visualisation3D.tsx | T07 |
| src/components/plugins/escaliers/EscalierScene.tsx | T07 |
| src/components/plugins/escaliers/EscalierMesh.tsx | T07 |
| src/app/plugins/escaliers/page.tsx | T08 |
| src/components/plugins/escaliers/EstimationProjet.tsx | T09 |
| docs/06-livrables/rapport-tranche-2-plugin-escaliers.md | T10 |

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
