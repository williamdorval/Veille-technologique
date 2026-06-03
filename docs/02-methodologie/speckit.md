# SpecKit

## C'est quoi

SpecKit est un outil open source développé par GitHub. Il fournit un cadre structuré pour travailler avec des agents de code à partir de spécifications.

Dépôt : https://github.com/github/spec-kit

## Installation

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai claude --integration-options="--skills"
```

## Commandes principales

| Commande | Rôle |
|---|---|
| `/speckit.specify` | Crée la spécification |
| `/speckit.plan` | Génère le plan |
| `/speckit.tasks` | Découpe en tâches |
| `/speckit.implement` | Implémente une tâche |

Les artefacts sont stockés dans `specs/`.

c,ets un skills 
