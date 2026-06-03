# Data Model: Page d'accueil — Hero 3D

**Feature**: `specs/001-home-page-3d-hero/spec.md`
**Date**: 2026-05-27

## Entités et types TypeScript

Pas de modèle de données persistant (tout côté client). Les types suivants définissent les interfaces des composants.

---

### PluginCard

```ts
type PluginStatus = 'available' | 'coming-soon';

interface PluginCardProps {
  icon: React.ElementType;   // Composant icône lucide-react
  title: string;
  description: string;
  status: PluginStatus;
  href?: string;             // Requis si status === 'available'
}
```

---

### Maison 3D (interne à DottedSurfaceWithHouses)

```ts
interface HouseConfig {
  position: { x: number; y: number; z: number };
  phaseOffset: number;  // déphasage du flottement sinusoïdal
}

const HOUSES: HouseConfig[] = [
  { position: { x: -600, y: 180, z: -400 }, phaseOffset: 0 },
  { position: { x:  500, y: 120, z: -300 }, phaseOffset: 1.5 },
  { position: { x: -300, y: 240, z:  400 }, phaseOffset: 3.0 },
  { position: { x:  700, y: 150, z:  200 }, phaseOffset: 4.5 },
];
```

---

### ThemeToggle (état géré par next-themes)

Pas de state local — le thème est lu et modifié via `useTheme()` de next-themes. Aucun type personnalisé requis.

---

### Header (état scroll)

```ts
// État interne uniquement, pas de prop
const [isScrolled, setIsScrolled] = useState(false);
// isScrolled = true quand window.scrollY > 50
```

---

## Données statiques (plugins)

Les 4 plugins sont définis comme constante dans `page.tsx` ou `PluginCard` :

```ts
const PLUGINS = [
  {
    icon: Stairs,          // ou Construction selon disponibilité lucide
    title: 'Calculateur d\'escaliers',
    description: 'Calcule les dimensions, les matériaux et le plan de construction d\'un escalier conforme aux normes du Québec.',
    status: 'available' as const,
    href: '/plugins/escaliers',
  },
  {
    icon: Fence,
    title: 'Rampes et garde-corps',
    description: 'Calcul des dimensions de rampes et garde-corps conformes.',
    status: 'coming-soon' as const,
  },
  {
    icon: Square,
    title: 'Calcul de plancher',
    description: 'Dimensionnement des solives et poutres de plancher.',
    status: 'coming-soon' as const,
  },
  {
    icon: Triangle,
    title: 'Estimation de toiture',
    description: 'Calcul de la surface et des matériaux de toiture.',
    status: 'coming-soon' as const,
  },
];
```
