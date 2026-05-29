# Plugin calculateur d'escaliers — Spec MVP

## Description

Calculateur d'escaliers professionnel basé sur les exercices émoicq (YouTube) de charpenterie québécoise. Reproduit exactement la logique d'un maître charpentier québécois.

## Utilisateurs cibles

- **Client** : veut savoir combien ça va coûter et si son escalier est faisable
- **Entrepreneur / charpentier** : veut faire une soumission professionnelle

## Fonctionnalités

### Deux modes de calcul
- **Course illimitée** : tu donnes la hauteur, le calculateur optimise tout
- **Course limitée** : tu imposes l'espace au sol, le giron s'adapte

### Résultats produits
1. **Recommandation** : meilleure configuration avec score /100, 3 rapports Blondel-Maximum
2. **Alternatives** : 5 configurations classées par score
3. **Crochet** (mode limité) : vérification sous le chevêtre
4. **Puits d'escalier** : longueur de l'ouverture dans le plancher
5. **Formules** : calculs transparents avec vraies valeurs
6. **Estimation $** : liste matériaux + coût (Canac/Rona 2025) + taxes QC
7. **Plan de construction** : étapes séquentielles avec dimensions
8. **Vue 3D** : visualisation interactive

### Aide intégrée
Chaque champ du formulaire a un bouton `?` qui explique le terme en langage simple.

## Algorithme (exercices émoicq 1 à 5)

| Exercice | Ce qu'il fait |
|----------|--------------|
| 1 | H = hauteur/N, limon = √(H²+G²), angle = atan(H/G) |
| 2 | Loi Blondel : 2H + G ≈ 630 mm |
| 3 | 3 rapports Blondel-Maximum, score 0-100, toutes options |
| 4 | Course limitée, giron forcé, crochet = (G + nez) - chevêtre |
| 5 | Puits = ((échappée + plafond) × G) / H + 50 mm |

## Normes CCQ appliquées (Partie 9)

- Art. 9.8.4.1 : contremarche 12,5 à 20 cm (résidentiel privé)
- Art. 9.8.4.2 : giron min 23,5 cm (résidentiel privé)
- Art. 9.8.2.1 : largeur min 86 cm
- Art. 9.8.3.1 : échappée min 195 cm
- Art. 9.8.4.4 : constance des marches (max 0,95 cm d'écart)
- Art. 9.8.7.4 : main courante si ≥ 3 marches
- Art. 9.8.8 : garde-corps si chute > 60 cm

## Unités

- **Stockage interne** : mm (millimètres, standard charpenterie)
- **Affichage défaut** : cm (centimètres)
- **Sélecteur** : cm | po | mm | m

## Prix et estimation

Prix 2025 relevés chez Canac, Rona, BMR (Québec). Taxes incluses dans l'affichage (TPS 5% + TVQ 9,975% = 14,975%).

Taux charpentier : 55-75 $/h (qualifié), 75-110 $/h (entrepreneur).

## Fichiers source

```
src/lib/escaliers/
  unit-converter.ts          # mm ↔ cm ↔ m ↔ po
  stair-rules.ts             # constantes CCQ
  stair-types.ts             # types TypeScript
  stair-calculator.ts        # exercice 1
  stair-blondel.ts           # exercice 2
  stair-builder.ts           # utilitaire partagé
  stair-unlimited-run.ts     # exercice 3
  stair-scoring.ts           # score 0-100
  stair-limited-run.ts       # exercice 4
  stair-hook.ts              # crochet ex.4
  stair-pit.ts               # puits ex.5
  stair-validation.ts        # règles CCQ
  stair-recommendations.ts   # textes en français
  stair-materials.ts         # matériaux + prix 2025
  stair-construction-plan.ts # plan étape par étape

src/components/plugins/escaliers/
  FormulaireEscalierPro.tsx  # formulaire + boutons ?
  HelpButton.tsx             # aide au clic
  EscalierCalculateurPro.tsx # orchestrateur 8 onglets
  ResultatsRecommandation.tsx
  ResultatsAlternatives.tsx
  ResultatsCrochet.tsx
  ResultatsPuits.tsx
  ResultatsFormules.tsx
  EstimationPro.tsx          # soumission professionnelle
```

## Documentation détaillée

Voir `docs/escaliers/` pour l'explication complète de chaque partie :
- `calculs.md` — algorithmes exercices 1-5
- `normes.md` — règles CCQ
- `estimation.md` — prix et calcul de coût
- `scene-3d.md` — visualisation Three.js/R3F
- `plan-construction.md` — plan de construction
