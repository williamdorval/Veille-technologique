# Ventilation de toiture — Ratio et exigences

## Règle
Un toit doit respirer. Sans ventilation, l'humidité s'accumule dans le grenier et provoque de la moisissure et une détérioration de la structure. La règle de base est qu'on doit avoir au minimum 1 cm² d'ouverture de ventilation pour chaque 300 cm² de surface de plafond (ratio 1/300).

La moitié de la ventilation doit être en bas du toit (dans les soffites) et l'autre moitié en haut (faîtière ou évent de toit).

## Valeurs
| Paramètre | Valeur | Article |
|-----------|--------|---------|
| Ratio ventilation minimum (sans pare-vapeur) | 1/300 (superficie vent. / superficie plafond) | CCQ 9.19.1.1 |
| Ratio ventilation minimum (avec pare-vapeur) | 1/300 | CCQ 9.19.1.1 |
| Ventilation basse (soffites) | ≥ 50% du total | CCQ 9.19.1.3 |
| Ventilation haute (faîtière) | ≥ 50% du total | CCQ 9.19.1.3 |
| Espace minimum entre isolation et panneau de toit | 63 mm (2,5 po) | CCQ 9.19.1.2 |

## Source officielle
- Article : CCQ 9.19.1.1 à 9.19.1.3 (Code de construction du Québec, Chapitre I – Bâtiment, Partie 9)
- URL : https://qccodes.ca/
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
RATIO_VENTILATION: 1/300,   // surface ventilation / surface plafond
RATIO_VENTILATION_BAS: 0.5, // 50% en soffites
RATIO_VENTILATION_HAUT: 0.5, // 50% en faîtière
```
