# Workflow Specification Driven Development

## C'est quoi le SDD

La Specification Driven Development est une méthode de développement où la spécification est le centre du processus. Au lieu de coder en improvisant, on décrit d'abord ce qu'il faut construire de façon rigoureuse, et le code est généré à partir de cette description.

Avec une IA de code comme Claude Code, le SDD prend tout son sens : plus la spécification est claire, plus le code produit est conforme à ce qui était voulu.

## Les 4 phases officielles de SpecKit

### Phase 1 — Spec (`/speckit.specify`)

On rédige une spécification complète du projet : objectifs, fonctionnalités, contraintes, design.

### Phase 2 — Plan (`/speckit.plan`)

À partir de la spec, SpecKit génère un plan d'architecture.

### Phase 3 — Tasks (`/speckit.tasks`)

Le plan est découpé en tâches concrètes, ordonnées, exécutables une à une.

### Phase 4 — Implement (`/speckit.implement`)

Claude Code implémente les tâches une à une avec un commit Git après chaque tâche.

## Règles importantes

1. Ne pas sauter de phase
2. Mettre à jour la spec si quelque chose change
3. Documenter les règles métier dans le wiki, pas dans le code
