# Section 3 — MVP

Définition précise de ce qui doit être livré.

## Pages de cette section

- [[page-accueil|Page d'accueil avec hero 3D]]
- [[structure-modulaire|Structure modulaire pour plugins]]
- [[plugin-escaliers|Plugin calculateur d'escaliers (le gros morceau)]]
- [[resultats-attendus|Résultats attendus]]

## Vue d'ensemble

Le MVP livre une plateforme web Next.js qui :

1. **Page d'accueil** avec un effet 3D Three.js professionnel sur le thème construction (terrain qui ondule + maisons stylisées qui flottent), présentation de la plateforme, liste des plugins
2. **Plugin escaliers complet** qui aide AU COMPLET un constructeur : calcule les dimensions conformes aux normes, liste tous les matériaux nécessaires avec quantités précises (bois, vis, clous, équerres), donne le plan de construction étape par étape, estime le temps de travail
3. **Structure modulaire** prête à accueillir d'autres plugins (rampes, planchers, etc.) sans tout casser
4. **Thème clair/sombre** pour utilisation en chantier
5. **Mobile-first** pour utilisation sur téléphone

## Priorisation (parce qu'on a 7 jours)

**P1 — Essentiel pour le MVP :**
- Page d'accueil fonctionnelle avec hero 3D
- Plugin escaliers : entrées + calculs de dimensions + conformité normes + liste basique de matériaux
- Structure modulaire de base

**P2 — Si on a le temps :**
- Plugin escaliers : quantités précises de quincaillerie (vis, clous, équerres)
- Plan de construction étape par étape
- Schéma visuel de l'escalier généré

**P3 — Bonus rêvé :**
- Estimation du temps de construction
- Estimation du coût des matériaux
- Export PDF du plan complet
