# Garde-corps — Hauteur minimale selon hauteur de chute

## Règle
Un garde-corps protège contre les chutes. Sa hauteur dépend de la distance de chute possible. Plus la chute peut être haute, plus le garde-corps doit être haut. En résidentiel, le garde-corps devient obligatoire dès que la chute dépasse 60 cm (600 mm).

## Valeurs
| Situation | Hauteur minimale | Article CCQ |
|-----------|-----------------|-------------|
| Chute ≤ 60 cm (600 mm) | Aucun garde-corps requis | CCQ 9.8.8.1 |
| Chute > 60 cm (600 mm) (résidentiel privé) | 90 cm (900 mm) | CCQ 9.8.8.1 |
| Chute ≥ 180 cm (1 800 mm) (résidentiel privé) | 107 cm (1 070 mm) | CCQ 9.8.8.1 |
| Usage commun / commercial | 107 cm (1 070 mm) | CCQ 9.8.8.1 |
| Balcon côté rue, escalier extérieur > 2 marches | 107 cm (1 070 mm) | CCQ 9.8.8 |

## Source officielle
- Article : CCQ 9.8.8.1 (Code de construction du Québec, Chapitre I – Bâtiment, Partie 9)
- URL : https://qccodes.ca/escaliers-et-rampes/
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
HAUTEUR_CHUTE_SEUIL_MM: 600,       // 60 cm
HAUTEUR_MIN_FAIBLE_MM: 900,       // chute > 60 cm (600 mm) et < 180 cm (1 800 mm)
HAUTEUR_MIN_ELEVEE_MM: 1070,      // chute >= 180 cm (1 800 mm)
HAUTEUR_MIN_COMMUN_MM: 1070,      // usage commun ou commercial
```
