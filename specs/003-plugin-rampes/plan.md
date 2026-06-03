# Plan d'architecture — Plugin Rampes et Garde-corps

## Structure des fichiers

### Logique métier (src/lib/rampes/)
- `types.ts` — interfaces TypeScript
- `normes.ts` — constantes CCQ
- `calculs.ts` — fonctions de calcul pures
- `materiaux.ts` — liste des matériaux
- `plan-construction.ts` — étapes de pose

### Composants UI (src/components/plugins/rampes/)
- `RampeCalculateur.tsx` — orchestrateur principal
- `FormulaireRampe.tsx` — formulaire react-hook-form + zod
- `ResultatsConformite.tsx` — badges conformité CCQ
- `ListeMateriaux.tsx` — tableau matériaux
- `PlanConstruction.tsx` — étapes numérotées
- `Visualisation3D.tsx` — Canvas R3F

### Page
- `src/app/plugins/rampes/page.tsx`
