# Prêt à pousser sur GitHub

**Date :** 2026-05-27
**Testé localement :** `npm run build` — 0 erreurs TypeScript, 6 routes statiques générées

---

## État du projet

4 plugins complets : escaliers (existant amélioré), rampes, plancher, toiture.
Page d'accueil mise à jour avec les 4 plugins disponibles + 2 cartes "Bientôt".
Normes du Québec documentées avec sources officielles dans `docs/04-normes-quebec/` (16 fichiers).
Visualisation 3D (Three.js/R3F) sur les 4 plugins.

---

## Commits prêts à être pushés

```
5e79c1d docs: rapport final projet plateforme constructeurs
40d7962 feat(accueil): 4 plugins disponibles et 2 nouvelles cartes a venir
ea1392a feat(toiture): plugin estimation toiture — surface, materiaux, charges neige Quebec
f878523 feat(plancher): plugin calcul de plancher — dimensionnement solives CNB 2020
fdb9df0 feat(rampes): plugin rampes et garde-corps complet — spec SDD, types, calculs, UI, 3D
da4ebc3 docs(normes): normes Quebec pour rampes plancher toiture avec sources
```

---

## Branches locales

```
  001-home-page-3d-hero
* 002-plugin-escaliers   ← branche de travail (tous les plugins)
  main
```

---

## Tests recommandés AVANT de pousser

1. `npm install` (au cas où des dépendances manquent)
2. `npm run dev`
3. Ouvrir http://localhost:3000
   - Vérifier le hero 3D et les 4 cartes plugins cliquables
   - Vérifier les 2 cartes "Bientôt" (Fondation, Isolation)
4. Tester `/plugins/escaliers`
   - Hauteur 2800 mm, largeur 900 mm → vérifier ~15 marches, conformité verte
5. Tester `/plugins/rampes`
   - Longueur 3000 mm, hauteur chute 1200 mm → garde-corps 900 mm, barreaux ≤100 mm
6. Tester `/plugins/plancher`
   - Portée 4000 mm, largeur 5000 mm, salon, SPF → vérifier recommandation solive 2×10
7. Tester `/plugins/toiture`
   - Bâtiment 10000×8000 mm, pente 26°, bardeau asphalte, Québec (ville) → ~80 m² développés
8. Alterner thème clair/sombre sur chaque page (bouton en haut à droite)
9. Ouvrir Console DevTools (F12) → aucune erreur rouge attendue
10. Tester sur viewport 375 px (mobile) — vérifier responsive

---

## Pour pousher (faire par William)

```bash
git push origin 002-plugin-escaliers
```

Note : tous les plugins (rampes, plancher, toiture) sont sur la branche `002-plugin-escaliers`.
Il n'y a pas de branches séparées 003/004/005 — tout est dans une seule branche de travail propre.

---


## Corrections 3D -- 2026-05-28

| Plugin | Bug corrige | Commit |
|--------|-------------|--------|
| Rampes | Escalier parasite retire -- rampe inclinee a la place des marches | c1c5ed7 |
| Plancher | Camera corrigee (vue de cote) -- solives visibles en perspective | 3520ec8 |
| Toiture | Rotations versants corrigees + yCentre exact + boxGeometry | 35d8da1 |

---
## Problèmes connus / Tâches en suspens

- Les portées de solives (plancher) utilisent un calcul de flèche élastique simplifié. Pour usage structurel officiel, consulter les tableaux du CNB 2020 et un ingénieur.
- Les charges de neige sont indicatives (CNB 2020 Annexe C). Valeurs exactes par municipalité nécessitent l'accès au CNB.
- La visualisation 3D de la toiture montre toujours deux versants (pignon), même si le type "croupe" est sélectionné — les calculs sont corrects pour tous les types.

