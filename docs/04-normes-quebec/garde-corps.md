# Garde-corps

## La règle en simple

Le garde-corps (aussi appelé rampe ou balustrade), c'est la barrière de protection sur le côté d'un escalier ou d'un balcon. Son rôle est d'empêcher les gens de tomber. Il est obligatoire dès que la différence de hauteur avec le sol est supérieure à 600 mm (environ 2 pieds).

Il ne faut pas confondre le garde-corps avec la main courante : le garde-corps protège contre les chutes, la main courante aide à se tenir.

## Les valeurs chiffrées

### Hauteur minimale du garde-corps

| Situation | Hauteur minimale (mm) | Hauteur minimale (pouces) |
|---|---|---|
| Escalier résidentiel privé | 900 mm | 35½ po |
| Balcon/terrasse, hauteur sol 600–1 800 mm | 900 mm | 35½ po |
| Balcon/terrasse, hauteur sol > 1 800 mm | 1 070 mm | 42 po |
| Escalier commun / Partie 3 | 1 070 mm | 42 po |

> La hauteur se mesure verticalement depuis le nez de la marche (pour les escaliers) ou depuis le plancher (pour les paliers et balcons).

### Espacement des barreaux (balustres)

| Paramètre | Valeur | Commentaire |
|---|---|---|
| Espacement maximum | 100 mm | Aucune ouverture ne doit permettre le passage d'une sphère de 100 mm de diamètre |

> Cette règle vise à empêcher les enfants de passer la tête ou de se coincer entre les barreaux.

### Quand le garde-corps est obligatoire

| Situation | Obligatoire |
|---|---|
| Chute possible > 600 mm de hauteur | Oui |
| Côtés ouverts d'un escalier | Oui si chute > 600 mm |
| Palier / mezzanine | Oui si > 600 mm du sol |
| Terrasse extérieure | Oui si > 600 mm du sol |

## À quel type d'escalier ça s'applique

- **Résidentiel privé :** 900 mm minimum sur les escaliers et les balcons à hauteur normale
- **Résidentiel avec grande hauteur (> 1,8 m) :** 1 070 mm requis pour les terrasses et balcons élevés
- **Résidentiel commun et commercial :** 1 070 mm souvent requis (plus conservateur)

## La source officielle

- **Article 9.8.8** du Code de construction du Québec (Chapitre I — Bâtiment), Partie 9
- Source complémentaire : [QCCodes — Mains courantes et garde-corps](https://www.qccodes.ca/escaliers-et-rampes/mains-courantes-et-garde-corps/)
- Source complémentaire : [Escalier Saint-Laurent — Normes CCQ](https://escaliersaintlaurent.ca/code-et-normes-de-construction-des-escaliers-et-garde-corps-au-quebec/)
- Source complémentaire : [Rampes et Balcons — Normes RBQ](https://rampesetbalcons.com/blogs/guides/normes-du-batiment-rbq-pour-escaliers-rampes-et-balcons)
- Source complémentaire : [Plans Architecture — Calcul CNB 2020](https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/)

> **Avertissement :** Les valeurs de 900 mm (résidentiel) et 1 070 mm (hauteur élevée) sont cohérentes entre plusieurs sources professionnelles québécoises. Elles doivent être vérifiées dans le texte officiel du CCQ (rbq.gouv.qc.ca).

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/normes.ts` :

```typescript
// Garde-corps
GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM: 900,    // Article 9.8.8 CCQ — résidentiel privé
GARDE_CORPS_HAUTEUR_MIN_ELEVE_MM: 1070,   // Article 9.8.8 CCQ — > 1800mm du sol
GARDE_CORPS_HAUTEUR_MIN_COMMUN_MM: 1070,  // Commun / Partie 3
GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM: 600,  // Obligatoire si chute > 600mm
GARDE_CORPS_BALUSTRE_MAX_MM: 100,         // Espacement maximum barreaux
```

Le calculateur calcule la hauteur de chute potentielle de l'escalier et indique si un garde-corps est obligatoire. Si oui, il affiche la hauteur minimale requise. Les exigences d'espacement des barreaux sont mentionnées dans la section "Plan de construction".
