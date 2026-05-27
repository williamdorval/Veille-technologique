# Angle et pente de l'escalier

## La règle en simple

L'angle d'un escalier, c'est son inclinaison par rapport au sol. Un escalier très raide (grand angle) fatigue les genoux et est dangereux. Un escalier presque plat (petit angle) prend beaucoup de place au sol.

L'angle n'est pas directement réglementé par un article chiffré dans le CCQ. C'est plutôt **une conséquence** des règles sur la hauteur de contremarche et le giron. Si tes contremarches et ton giron sont conformes, ton angle est automatiquement dans une plage acceptable.

## Les valeurs chiffrées

### Angle résultant des normes CCQ

| Paramètre | Valeur | Commentaire |
|---|---|---|
| Angle pratique courant | 30° à 40° | Zone de confort pour la majorité des escaliers résidentiels |
| Angle avec H=180 mm, G=270 mm | 33,7° | Escalier idéal typique |
| Angle minimum théorique | ~19° | Si G=355 mm (max) et H=125 mm (min) |
| Angle maximum théorique | ~43° | Si G=210 mm (min) et H=200 mm (max) |

> **Note importante :** Il n'existe pas d'article du CCQ qui dit "l'angle doit être entre X° et Y°". L'angle est calculé comme suit :  
> `angle = arctan(hauteurTotale / longueurAuSol)`  
> ou de façon équivalente :  
> `angle = arctan(hauteurContremarche / giron)`

### Zone de confort reconnue dans le milieu professionnel

| Zone | Angle | Confort |
|---|---|---|
| Trop plat | < 20° | Marche fatigante, prend beaucoup de place |
| Idéal | 25° à 38° | Confortable pour tous les âges |
| Acceptable | 38° à 45° | Praticable mais peut être difficile pour les aînés |
| Trop raide | > 45° | Non recommandé — escalier de meunier seulement |

*Valeur indicative — source : pratique professionnelle standard, non réglementée par un article spécifique du CCQ*

## À quel type d'escalier ça s'applique

- **Tous types :** l'angle est une valeur calculée, pas une contrainte directe
- **Escaliers de meunier (accès grenier, sous-sol) :** parfois jusqu'à 60°–75°, mais ils ne sont pas couverts par les normes des escaliers de passage régulier

## La source officielle

L'angle n'est pas défini par un article spécifique. Les sources de référence pour les valeurs indirectes :

- **Article 9.8.4.1 et 9.8.4.2** du CCQ — contremarche et giron (d'où l'angle est déduit)
- Source complémentaire : [Plans Architecture — Calcul d'escalier CNB 2020](https://plans-architecture.ca/calcul-escalier-cnb-2020-quebec/)
- Source complémentaire : [Treppenmeister — Inclinaison d'escalier](https://www.treppenmeister.com/fr/verifier-l-inclinaison-de-son-escalier/)

> **Avertissement :** Les plages d'angle mentionnées ci-dessus (25°–45°) sont des valeurs de confort pratiques et non des exigences légales directes du CCQ. L'angle est acceptable si et seulement si les contremarches et le giron sont conformes.

## Comment c'est utilisé dans le calculateur

Dans `src/lib/escaliers/calculs.ts` :

```typescript
// Calcul de l'angle
const angleRad = Math.atan2(hauteurTotale, longueurAuSol);
const angleDeg = angleRad * (180 / Math.PI);

// Indicateur de confort (non réglementaire, informatif)
// < 25° : "Escalier très plat — prend beaucoup de place"
// 25°–38° : "Angle idéal ✓"
// 38°–45° : "Angle acceptable, mais raide"
// > 45° : "Escalier très raide — difficile d'utilisation"
```

L'angle est affiché à titre informatif dans les résultats. Il n'est pas un critère de conformité direct — seules les valeurs de contremarche et de giron déclenchent les indicateurs de conformité réglementaire.
