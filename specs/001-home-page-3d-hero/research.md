# Research: Page d'accueil — Hero 3D

**Feature**: `specs/001-home-page-3d-hero/spec.md`
**Date**: 2026-05-27

## Décisions techniques

### 1. Séparation DottedSurface existant vs nouveau composant

**Décision** : Créer un nouveau composant `DottedSurfaceWithHouses.tsx` plutôt que de modifier `dotted-surface.tsx`.

**Justification** :
- `dotted-surface.tsx` est un composant UI générique réutilisable — le modifier pour y ajouter des maisons le rendrait moins réutilisable
- `DottedSurfaceWithHouses.tsx` est spécifique au hero de la home page — logique de séparation des responsabilités
- Si une autre page veut le terrain sans maisons, `DottedSurface` reste intact

**Alternatives rejetées** : Modifier `dotted-surface.tsx` directement → couplage non voulu entre composant générique et page spécifique.

---

### 2. Gestion du thème dans Three.js

**Décision** : Utiliser le hook `useTheme` de `next-themes` pour lire le thème courant, et recréer la scène Three.js via la dépendance `[theme]` dans `useEffect`.

**Justification** : Le pattern existant dans `dotted-surface.tsx` fait déjà ceci. On réutilise la même approche pour la cohérence.

**Alternative rejetée** : Modifier dynamiquement les matériaux Three.js sans recréer la scène → plus complexe, risques de fuite mémoire.

---

### 3. Header transparent → opaque au scroll

**Décision** : Utiliser un `useEffect` + `window.addEventListener('scroll', ...)` pour ajouter/retirer une classe CSS selon `window.scrollY > 50`.

**Justification** : Solution légère, pas de dépendance supplémentaire, compatible SSR (l'effet ne s'exécute que côté client).

**Alternative rejetée** : Framer Motion → dépendance non installée, overkill pour cet effet.

---

### 4. Image de la section À propos

**Décision** : Télécharger une image via le skill `image` au moment de l'implémentation, sauvegarder dans `public/images/about-construction.jpg`, utiliser `next/image` avec `width={800} height={450}` (format 16:9).

**Justification** : Spécifié dans FR-007 de la spec. next/image assure l'optimisation automatique.

**Alternative rejetée** : URL Unsplash directe dans le code → dépendance externe fragile, pas de contrôle sur l'image.

---

### 5. Composant PluginCard — actif vs désactivé

**Décision** : Prop `disabled?: boolean`. Quand `disabled=true` : `opacity-50 cursor-not-allowed pointer-events-none`. Quand `disabled=false` : composant cliquable avec `Link` de Next.js.

**Justification** : Interface simple, un seul composant, comportement contrôlé par prop.

---

### 6. Maisons 3D — `ConeGeometry` pour le toit

**Décision** : `ConeGeometry(55, 70, 4)` — rayon 55 (base 110 de diamètre), hauteur 70, 4 segments (carré = toit de maison).

**Justification** : Les paramètres de spec indiquent "base 110 unités". `ConeGeometry` prend le rayon (donc 110/2 = 55). 4 segments → toit en forme de pyramide carrée, visuellement reconnaissable comme toit de maison.

---

## Aucun NEEDS CLARIFICATION

Toutes les dépendances sont installées. Tous les choix techniques sont documentés ci-dessus.
