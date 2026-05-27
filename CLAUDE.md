# CLAUDE.md — Contexte du projet

Ce fichier donne à Claude Code tout le contexte du projet. Claude Code le lit en premier à chaque session.

## Identité du projet

- **Nom :** Plateforme web d'aide aux constructeurs
- **Étudiant :** William Dorval
- **Cours :** Veille technologique (420-1SH-SW) — Cégep de Shawinigan
- **Volet :** 1 — Specification Driven Development
- **Description courte :** Site web modulaire qui regroupe des outils pour les constructeurs québécois. Premier plugin du MVP : un calculateur d'escaliers complet (dimensions + matériaux + plan de construction) conforme aux normes du Québec.

## Stack technique

| Catégorie | Choix |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Composants | shadcn/ui |
| Animations | CSS Tailwind + Three.js pour le hero 3D |
| Thème | next-themes (clair/sombre) |
| Lint | aucun (volontairement simple) |

## Méthode de travail : Specification Driven Development (SDD) avec SpecKit

Le projet utilise SpecKit de GitHub. Le workflow officiel est :

1. **Spec** (`/speckit.specify`) — Définir ce qui doit être construit
2. **Plan** (`/speckit.plan`) — Transformer la spec en architecture
3. **Tasks** (`/speckit.tasks`) — Découper en tâches concrètes
4. **Implement** (`/speckit.implement`) — Implémenter une tâche à la fois

Règles strictes :
- Ne jamais sauter de phase
- Ne jamais dévier de la spec sans la mettre à jour d'abord
- Une tâche = un commit Git
- Avant chaque tâche d'implémentation, consulter la doc dans `docs/`
- Si une instruction est floue, DEMANDER avant d'inventer
- Pour le plugin escaliers : JAMAIS inventer une valeur de norme. Si une norme n'est pas documentée dans `docs/04-normes-quebec/`, s'arrêter et signaler

## Documentation : français simple

Toute la documentation produite dans `docs/` doit être en français québécois SIMPLE, niveau cégep, lisible par quelqu'un qui n'est pas développeur. Règles :
- Phrases courtes
- Pas de jargon technique sans définition
- Exemples concrets
- "Pourquoi" avant le "comment"
- Captures d'écran ou schémas quand c'est utile

## Conventions de code

### Général
- Noms de fichiers React : `PascalCase.tsx` (ex. `StairCalculator.tsx`)
- Noms de fichiers utilitaires : `kebab-case.ts` (ex. `escaliers-calculs.ts`)
- Indentation : 2 espaces
- Encodage : UTF-8
- Toujours utiliser TypeScript, jamais `any` sauf si vraiment impossible

### React / Next.js
- App Router (pas Pages Router)
- Server Components par défaut, Client Components seulement quand nécessaire (`'use client'`)
- Composants courts et focalisés (max ~150 lignes par fichier)
- Logique métier séparée des composants UI : algorithmes dans `src/lib/`, composants dans `src/components/`

### Styling
- Tailwind v4 uniquement (pas de CSS custom sauf cas exceptionnels)
- Composants shadcn pour la base UI (Button, Card, Input, etc.)
- Variables de couleurs définies dans `src/app/globals.css` via `@theme` (syntaxe Tailwind v4)
- Mobile-first systématique

## Sécurité

- Aucun secret en clair dans le code. Tout va dans `.env.local` qui n'est jamais commité.
- Le `.gitignore` couvre `.env*`, `*.key`, `*.pem`, etc.
- Validation systématique des entrées utilisateur (les calculs d'escaliers doivent vérifier que les valeurs sont dans des plages raisonnables avant de calculer)

## Structure du projet

```
./                              # racine du repo
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs          # config Tailwind v4 (pas de tailwind.config.ts)
├── components.json             # config shadcn
├── public/                     # assets statiques servis à la racine (images, SVG)
│   └── images/
└── src/
    ├── app/                    # routes Next.js (App Router)
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css         # styles globaux + @theme Tailwind v4 + shadcn vars
    │   └── plugins/
    │       └── escaliers/
    │           └── page.tsx
    ├── components/
    │   ├── ui/                 # composants shadcn auto-générés
    │   ├── hero/               # Hero + DottedSurface 3D
    │   ├── plugins/escaliers/  # composants spécifiques au plugin
    │   └── layout/             # Header, Footer
    └── lib/
        ├── utils.ts            # helpers shadcn auto-généré
        ├── escaliers/          # logique métier
        │   ├── calculs.ts
        │   ├── materiaux.ts
        │   ├── normes.ts
        │   └── types.ts
        └── plugins-registry.ts # registre des plugins
```

## Workflow Git

- Branche principale : `main`
- Commits réguliers à chaque tâche complétée
- Messages en français, format `type: description`
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `chore`
- Avant CHAQUE commit : `git status` pour vérifier qu'aucun secret n'est inclus

## Fichiers de référence obligatoires

Avant d'écrire du code, Claude Code DOIT consulter :
- `docs/03-mvp/plugin-escaliers.md` — spec complète du plugin
- `docs/04-normes-quebec/index.md` + ses pages — règles du Code de construction
- `docs/05-design/index.md` — design system

## Limites du projet (NE PAS dépasser)

- Pas de backend ni base de données pour le MVP (tout côté client)
- Pas d'authentification
- Un seul plugin dans le MVP : escaliers (mais structure modulaire prête pour plus)
- Escaliers droits seulement (pas tournants, pas paliers multiples)
- Pas d'IA intégrée dans les calculs eux-mêmes (algorithme déterministe)
- Pas un remplacement à un professionnel certifié — l'app le dit clairement

<!-- SPECKIT START -->
Feature en cours : **Page d'accueil — Hero 3D** (branche `001-home-page-3d-hero`)
Plan actif : `specs/001-home-page-3d-hero/plan.md`
Spec : `specs/001-home-page-3d-hero/spec.md`
Contrats UI : `specs/001-home-page-3d-hero/contracts/components.md`
<!-- SPECKIT END -->
