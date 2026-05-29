# Prêt à pousser sur GitHub

**Dernière mise à jour :** 2026-05-29
**Build :** `npm run build` — 0 erreur TypeScript, 6 routes statiques générées
**Changements fonctionnels :** AUCUN — refactoring docs/structure uniquement (sauf conversion mm→cm)

---

## Nouveaux commits depuis le dernier push

```
b006180 docs(escaliers): documentation complete du plugin en langage simple
e7d4938 chore(docs): archiver rapport-tranche-2 et spec 001 (supplantes)
818bfcb docs(methodologie): optimisation-tokens.md explique la strategie de contexte
1bf241e docs(pret-a-push): mise a jour avec conversions mm->cm et refactoring scenes 3D
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

## Tests à faire avant de pousser

1. `npm run dev` → http://localhost:3000
2. Vérifier les 4 plugins (valeurs par défaut en **cm** maintenant) :
   - `/plugins/escaliers` → saisir 280 cm, 90 cm → ~16 marches, conformité verte
   - `/plugins/rampes` → 300 cm, chute 120 cm → garde-corps requis
   - `/plugins/plancher` → portée 400 cm, largeur 500 cm → recommandation solive
   - `/plugins/toiture` → 1000×800 cm, pente 26° → surface calculée
3. Sélecteur cm/po fonctionne (escaliers + rampes)
4. Scènes 3D s'affichent (même rendu visuel qu'avant le refactoring)
5. Console F12 → aucune erreur rouge

---

## Pour pousher

```bash
git push origin 002-plugin-escaliers
```

---

## Limitations connues

- Scène 3D toiture : affiche toujours 2 versants même si type "croupe" — calculs corrects
- Plancher : flèche Euler-Bernoulli simplifiée — consulter ingénieur pour usage structurel officiel
- Charges de neige : indicatives (CNB 2020 Annexe C)
- Estimation de coût : ±20 %, prix moyens 2025 Québec
