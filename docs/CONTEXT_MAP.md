# CONTEXT_MAP.md — Quoi charger selon la tâche

> Règle : charger UNIQUEMENT les fichiers listés. Ne jamais tout lire d'un coup.

## Travailler sur le plugin escaliers
```
src/lib/escaliers/normes.ts
src/lib/escaliers/types.ts
src/lib/escaliers/calculs.ts
src/lib/escaliers/conformite.ts
src/components/plugins/escaliers/FormulaireEscalier.tsx
src/components/plugins/escaliers/ResultatsConformite.tsx
docs/04-normes-quebec/RESUME_VALEURS.md  ← section escaliers
```

## Travailler sur le plugin rampes
```
src/lib/rampes/normes.ts
src/lib/rampes/types.ts
src/lib/rampes/calculs.ts
src/components/plugins/rampes/FormulaireRampe.tsx
src/components/plugins/rampes/ResultatsRampe.tsx
docs/04-normes-quebec/RESUME_VALEURS.md  ← section rampes
```

## Travailler sur le plugin plancher
```
src/lib/plancher/normes.ts
src/lib/plancher/types.ts
src/lib/plancher/calculs.ts
src/components/plugins/plancher/FormulaireplanCher.tsx
src/components/plugins/plancher/ResultatsPlancher.tsx
docs/04-normes-quebec/RESUME_VALEURS.md  ← section plancher
```

## Travailler sur le plugin toiture
```
src/lib/toiture/normes.ts
src/lib/toiture/types.ts
src/lib/toiture/calculs.ts
src/components/plugins/toiture/FormulaireToiture.tsx
src/components/plugins/toiture/ResultatsToiture.tsx
docs/04-normes-quebec/RESUME_VALEURS.md  ← section toiture
```

## Travailler sur UI / design
```
src/app/globals.css
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/shared/SelecteurUnite.tsx
docs/05-design/index.md
```

## Travailler sur les scènes 3D
```
src/components/plugins/[plugin]/[Plugin]Scene.tsx   ← Canvas + lumières
src/components/plugins/[plugin]/[Plugin]Meshes.tsx  ← géométrie principale
```
Fichiers 3D par plugin :
- escaliers → EscalierScene.tsx + EscalierStructure.tsx + EscalierEnvironnement.tsx
- rampes → RampeScene.tsx + RampePoteaux.tsx + RampeBarreaux.tsx + RampeMainCourante.tsx
- plancher → PlancherScene.tsx + SoliveMeshes.tsx + SousPlancherMeshes.tsx
- toiture → ToitureScene.tsx + ToitureMeshes.tsx + BatimentMeshes.tsx

## Ajouter un nouveau plugin
```
src/lib/plugins-registry.ts          ← enregistrer le plugin
src/app/plugins/[nouveau]/page.tsx   ← créer la route
src/lib/[nouveau]/normes.ts          ← constantes CCQ en cm
src/lib/[nouveau]/types.ts           ← types TypeScript
src/lib/[nouveau]/calculs.ts         ← logique métier
src/components/plugins/[nouveau]/    ← formulaire + résultats + scène 3D
docs/03-mvp/plugin-[nouveau].md      ← spec
```
Pattern normes.ts : constantes `_CM`, valeurs ÷10 vs mm.

## Travailler sur les unités (cm/po)
```
src/lib/shared/use-unite.ts
src/components/shared/SelecteurUnite.tsx
```
- `useUnite(pluginKey)` → { unite, choisirUnite }
- `cmVers(cm, unite)` → valeur dans l'unité d'affichage
- `versCm(valeur, unite)` → cm à stocker

## Normes CCQ (vue d'ensemble)
```
docs/04-normes-quebec/RESUME_VALEURS.md   ← tout en un seul fichier
```
Si plus de détail : charger le fichier spécifique dans `docs/04-normes-quebec/`.
