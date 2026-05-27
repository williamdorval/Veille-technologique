# Implementation Plan: Page d'accueil — Hero 3D

**Branch**: `001-home-page-3d-hero` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: `specs/001-home-page-3d-hero/spec.md`

## Summary

Construire la page d'accueil complète de la Plateforme constructeurs : header fixe avec toggle thème, hero plein écran Three.js (terrain de particules + 4 maisons flottantes), grille de plugins, section À propos, et footer. Tous les composants sont des Client ou Server Components Next.js selon besoin, en TypeScript strict, stylés avec Tailwind v4 + shadcn/ui.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)

**Primary Dependencies**: Next.js 16.2.6 (App Router), React 19, Three.js ^0.184, next-themes ^0.4.6, shadcn/ui (Button, Card, Badge), lucide-react, Tailwind CSS v4

**Storage**: N/A — tout côté client, aucune persistance

**Testing**: Vérification visuelle dans le navigateur (npm run dev → localhost:3000)

**Target Platform**: Web — navigateurs modernes (Chrome, Firefox, Safari, Edge dernières 2 versions), mobile 375px+

**Project Type**: Application web — Next.js App Router, rendu hybride (Server Components par défaut, Client Components pour Three.js et interactivité)

**Performance Goals**: Page visible en < 3s sur 4G, animation fluide 60fps desktop, pas de ralentissement mobile

**Constraints**: Composants Three.js = `'use client'` obligatoire. `prefers-reduced-motion` → dégradé statique. Mobile < 768px → densité réduite (20×30) + 2 maisons seulement.

**Scale/Scope**: Page unique avec 7 composants + 1 page placeholder + 1 image

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitution SpecKit du projet est un template vide (non rempli). Le CLAUDE.md définit les règles applicables :

- ✅ TypeScript strict — aucun `any`
- ✅ Pas de secret en dur dans le code
- ✅ Aucune valeur de norme du Québec dans ce code
- ✅ `'use client'` uniquement quand nécessaire (Three.js + next-themes)
- ✅ Logique métier séparée des composants UI
- ✅ Mobile-first systématique

**Résultat : PASS. Aucune violation.**

## Project Structure

### Documentation (this feature)

```text
specs/001-home-page-3d-hero/
├── plan.md              ← ce fichier
├── research.md          ← Phase 0
├── data-model.md        ← Phase 1
├── contracts/
│   └── components.md   ← Phase 1 (contrats UI)
└── tasks.md             ← Phase 2 (/speckit-tasks)
```

### Source Code

```text
src/
├── app/
│   ├── layout.tsx                          ← MODIFIER: ThemeProvider + metadata
│   ├── page.tsx                            ← MODIFIER: assemblage home complète
│   ├── globals.css                         ← MODIFIER: @theme couleurs construction
│   └── plugins/
│       └── escaliers/
│           └── page.tsx                   ← CRÉER: placeholder simple
├── components/
│   ├── ui/
│   │   └── dotted-surface.tsx             ← EXISTANT (ne pas modifier)
│   ├── layout/
│   │   ├── Header.tsx                     ← CRÉER: header fixe + ThemeToggle
│   │   └── Footer.tsx                     ← CRÉER: footer 3 colonnes
│   ├── hero/
│   │   ├── Hero.tsx                       ← CRÉER: section hero assemblée
│   │   └── DottedSurfaceWithHouses.tsx    ← CRÉER: Three.js terrain + maisons
│   ├── PluginCard.tsx                     ← CRÉER: carte plugin (active/désactivée)
│   └── ThemeToggle.tsx                    ← CRÉER: bouton clair/sombre

public/
└── images/
    └── about-construction.jpg             ← TÉLÉCHARGER via skill image
```

**Structure Decision**: Application web Next.js App Router, src-dir layout. Composants organisés par domaine (layout/, hero/). Pas de backend ni tests automatisés pour le MVP.

## Complexity Tracking

Aucune violation de constitution — section non applicable.

## Ordre d'implémentation

1. `globals.css` — couleurs @theme (base de tout le design)
2. `layout.tsx` — ThemeProvider (requis pour next-themes partout)
3. `ThemeToggle.tsx` — bouton thème (composant feuille)
4. `Header.tsx` — utilise ThemeToggle
5. `Footer.tsx` — composant autonome
6. `DottedSurfaceWithHouses.tsx` — Three.js terrain + maisons
7. `Hero.tsx` — utilise DottedSurfaceWithHouses
8. `PluginCard.tsx` — composant feuille shadcn
9. `page.tsx` — assemble tous les composants
10. `plugins/escaliers/page.tsx` — placeholder simple
11. Image `about-construction.jpg` — télécharger dans public/images/
