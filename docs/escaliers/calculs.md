# Comment les calculs fonctionnent — Escaliers professionnel

> Fichiers source : `src/lib/escaliers/stair-calculator.ts`, `stair-blondel.ts`, `stair-unlimited-run.ts`, `stair-limited-run.ts`
> Source des exercices : série émoicq (YouTube) sur la charpenterie québécoise

Toutes les valeurs sont stockées en **millimètres (mm)** en interne. L'affichage se fait dans l'unité choisie (cm par défaut).

---

## Exercice 1 — Calculs de base

### Hauteur de la contremarche
```
H = hauteur_totale ÷ nombre_de_contremarches
```
Exemple : 2800 mm ÷ 16 = **175 mm** (17,5 cm)

### Nombre de marches physiques
```
marches = contremarches - 1
```
Parce que le plancher supérieur compte comme la dernière "marche". Avec 16 contremarches : **15 marches à installer**.

### Course totale (longueur au sol)
```
course = marches × giron
```
Exemple : 15 × 280 mm = **4200 mm** (420 cm)

### Angle de l'escalier
```
angle = arctan(hauteur_totale ÷ course) × 180/π
```
Exemple : arctan(2800 ÷ 4200) = **33,7°** — dans la plage idéale (30-37°)

### Longueur du limon
```
limon = √(hauteur² + course²)
```
Exemple : √(2800² + 4200²) = **5048 mm** (504,8 cm)

---

## Exercice 2 — Loi de Blondel (pas de foulée)

La loi de Blondel est une règle de confort reconnue par tous les charpentiers. Elle garantit un rythme de marche naturel.

```
Pas de foulée = 2 × H + G
```
- H = hauteur contremarche
- G = giron (profondeur de marche)

| Pas de foulée | Évaluation |
|--------------|-----------|
| 610 à 635 mm | Excellent |
| 600 à 650 mm | Acceptable |
| 590 à 600 mm ou 650 à 660 mm | Limite |
| < 590 mm ou > 660 mm | Non conforme |

**Cible** : 630 mm (63 cm)

### Comment le giron est calculé depuis Blondel
```
G = 630 - (2 × H)
```
Exemple avec H = 175 mm : G = 630 - 350 = **280 mm** (28 cm)

---

## Exercice 3 — Blondel-Maximum (3 rapports)

En plus du pas de foulée, on vérifie 3 rapports entre G (giron) et H (contremarche). C'est la méthode professionnelle pour garantir une configuration optimale.

| Rapport | Calcul | Plage valide |
|---------|--------|-------------|
| Rapport 1 | G + H | 430 à 460 mm |
| Rapport 2 (principal) | G + 2 × H | 610 à 635 mm |
| Rapport 3 | G × H | 45 000 à 48 500 |

**Exemple avec G=280, H=175** :
- G + H = 455 ✓ (entre 430-460)
- G + 2H = 630 ✓ (entre 610-635)
- G × H = 49 000 ✗ (trop élevé pour être dans 45000-48500)
- Score Blondel : **2/3**

### Score de qualité (0-100)
Le score pénalise :
- L'écart par rapport au pas de foulée idéal (630 mm)
- Le giron trop court
- La contremarche trop haute ou trop basse
- L'angle trop raide ou trop plat
- Les rapports Blondel-Maximum échoués (-20 points chacun)
- La non-conformité CCQ (-50 points)

Bonus : pas de foulée parfait (+5), angle idéal (+5), 3/3 rapports Blondel (+10).

### Mode course illimitée
Le calculateur essaie TOUTES les combinaisons de contremarches possibles, calcule le score de chacune, et propose la meilleure + 5 alternatives.

---

## Exercice 4 — Course limitée et crochet

### Course limitée
L'espace horizontal disponible est fixe. Le giron est forcé par la course :
```
G = course_disponible ÷ nombre_de_marches
```

### Calcul du crochet
Le crochet vérifie si le haut de l'escalier rentre sous le chevêtre (la structure du plancher supérieur).

```
Crochet = (giron + nez) - épaisseur_chevêtre
```
- Nez de marche = 28 mm (standard)
- Épaisseur chevêtre typique = 250-300 mm

Si **positif** → l'escalier rentre bien. Il reste X mm de jeu.
Si **négatif** → il manque de l'espace. Revoir la conception.

**Exemple** : (280 + 28) - 275 = **+33 mm** → OK, 33 mm de jeu.

---

## Exercice 5 — Calcul du puits d'escalier

Le puits est l'ouverture dans le plancher supérieur pour laisser passer l'escalier.

**Formule officielle** :
```
Longueur du puits = ((échappée + épaisseur plafond) × giron) ÷ contremarche + 50
```

Les 50 mm représentent le nez de marche et la marge de sécurité.

**Exemple** :
- Échappée = 1950 mm (min CCQ)
- Épaisseur plafond = 275 mm
- Giron = 280 mm
- Contremarche = 175 mm

```
((1950 + 275) × 280) ÷ 175 + 50 = 3612 mm (361 cm)
```

L'onglet "Formules" de l'app affiche ce calcul avec les vraies valeurs.
