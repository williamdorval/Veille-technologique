# Assistant de validation séquentiel

## Pourquoi valider manuellement

L'IA peut se tromper. Elle peut mal lire un chiffre manuscrit, confondre deux dimensions proches, ou marquer un champ comme trouvé alors qu'il s'agit d'une valeur d'un autre champ. L'étape de validation donne à l'utilisateur le contrôle final avant d'écrire quoi que ce soit dans le fichier Excel.

---

## Fonctionnement de l'assistant

L'assistant (`ListeValidation.tsx`) présente les champs **un par un**, dans l'ordre. Pour chaque champ, l'utilisateur voit :

- Le nom du champ (ex. « Giron »)
- La valeur trouvée par l'IA (ex. « 10 po »)
- Le niveau de confiance avec un indicateur visuel (vert / orange / rouge)
- La note explicative du modèle

L'utilisateur a trois choix :

| Bouton | Signification |
|--------|--------------|
| **Oui** | La valeur est correcte, elle sera écrite dans le fichier Excel |
| **Non** | La valeur est incorrecte, l'utilisateur entre la bonne valeur manuellement |
| **Non spécifié** | Le champ ne s'applique pas ou est vraiment introuvable — cellule laissée vide |

Quand tous les champs sont traités, un bouton « Générer Excel » apparaît et déclenche le téléchargement.

---

## États de l'interface (3 écrans)

L'orchestrateur `AnalysePlanCalculateur.tsx` gère trois états visuels avec un indicateur d'étapes en haut :

```
[1] Téléverser les fichiers  →  [2] Analyser  →  [3] Valider et exporter
```

| État | Ce qui s'affiche |
|------|-----------------|
| `upload` | Les deux zones d'upload (photos + Excel) et le bouton d'analyse |
| `analyse` | Indicateur de chargement pendant l'appel à Gemini |
| `validation` | L'assistant de validation carte par carte |

L'état ne revient jamais en arrière automatiquement — l'utilisateur peut recharger la page pour recommencer.

---

## Composant CarteChamp

`CarteChamp.tsx` est le composant de base qui affiche un champ individuel. Il reçoit les props :

| Prop | Type | Rôle |
|------|------|------|
| `champ` | `ChampAnalyse` | Données du champ (valeur, confiance, statut, note) |
| `onDecision` | `(valeur: string \| null) => void` | Callback appelé avec la valeur finale (null = Non spécifié) |

Le composant gère son propre état local : mode lecture (Oui / Non / Non spécifié) ou mode édition (quand l'utilisateur clique « Non » pour corriger la valeur).

---

## Gestion des champs non trouvés

Les champs avec statut `introuvable` ou `illisible` sont présentés comme les autres, mais avec un style visuel différent (fond rouge ou orange). L'utilisateur peut :
- Entrer manuellement la valeur s'il la connaît (bouton « Non » → saisie)
- Ignorer le champ (bouton « Non spécifié » → cellule vide dans le Excel)

Cette approche garantit que l'utilisateur reste toujours conscient des champs que l'IA n'a pas pu lire, sans bloquer le flux pour autant.
