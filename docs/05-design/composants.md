# Composants UI (shadcn)

## Composants shadcn installés

Déjà dans `src/components/ui/` :

- `button` — boutons principaux et secondaires
- `card` — cartes (utilisées pour les résultats du calculateur)
- `input` — champs texte
- `label` — étiquettes des champs
- `select` — listes déroulantes
- `separator` — séparateurs visuels
- `badge` — badges (indicateurs de conformité)
- `alert` — alertes (avertissement professionnel certifié)

À ajouter lors de l'implémentation si nécessaire :
- `form` — gestion de formulaire avec validation (`npx shadcn@latest add form`)

## Composants custom à créer

### Hero (page d'accueil)

`src/components/hero/Hero.tsx` :
- Wrap dans une `<section className="relative h-screen">`
- `DottedSurface` en background absolu
- Contenu (titre, sous-titre, CTA) centré par-dessus

`src/components/hero/DottedSurface.tsx` :
- Utilise Three.js pour la grille de points + maisons cubes
- `'use client'` obligatoire (Three.js ne fonctionne que côté client)
- Respect du `useTheme` de next-themes pour adapter les couleurs clair/sombre

### PluginCard

`src/components/PluginCard.tsx` :
- Wrap autour de `Card` shadcn
- Si `disponible: false`, ajouter `opacity-50 cursor-not-allowed`
- Cliquable seulement si disponible

### ResultatConformite (plugin escaliers)

`src/components/plugins/escaliers/ResultatConformite.tsx` :
- `Badge` shadcn avec className selon état :
  - `bg-construction-succes text-white` si conforme
  - `bg-construction-attention text-white` si limite
  - `bg-construction-erreur text-white` si non conforme
- Au clic, ouvre un panneau qui cite la norme

### ListeMateriaux (plugin escaliers)

`src/components/plugins/escaliers/ListeMateriaux.tsx` :
- Tableau structuré par catégorie : Bois, Quincaillerie, Accessoires
- Chaque ligne : nom du matériau + dimensions + quantité

### PlanConstruction (plugin escaliers, P2)

`src/components/plugins/escaliers/PlanConstruction.tsx` :
- Liste numérotée d'étapes
- Chaque étape avec icône + texte simple
- Possibilité de cocher les étapes complétées (state local React)
