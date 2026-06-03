# Sous-plancher — Épaisseur et type de panneaux

## Règle
Le sous-plancher est la couche de panneaux (OSB ou contreplaqué) posée directement sur les solives, avant le plancher fini. Son épaisseur dépend de l'espacement des solives. Plus les solives sont espacées, plus le panneau doit être épais pour ne pas plier entre les solives.

## Valeurs
| Espacement des solives | Épaisseur OSB minimale | Épaisseur contreplaqué minimale |
|------------------------|----------------------|--------------------------------|
| ≤ 40 cm (400 mm) (16 po) | 1,59 cm (15,9 mm) (5/8 po) | 1,59 cm (15,9 mm) (5/8 po) |
| ≤ 60 cm (600 mm) (24 po) | 1,90 cm (19,0 mm) (3/4 po) | 1,90 cm (19,0 mm) (3/4 po) |

Note : L'OSB 3/4 po (19 mm) est le standard courant pour espacements de 16 po.

## Source officielle
- Article : CCQ 9.23.15.3 (revêtement de sol — sous-plancher)
- Valeur indicative (pratique standard industrie canadienne, source officielle non trouvée en ligne libre)
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
EPAISSEUR_OSB_400MM_PO: 0.625,    // 5/8 po = 15,9 mm (1,59 cm)
EPAISSEUR_OSB_600MM_PO: 0.75,     // 3/4 po = 19,0 mm (1,90 cm)
EPAISSEUR_STANDARD_MM: 19.0,
```
