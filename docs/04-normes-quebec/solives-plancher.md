# Solives de plancher — Dimensions et portées

## Règle
Une solive est une pièce de bois horizontale qui supporte le plancher. Plus la portée (distance entre deux appuis) est grande, plus la solive doit être grande. Le Code de construction du Québec donne des tableaux de portées maximales selon la grosseur du bois et l'espacement entre les solives.

## Valeurs — Portées maximales (en mètres) pour bois SPF n°2, charge vive 1,9 kPa résidentiel
| Dimension | Esp. 300 mm | Esp. 400 mm | Esp. 600 mm |
|-----------|-------------|-------------|-------------|
| 38 × 140 mm (2×6) | 2,60 m | 2,37 m | 2,03 m |
| 38 × 184 mm (2×8) | 3,44 m | 3,13 m | 2,67 m |
| 38 × 235 mm (2×10) | 4,39 m | 3,99 m | 3,41 m |
| 38 × 286 mm (2×12) | 5,33 m | 4,85 m | 4,14 m |

Note : Ces valeurs sont indicatives pour bois SPF catégorie n°2. Consulter le tableau A-9.23.4.2 du CNB 2020 pour les valeurs officielles selon l'essence et la catégorie du bois.

## Source officielle
- Article : CNB 2020, Tableau A-9.23.4.2 (portées des solives de plancher)
- Article CCQ : 9.23.4.2
- URL : https://cnrc-nrc.gc.ca/fra/publications/codes_centre/2020_codes_nationaux.html
- Valeur indicative (pratique standard industrie canadienne, source officielle non trouvée en ligne libre)
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
// Charge vive résidentielle : 1,9 kPa (CNB 2020, Table 4.1.5.3)
// Flèche maximale admissible : L/360
CHARGE_VIVE_RESIDENTIEL_KPA: 1.9,
FLECHE_MAX_RATIO: 360,  // L/360
```
