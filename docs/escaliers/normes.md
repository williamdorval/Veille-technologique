# Les règles du Québec pour les escaliers

> Source officielle : Code de construction du Québec (CCQ), Chapitre I — Bâtiment, Partie 9
> Site de référence : rbq.gouv.qc.ca | qccodes.ca

---

## Pourquoi des règles ?

Les règles du CCQ existent pour éviter les accidents. Un escalier mal proportionné peut faire trébucher, et un garde-corps trop bas ne retient pas une personne qui tombe. Ces normes sont obligatoires pour toute construction au Québec.

---

## Contremarche (hauteur de chaque marche) — Art. 9.8.4.1

La contremarche, c'est la partie **verticale** d'une marche.

| Usage | Minimum | Maximum |
|-------|---------|---------|
| Résidentiel privé (maison) | 12,5 cm | 20 cm |
| Résidentiel commun / commercial | 12,5 cm | 18 cm |

**Pourquoi ?** Une contremarche trop basse (< 12,5 cm) fait trébucher. Trop haute (> 20 cm), elle est fatigante et dangereuse, surtout pour les personnes âgées.

---

## Giron (profondeur de chaque marche) — Art. 9.8.4.2

Le giron, c'est la partie **horizontale** où on pose le pied.

| Usage | Minimum | Maximum |
|-------|---------|---------|
| Résidentiel privé | 21 cm | 35,5 cm |
| Résidentiel commun / commercial | 28 cm | 35,5 cm |

**Pourquoi ?** Un giron trop petit (< 21 cm) ne supporte pas le pied entier. Trop grand (> 35,5 cm), on ne sait plus où mettre les pieds naturellement.

---

## Formule de Blondel (confort) — Pratique professionnelle

```
2H + G = entre 60 et 64 cm   (idéal : 63 cm)
```

C'est une règle de confort, pas une obligation légale, mais elle est reconnue par tous les architectes et ingénieurs. Elle garantit un rythme de marche naturel.

---

## Largeur de l'escalier — Art. 9.8.2.1

| Usage | Minimum |
|-------|---------|
| Résidentiel privé | 86 cm |
| Résidentiel commun / commercial | 90 cm |

---

## Dégagement de tête (échappée) — Art. 9.8.3.1

C'est la hauteur libre mesurée verticalement au-dessus de chaque nez de marche.

| Usage | Minimum |
|-------|---------|
| Résidentiel privé | 195 cm |
| Résidentiel commun | 205 cm |

**Pourquoi ?** Pour que les gens de grande taille ne se cognent pas la tête sur le plancher au-dessus.

---

## Uniformité des marches — Art. 9.8.4.4

Toutes les marches d'un escalier doivent être pratiquement identiques.

| Tolérance | Maximum |
|-----------|---------|
| Différence entre 2 marches consécutives | 0,5 cm |
| Différence entre la plus petite et la plus grande de toute la volée | 1 cm |

**Pourquoi ?** Si les marches ne sont pas uniformes, le corps s'adapte à un rythme et trébuche quand il change.

---

## Main courante — Art. 9.8.7.4

La main courante est la barre qu'on tient en montant l'escalier.

| Paramètre | Règle |
|-----------|-------|
| Obligatoire si | ≥ 3 marches |
| Hauteur mesurée depuis le nez de marche | Entre 80 cm et 96,5 cm |
| Distance minimale du mur | 5 cm (pour pouvoir la saisir) |
| Des deux côtés si largeur ≥ | 110 cm |

---

## Garde-corps — Art. 9.8.8

Le garde-corps est la barrière de sécurité sur le côté ouvert de l'escalier.

| Paramètre | Règle |
|-----------|-------|
| Obligatoire si hauteur de chute > | 60 cm |
| Hauteur min (chute ≤ 180 cm, privé) | 90 cm |
| Hauteur min (chute > 180 cm, privé) | 107 cm |
| Hauteur min (commun / commercial) | 107 cm |
| Espacement max entre barreaux | 10 cm |

**La règle de la sphère** : aucune ouverture dans le garde-corps ne doit permettre le passage d'une sphère de 10 cm de diamètre. Cela empêche la tête d'un enfant de se coincer.

---

## Ce que vérifie l'application

Chaque indicateur affiche :
- ✅ **Vert** : conforme, pas de problème
- ⚠️ **Orange** : proche d'une limite (vérifier avec un professionnel)
- ❌ **Rouge** : non conforme, violation de la norme CCQ

**Important** : l'application donne une évaluation indicative. Pour une construction officielle, un professionnel certifié doit valider les plans.

---

## Valeurs dans le code

Toutes ces valeurs se trouvent dans `src/lib/escaliers/normes.ts` (en cm, suffixe `_CM`).
Exemple : `CONTREMARCHE_MAX_PRIVE_CM: 20`
