# L'estimation de coût et de temps — Comment elle est calculée

> Fichier source : `src/lib/escaliers/materiaux.ts`

---

## Deux sorties : liste de matériaux + estimation

La fonction `calculerMateriaux()` produit la **liste détaillée de chaque pièce** nécessaire. Ensuite `calculerEstimation()` utilise cette liste pour calculer le coût total et le temps de construction.

---

## Liste des matériaux

### 1. Limons (2 pièces)

Les limons sont les pièces les plus importantes et les plus coûteuses.

```
longueur = longueur_limon + 15 cm  (marge pour les ancrages)
largeur  = 23,5 cm  (2×10 — standard pour escalier résidentiel)
hauteur  = 3,8 cm   (épaisseur d'une planche 2×)
```

Prix : `PRIX_INDICATIFS_CAD.limon[materiau]` × longueur en mètres

Exemples de prix au mètre linéaire (2025, indicatifs) :
| Matériau | Prix / m linéaire |
|----------|-------------------|
| Épinette | 3,50 $ |
| Bois franc | 8,00 $ |
| Acier | 12,00 $ |
| Composite | 15,00 $ |

### 2. Marches

```
quantité  = nombre_de_marches
largeur   = largeur_escalier
profondeur = giron + 2,5 cm (nez de marche)
épaisseur = 3,8 cm
```

Pour le contreplaqué, le calcul est différent : on divise le nombre de marches par le nombre de marches qu'on peut couper dans une feuille 4×8 pieds (121,9 × 243,8 cm).

### 3. Contremarches (si escalier fermé)

```
quantité  = nombre_de_marches
largeur   = largeur_escalier
hauteur   = hauteur_contremarche
épaisseur = 1,9 cm
```

### 4. Supports d'ancrage

4 supports fixes (2 en haut, 2 en bas). Prix unitaire : 8 $ chacun.

### 5. Espaceurs de limon

Un espaceur par marche (maintient l'écartement entre les deux limons). Prix : 3 $ chacun.

### 6. Vis inox

```
nombre_vis = nombre_de_marches × 8  (si contremarches fermées)
           = nombre_de_marches × 4  (si escalier ouvert)
boites     = arrondi au supérieur(nombre_vis / 100)
```

Prix par boîte de 100 vis : 25 $.

---

## Calcul du coût total

```
coût_total = Σ (quantité × prix_unitaire)  pour chaque pièce

fourchette_min = coût_total × 0,80   (−20%)
fourchette_max = coût_total × 1,20   (+20%)
```

La fourchette de ±20 % reflète la variation des prix selon les fournisseurs, les régions et les promotions du moment.

---

## Calcul du temps de construction

```
temps_base = 5 heures   (traçage des limons + ancrage + finition)

temps_par_marche selon le matériau :
  Épinette / Bois traité  : 20 min/marche
  Bois franc               : 30 min/marche
  Composite                : 25 min/marche
  Acier                    : 45 min/marche

temps_total = temps_base + (nombre_marches × temps_par_marche)
            → arrondi à 0,5 heure près
```

**Exemple** : 16 marches en épinette = 5h + (16 × 20/60) = 5h + 5,3h ≈ 10,5h

---

## Avertissement obligatoire

L'application affiche toujours ce message :

> Ces estimations sont indicatives (prix moyens québécois 2025). Les prix varient selon les fournisseurs et la région. Obtenez des soumissions avant d'acheter.

Cet avertissement est **obligatoire** pour éviter toute confusion : les prix sont des ordres de grandeur, pas des devis.

---

## Ce qui N'EST PAS inclus dans l'estimation

- Main courante (prix très variable selon le modèle)
- Garde-corps (idem)
- Finition (teinture, vernis, peinture)
- Main-d'œuvre si on fait faire par un entrepreneur
- Livraison des matériaux
- Outils (scie, perceuse, niveau, gabarit d'escalier)

L'estimation couvre uniquement les **matériaux bruts** de la structure.
