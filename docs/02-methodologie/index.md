# Section 2 — Méthodologie

Comment on travaille : Specification Driven Development avec SpecKit et Claude Code, sur un projet Next.js + React + TypeScript, le tout documenté dans Obsidian.

## Pages de cette section

- [[workflow-sdd|Workflow SDD complet]]
- [[speckit|SpecKit (outil principal)]]
- [[claude-code|Claude Code (agent qui code)]]
- [[stack-technique|Stack technique (Next.js + React + TS + Tailwind + shadcn)]]
- [[obsidian|Obsidian (wiki de documentation)]]

## Vue d'ensemble en une image mentale

```
Documentation (Obsidian)
        ↓
Spécification (SpecKit /speckit.specify)
        ↓
Plan d'architecture (/speckit.plan)
        ↓
Tâches concrètes (/speckit.tasks)
        ↓
Implémentation (/speckit.implement → Claude Code écrit le code React/TS)
        ↓
Application Next.js fonctionnelle
```

Chaque étape produit un document écrit qui sert de base à la suivante.
