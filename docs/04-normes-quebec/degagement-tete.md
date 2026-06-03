# Dégagement de tête (échappée)

## La règle en simple

Le dégagement de tête (aussi appelé "échappée"), c'est la hauteur libre au-dessus de toi quand tu montes ou descends l'escalier. Imagine que tu te lèves sur une marche : il faut que tu n'aies pas la tête dans le plafond ou dans la poutre.

Cette mesure est prise verticalement depuis le nez de la marche jusqu'au plafond, au plancher du niveau supérieur, ou à tout obstacle au-dessus.

## Les valeurs chiffrées

| Type d'usage | Minimum (cm) | Minimum (pieds/pouces) |
|---|---|---|
| Résidentiel — maison individuelle | 195 cm (1 950 mm) | 6 pi 5 po |
| Résidentiel — sous une poutre ou solive | 185 cm (1 850 mm) | 6 pi 1 po |
| Commun / autre bâtiment | 205 cm (2 050 mm) | 6 pi 9 po |

> **Note :** La valeur de 195 cm (1 950 mm) s'applique aux escaliers intérieurs d'une maison individuelle. Pour les escaliers de sortie dans un immeuble d'appartements, le minimum est généralement 205 cm (2 050 mm).

## À quel type d'escalier ça s'applique

- **Résidentiel privé (Partie 9 du CCQ) :** 195 cm (1 950 mm) minimum — c'est la valeur utilisée dans ce calculateur
- **Résidentiel avec obstruction structurale (poutre) :** 185 cm (1 850 mm) est parfois toléré localement sous une poutre (Valeur indicative — pratique courante, vérifier avec professionnel)
- **Bâtiments non résidentiels et communs (Partie 3 du CNB) :** 205 cm (2 050 mm) minimum

## La source officielle

- **Article 9.8.3.1** du Code de construction du Québec (Chapitre I — Bâtiment), Partie 9
- Source complémentaire : [Plans Architecture — Calcul d'escalier CNB 2020](https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/)
- Source complémentaire : [Rampes et Balcons — Normes RBQ](https://rampesetbalcons.com/blogs/guides/normes-du-batiment-rbq-pour-escaliers-rampes-et-balcons)
- Source complémentaire : [Escalier Intérieur — Guide complet 2026](https://www.escalierinterieur.ca/normes-escalier-quebec-guide-complet/)

> **Avertissement :** La valeur de 195 cm (1 950 mm) est cohérente entre plusieurs sources professionnelles québécoises et correspond à la pratique standard. Elle doit être vérifiée dans le texte officiel du CCQ (rbq.gouv.qc.ca).

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/normes.ts` :

```typescript
// Dégagement de tête
DEGAGEMENT_TETE_MIN_PRIVE_MM: 1950,   // Article 9.8.3.1 CCQ — résidentiel privé (195 cm)
DEGAGEMENT_TETE_MIN_COMMUN_MM: 2050,  // CNB Partie 3 — bâtiments communs (205 cm)
```

Le formulaire demande la hauteur du plafond. Le calculateur vérifie si le dégagement de tête est suffisant en tenant compte de l'angle de l'escalier et de l'endroit où il passe sous le plancher du niveau supérieur. Si le dégagement est insuffisant, un avertissement rouge apparaît avec la valeur manquante.
