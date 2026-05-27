# Palette de couleurs

## Approche — Tailwind v4 avec @theme

Avec Tailwind v4, on ne déclare plus les couleurs custom dans `tailwind.config.ts`. Tout se passe dans `src/app/globals.css` via la directive `@theme`.

## Variables (dans `src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Couleurs construction custom */
  --color-construction-primaire: oklch(0.28 0.07 250);   /* bleu industriel sombre */
  --color-construction-accent: oklch(0.78 0.17 82);       /* jaune chantier */
  --color-construction-succes: oklch(0.45 0.12 142);      /* conformité OK */
  --color-construction-attention: oklch(0.55 0.14 52);    /* limite */
  --color-construction-erreur: oklch(0.50 0.18 25);       /* non conforme */
}
```

Ces variables génèrent automatiquement les classes Tailwind `bg-construction-primaire`, `text-construction-accent`, etc.

## Variables shadcn (déjà dans globals.css après shadcn init)

shadcn utilise ses propres CSS variables pour les thèmes clair/sombre. Ne pas toucher aux variables `--background`, `--foreground`, `--card`, `--primary`, etc. — elles sont gérées par shadcn.

Pour les éléments shadcn, utiliser les classes `bg-primary`, `text-muted-foreground`, `border`, etc.

## Usage en pratique

```tsx
// Fond construction personnalisé
<div className="bg-construction-primaire text-white" />

// Badge conforme
<Badge className="bg-construction-succes text-white">Conforme</Badge>

// Badge non conforme
<Badge className="bg-construction-erreur text-white">Non conforme</Badge>

// Bouton shadcn standard (utilise les vars shadcn)
<Button variant="default">Calculer</Button>
```

## Résumé

| Variable | Couleur | Usage |
|---|---|---|
| `construction-primaire` | Bleu industriel | Headers, titres principaux |
| `construction-accent` | Jaune chantier | CTA, boutons d'action |
| `construction-succes` | Vert | Résultats conformes |
| `construction-attention` | Orange | Résultats limites |
| `construction-erreur` | Rouge | Résultats non conformes |
