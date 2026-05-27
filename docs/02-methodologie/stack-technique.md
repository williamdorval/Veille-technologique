# Stack technique

Cette page explique CHAQUE technologie utilisée dans le projet, en mots simples.

## Next.js

**C'est quoi :** un framework pour faire des sites web modernes avec React. Il gère automatiquement les pages, le routage, l'optimisation des images, etc.

**Pourquoi on l'utilise :** parce qu'il rend la création d'un site React beaucoup plus facile que de tout configurer à la main.

**Comment ça se présente :** on écrit des fichiers `page.tsx` dans le dossier `src/app/`. Chaque dossier devient automatiquement une URL. Exemple : `src/app/plugins/escaliers/page.tsx` devient l'URL `/plugins/escaliers`.

## React

**C'est quoi :** une bibliothèque JavaScript pour construire des interfaces utilisateur en composants réutilisables.

**Pourquoi on l'utilise :** c'est le standard de l'industrie. Permet de séparer l'UI en petits morceaux (composants) qu'on peut combiner.

**Exemple de composant :**
```tsx
function Bouton({ texte }: { texte: string }) {
  return <button>{texte}</button>
}
```

## TypeScript

**C'est quoi :** du JavaScript avec des types. On écrit du code presque identique mais on précise le type de chaque variable.

**Pourquoi on l'utilise :** ça évite des bugs. Si on essaie de mettre un nombre où on attend du texte, TypeScript nous le dit avant même de lancer l'app.

**Exemple :**
```ts
function ajouter(a: number, b: number): number {
  return a + b
}
```

## Tailwind CSS v4

**C'est quoi :** une bibliothèque de styles CSS où on utilise des classes utilitaires directement dans le HTML.

**Pourquoi on l'utilise :** beaucoup plus rapide qu'écrire du CSS à la main. On garde le style près du code qui l'utilise.

**Note v4 :** on déclare les couleurs custom directement dans `globals.css` avec `@theme` (pas de fichier `tailwind.config.ts` nécessaire).

**Exemple :**
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Bonjour
</div>
```

## shadcn/ui

**C'est quoi :** une collection de composants React déjà stylés (Button, Card, Input, etc.) qu'on copie dans notre projet.

**Pourquoi on l'utilise :** on a une UI propre et professionnelle sans la coder soi-même. On peut modifier les composants comme on veut puisqu'ils sont dans notre projet.

**Comment on ajoute un composant :**
```bash
npx shadcn@latest add button
```

## Three.js

**C'est quoi :** une bibliothèque pour faire de la 3D dans le navigateur.

**Pourquoi on l'utilise :** pour l'effet hero 3D de la page d'accueil (terrain qui ondule + maisons stylisées qui flottent).

## next-themes

**C'est quoi :** un petit outil pour gérer le thème clair/sombre.

**Pourquoi on l'utilise :** plusieurs constructeurs travaillent en chantier en plein soleil ou dans des sous-sols sombres — pouvoir basculer entre thèmes est utile.
