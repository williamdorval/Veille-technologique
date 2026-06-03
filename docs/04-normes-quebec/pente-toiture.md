# Pente de toiture — Minimums selon le revêtement

## Règle
La pente d'un toit doit être assez grande pour que l'eau de pluie et la neige fondue s'écoulent. Si la pente est trop faible, l'eau stagne et ça crée des infiltrations. Le minimum dépend du type de revêtement utilisé.

La pente est souvent exprimée en ratio : 4/12 signifie que le toit monte de 4 unités pour chaque 12 unités horizontales.

## Valeurs
| Type de revêtement | Pente minimale | En degrés approx. | Article CCQ |
|-------------------|----------------|-------------------|-------------|
| Bardeau d'asphalte | 1:3 (4/12) | 18,4° | CCQ 9.26.1 |
| Tôle nervurée (acier) | 1:6 (2/12) | 9,5° | CCQ 9.26.2 |
| Membrane élastomère (1 pli) | 1:50 | 1,1° | CCQ 9.26.3 |
| Membrane élastomère (2 plis soudés) | Toit plat possible | ~0° | CCQ 9.26.3 |

## Source officielle
- Article : CCQ 9.26.1, 9.26.2, 9.26.3 (Code de construction du Québec, Chapitre I – Bâtiment, Partie 9)
- URL : https://qccodes.ca/
- Valeur indicative pour les toitures plates (pratique standard industrie canadienne)
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
PENTE_MIN_BARDEAU_RATIO: 1/3,    // = 4/12
PENTE_MIN_TOLE_RATIO: 1/6,       // = 2/12
PENTE_MIN_MEMBRANE_RATIO: 1/50,
```
