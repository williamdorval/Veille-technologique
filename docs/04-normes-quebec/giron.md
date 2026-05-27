# Giron (profondeur de marche)

## La règle en simple

Le giron, c'est la profondeur horizontale d'une marche — l'espace où tu poses le pied. S'il est trop petit, tu risques de glisser parce que ton pied dépasse. S'il est trop grand, l'escalier prend trop de place et le pas devient inconfortable.

Le giron se mesure toujours sur la partie rectangulaire de la marche (pas sur le nez de marche qui dépasse).

## Les valeurs chiffrées

### Escalier résidentiel privé (maison individuelle)

| Paramètre | Valeur (mm) | Valeur (pouces) |
|---|---|---|
| Minimum (rectangulaire) | 210 mm | 8¼ po |
| Minimum (recommandé) | 235 mm | 9¼ po |
| Idéal (confort) | 255–280 mm | 10–11 po |
| Maximum | 355 mm | 14 po |

### Escalier commun (parties communes)

| Paramètre | Valeur (mm) | Valeur (pouces) |
|---|---|---|
| Minimum | 280 mm | 11 po |
| Maximum | Sans limite explicite | — |

### Formule de Blondel (confort)

La formule de Blondel est un outil reconnu pour vérifier le confort d'un escalier :

**2H + G = 600 à 640 mm**

- H = hauteur de contremarche (mm)
- G = giron (mm)
- La valeur cible idéale est 630 mm

Exemples :
- H = 180 mm → G idéal = 630 - 2×180 = 270 mm ✓
- H = 175 mm → G idéal = 630 - 2×175 = 280 mm ✓
- H = 190 mm → G idéal = 630 - 2×190 = 250 mm (proche minimum)

> **Note :** La formule de Blondel est un indicateur de confort, pas une exigence légale du CCQ. Mais elle est utilisée dans la pratique professionnelle québécoise.

## À quel type d'escalier ça s'applique

- **Résidentiel privé :** minimum 210 mm (marche rectangulaire) — souvent 235 mm en pratique
- **Résidentiel commun :** minimum 280 mm (exigence plus stricte pour le trafic multiple)
- **Escaliers en colimaçon ou balancés :** règles différentes (non couvert par ce calculateur)

## La source officielle

- **Article 9.8.4.2** du Code de construction du Québec (Chapitre I — Bâtiment), Partie 9
- **Tableau 9.8.4.2** — tableau des dimensions selon l'usage (CCQ 2020)
- Source complémentaire : [Plans Architecture — Calcul d'escalier CNB 2020](https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/)
- Source complémentaire : [QCCodes — Hauteur de marche et giron](https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/)
- Source complémentaire : [Escalier Saint-Laurent — Normes CCQ](https://escaliersaintlaurent.ca/code-et-normes-de-construction-des-escaliers-et-garde-corps-au-quebec/)

> **Avertissement :** La valeur de 210 mm minimum (marche rectangulaire) est cohérente entre plusieurs sources professionnelles. La valeur de 235 mm est citée comme seuil pratique recommandé. Les numéros d'articles exacts doivent être vérifiés dans le texte officiel du CCQ (rbq.gouv.qc.ca).

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/normes.ts` :

```typescript
// Résidentiel privé
GIRON_MIN_MM: 210,          // Article 9.8.4.2 CCQ — marche rectangulaire minimale
GIRON_RECOMMANDE_MIN_MM: 235, // Pratique professionnelle standard
GIRON_IDEAL_MM: 270,        // Via formule de Blondel avec H=180mm
GIRON_MAX_MM: 355,          // Article 9.8.4.2 CCQ

// Commun
GIRON_MIN_COMMUN_MM: 280,   // Article 9.8.4.2 CCQ — parties communes

// Formule de Blondel
BLONDEL_MIN_MM: 600,        // 2H + G minimum
BLONDEL_MAX_MM: 640,        // 2H + G maximum
BLONDEL_CIBLE_MM: 630,      // 2H + G cible idéale
```

L'algorithme calcule le giron idéal avec `giron = BLONDEL_CIBLE - 2 * hauteurContremarche`, puis vérifie les bornes min/max. Un résultat hors plage affiche un indicateur orange (avertissement) ou rouge (non conforme).
