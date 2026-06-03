# CLAUDE.md — Plateforme constructeurs québécois

## Identité
William Dorval | Cours 420-1SH-SW, Cégep Shawinigan | Méthode : SDD (Specification Driven Development)
Site modulaire d'outils pour constructeurs QC. MVP : 4 plugins complets sur branche `002-plugin-escaliers`.

## Stack
| Catégorie | Choix | Catégorie | Choix |
|---|---|---|---|
| Framework | Next.js 16 App Router | Langage | TypeScript strict |
| UI | React 19 | Styling | Tailwind v4 (postcss.config.mjs) |
| Composants | shadcn/ui | 3D | React Three Fiber (R3F) |
| Thème | next-themes | Lint | aucun |

## Plugins (état)
| Plugin | Statut | Lib | Composants |
|--------|--------|-----|------------|
| escaliers | ✅ Complet | src/lib/escaliers/ | src/components/plugins/escaliers/ |
| rampes | ✅ Complet | src/lib/rampes/ | src/components/plugins/rampes/ |
| plancher | ✅ Complet | src/lib/plancher/ | src/components/plugins/plancher/ |
| toiture | ✅ Complet | src/lib/toiture/ | src/components/plugins/toiture/ |

## Règles strictes
1. **Jamais hardcoder** de valeur de norme — `import { NORMES_XXX } from '@/lib/[plugin]/normes'`
2. **Jamais inventer** une norme : si absente de `docs/04-normes-quebec/`, signaler et arrêter
3. **Composants < 200 lignes** — logique dans `src/lib/`, UI dans `src/components/`
4. **TypeScript strict** — jamais `any` sauf impossible
5. **Pas de backend/auth/BDD** — tout client-side
6. **Une tâche = un commit** (français, format `type(scope): description`)
7. **`git status` avant commit** — aucun secret inclus
8. **Lire `docs/CONTEXT_MAP.md`** avant de travailler — ne pas tout charger

## Unités
- Stockage interne : **centimètres (cm)** — constantes `_CM` dans chaque `normes.ts`
- Sélecteur UI : cm | po (persisté localStorage) via `SelecteurUnite`
- Conversions : `cmVers()` / `versCm()` dans `src/lib/shared/use-unite.ts`
- Normes docs : format `X cm (Y mm)` — résumé dans `docs/04-normes-quebec/RESUME_VALEURS.md`

## Structure repo
```
src/
  app/plugins/[plugin]/page.tsx       ← routes
  components/plugins/[plugin]/        ← UI + scènes 3D (composants < 200 lignes chacun)
  components/shared/SelecteurUnite    ← sélecteur unité
  lib/[plugin]/normes|types|calculs   ← logique métier
  lib/shared/use-unite.ts             ← hook unités
docs/
  CONTEXT_MAP.md                      ← LIRE EN PREMIER : quoi charger selon la tâche
  04-normes-quebec/RESUME_VALEURS.md  ← toutes les normes en un tableau
  _archive/                           ← fichiers obsolètes conservés
```

## Références (charger à la demande)
- Contexte tâche → `docs/CONTEXT_MAP.md`
- Normes → `docs/04-normes-quebec/RESUME_VALEURS.md`
- Design → `docs/05-design/index.md`
- Spec MVP → `docs/03-mvp/plugin-escaliers.md`

## Workflow SDD (5 étapes)
1. Lire `docs/CONTEXT_MAP.md` → charger UNIQUEMENT les fichiers pertinents
2. `/speckit.specify` → spec
3. `/speckit.plan` → plan
4. `/speckit.tasks` → tâches
5. `/speckit.implement` → implémenter + commit après chaque tâche
