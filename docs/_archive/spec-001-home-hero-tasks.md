# Tasks: Page d'accueil — Hero 3D

**Input**: `specs/001-home-page-3d-hero/` — plan.md, spec.md, data-model.md, contracts/components.md, research.md

**User Stories** :
- **US1** — Premier visiteur desktop : voit le hero, la grille plugins, peut naviguer vers l'escaliers
- **US2** — Visiteur mobile : page fonctionnelle à 375px, 3D simplifiée
- **US3** — Changement de thème : toggle clair/sombre, header scroll, Three.js s'adapte
- **US4** — prefers-reduced-motion : pas d'animation, dégradé statique
- **US5** — Navigation À propos : section about + footer visibles au scroll

## Format: `[ID] [P?] [Story] Description`

- **[P]** : tâche parallélisable (fichier indépendant, pas de dépendance incomplète)
- **[USn]** : user story correspondante

---

## Phase 1 : Setup

**Objectif** : Vérifier que la structure de répertoires attendue existe avant de commencer.

- [x] T001 Créer les répertoires manquants : `src/components/layout/`, `src/components/hero/`, `public/images/`

---

## Phase 2 : Fondations (bloquant pour toutes les user stories)

**Objectif** : Couleurs, ThemeProvider et ThemeToggle doivent exister avant tout autre composant.

**⚠️ CRITIQUE** : Aucune user story ne peut démarrer avant la fin de cette phase.

- [x] T002 Ajouter les variables de couleur construction dans `src/app/globals.css` via `@theme` — valeurs HSL : `--construction-primaire` (217 51% 25% clair / 217 51% 70% sombre), `--construction-accent` (44 96% 49% clair / 44 96% 60% sombre), `--construction-succes` (142 50% 33%), `--construction-attention` (32 100% 39%), `--construction-erreur` (7 64% 46%)
- [x] T003 [P] Ajouter `ThemeProvider` de next-themes dans `src/app/layout.tsx` avec `attribute="class" defaultTheme="light" enableSystem`
- [x] T004 [P] Créer `src/components/ThemeToggle.tsx` — bouton `'use client'` qui lit `useTheme()`, affiche `<Sun />` en dark et `<Moon />` en light

**Checkpoint** : `npm run dev` démarre sans erreur TypeScript. Les classes `text-construction-accent` sont reconnues par Tailwind.

---

## Phase 3 : US1 — Premier visiteur desktop 🎯 MVP

**Objectif** : Un visiteur ouvre le site, voit le hero 3D animé, la grille de 4 plugins, et peut cliquer sur "Ouvrir le calculateur d'escaliers".

**Test indépendant** : Ouvrir `localhost:3000` sur desktop. Le titre "Plateforme constructeurs" est visible au-dessus de l'animation. La grille affiche 1 carte active (escaliers) + 3 grises. Le clic sur la carte escaliers navigue vers `/plugins/escaliers`.

- [x] T005 Créer `src/components/layout/Header.tsx` — `'use client'`, transparent par défaut, devient `bg-white/90 dark:bg-zinc-900/90 backdrop-blur` quand `scrollY > 50`, logo Hammer + texte "Plateforme constructeurs", `<ThemeToggle />` à droite
- [x] T006 Créer `src/components/hero/DottedSurfaceWithHouses.tsx` — `'use client'`, reprend la logique de `dotted-surface.tsx` (SEPARATION=150, AMOUNTX=40, AMOUNTY=60), ajoute 4 maisons Three.js aux positions `(-600,180,-400)`, `(500,120,-300)`, `(-300,240,400)`, `(700,150,200)` — chaque maison = `BoxGeometry(80,80,80)` + `ConeGeometry(55,70,4)` positionné +80u au-dessus, matériau `MeshBasicMaterial` wireframe, rotation Y +0.005 rad/frame, flottement `Math.sin(count * 0.5 + phaseOffset) * 20` (phaseOffset = 0, 1.5, 3.0, 4.5)
- [x] T007 Créer `src/components/hero/Hero.tsx` — `DottedSurfaceWithHouses` en `absolute inset-0 opacity-60`, contenu centré `flex items-center justify-center`, titre `text-6xl md:text-8xl font-bold tracking-tight`, sous-titre `text-xl md:text-2xl text-muted-foreground mt-6`, deux `Button` shadcn `size="lg"` côte à côte `mt-12 flex gap-4` (CTA1 → `/plugins/escaliers`, CTA2 `variant="outline"` → scroll `#plugins`)
- [x] T008 [P] Créer `src/components/PluginCard.tsx` — props `{ icon, title, description, status, href? }` (types du data-model.md), carte shadcn `Card` cliquable avec `Link` si `status === 'available'` et badge vert "Disponible" + `hover:shadow-lg transition`, sinon `opacity-50 cursor-not-allowed pointer-events-none` et badge gris "Bientôt"
- [x] T009 [P] Créer `src/app/plugins/escaliers/page.tsx` — Server Component, `<h1>Calculateur d'escaliers — À venir</h1>` + lien retour accueil avec `Link href="/"`
- [x] T010 Modifier `src/app/page.tsx` — importer `Header`, `Hero`, `PluginCard` et la constante `PLUGINS` (4 plugins du data-model.md), assembler : `<Header />` en haut, `<Hero />`, section `id="plugins" py-24` avec grille `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12` de 4 `<PluginCard />`

**Checkpoint** : Page d'accueil visible à `localhost:3000`. Hero 3D animé avec maisons. Grille de plugins. Navigation vers `/plugins/escaliers` fonctionnelle.

---

## Phase 4 : US2 — Visiteur mobile

**Objectif** : La page est entièrement utilisable à 375px de large. L'animation 3D ne ralentit pas l'appareil.

**Test indépendant** : Ouvrir DevTools → passer en vue 375px. Tous les textes lisibles, boutons cliquables, grille en 1 colonne, animation fluide.

- [x] T011 Modifier `src/components/hero/DottedSurfaceWithHouses.tsx` — ajouter détection mobile dans `useEffect` : si `window.innerWidth < 768` → `AMOUNTX=20, AMOUNTY=30`, et n'afficher que les 2 premières maisons (Maison 1 et Maison 2)
- [x] T012 Vérifier le layout responsive dans `src/app/page.tsx` et `src/components/hero/Hero.tsx` — les boutons CTA passent en `flex-col` sur mobile si nécessaire, le titre `text-6xl` reste lisible, la grille plugins est déjà `grid-cols-1` sur mobile

**Checkpoint** : Vue 375px en DevTools — page lisible, animation réduite (20×30 points, 2 maisons).

---

## Phase 5 : US3 — Changement de thème

**Objectif** : Cliquer sur le toggle thème bascule instantanément entre clair et sombre. Le header, les couleurs, et l'animation Three.js s'adaptent.

**Test indépendant** : Cliquer sur le toggle. La page bascule en dark mode. L'animation Three.js change de couleur (particules claires). Le header en dark mode devient sombre au scroll.

- [x] T013 Modifier `src/components/hero/DottedSurfaceWithHouses.tsx` — lire `useTheme()` pour déterminer la couleur des particules et des maisons wireframe : thème clair → `#000000`, thème sombre → `#c8c8c8` pour les particules; thème clair → couleur primaire sombre (`hsl(217,51%,25%)`), thème sombre → couleur primaire claire (`hsl(217,51%,70%)`) pour les maisons — le `useEffect` doit avoir `theme` dans ses dépendances pour recréer la scène au changement de thème

**Checkpoint** : Cliquer ThemeToggle → page bascule clair/sombre. Animation 3D change de couleur. Header opaque au scroll en dark mode.

---

## Phase 6 : US4 — prefers-reduced-motion

**Objectif** : Si l'utilisateur a activé "réduire les animations" dans son OS, aucune animation Three.js ne se lance.

**Test indépendant** : Activer prefers-reduced-motion dans DevTools (Rendering → Emulate CSS prefers-reduced-motion). Recharger la page. Le hero affiche un dégradé statique sans canvas Three.js.

- [x] T014 Modifier `src/components/hero/DottedSurfaceWithHouses.tsx` — au début du composant, vérifier `window.matchMedia('(prefers-reduced-motion: reduce)').matches` avant de créer la scène Three.js; si `true`, retourner un `<div className="absolute inset-0 bg-gradient-to-br from-construction-primaire/20 to-transparent" />` à la place du canvas

**Checkpoint** : prefers-reduced-motion activé → canvas Three.js absent du DOM, dégradé visible.

---

## Phase 7 : US5 — Navigation vers À propos

**Objectif** : En faisant défiler la page, l'utilisateur voit la section À propos (2 colonnes) et le footer avec l'avertissement légal.

**Test indépendant** : Défiler jusqu'en bas de la page. La section "Conçu pour les constructeurs québécois" est visible avec une image professionnelle. Le footer affiche 3 colonnes et l'avertissement légal.

- [x] T015 Télécharger une image professionnelle via le skill `image` (chercher "Quebec construction worker carpenter" ou "wooden staircase construction worker") et sauvegarder dans `public/images/about-construction.jpg` — format paysage 16:9
- [x] T016 [P] Créer `src/components/layout/Footer.tsx` — `bg-construction-primaire text-white py-12`, 3 colonnes desktop (`grid-cols-1 md:grid-cols-3 gap-8`) : Col1 = logo + description courte, Col2 = liens utiles (Accueil `/`, Calculateur `/plugins/escaliers`, GitHub), Col3 = avertissement légal "Cet outil ne remplace pas la consultation d'un professionnel certifié. L'utilisateur reste responsable de la conformité finale.", bas du footer = "© 2026 William Dorval — Projet scolaire, Cégep de Shawinigan, Veille technologique"
- [x] T017 Ajouter la section À propos dans `src/app/page.tsx` — `py-24 bg-muted/30`, container `max-w-7xl mx-auto px-6`, grille `grid-cols-1 md:grid-cols-2 gap-12 items-center` : col gauche = titre h2 + paragraphe + liste `<Check />` en vert (4 items), col droite = `next/image` sur `about-construction.jpg` `width={800} height={450} className="rounded-2xl shadow-2xl"`
- [x] T018 Ajouter `<Footer />` dans `src/app/page.tsx` (après la section À propos) et câbler le bouton "En savoir plus" du hero pour scroller vers `#plugins`

**Checkpoint** : Défiler la page entière. Section À propos visible avec image. Footer avec 3 colonnes et avertissement légal. Le bouton "En savoir plus" scrolle vers la grille plugins.

---

## Phase 8 : Polish et vérification finale

**Objectif** : Aucune erreur TypeScript, aucun avertissement console, page visuellement cohérente en clair/sombre/mobile.

- [x] T019 [P] Vérifier l'absence d'erreurs TypeScript — dans le terminal : `npx tsc --noEmit`; corriger tous les types incorrects (aucun `any`)
- [x] T020 Vérification visuelle complète à `localhost:3000` : (1) desktop thème clair, (2) desktop thème sombre, (3) vue mobile 375px, (4) prefers-reduced-motion activé — corriger tout problème visuel identifié

---

## Dépendances et ordre d'exécution

### Dépendances entre phases

- **Phase 1 (Setup)** : Aucune dépendance — commencer immédiatement
- **Phase 2 (Fondations)** : Dépend de Phase 1 — BLOQUE toutes les user stories
- **Phase 3 (US1)** : Dépend de Phase 2 — MVP livrable après cette phase
- **Phase 4 (US2)** : Dépend de Phase 3 (modifie `DottedSurfaceWithHouses`)
- **Phase 5 (US3)** : Dépend de Phase 3 (modifie `DottedSurfaceWithHouses`)
- **Phase 6 (US4)** : Dépend de Phase 3 (modifie `DottedSurfaceWithHouses`)
- **Phase 7 (US5)** : Dépend de Phase 3 (`page.tsx` existe déjà)
- **Phase 8 (Polish)** : Dépend de toutes les phases précédentes

### Dépendances dans US1 (Phase 3)

T005 et T006 peuvent démarrer en parallèle après Phase 2.
T007 dépend de T006 (utilise `DottedSurfaceWithHouses`).
T008 et T009 sont indépendants, parallélisables.
T010 dépend de T005, T007, T008 (assemble les composants).

### Opportunités de parallélisation

- T002, T003, T004 (Phase 2) : en parallèle après T001
- T005, T006, T008, T009 (Phase 3) : en parallèle après Phase 2
- T011, T012 (Phase 4) et T013 (Phase 5) et T014 (Phase 6) et T015, T016 (Phase 7) : en parallèle après T010

---

## Exemple de parallélisation — Phase 3 (US1)

```text
Après fin de Phase 2 :
  → T005 Header.tsx                    (indépendant)
  → T006 DottedSurfaceWithHouses.tsx   (indépendant)
  → T008 PluginCard.tsx                (indépendant)
  → T009 plugins/escaliers/page.tsx    (indépendant)

Quand T006 terminé :
  → T007 Hero.tsx

Quand T005 + T007 + T008 terminés :
  → T010 page.tsx (assemblage final)
```

---

## Stratégie d'implémentation

### MVP (US1 seulement — Phases 1 à 3)

1. Phase 1 : Setup — créer répertoires
2. Phase 2 : Fondations — couleurs + ThemeProvider + ThemeToggle
3. Phase 3 : US1 — Hero, plugins, navigation
4. **STOP et VALIDER** : page visible à `localhost:3000`, hero animé, navigation fonctionnelle
5. Commit MVP

### Livraison incrémentale

1. Phases 1+2 → Fondations prêtes
2. Phase 3 → MVP livrable et testable
3. Phase 4 → Mobile optimisé
4. Phases 5+6 → Thème et accessibilité
5. Phase 7 → Page complète avec About + Footer
6. Phase 8 → Finition et commit final

---

## Notes

- `[P]` = fichiers différents, pas de conflit, parallélisable
- `[USn]` = traçabilité vers la user story
- Committer après chaque phase (ou après chaque tâche majeure)
- Tester dans le navigateur après T010 (MVP checkpoint)
- Ne jamais inventer de valeur de norme du Québec dans ce code




