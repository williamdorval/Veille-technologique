# Structure modulaire pour plugins

## Objectif

La plateforme doit pouvoir accueillir de nouveaux plugins sans qu'on ait à modifier le code existant.

## Approche Next.js

Chaque plugin = un dossier sous `src/app/plugins/`. Next.js App Router fait que la route est automatique.

```
src/app/plugins/
└── escaliers/
    └── page.tsx     ← devient l'URL /plugins/escaliers
```

## Registre des plugins

Un fichier `src/lib/plugins-registry.ts` contient la liste des plugins disponibles :

```ts
export type Plugin = {
  id: string;
  nom: string;
  description: string;
  chemin: string;
  disponible: boolean;
  icone?: string;
};

export const plugins: Plugin[] = [
  {
    id: 'escaliers',
    nom: "Calculateur d'escaliers",
    description: "Calcule les dimensions, les matériaux et le plan de construction d'un escalier conforme aux normes du Québec.",
    chemin: '/plugins/escaliers',
    disponible: true,
  },
  {
    id: 'rampes',
    nom: 'Rampes et garde-corps',
    description: "Calculs et matériaux pour rampes conformes aux normes.",
    chemin: '/plugins/rampes',
    disponible: false,
  },
];
```

La page d'accueil importe ce registre et génère les cartes automatiquement.

## Comment ajouter un nouveau plugin plus tard

1. Créer `src/app/plugins/<id>/page.tsx`
2. Créer les composants nécessaires dans `src/components/plugins/<id>/`
3. Créer la logique métier dans `src/lib/<id>/`
4. Ajouter une entrée dans `src/lib/plugins-registry.ts`
5. Documenter dans `docs/03-mvp/` (ou nouvelle section)
