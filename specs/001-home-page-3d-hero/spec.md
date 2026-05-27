# Feature Specification: Page d'accueil — Hero 3D et présentation de la plateforme

## Summary

Créer la page d'accueil complète de la Plateforme constructeurs. La page présente la plateforme aux constructeurs québécois via un hero plein écran animé en 3D, une grille de plugins disponibles, une section À propos, et un footer. L'objectif est d'offrir une première impression professionnelle et de guider les utilisateurs vers le calculateur d'escaliers.

## Problem Statement

Actuellement, la page d'accueil affiche le boilerplate par défaut de Next.js, qui ne représente pas le projet et ne permet pas aux utilisateurs de comprendre ce qu'est la Plateforme constructeurs ni d'accéder aux outils disponibles.

## Goals

- Présenter clairement la Plateforme constructeurs dès la première visite
- Guider les utilisateurs vers le calculateur d'escaliers (seul plugin disponible dans le MVP)
- Offrir une expérience visuelle mémorable et professionnelle grâce à l'animation 3D
- Supporter les thèmes clair et sombre
- Être entièrement utilisable sur mobile (375px et plus)

## Out of Scope

- Implémentation du calculateur d'escaliers (plugin escaliers = placeholder seulement)
- Authentification ou comptes utilisateurs
- Traitement de données côté serveur
- Intégration des normes du Québec (Tranche 2+)
- Plugins autres que l'escaliers (cartes grises / désactivées)

## User Scenarios

### Scénario 1 — Premier visiteur sur desktop
Un charpentier ouvre le site pour la première fois. Il voit immédiatement le hero animé avec le titre "Plateforme constructeurs" et deux boutons d'action. Il clique sur "Ouvrir le calculateur d'escaliers" et est redirigé vers la page du plugin (placeholder pour l'instant).

### Scénario 2 — Visiteur mobile
Un entrepreneur consulte le site sur son téléphone. La page s'affiche correctement à 375px de large, les boutons sont facilement cliquables, et l'animation 3D est simplifiée (moins de points) pour ne pas ralentir l'appareil.

### Scénario 3 — Changement de thème
Un utilisateur préfère le thème sombre. Il clique sur le bouton de bascule thème dans le header. Le site bascule immédiatement entre clair et sombre, et les couleurs de l'animation 3D s'adaptent.

### Scénario 4 — Utilisateur avec prefers-reduced-motion
Un utilisateur ayant activé "réduire les animations" dans son système d'exploitation charge la page. L'animation Three.js ne se lance pas ; un fond dégradé statique s'affiche à la place du hero animé.

### Scénario 5 — Navigation vers À propos
Un visiteur curieux fait défiler la page. Il lit la section À propos, voit la liste des avantages de la plateforme, et consulte le footer avec l'avertissement légal.

## Functional Requirements

### FR-001 — Header fixe avec logo et toggle thème
Le header est visible en permanence en haut de l'écran. Au-dessus du hero, il est transparent. Lorsque l'utilisateur fait défiler la page vers le bas, le header devient opaque (fond blanc en thème clair, fond sombre en thème sombre). Le logo affiche une icône de marteau et le texte "Plateforme constructeurs". Le toggle thème bascule entre icône Soleil (thème sombre actif) et icône Lune (thème clair actif).

### FR-002 — Hero plein écran avec animation 3D
Le hero occupe toute la hauteur de la fenêtre. Un fond animé Three.js affiche une surface de points ondulants (terrain de particules), avec 4 maisons stylisées 3D qui flottent et pivotent lentement. Le contenu central du hero (titre, sous-titre, boutons) reste lisible par-dessus l'animation.

### FR-003 — Densité réduite sur mobile
Sur les écrans inférieurs à 768px de largeur, la grille de particules est réduite de 40×60 à 20×30 afin de préserver les performances sur appareils mobiles.

### FR-004 — Désactivation de l'animation si prefers-reduced-motion
Si la préférence système "réduire les animations" est active, l'animation Three.js ne se lance pas. Un dégradé statique est affiché à la place.

### FR-005 — Titre, sous-titre et boutons d'action dans le hero
Au centre du hero : titre principal "Plateforme constructeurs", sous-titre "Des outils pour construire selon les normes du Québec", et deux boutons côte à côte. Le premier bouton ("Ouvrir le calculateur d'escaliers") est le CTA principal et mène à `/plugins/escaliers`. Le deuxième bouton ("En savoir plus") fait défiler la page vers la section plugins.

### FR-006 — Section plugins avec grille de cartes
La section "Nos outils" affiche une grille responsive de 4 cartes. La carte "Calculateur d'escaliers" est active : elle est cliquable, mène à `/plugins/escaliers`, affiche un badge "Disponible" en vert, et a un effet de survol. Les 3 autres cartes (Rampes et garde-corps, Calcul de plancher, Estimation de toiture) sont désactivées visuellement et non cliquables.

### FR-007 — Section À propos en deux colonnes
La section À propos présente la plateforme dans un layout deux colonnes sur desktop (une colonne sur mobile). La colonne gauche contient le titre, un paragraphe de présentation, et une liste à puces avec icônes. La colonne droite affiche une image professionnelle de construction.

L'image professionnelle doit être obtenue via le skill `image` disponible dans cette session, en cherchant des termes comme "Quebec construction worker carpenter" ou "wooden staircase construction". L'image téléchargée est sauvegardée dans `public/images/about-construction.jpg`. Format paysage 16:9 préféré. Si le skill image n'est pas disponible au moment de l'implémentation, utiliser une image Unsplash via leur API source (https://source.unsplash.com/) avec une recherche similaire.

### FR-008 — Footer avec avertissement légal
Le footer sur fond bleu industriel affiche trois colonnes sur desktop : logo et description courte, liens utiles (Accueil, Calculateur, GitHub), et un avertissement légal indiquant que l'outil ne remplace pas un professionnel certifié. En bas du footer : mention de copyright avec nom de l'étudiant et nom du cours.

### FR-009 — Placeholder page escaliers
La route `/plugins/escaliers` affiche une page simple indiquant que le calculateur est en cours de développement, avec un lien de retour vers l'accueil.

### FR-010 — Variables de couleur construction
Les couleurs de la plateforme sont définies comme variables globales accessibles via les classes Tailwind : bleu industriel (primaire), jaune chantier (accent), vert succès, couleurs d'attention et d'erreur. Ces couleurs sont adaptées pour le thème sombre.

Valeurs HSL exactes à utiliser dans la feuille de styles globale :

| Variable | Thème clair | Thème sombre |
|---|---|---|
| --construction-primaire | hsl(217 51% 25%) — bleu industriel sombre | hsl(217 51% 70%) — ajusté pour lisibilité |
| --construction-accent | hsl(44 96% 49%) — jaune chantier | hsl(44 96% 60%) |
| --construction-succes | hsl(142 50% 33%) — vert validation | (identique) |
| --construction-attention | hsl(32 100% 39%) — orange limite | (identique) |
| --construction-erreur | hsl(7 64% 46%) — rouge non-conformité | (identique) |

### FR-011 — Maisons 3D : spécifications détaillées
Exactement 4 maisons stylisées sont superposées au terrain de particules du hero.

**Géométrie de chaque maison** :
- Corps : cube de base (80 unités de côté)
- Toit : cône à 4 segments (base 110 unités, hauteur 70 unités), positionné au-dessus du cube

**Matériau** : wireframe, couleur adaptée selon le thème (primaire clair en thème clair, primaire sombre en thème sombre)

**Positions initiales** (coordonnées X, Y, Z dans l'espace Three.js) :
- Maison 1 : x = -600, y = 180, z = -400
- Maison 2 : x = 500, y = 120, z = -300
- Maison 3 : x = -300, y = 240, z = 400
- Maison 4 : x = 700, y = 150, z = 200

**Animation rotation** : axe Y uniquement, vitesse 0,005 radians/frame (rotation lente)

**Animation flottement** : oscillation verticale sinusoïdale, amplitude ±20 unités, déphasage différent par maison — `Math.sin(count * 0.5 + phaseOffset) * 20`

**Performance mobile** : si la largeur d'écran est inférieure à 768px, afficher uniquement les 2 premières maisons (Maison 1 et Maison 2)

## Non-Functional Requirements

- **Performance** : La page doit afficher le contenu principal en moins de 3 secondes sur une connexion 4G standard
- **Accessibilité** : Contraste minimum WCAG AA pour tous les textes. Respect de prefers-reduced-motion.
- **Compatibilité** : Fonctionne sur les navigateurs modernes (Chrome, Firefox, Safari, Edge — dernières 2 versions)
- **Mobile-first** : Layout fonctionnel et lisible à partir de 375px de largeur

## Success Criteria

- Un visiteur comprend en moins de 5 secondes ce qu'est la plateforme et peut trouver le calculateur d'escaliers sans hésitation
- La page s'affiche sans erreur en thème clair et en thème sombre
- La page est entièrement fonctionnelle sur un écran de 375px de large
- L'animation 3D ne provoque pas de ralentissement notable sur un iPhone récent
- L'animation ne se lance pas si prefers-reduced-motion est activé
- Le footer affiche l'avertissement légal clairement visible

## Key Entities

| Entité | Description |
|--------|-------------|
| Header | Barre de navigation fixe avec logo et toggle thème |
| Hero | Section plein écran avec fond 3D animé et contenu centré |
| DottedSurface | Composant Three.js existant — terrain de particules ondulantes |
| MaisonsFlottantes | Nouvelles formes 3D (cube + toit pyramidal) superposées au DottedSurface |
| PluginCard | Composant de carte réutilisable pour présenter un plugin (actif ou désactivé) |
| SectionPlugins | Grille de 4 PluginCard |
| SectionAPropos | Présentation en 2 colonnes avec image |
| Footer | Pied de page avec 3 colonnes et avertissement légal |
| ThemeToggle | Bouton de bascule clair/sombre utilisant next-themes |

## Assumptions

- Le composant `DottedSurface` (`src/components/ui/dotted-surface.tsx`) est déjà créé et fonctionnel
- `next-themes`, `three`, `@types/three`, `lucide-react` sont déjà installés dans le projet
- Les composants shadcn `Button`, `Card`, `Badge` sont déjà installés
- L'image de la section À propos sera une image libre de droits téléchargée dans `public/images/`
- Le plugin escaliers n'est PAS implémenté — la page `/plugins/escaliers` est un simple placeholder
- Aucune valeur de norme du Québec n'apparaît dans ce code

## Dependencies

- `src/components/ui/dotted-surface.tsx` — doit exister avant l'implémentation du hero
- `next-themes` — ThemeProvider installé dans `layout.tsx`
- shadcn/ui Button, Card, Badge — déjà installés via `npx shadcn@latest add`
- lucide-react — déjà disponible via shadcn/ui
