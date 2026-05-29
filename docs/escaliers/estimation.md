# Estimation de coût et de matériaux — Professionnel

> Fichier source : `src/lib/escaliers/stair-materials.ts`
> Composant : `src/components/plugins/escaliers/EstimationPro.tsx`
> Prix relevés dans les quincailleries québécoises (Canac, Rona, BMR) — 2025, avant taxes

---

## Deux publics cibles

**Pour le client :** "Combien va me coûter cet escalier en tout ?"
**Pour l'entrepreneur :** "Combien je dois charger pour faire une soumission ?"

L'onglet "Estimation $" de l'app affiche les deux visions.

---

## Matériaux calculés automatiquement

### Limons (2 pièces obligatoires)

Les limons sont les deux planches inclinées qui courent de haut en bas et supportent toutes les marches.

```
Longueur = longueur_calculée + 150 mm (marge pour les ancrages)
Prix = longueur (en m) × prix par mètre linéaire
```

| Matériau | Prix / m linéaire 2025 | Commentaire |
|----------|------------------------|-------------|
| Épinette (2×10) | 8,00 $ | ~28$ / 10 pi chez Canac |
| Bois franc | 16,00 $ | Chêne ou érable, spécialiste |
| Acier | 25,00 $ | Profil C galvanisé |
| Composite | 28,00 $ | PVC/bois, résistant humidité |

### Marches

```
Prix par marche = largeur (m) × profondeur (m) × prix par m²
Profondeur = giron + 28 mm (nez de marche standard)
```

| Matériau | Prix / m² 2025 | Commentaire |
|----------|----------------|-------------|
| Épinette | 42 $ | 2×12 épinette, ~35$ / feuille 4×8 |
| Bois traité | 55 $ | ACQ pour extérieur ou humidité |
| Bois franc | 98 $ | Chêne/érable fini |
| Contreplaqué | 22 $ | 3/4", ~75$ / feuille 4×8, pour poser un revêtement par-dessus |
| Composite | 85 $ | Antidérapant, longue durée |

**Exemple** : escalier 90 cm de large, giron 28 cm, marche en épinette :
- Surface = 0,90 × (0,28 + 0,028) = 0,277 m²
- Prix par marche = 0,277 × 42 = **11,63 $**
- Pour 15 marches = **174 $**

### Contremarches (si escalier fermé)

```
Prix par contremarche = largeur (m) × hauteur_CM (m) × prix par m²
```

| Matériau | Prix / m² 2025 |
|----------|----------------|
| Épinette | 35 $ |
| Bois traité | 38 $ |
| Bois franc | 75 $ |
| Contreplaqué | 18 $ |
| Composite | 60 $ |

### Quincaillerie

| Pièce | Quantité | Prix unitaire 2025 | Commentaire |
|-------|----------|-------------------|-------------|
| Supports d'ancrage | 4 | 10,50 $ | ~10,50$ la paire chez Canac |
| Espaceurs de limon | 1 par marche | 3,50 $ | Entretoise entre les limons |
| Vis inox 3" (boîte 100) | 1 boîte / 12-25 marches | 28,00 $ | ~28$ chez Rona |

---

## Calcul du temps de travail

```
Temps total = 5 h (base) + (nombre_marches × temps_par_marche)
```

| Matériau des marches | Temps par marche |
|---------------------|-----------------|
| Épinette | 25 min |
| Bois traité | 25 min |
| Bois franc | 40 min |
| Contreplaqué | 25 min |
| Composite | 30 min |
| Acier | 50 min |

**Exemple** : 15 marches en épinette = 5h + (15 × 25/60) = 5h + 6,25h = **11,5 heures** (arrondi à 11,5h)

---

## Taux de main-d'œuvre 2025 (Québec)

| Niveau | Taux horaire |
|--------|-------------|
| Charpentier qualifié | 55 $ à 75 $/h |
| Entrepreneur (avec overhead) | 75 $ à 110 $/h |

**Source** : taux syndicaux québécois 2025, CCQ (Commission de la construction du Québec).

---

## Calcul du coût total

```
Coût matériaux = Σ (quantité × prix_unitaire) pour chaque pièce

Fourchette projet = (matériaux + main-d'oeuvre_min à max) × ±15%
```

La fourchette de ±15% reflète la variation des prix régionaux et les imprévus de chantier.

### Taxes au Québec

```
TPS = 5 %
TVQ = 9,975 %
Total taxes = 14,975 %
```

L'app calcule automatiquement le total avec taxes.

---

## Pour une soumission professionnelle

En tant qu'entrepreneur, ajouter à l'estimation de l'app :

| Poste | Montant suggéré |
|-------|----------------|
| Permis de construction | 150 $ à 500 $ (varie par municipalité) |
| Déplacement et transport | 50 $ à 150 $ |
| Location d'équipement | Selon besoin |
| Marge de profit entrepreneur | 15 % à 25 % sur le total |

**Formule soumission** :
```
Prix soumission = (matériaux + main-d'oeuvre + frais) × 1,20 à 1,25
                + TPS + TVQ
```

---

## Important

- Ces prix sont **indicatifs** — ils varient selon la région, la qualité et les promotions.
- **Toujours obtenir des soumissions** auprès des fournisseurs avant d'acheter.
- Les taxes (TPS + TVQ = 14,975 %) s'appliquent sur tout travail de construction.
- L'app affiche un estimé — **pas un contrat**. Valider avec un professionnel RBQ.
