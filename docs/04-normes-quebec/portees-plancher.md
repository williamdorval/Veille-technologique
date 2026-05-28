# Portées de plancher — Charges et flèche admissible

## Règle
Quand un plancher est chargé (meubles, personnes), il fléchit un peu. Ce fléchissement doit rester dans des limites acceptables pour que le plancher ne craque pas et reste solide. La règle standard est que la flèche ne dépasse pas L/360, où L est la portée de la solive.

Exemple : une solive de 4 000 mm de portée peut fléchir au maximum 4 000 ÷ 360 = 11 mm.

## Valeurs
| Paramètre | Valeur | Source |
|-----------|--------|--------|
| Charge vive résidentielle (chambre, salon) | 1,9 kPa | CNB 2020, Table 4.1.5.3 |
| Charge vive résidentielle (garage) | 2,4 kPa | CNB 2020 |
| Charge vive commercial (bureaux) | 2,4 kPa | CNB 2020 |
| Flèche maximale admissible | L/360 | CNB 2020, Art. 9.4.3.1 |
| Charge morte plancher type | 0,5 kPa | Pratique standard |

## Source officielle
- Article : CNB 2020, Articles 4.1.5.3 et 9.4.3.1
- URL : https://cnrc-nrc.gc.ca/fra/publications/codes_centre/2020_codes_nationaux.html
- Valeur indicative (pratique standard industrie canadienne)
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
CHARGE_VIVE_CHAMBRE_KPA: 1.9,
CHARGE_VIVE_GARAGE_KPA: 2.4,
FLECHE_ADMISSIBLE_RATIO: 360,    // L/360
CHARGE_MORTE_PLANCHER_KPA: 0.5,
```
