# Claude Code

## C'est quoi

Outil en ligne de commande développé par Anthropic qui permet à Claude d'agir comme un développeur sur un projet.

## Fichiers que Claude Code lit en priorité

1. `CLAUDE.md` à la racine
2. Les skills dans `.claude/skills/`
3. Les specs dans `specs/`
4. La documentation dans `docs/` quand on lui dit de la consulter

## Bonnes pratiques

- Démarrer chaque session en demandant à Claude Code de lire `CLAUDE.md`
- Avant chaque tâche d'implémentation, consulter la doc pertinente
- Faire des commits Git réguliers
- Vérifier avec `git status` qu'aucun fichier sensible n'est dans le commit
