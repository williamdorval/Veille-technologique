# UI Contracts: Page d'accueil — Hero 3D

**Feature**: `specs/001-home-page-3d-hero/spec.md`
**Date**: 2026-05-27

## Composants et leurs contrats

### `<Header />`
**Fichier** : `src/components/layout/Header.tsx`
**Type** : Client Component (`'use client'`)

| Prop | Type | Description |
|------|------|-------------|
| _(aucune)_ | — | Composant autonome, lit le thème via useTheme |

**Comportement** :
- Transparent par défaut (`bg-transparent`)
- Devient `bg-white/90 dark:bg-zinc-900/90 backdrop-blur` quand `scrollY > 50`
- Contient `<ThemeToggle />`
- Logo : icône `Hammer` + texte "Plateforme constructeurs"

---

### `<ThemeToggle />`
**Fichier** : `src/components/ThemeToggle.tsx`
**Type** : Client Component (`'use client'`)

| Prop | Type | Description |
|------|------|-------------|
| _(aucune)_ | — | Lit/écrit le thème via useTheme |

**Comportement** :
- Affiche `<Sun />` quand thème = `dark`
- Affiche `<Moon />` quand thème = `light`
- Clic → bascule entre `light` et `dark`

---

### `<DottedSurfaceWithHouses />`
**Fichier** : `src/components/hero/DottedSurfaceWithHouses.tsx`
**Type** : Client Component (`'use client'`)

| Prop | Type | Description |
|------|------|-------------|
| `className?` | `string` | Classes CSS additionnelles |

**Comportement** :
- Hérite de la logique de `DottedSurface` (terrain de particules ondulantes)
- Ajoute 4 maisons 3D (2 sur mobile < 768px)
- Si `prefers-reduced-motion` → rendu statique (`<div>` avec dégradé)
- S'adapte au thème clair/sombre

---

### `<Hero />`
**Fichier** : `src/components/hero/Hero.tsx`
**Type** : Server Component (pas d'interactivité directe)

| Prop | Type | Description |
|------|------|-------------|
| _(aucune)_ | — | Assemblage statique |

**Comportement** :
- Contient `<DottedSurfaceWithHouses />` en `absolute inset-0`
- Contenu centré : titre + sous-titre + 2 boutons CTA
- `h-screen relative overflow-hidden`

---

### `<PluginCard />`
**Fichier** : `src/components/PluginCard.tsx`
**Type** : Server Component

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `React.ElementType` | Icône lucide-react |
| `title` | `string` | Nom du plugin |
| `description` | `string` | Description courte |
| `status` | `'available' \| 'coming-soon'` | Détermine l'état visuel |
| `href?` | `string` | URL de destination (requis si `available`) |

**Comportement** :
- `available` → Card cliquable avec `hover:shadow-lg`, badge vert "Disponible"
- `coming-soon` → Card `opacity-50 cursor-not-allowed pointer-events-none`, badge gris "Bientôt"

---

### `<Footer />`
**Fichier** : `src/components/layout/Footer.tsx`
**Type** : Server Component

| Prop | Type | Description |
|------|------|-------------|
| _(aucune)_ | — | Contenu statique |

**Comportement** :
- `bg-construction-primaire text-white`
- 3 colonnes sur desktop, 1 colonne sur mobile
- Col 3 : avertissement légal obligatoire

---

## Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `src/app/page.tsx` | Home page complète |
| `/plugins/escaliers` | `src/app/plugins/escaliers/page.tsx` | Placeholder escaliers |
