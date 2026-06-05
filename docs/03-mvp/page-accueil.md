# Page d'accueil

## Objectif

Présenter la plateforme et donner accès aux plugins. C'est le point d'entrée du site.

## Sections de la page

### 1. Hero (en haut)

- **Effet 3D Three.js en arrière-plan** :
  - Terrain en grille de points qui ondule (inspiration : composant DottedSurface)
  - Par-dessus le terrain : 3 à 6 cubes 3D simples qui flottent et tournent doucement, représentant des maisons stylisées en construction
  - Couleurs : bleu industriel sombre (points et cubes) + jaune chantier (accents)
  - Mobile : densité de points réduite, désactivable si performance trop faible
  - Animation SUBTILE — l'utilisateur lit le contenu par-dessus

#### Comment le mouvement fonctionne

L'animation repose sur deux mécanismes simples — pas de vecteurs ni de matrices complexes.

**1. La grille de points ondulante (terrain)**

Les points sont placés sur une grille de 40 × 60 cases, séparées de 150 px. À chaque image, la hauteur Y de chaque point est recalculée avec une **formule sinus** :

```js
Y = sin((colonne + compteur) × 0.3) × 50 + sin((ligne + compteur) × 0.5) × 50
```

- `sin()` produit une valeur qui oscille entre −1 et +1 → multipliée par 50, ça donne une montée/descente de 50 px
- Deux sinus superposés (un par axe X, un par axe Z) créent un effet de vague croisée
- `compteur` augmente de 0.1 à chaque image → la vague se déplace dans le temps

**2. Les maisons flottantes**

Chaque maison a sa propre formule sinus pour monter et descendre :

```js
Y = positionBase + sin(compteur × 0.5 + décalagePhase) × 20
```

Le `décalagePhase` est différent pour chaque maison (0, 1.5, 3.0, 4.5) → elles ne bougent pas toutes en même temps, l'effet est plus naturel. Elles tournent aussi lentement sur elles-mêmes (`rotation.y += 0.005` à chaque image).

**La boucle d'animation**

Tout ça tourne grâce à `requestAnimationFrame` — la fonction que le navigateur appelle environ 60 fois par seconde. Sur mobile, la densité est réduite (20 × 30 points, 2 maisons seulement) pour préserver les performances.

- **Titre principal :** « Plateforme constructeurs »
- **Sous-titre :** « Des outils pour construire selon les normes du Québec »
- **CTA principal :** « Ouvrir le calculateur d'escaliers »
- **Toggle thème clair/sombre** en haut à droite

### 2. Section « Plugins disponibles »

- Grille de cartes shadcn (`Card`)
- Pour le MVP : 1 carte « Calculateur d'escaliers » + 2-3 cartes « Bientôt » en grisé (rampes, planchers, etc.)
- Chaque carte cliquable mène au plugin

### 3. Section « À propos »

- Court paragraphe sur la mission de la plateforme
- Photo professionnelle d'un chantier ou d'un charpentier au travail (utiliser le skill `image` si disponible, sinon Unsplash en placeholder)

### 4. Footer

- Avertissement professionnel certifié
- Lien GitHub du projet
- Mention du projet scolaire (Veille technologique, Cégep de Shawinigan)

## Composants à créer

- `src/components/hero/Hero.tsx` — section hero avec titre + CTA
- `src/components/hero/DottedSurface.tsx` — effet 3D Three.js (adapté du composant de référence)
- `src/components/layout/Header.tsx` — header avec toggle thème
- `src/components/layout/Footer.tsx` — footer avec avertissement
- `src/components/PluginCard.tsx` — carte d'un plugin disponible
- `src/app/page.tsx` — composition de tout ça
