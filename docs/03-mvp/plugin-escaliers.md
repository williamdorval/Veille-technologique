# Plugin calculateur d'escaliers

Le plugin qui aide AU COMPLET un constructeur à construire un escalier conforme aux normes du Québec.

## Objectif

Un constructeur entre quelques informations de base (hauteur à franchir, largeur souhaitée, type d'usage) et le plugin lui sort TOUT ce dont il a besoin pour construire son escalier :

1. Les dimensions exactes de chaque marche
2. La vérification de conformité aux normes du Québec
3. La liste complète des matériaux nécessaires (bois, quincaillerie)
4. Le plan de construction étape par étape
5. L'estimation du temps de construction

## Entrées (formulaire utilisateur)

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Hauteur totale à franchir | nombre (mm ou pouces) | oui | Du sol fini d'en bas au sol fini d'en haut |
| Largeur de l'escalier souhaitée | nombre (mm ou pouces) | oui | Largeur d'une marche |
| Type d'usage | choix | oui | Résidentiel privé / Commun / Commercial |
| Avec ou sans contremarche | choix | oui | Avec : marche pleine. Sans : escalier ajouré |
| Matériau du limon | choix | oui | Bois traité / Bois d'épinette / Bois franc |
| Unité de mesure | choix | oui | Millimètres / Pouces |

## Sorties P1 (essentiel)

### Dimensions de l'escalier

- Nombre de marches (contremarches)
- Hauteur exacte de chaque contremarche (en mm et en pouces)
- Profondeur (giron) de chaque marche (en mm et en pouces)
- Longueur totale de l'escalier au sol
- Angle de l'escalier en degrés

### Conformité aux normes

Pour chaque dimension, indicateur clair :
- ✅ Vert : conforme
- ⚠️ Orange : limite (acceptable mais à la limite)
- ❌ Rouge : non conforme avec citation de la norme violée

### Liste basique des matériaux

- Limons : nombre, longueur, dimensions
- Marches : nombre, dimensions exactes
- Contremarches (si applicable) : nombre, dimensions

## Sorties P2 (si temps)

### Quantités précises de quincaillerie

Pour CHAQUE assemblage de l'escalier, lister :
- Vis (type, longueur, quantité) — exemple : « 24 vis à bois 3 pouces pour fixer les marches aux limons »
- Clous (type, longueur, quantité) — exemple : « 16 clous galvanisés 2½ pouces pour les contremarches »
- Équerres métalliques (type, quantité) — exemple : « 2 équerres de 4 pouces pour fixer l'escalier au plancher d'arrivée »
- Supports de marches (s'il y en a)

Tous les nombres sont calculés à partir de la géométrie de l'escalier, pas inventés.

### Plan de construction étape par étape

Liste ordonnée des étapes pour construire l'escalier, en français simple :

1. Couper les limons à la longueur X et tracer les encoches selon le gabarit
2. Couper les Y marches aux dimensions A × B
3. Couper les Y contremarches aux dimensions C × D
4. Pré-percer les trous dans les limons
5. Visser les marches sur les limons (vis Z, à raison de 2 par côté)
6. Visser les contremarches
7. Fixer l'ensemble au sol d'arrivée avec les équerres
8. Vérifier l'aplomb et l'horizontalité de chaque marche

### Schéma visuel

Un dessin simple en SVG ou Canvas qui montre l'escalier en coupe avec les cotes principales annotées.

## Sorties P3 (bonus, sûrement pas fait)

- Estimation du temps de construction (heures de travail)
- Estimation du coût des matériaux (à partir de prix moyens)
- Export PDF de tout le plan

## Logique de calcul

L'algorithme est dans `src/lib/escaliers/calculs.ts`. Il suit ces étapes :

1. **Estimation initiale du nombre de marches** : `hauteurTotale / hauteurContremarcheCible` (cible ≈ 180 mm pour résidentiel)
2. **Ajustement pour respecter la plage normée** : si la hauteur calculée sort de la plage permise, on augmente ou diminue le nombre de marches
3. **Calcul du giron** selon la règle ergonomique (2 × hauteur + giron ≈ 600 à 630 mm) et la valeur minimale du giron permise par la norme
4. **Vérification de l'angle** final (doit être dans la plage permise)
5. **Calcul de la longueur du limon** par le théorème de Pythagore
6. **Calcul des matériaux** à partir de la géométrie obtenue

Toutes les valeurs des normes proviennent de `docs/04-normes-quebec/` et sont importées depuis `src/lib/escaliers/normes.ts`. JAMAIS de valeur inventée dans le code.

## Interface utilisateur

### Layout

- À gauche (ou en haut sur mobile) : le formulaire d'entrée avec les champs ci-dessus, bouton « Calculer »
- À droite (ou en bas sur mobile) : les résultats organisés en cartes shadcn

### Cartes de résultats

1. **Carte « Dimensions »** — tableau des dimensions calculées
2. **Carte « Conformité »** — résumé visuel (vert/orange/rouge) + détails au clic
3. **Carte « Matériaux »** — liste complète avec quantités
4. **Carte « Plan de construction »** (P2) — étapes numérotées
5. **Carte « Schéma »** (P2) — dessin SVG

### Composants shadcn utilisés

- `Input`, `Label`, `Select`, `Button` pour le formulaire
- `Card`, `CardHeader`, `CardContent` pour chaque résultat
- `Badge` pour les indicateurs de conformité
- `Separator` entre les sections
- `Alert` pour l'avertissement « ce n'est pas un remplacement à un professionnel »

## Limites du plugin dans le MVP

- Escaliers droits seulement (pas tournants, pas paliers multiples)
- Pas de gestion de l'épaisseur des matériaux (le calcul porte sur les dimensions finies)
- Pas de visualisation 3D (juste 2D en coupe)
- Calculs en mm ou pouces, pas de mélange dans une même session

## Avertissement obligatoire affiché

> ⚠️ Cet outil donne une estimation conforme aux normes documentées au moment de sa création. Il NE REMPLACE PAS la consultation d'un professionnel certifié (architecte, ingénieur, charpentier d'expérience). L'utilisateur est responsable de valider la conformité finale de son escalier auprès de la Régie du bâtiment du Québec et de la municipalité concernée.
