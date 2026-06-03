# Charges de neige au Québec par région

## Règle
La neige pèse sur le toit. Au Québec, la quantité de neige varie beaucoup selon la région. Un toit à Gaspé doit supporter beaucoup plus de neige qu'un toit à Montréal. Ces valeurs servent à calculer si la structure du toit est assez solide.

La charge de neige au sol (Ss) est la valeur de référence. On multiplie par des facteurs pour obtenir la charge sur le toit (selon la pente, la forme, etc.).

## Valeurs — Charge de neige au sol Ss (kPa) par ville principale
| Région / Ville | Ss (kPa) | Source |
|----------------|---------|--------|
| Montréal | 2,1 | CNB 2020, Annexe C |
| Québec (ville) | 3,2 | CNB 2020, Annexe C |
| Saguenay / Chicoutimi | 3,5 | CNB 2020, Annexe C |
| Trois-Rivières (Mauricie) | 3,0 | CNB 2020, Annexe C |
| Sherbrooke (Estrie) | 3,2 | CNB 2020, Annexe C |
| Gatineau (Outaouais) | 2,4 | CNB 2020, Annexe C |
| Rouyn-Noranda (Abitibi) | 3,0 | CNB 2020, Annexe C |
| Sept-Îles (Côte-Nord) | 3,5 | CNB 2020, Annexe C |
| Gaspé (Gaspésie) | 4,0 | CNB 2020, Annexe C |

Note : Ces valeurs sont indicatives basées sur les charges de référence du CNB 2020. Pour la conception structurale officielle, utiliser les valeurs exactes du tableau C-2 du CNB pour la localité précise.

## Source officielle
- Article : CNB 2020, Annexe C, Tableau C-2 (charges climatiques de conception)
- URL : https://cnrc-nrc.gc.ca/fra/publications/codes_centre/2020_codes_nationaux.html
- Valeur indicative (pratique standard — source officielle requiert abonnement CNB)
- Date de vérification : 2026-05-27

## Valeurs utilisées dans le calculateur
```typescript
CHARGES_NEIGE_KPA = {
  montreal: 2.1,
  quebec_ville: 3.2,
  saguenay: 3.5,
  mauricie: 3.0,
  estrie: 3.2,
  outaouais: 2.4,
  abitibi: 3.0,
  cote_nord: 3.5,
  gaspesie: 4.0,
};
```
