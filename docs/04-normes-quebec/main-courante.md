# Main courante

## La règle en simple

La main courante, c'est la barre que tu tiens pour monter ou descendre l'escalier en sécurité. Elle doit être à la bonne hauteur pour que tu puisses l'attraper naturellement sans te pencher ou lever le bras.

Elle est obligatoire dès qu'un escalier a 3 marches ou plus (résidentiel).

## Les valeurs chiffrées

### Hauteur de la main courante

La hauteur se mesure verticalement depuis le nez de la marche jusqu'au dessus de la main courante.

| Paramètre | Valeur (cm) | Valeur (pouces) |
|---|---|---|
| Minimum | 80 cm (800 mm) | 31½ po |
| Maximum | 96,5 cm (965 mm) | 38 po |
| Maximum avec garde-corps requis | 107 cm (1 070 mm) | 42 po |

### Autres exigences

| Paramètre | Valeur | Commentaire |
|---|---|---|
| Distance minimale du mur | 5 cm (50 mm) | Pour pouvoir l'attraper |
| Diamètre si circulaire | 3–5 cm (30–50 mm) | Pour avoir une bonne prise |
| Espacement max des consoles | 120 cm (1 200 mm) | Fixation murale |
| Distance console du bout | 30 cm (300 mm) max | Première et dernière console |
| Profondeur vis dans le mur | 3,2 cm (32 mm) min | Solidité de la fixation |

### Quand la main courante est obligatoire

| Situation | Obligatoire |
|---|---|
| Escalier intérieur ≥ 3 contremarches, logement individuel | Oui, au moins 1 côté |
| Escalier extérieur ≥ 3 contremarches | Oui |
| Escalier ≥ 110 cm (1 100 mm) de largeur | Oui, les deux côtés |
| Escalier < 3 marches | Non (recommandé quand même) |

## À quel type d'escalier ça s'applique

- **Résidentiel privé :** obligatoire à partir de 3 marches (intérieur) ou 3 marches (extérieur)
- **Résidentiel commun :** mêmes règles, souvent les deux côtés requis pour les largeurs de couloir
- **Escalier sur les deux côtés :** obligatoire si largeur ≥ 110 cm (1 100 mm)

## La source officielle

- **Article 9.8.7.4** du Code de construction du Québec (Chapitre I — Bâtiment), Partie 9
- Source complémentaire : [QCCodes — Hauteur des mains courantes](https://www.qccodes.ca/escaliers-et-rampes/hauteur-des-mains-courantes/)
- Source complémentaire : [QCCodes — Mains courantes et garde-corps](https://www.qccodes.ca/escaliers-et-rampes/mains-courantes-et-garde-corps/)
- Source complémentaire : [Rampes et Balcons — Normes RBQ](https://rampesetbalcons.com/blogs/guides/normes-du-batiment-rbq-pour-escaliers-rampes-et-balcons)
- Source complémentaire : [Technorm — Évolution mains courantes CNB](https://technorm.ca/articles/levolution-des-exigences-concernant-les-mains-courantes-dans-le-code-national-du-batiment-cnb/)

> **Avertissement :** Les valeurs min/max (80–96,5 cm (800–965 mm)) sont cohérentes entre plusieurs sources professionnelles citant l'article 9.8.7.4 du CCQ. Elles doivent être vérifiées dans le texte officiel du CCQ (rbq.gouv.qc.ca).

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/normes.ts` :

```typescript
// Main courante
MAIN_COURANTE_HAUTEUR_MIN_MM: 800,   // Article 9.8.7.4 CCQ (80 cm)
MAIN_COURANTE_HAUTEUR_MAX_MM: 965,   // Article 9.8.7.4 CCQ (96,5 cm)
MAIN_COURANTE_HAUTEUR_MAX_AVEC_GARDE_CORPS_MM: 1070, // Article 9.8.7.4 §3 CCQ (107 cm)
MAIN_COURANTE_DISTANCE_MUR_MIN_MM: 50,   // Pour accessibilité (5 cm)
MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES: 3, // Résidentiel privé
MAIN_COURANTE_DOUBLE_MIN_LARGEUR_MM: 1100, // Les deux côtés si largeur ≥ 110 cm (1 100 mm)
```

Le calculateur indique si la main courante est obligatoire selon le nombre de marches calculé et la largeur d'escalier saisie. Ces informations sont affichées dans la section "Plan de construction" avec les spécifications d'installation.
