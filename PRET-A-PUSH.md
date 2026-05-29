# Prêt à pousser sur GitHub

**Dernière mise à jour :** 2026-05-29
**Build :** `npm run build` — 0 erreurs TypeScript, 6 routes statiques générées

---

## Nouveautés depuis le dernier push

### Conversion mm → cm (commits f441ed8 à f5967b8)
Tous les plugins et la documentation utilisent maintenant les centimètres comme unité interne.

| Plugin | Changements |
|--------|-------------|
| Partagé | `use-unite.ts` cm-centrique, `SelecteurUnite` options [cm, po] |
| Escaliers | 21 constantes `_CM`, `poucesEnCm` (2,54), défauts 280/90/240 cm |
| Rampes | 9 constantes `_CM`, bornes 30-3000 cm, défauts 300/120 cm |
| Plancher | Euler-Bernoulli interne en mm, interface en cm, espacement 30/40/60 cm |
| Toiture | `/100` pour mètres, longueur chevron en cm, bornes en cm |
| Docs normes | Format `X cm (Y mm)` dans les 15 fichiers markdown |

### Refactoring scènes 3D (commits 09d9a6a à df0657a)
4 scènes React Three Fiber éclatées en sous-composants (cible < 200 lignes).

| Scène | Avant | Après (nb fichiers) |
|-------|-------|---------------------|
| EscalierScene | 478 lignes | 5 fichiers (max 178 l.) |
| RampeScene | 510 lignes | 7 fichiers (max 166 l.) |
| PlancherScene | 479 lignes | 5 fichiers (max 149 l.) |
| ToitureScene | 314 lignes | 3 fichiers (max 141 l.) |

### Optimisation docs (commit df5175a)
- `CLAUDE.md` : 142 → 64 lignes
- `docs/CONTEXT_MAP.md` : carte quoi charger selon la tâche (évite de tout lire)
- `docs/04-normes-quebec/RESUME_VALEURS.md` : toutes les normes en 1 tableau
- `docs/PROMPT_DEMARRAGE_SESSION.md` : prompt 5 lignes début de session

---

## Tests recommandés avant de pousser

1. `npm run dev` → ouvrir http://localhost:3000
2. Tester les 4 plugins (valeurs par défaut affichées en cm maintenant) :
   - `/plugins/escaliers` → 280 cm, 90 cm → ~15 marches, conformité verte
   - `/plugins/rampes` → 300 cm, chute 120 cm → garde-corps 90 cm
   - `/plugins/plancher` → portée 400 cm, largeur 500 cm → solive 2×10
   - `/plugins/toiture` → 1000×800 cm, pente 26° → ~80 m² développés
3. Vérifier le sélecteur cm/po sur escaliers et rampes
4. Vérifier les scènes 3D (même rendu visuel qu'avant)
5. Console DevTools (F12) → aucune erreur rouge

---

## Commits prêts à être poussés

```
df5175a docs(optimisation): CLAUDE.md condense + guides contexte session
df0657a refactor(toiture): scene 3D eclatee en sous-composants < 200 lignes
d06b1d6 refactor(plancher): scene 3D eclatee en sous-composants < 200 lignes
bae7604 refactor(rampes): scene 3D eclatee en sous-composants < 200 lignes
09d9a6a refactor(escaliers): scene 3D eclatee en sous-composants < 200 lignes
f5967b8 docs(normes-quebec): conversion mm vers cm dans toute la documentation
bfaae1c refactor(toiture): conversion mm vers cm — normes, calculs, UI
69394ad refactor(plancher): conversion mm vers cm — normes, formule, UI
f441ed8 refactor(rampes): conversion mm vers cm — normes, calculs, UI
0c5a9e8 refactor(escaliers): conversion mm vers cm — normes, calculs, UI et hook partage
```

---

## Pour pousser (faire par William)

```bash
git push origin 002-plugin-escaliers
```

---

## Problèmes connus / limitations

- La visualisation 3D toiture affiche toujours deux versants (pignon) même si type "croupe" sélectionné — calculs corrects pour tous les types.
- Portées plancher : calcul de flèche élastique simplifié. Pour usage structurel officiel, consulter CNB 2020 et un ingénieur.
- Charges de neige indicatives (CNB 2020 Annexe C) — valeurs exactes par municipalité dans le CNB.
