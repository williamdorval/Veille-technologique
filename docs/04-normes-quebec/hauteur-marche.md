# Hauteur de marche (contremarche)

## La règle en simple

La contremarche, c'est la hauteur verticale entre deux marches. Si elle est trop haute, tu vas te fatiguer vite. Si elle est trop basse, tu trébuches facilement. Le Code de construction du Québec fixe des limites précises pour que tout le monde puisse monter et descendre en sécurité.

**Règle importante :** toutes les contremarches d'un même escalier doivent être presque identiques. Une différence de plus de 0,5 cm (5 mm) entre deux marches consécutives, ou de 1 cm (10 mm) entre la plus haute et la plus basse de la volée, c'est non conforme.

## Les valeurs chiffrées

### Escalier résidentiel privé (maison individuelle)

| Paramètre | Valeur (cm) | Valeur (pouces) |
|---|---|---|
| Minimum | 12,5 cm (125 mm) | 5 po |
| Maximum | 20 cm (200 mm) | 7⅞ po |
| Idéal (confort) | 17,5–18,5 cm (175–185 mm) | 7 po |
| Tolérance entre marches consécutives | 0,5 cm (5 mm) max | — |
| Tolérance sur toute la volée | 1 cm (10 mm) max | — |

### Escalier commun (parties communes d'un immeuble)

| Paramètre | Valeur (cm) | Valeur (pouces) |
|---|---|---|
| Minimum | 12,5 cm (125 mm) | 5 po |
| Maximum | 18 cm (180 mm) | 7 po |

> **Note :** La contremarche maximale est plus stricte (18 cm (180 mm) au lieu de 20 cm (200 mm)) pour les escaliers qui servent plusieurs logements ou du public.

## À quel type d'escalier ça s'applique

- **Résidentiel privé :** escalier intérieur d'une maison individuelle ou d'un duplex qui sert un seul logement → max 20 cm (200 mm)
- **Résidentiel commun :** escalier qui dessert plusieurs logements (corridor d'immeuble, escalier de sortie) → max 18 cm (180 mm)
- **Commercial / Partie 3 du CNB :** mêmes règles que commun (max 18 cm (180 mm)), souvent plus strict selon l'usage

## La source officielle

- **Article 9.8.4.1** du Code de construction du Québec (Chapitre I — Bâtiment), Partie 9
- **Article 9.8.4.4** — tolérances d'uniformité
- Source complémentaire : [Plans Architecture — Calcul d'escalier CNB 2020](https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/)
- Source complémentaire : [Escalier Intérieur — Guide complet normes 2026](https://www.escalierinterieur.ca/normes-escalier-quebec-guide-complet/)
- Source complémentaire : [QCCodes — Hauteur de marche et giron](https://www.qccodes.ca/escaliers-et-rampes/hauteur-de-marche-et-giron/)

> **Avertissement :** Les valeurs ci-dessus proviennent de sources professionnelles reconnues qui citent le CCQ. Les numéros d'articles exacts ne peuvent être vérifiés qu'en consultant directement le texte officiel du Code de construction du Québec disponible auprès de la RBQ (rbq.gouv.qc.ca).

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/normes.ts` :

```typescript
// Résidentiel privé
CONTREMARCHE_MIN_MM: 125,   // Article 9.8.4.1 CCQ (12,5 cm)
CONTREMARCHE_MAX_MM: 200,   // Article 9.8.4.1 CCQ — résidentiel privé (20 cm)
CONTREMARCHE_IDEAL_MM: 180, // Valeur de confort professionnelle reconnue (18 cm)

// Commun / Partie 3
CONTREMARCHE_MAX_COMMUN_MM: 180, // Article 9.8.4.1 CCQ — parties communes (18 cm)

// Tolérances
TOLERANCE_MARCHES_CONSECUTIVES_MM: 5,  // Article 9.8.4.4 CCQ (0,5 cm)
TOLERANCE_VOLEE_ENTIERE_MM: 10,        // Article 9.8.4.4 CCQ (1 cm)
```

L'algorithme calcule `hauteurContremarche = hauteurTotale / nombreMarches` et vérifie que le résultat se trouve dans la plage autorisée selon le type d'usage sélectionné. Si non conforme, l'indicateur passe au rouge.
