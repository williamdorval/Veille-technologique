# Optimisation de l'utilisation des tokens avec Claude Code

## Le problème

Quand Claude Code commence une session sur un gros projet, il charge automatiquement plusieurs fichiers pour comprendre le contexte. Si la doc est mal structurée, il peut consommer 60-80 % de sa fenêtre de contexte juste à se repérer, avant même de commencer le vrai travail. Résultat : il manque de tokens pour bien faire la tâche.

## Les solutions appliquées

### 1. CLAUDE.md ultra-condensé
- Avant : 142 lignes avec des règles répétées et du texte long
- Après : 64 lignes, scannable en 30 secondes
- L'ancien est conservé dans `docs/_archive/CLAUDE-old.md`

### 2. Carte de contexte (CONTEXT_MAP.md)
Au lieu de tout charger, `docs/CONTEXT_MAP.md` liste précisément quels fichiers consulter selon la tâche. Claude ne charge que le strict nécessaire.

### 3. Résumé des normes (RESUME_VALEURS.md)
`docs/04-normes-quebec/RESUME_VALEURS.md` regroupe toutes les valeurs numériques en un seul tableau. Plus besoin de lire 15 fichiers pour trouver 10 valeurs.

### 4. Composants courts
Aucun composant React ne dépasse 200 lignes. Les 4 scènes 3D ont été divisées en sous-composants logiques (entre 40 et 178 lignes chacun).

### 5. Prompt de démarrage minimal
`docs/PROMPT_DEMARRAGE_SESSION.md` contient un prompt court (5 lignes) à copier-coller en début de session au lieu d'un long texte explicatif.

## Résultats

| Élément | Avant | Après |
|---------|-------|-------|
| CLAUDE.md | 142 lignes | 64 lignes (−55 %) |
| Composants > 250 lignes | 4 fichiers | 0 |
| Fichiers normes à lire | 15 | 1 (RESUME_VALEURS) |
| Navigation docs | À tâtons | CONTEXT_MAP.md |

## Règle à garder

Avant de commencer une tâche : lire `docs/CONTEXT_MAP.md` pour identifier les 3-5 fichiers pertinents, et ne charger QUE ceux-là.
