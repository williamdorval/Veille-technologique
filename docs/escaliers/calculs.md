# Comment les calculs fonctionnent — Escaliers

> Fichier source : `src/lib/escaliers/calculs.ts`

## L'objectif

À partir d'une hauteur totale (ex. 280 cm), trouver le **nombre de marches** qui donne le confort maximal, puis calculer toutes les dimensions qui en découlent.

---

## Étape 1 : Trouver le nombre de marches optimal

On commence avec une estimation de base :

```
nombre_de_base = arrondi( hauteur_totale / 18 )
```

Pourquoi 18 cm ? C'est la hauteur de contremarche idéale reconnue dans la pratique (confortable pour la majorité des gens).

Ensuite on teste 3 candidats : `nombre_de_base - 1`, `nombre_de_base`, `nombre_de_base + 1`.

Pour chaque candidat, on calcule l'écart par rapport à la **formule de Blondel** (voir ci-dessous). On choisit le nombre qui donne le plus petit écart.

**Exemple** : hauteur totale = 280 cm, idéal = 18 cm → base = 16 marches.
On teste 15, 16, 17 marches et on choisit le meilleur.

---

## Étape 2 : La formule de Blondel (le cœur du calcul)

La formule de Blondel est une règle de confort reconnue mondialement :

```
2H + G = entre 60 et 64 cm   (cible : 63 cm)
```

Où :
- **H** = hauteur de la contremarche (la partie verticale d'une marche)
- **G** = giron (la profondeur de la marche, où on pose le pied)

Cette formule garantit que l'escalier est confortable à monter : ni trop raide (H trop grand), ni trop aplati (G trop grand).

---

## Étape 3 : Calculer la hauteur de la contremarche

```
H = hauteur_totale / nombre_de_marches
```

**Exemple** : 280 cm ÷ 16 marches = 17,5 cm par contremarche.

---

## Étape 4 : Calculer le giron

On part de Blondel pour trouver le giron :

```
G = 63 - (2 × H)
```

**Exemple** : 63 - (2 × 17,5) = 63 - 35 = 28 cm de giron.

Le giron est ensuite limité entre le minimum légal (21 cm privé / 28 cm commun) et le maximum légal (35,5 cm).

---

## Étape 5 : Calculer la longueur au sol

```
longueur_au_sol = nombre_de_marches × giron
```

**Exemple** : 16 × 28 = 448 cm — c'est l'espace horizontal que l'escalier occupe au sol.

---

## Étape 6 : Calculer la longueur du limon

Le limon est la pièce inclinée qui court le long de l'escalier de haut en bas. C'est le théorème de Pythagore :

```
longueur_limon = √( longueur_au_sol² + hauteur_totale² )
```

**Exemple** : √(448² + 280²) = √(200 704 + 78 400) = √279 104 ≈ 528 cm.

Pour couper le limon, on ajoute 15 cm de marge de chaque côté, soit +15 cm au total.

---

## Étape 7 : Calculer l'angle

```
angle = arctan( hauteur_totale / longueur_au_sol )  →  converti en degrés
```

**Exemple** : arctan(280 / 448) ≈ 32° — c'est dans la plage confortable (30-40°).

---

## Étape 8 : Vérifier la conformité

Chaque dimension est comparée aux normes CCQ :
- Contremarche entre 12,5 et 20 cm ?
- Giron entre 21 et 35,5 cm ?
- Blondel entre 60 et 64 cm ?
- Dégagement de tête ≥ 195 cm ?
- Largeur ≥ 86 cm ?

Si une valeur est trop proche d'une limite (zone orange), l'indicateur passe en **avertissement**. Si elle dépasse, c'est **non conforme**.

Voir : `src/lib/escaliers/conformite.ts`

---

## Résumé visuel

```
Entrée : hauteur_totale = 280 cm
         largeur = 90 cm

    ↓ Étape 1 : nombre_de_marches = 16

    ↓ Étape 2-3 : H = 280 / 16 = 17,5 cm

    ↓ Étape 4 : G = 63 - (2×17,5) = 28 cm

    ↓ Étape 5 : longueur_au_sol = 16 × 28 = 448 cm

    ↓ Étape 6 : longueur_limon = √(448² + 280²) ≈ 528 cm

    ↓ Étape 7 : angle = 32°

    ↓ Étape 8 : Blondel = 2×17,5 + 28 = 63 ✅
```
