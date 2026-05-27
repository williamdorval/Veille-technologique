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
