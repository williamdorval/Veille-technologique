---
feature: "Calculateur d'escaliers — Plugin complet (Tranche 2)"
branch: "002-plugin-escaliers"
spec: "specs/002-plugin-escaliers-calculateur/spec.md"
plan: "specs/002-plugin-escaliers-calculateur/plan.md"
created: "2026-05-27"
---

# Tasks: Calculateur d'escaliers — Plugin complet (Tranche 2)

## Résumé

| Phase | Description | Tâches |
|---|---|---|
| Phase 1 — Setup | Dépendances et infrastructure | T001–T002 |
| Phase 2 — Fondations | Types, normes, algorithme | T003–T005 |
| Phase 3 — US1 | P1: Formulaire + Conformité | T006–T008 |
| Phase 4 — US2 | P2: Matériaux + Plan + 3D | T009–T012 |
| Phase 5 — US3 | P3: Estimation + Impression | T013–T014 |
| Phase 6 — Finition | Validation TS + assemblage page + rapport | T015–T017 |

**Total** : 17 tâches | **MVP** : Phase 1 + 2 + 3 (T001–T008)

---

## Phase 1 — Setup

> Installer les dépendances et préparer la structure de fichiers. Bloquant pour tout le reste.

- [x] T001 Installer les dépendances npm : @react-three/fiber @react-three/drei react-hook-form zod @types/three (commande : `npm install @react-three/fiber @react-three/drei react-hook-form zod && npm install -D @types/three`)
- [x] T002 Ajouter les composants shadcn manquants : badge alert separator (commande : `npx shadcn@latest add badge alert separator`) — si échec, créer manuellement dans `src/components/ui/`

---

## Phase 2 — Fondations (bloquant pour toutes les user stories)

> Types TypeScript + constantes normes + algorithme de calcul. Tout le reste dépend de ces fichiers.

- [x] T003 [P] Créer les types TypeScript dans `src/lib/escaliers/types.ts` : EntreeFormulaire, ResultatCalcul, IndicateurConformite, StatutConformite, PieceMateriaux, EtapeConstruction, EstimationProjet, ErreurCalcul, ResultatOuErreur, UniteMesure, TypeUsage, MateriauLimon, TypeMarche
- [x] T004 [P] Créer les constantes de normes CCQ dans `src/lib/escaliers/normes.ts` : NORMES_CCQ avec toutes les valeurs (CONTREMARCHE_MIN_MM, CONTREMARCHE_MAX_PRIVE_MM, CONTREMARCHE_MAX_COMMUN_MM, GIRON_MIN_PRIVE_MM, GIRON_MIN_COMMUN_MM, GIRON_MAX_MM, LARGEUR_MIN_PRIVE_MM, LARGEUR_MIN_COMMUN_MM, DEGAGEMENT_TETE_MIN_PRIVE_MM, DEGAGEMENT_TETE_MIN_COMMUN_MM, BLONDEL_MIN_MM, BLONDEL_MAX_MM, BLONDEL_CIBLE_MM, MAIN_COURANTE_HAUTEUR_MIN_MM, MAIN_COURANTE_HAUTEUR_MAX_MM, GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM, GARDE_CORPS_HAUTEUR_MIN_ELEVE_MM, GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM) — chaque constante commentée avec l'article CCQ source
- [x] T005 Créer l'algorithme de calcul dans `src/lib/escaliers/calculs.ts` : fonctions calculerEscalier(entree) → ResultatOuErreur, verifierConformite(dimensions, typeUsage, hauteurPlafond) → ConformiteResultat ; créer `src/lib/escaliers/materiaux.ts` avec calculerMateriaux() et calculerEstimation() ; créer `src/lib/escaliers/plan-construction.ts` avec genererPlanConstruction() — valider avec `npx tsc --noEmit`

---

## Phase 3 — User Story 1 : Calcul des dimensions et conformité (P1)

> **Objectif** : L'utilisateur peut entrer les mesures de son escalier et obtenir instantanément les dimensions calculées avec les indicateurs de conformité CCQ.
>
> **Critère de test indépendant** : Entrer hauteur=2800mm, largeur=900mm, plafond=2400mm, type=residentiel_prive → obtenir ~16 marches, contremarche ~175mm, tous les indicateurs verts.

- [x] T006 [US1] Créer le formulaire dans `src/components/plugins/escaliers/FormulaireEscalier.tsx` : 'use client', react-hook-form avec resolver zod, tous les champs (hauteurTotale, uniteMesure toggle mm/pouces, largeur, hauteurPlafond, typeUsage Select, contremargesFermees Switch, materiauLimon Select, typeMarche Select), debounce 300ms sur watch → appel onCalculer, bouton "Calculer" explicite, messages d'erreur en français sous chaque champ, conversion automatique pouces↔mm — max 150 lignes (extraire ChampsOptions.tsx si nécessaire)
- [x] T007 [US1] Créer le composant de résultats dans `src/components/plugins/escaliers/ResultatsConformite.tsx` : 'use client', section "Dimensions" avec tableau (nombre marches, hauteur contremarche mm+pouces, giron mm+pouces, longueur au sol, longueur limon, angle°), 5 indicateurs Badge shadcn (variant success/warning/destructive) pour contremarche/giron/blondel/dégagement/largeur, chaque indicateur affiche valeur + plage min-max + article CCQ — max 150 lignes
- [x] T008 [US1] Valider le flux complet P1 : vérifier que npx tsc --noEmit retourne 0 erreurs sur T003–T007, tester mentalement les 3 cas (hauteur 2800mm ok, hauteur 200mm erreur, giron hors plage rouge)

---

## Phase 4 — User Story 2 : Matériaux, plan de construction et visualisation 3D (P2)

> **Objectif** : L'utilisateur peut obtenir la liste complète des matériaux avec quantités, un plan de construction étape par étape, et une visualisation 3D interactive de son escalier.
>
> **Critère de test indépendant** : Après calcul valide, la liste matériaux affiche limons×2, marches×N, contremarches×N (si fermé), la visualisation 3D pivote librement ou le SVG 2D s'affiche en fallback.

- [x] T009 [P] [US2] Créer le composant liste matériaux dans `src/components/plugins/escaliers/ListeMateriaux.tsx` : Card shadcn, tableau avec colonnes élément/quantité/dimensions/matériau, badges "main courante requise" (si ≥3 marches) et "garde-corps requis" (si chute >600mm), total estimé avec avertissement "prix indicatifs 2025"
- [x] T010 [P] [US2] Créer le composant plan de construction dans `src/components/plugins/escaliers/PlanConstruction.tsx` : 7 Card numérotées shadcn, chaque étape avec titre/description/dimensions clés, étapes conditionnelles (main courante, garde-corps) clairement marquées
- [x] T011 [US2] Créer la visualisation 3D dans `src/components/plugins/escaliers/Visualisation3D.tsx` (wrapper 'use client' avec dynamic import ssr:false + détection WebGL + fallback SVG 2D), `src/components/plugins/escaliers/EscalierScene.tsx` (Canvas R3F avec OrbitControls drei, AmbientLight+DirectionalLight), `src/components/plugins/escaliers/EscalierMesh.tsx` (BoxGeometry pour limons×2+marches+contremarches, MeshStandardMaterial couleurs par matériau, modèle centré à l'origine) — si R3F échoue après 3 tentatives : implémenter SVG uniquement
- [x] T012 [US2] Valider P2 : npx tsc --noEmit sur T009–T011, vérifier que le fallback SVG s'affiche si WebGL est simulé comme absent

---

## Phase 5 — User Story 3 : Estimation de coût/temps et impression (P3)

> **Objectif** : L'utilisateur peut voir une estimation du coût et du temps de construction, et imprimer une fiche complète.
>
> **Critère de test indépendant** : Après calcul valide, la section estimation affiche une fourchette de coût et un temps estimé. Le bouton Imprimer déclenche window.print(). L'impression exclut la visualisation 3D.

- [ ] T013 [US3] Créer le composant estimation dans `src/components/plugins/escaliers/EstimationProjet.tsx` : Card shadcn, temps estimé en heures (arrondi 0.5h), fourchette coût basse-haute en CAD, avertissement obligatoire "Prix indicatifs — obtenir des soumissions"
- [ ] T014 [US3] Ajouter les styles CSS d'impression dans `src/app/globals.css` sous @media print : masquer Alert/formulaire/boutons/navigation/canvas 3D, afficher en pleine largeur Conformité/Matériaux/Plan, optimiser pour page A4

---

## Phase 6 — Finition et assemblage

> Assembler la page principale, valider TypeScript, vérifier la responsivité, et produire le rapport.

- [ ] T015 Créer la page principale dans `src/app/plugins/escaliers/page.tsx` : Server Component (pas de 'use client'), Alert shadcn permanente non effaçable en haut (avertissement légal complet), titre "Calculateur d'escaliers" + sous-titre, grid md:grid-cols-2 gap-6 (formulaire gauche, résultats droite), Tabs shadcn pour résultats (Conformité/Matériaux/Plan/3D/Estimation), bouton Imprimer en bas, fonctionnel à partir de 375px — orchestrateur Client Component EscalierCalculateur.tsx si état partagé nécessaire
- [ ] T016 Valider l'ensemble : exécuter `npx tsc --noEmit` et corriger toutes les erreurs ; vérifier que chaque composant fait ≤150 lignes ; vérifier qu'aucune valeur numérique de norme n'est hardcodée hors de normes.ts ; tester manuellement les cas critiques (2800mm privé→conforme, 3500mm commun→contraintes strictes, 200mm→erreur)
- [ ] T017 Créer le rapport final dans `docs/06-livrables/rapport-tranche-2-plugin-escaliers.md` : tâches implémentées (N sur 17), fonctionnalités P1/P2/P3 livrées, normes documentées avec sources, décisions techniques justifiées, limites connues, instructions pour tester manuellement — puis git push origin 002-plugin-escaliers

---

## Graphe de dépendances

```
T001 ──┐
T002 ──┼──► T003, T004 ──► T005 ──► T006 ──► T007 ──► T008 (MVP P1 complet)
                                          └──► T009, T010, T011 ──► T012
                                          └──► T013, T014
                                                              └──► T015 ──► T016 ──► T017
```

## Tâches parallélisables

- T003 et T004 peuvent être écrits simultanément (fichiers indépendants)
- T009 et T010 peuvent être écrits simultanément (composants indépendants)
- T013 et T014 peuvent être écrits simultanément

## Périmètre MVP (minimum viable)

Phases 1–3 seulement (T001–T008) :
- Formulaire de saisie fonctionnel
- Calcul des dimensions
- 5 indicateurs de conformité CCQ
- TypeScript sans erreurs

P2 et P3 ajoutent la valeur complète mais P1 est autonome et testable.
