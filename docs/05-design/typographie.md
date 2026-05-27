# Typographie

## Choix de police

Police système via `next/font/google`. Next.js optimise le chargement automatiquement.

Dans `src/app/layout.tsx` :

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

## Tailles (utilisées via Tailwind)

| Usage | Classe Tailwind |
|---|---|
| Petit (mentions légales) | `text-sm` |
| Corps | `text-base` (défaut) |
| Important | `text-lg` |
| Titre de section | `text-2xl font-bold` |
| Titre de page | `text-3xl md:text-4xl font-bold` |
| Titre hero | `text-5xl md:text-7xl font-bold` |

## Police monospace pour les chiffres

Pour les tableaux de résultats du calculateur, utiliser `font-mono` pour aligner les chiffres verticalement.

## Règles générales

- Titres : `font-bold`, interlignage `leading-tight`
- Corps : `font-normal`, interlignage `leading-relaxed`
- Labels de formulaire : `font-medium` (shadcn le fait automatiquement avec `<Label>`)
