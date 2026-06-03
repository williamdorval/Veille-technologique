# Le plan de construction — Comment il est généré

> Fichier source : `src/lib/escaliers/plan-construction.ts`

---

## Principe général

Le plan de construction est une **liste d'étapes séquentielles** générée automatiquement à partir des dimensions calculées. Ce n'est pas une liste fixe — elle s'adapte aux choix de l'utilisateur.

Chaque étape contient :
- Un **numéro** (1, 2, 3…)
- Un **titre** court
- Une **description** détaillée avec les dimensions exactes
- Les **dimensions clés** (tableau récapitulatif)
- Une indication si l'étape est **obligatoire selon les normes CCQ**

---

## Logique de génération

La fonction `genererPlanConstruction()` reçoit :
- Les **dimensions calculées** (nombreMarches, hauteurContremarche, giron, longueurLimon…)
- Les **choix du formulaire** (largeur, type de marche, contremarches fermées ou non)
- Les **résultats de conformité** (pour conditions futures)

Elle construit le tableau d'étapes dans l'ordre logique de construction.

---

## Étapes toujours présentes (inconditionnelles)

### Étape 1 : Préparer et tracer les limons

Les **limons** sont les deux planches inclinées sur les côtés qui supportent toutes les marches.

- On coupe chaque limon à `longueur_limon + 15 cm` (15 cm de marge pour les ancrages)
- On trace les encoches (encoches = découpes en forme de marches) avec un gabarit

**Exemple** : limon de 528 + 15 = 543 cm

### Étape 2 : Installer les supports d'ancrage

Fixation de 4 supports métalliques :
- 2 en bas (au plancher ou à la dalle)
- 2 en haut (au plancher ou à la charpente)

On vérifie l'aplomb (vertical) et le niveau (horizontal) avant de fixer définitivement.

### Étape 3 : Installer les limons

On pose les deux limons en parallèle à la largeur souhaitée, et on les fixe aux supports d'ancrage.

---

## Étapes conditionnelles

### Étape 4 : Fixer les contremarches (SI escalier fermé)

Apparaît **seulement si** l'utilisateur a coché "contremarches fermées".

Les contremarches sont les panneaux verticaux entre chaque marche. Dimensions :
- Largeur = largeur de l'escalier
- Hauteur = hauteur de contremarche calculée
- Épaisseur = 1,9 cm (panneau standard)

### Étape marches : Fixer les marches

Toujours présente. Les marches (la partie horizontale où on marche) ont :
- Largeur = largeur de l'escalier
- Profondeur = giron + 2,5 cm (nez de marche standard)
- Épaisseur = 3,8 cm (planche standard)

Le **nez de marche** (2,5 cm) est la partie qui dépasse légèrement vers l'avant. Il améliore la sécurité et est visuellement attendu sur un escalier fini.

### Étape main courante (SI ≥ 3 marches — OBLIGATOIRE)

Apparaît automatiquement si l'escalier a 3 marches ou plus (règle CCQ).

La description indique :
- Hauteur requise : entre 80 et 96,5 cm depuis le nez de marche
- Distance minimale du mur : 5 cm
- Si l'escalier est ≥ 110 cm de large → main courante **des deux côtés** obligatoire

### Étape garde-corps (SI chute > 60 cm — OBLIGATOIRE)

Apparaît si la hauteur totale de l'escalier dépasse 60 cm (presque toujours).

La hauteur minimale requise dépend de la hauteur de chute :
- Chute ≤ 180 cm → garde-corps min 90 cm
- Chute > 180 cm → garde-corps min 107 cm

L'espacement entre barreaux ne doit pas dépasser 10 cm.

---

## Exemple de plan généré

Pour un escalier de 280 cm de haut, 90 cm de large, avec contremarches fermées, 16 marches :

```
Étape 1 — Préparer et tracer les limons
  Couper les deux limons à 543 cm.
  Tracer les 16 encoches : hauteur 17,5 cm et giron 28 cm.

Étape 2 — Installer les supports d'ancrage
  4 supports (2 en bas, 2 en haut). Vérifier aplomb et niveau.

Étape 3 — Installer les limons
  Poser à 90 cm d'écartement intérieur.

Étape 4 — Fixer les contremarches
  16 contremarches : 90 × 17,5 cm × 1,9 cm d'épaisseur.

Étape 5 — Fixer les marches
  16 marches : 90 cm × 30,5 cm de profondeur (28 + 2,5 cm nez) × 3,8 cm.

Étape 6 — Installer la main courante (OBLIGATOIRE)
  Hauteur : entre 80 et 96,5 cm depuis le nez de marche.

Étape 7 — Installer le garde-corps (OBLIGATOIRE)
  Hauteur min 90 cm. Espacement barreaux max 10 cm.
```

---

## Ce que le plan ne contient pas

Le plan de construction est volontairement **simplifié** pour être accessible à un non-spécialiste. Il ne couvre pas :
- Les détails de finition (ponçage, teinture)
- Les calculs structuraux des limons (charge admissible)
- Les détails de fixation selon le type de matériau
- Les codes locaux de la municipalité

**Toujours faire valider les plans par un professionnel certifié avant de construire.**
