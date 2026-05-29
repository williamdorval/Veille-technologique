# Plugin Escaliers — Documentation complète

Ce dossier explique comment fonctionne le plugin escaliers, en langage simple.

## Fichiers de cette documentation

| Fichier | Contenu |
|---------|---------|
| [calculs.md](calculs.md) | Comment les dimensions sont calculées (algorithme expliqué) |
| [normes.md](normes.md) | Les règles du Québec (CCQ) qui s'appliquent aux escaliers |
| [scene-3d.md](scene-3d.md) | Comment la visualisation 3D a été faite |
| [plan-construction.md](plan-construction.md) | Comment le plan de construction étape par étape est généré |
| [estimation.md](estimation.md) | Comment l'estimation de temps et de coût est calculée |

## Vue d'ensemble du plugin

L'utilisateur entre :
- La **hauteur totale** à monter (du plancher du bas au plancher du haut)
- La **largeur** souhaitée de l'escalier
- La **hauteur du plafond** (pour vérifier le dégagement de tête)
- Le **type d'usage** (résidentiel privé, commun ou commercial)
- Les **matériaux** (bois, acier, etc.)

L'application calcule automatiquement :
- Le **nombre de marches** optimal
- La **hauteur de chaque contremarche**
- La **profondeur de chaque marche** (giron)
- La **longueur des limons** (pièces inclinées qui supportent tout)
- L'**angle** de l'escalier
- Si chaque mesure **respecte les normes du Québec**
- La **liste des matériaux** nécessaires
- Un **plan de construction** étape par étape
- Une **estimation du temps et du coût**

## Fichiers source (code)

```
src/lib/escaliers/
  calculs.ts          ← algorithme principal
  conformite.ts       ← vérification des normes CCQ
  normes.ts           ← valeurs numériques des normes (en cm)
  types.ts            ← types TypeScript
  materiaux.ts        ← calcul des matériaux et du coût
  plan-construction.ts ← génération du plan étape par étape

src/components/plugins/escaliers/
  FormulaireEscalier.tsx    ← formulaire de saisie
  ResultatsConformite.tsx   ← tableau de conformité
  ListeMateriaux.tsx        ← liste des matériaux
  EstimationProjet.tsx      ← temps et coût estimés
  EscalierScene.tsx         ← scène 3D (Canvas + lumières)
  EscalierStructure.tsx     ← marches et limons en 3D
  EscalierEnvironnement.tsx ← murs et sol en 3D
```
