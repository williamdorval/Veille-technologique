# Contrats des composants — Calculateur d'escaliers

**Date**: 2026-05-27

---

## Composants et leurs interfaces props

### FormulaireEscalier

Formulaire principal. Gère la saisie, la validation et le déclenchement du calcul.

```typescript
interface FormulaireEscalierProps {
  onCalculer: (entree: EntreeFormulaire) => void;
  isCalculating: boolean;
}
```

**Responsabilités** :
- Afficher tous les champs de saisie avec labels et messages d'erreur
- Valider avec zod en temps réel
- Déclencher `onCalculer` après debounce 300ms ou clic bouton
- Convertir pouces → mm avant de passer au parent

---

### ResultatsConformite

Affiche les 5 indicateurs de conformité avec pastilles colorées.

```typescript
interface ResultatsConformiteProps {
  resultat: ResultatCalcul;
  isLoading: boolean;
}
```

**Responsabilités** :
- Afficher : nombre marches, contremarche, giron, longueur sol, longueur limon, angle
- Afficher 5 indicateurs avec Badge shadcn (vert/orange/rouge)
- Citer l'article CCQ pour chaque indicateur
- Afficher les valeurs en mm ET pouces

---

### ListeMateriaux

Tableau des matériaux avec quantités et estimation de coût.

```typescript
interface ListeMateriauxProps {
  materiaux: PieceMateriaux[];
  estimation: EstimationProjet;
}
```

**Responsabilités** :
- Tableau shadcn Card avec toutes les pièces
- Sous-total de coût estimé avec avertissement "prix indicatifs"
- Format lisible : "2 limons de 3 050 mm × 38 mm × 235 mm"

---

### PlanConstruction

Plan d'exécution étape par étape.

```typescript
interface PlanConstructionProps {
  etapes: EtapeConstruction[];
  entree: EntreeFormulaire;
  resultat: ResultatCalcul;
}
```

**Responsabilités** :
- Afficher les 7 étapes dans des Card shadcn numérotées
- Mettre en évidence les dimensions clés à respecter
- Indiquer les étapes conditionnelles (main courante, garde-corps)

---

### Visualisation3D

Rendu 3D de l'escalier avec fallback SVG.

```typescript
interface Visualisation3DProps {
  resultat: ResultatCalcul;
  entree: EntreeFormulaire;
}
```

**Responsabilités** :
- Charger R3F dynamiquement (ssr: false)
- Détecter WebGL et afficher SVG 2D si absent
- Bouton "Réinitialiser la vue"
- Canvas responsive (100% de la largeur du conteneur)

---

### EscalierMesh

Géométrie Three.js de l'escalier. Composant interne à Visualisation3D.

```typescript
interface EscalierMeshProps {
  nombreMarches: number;
  hauteurContremarche: number;
  giron: number;
  largeur: number;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
  avecContremarches: boolean;
}
```

**Responsabilités** :
- Générer les meshes BoxGeometry pour limons, marches, contremarches
- Appliquer les couleurs par matériau depuis COULEURS_MATERIAUX
- Centrer le modèle à l'origine

---

## Contrats des fonctions lib

### calculerEscalier (src/lib/escaliers/calculs.ts)

```typescript
function calculerEscalier(entree: EntreeFormulaire): ResultatOuErreur
```

**Préconditions** : entree validée par zod  
**Postconditions** : ResultatCalcul complet ou ErreurCalcul avec code et message  
**Erreurs possibles** :
- `HAUTEUR_INVALIDE` : hauteur < 400 ou > 6000 mm
- `LARGEUR_INVALIDE` : largeur < 600 ou > 2500 mm
- `IMPOSSIBLE_DEUX_MARCHES` : hauteur trop basse pour 2 marches minimales

### verifierConformite (src/lib/escaliers/calculs.ts)

```typescript
function verifierConformite(
  dimensions: DimensionsEscalier,
  typeUsage: TypeUsage,
  hauteurPlafond: number
): ConformiteResultat
```

**Utilise** : uniquement les constantes de NORMES_CCQ (jamais de valeurs hardcodées)

### calculerMateriaux (src/lib/escaliers/materiaux.ts)

```typescript
function calculerMateriaux(
  dimensions: DimensionsEscalier,
  options: OptionsConstruction
): PieceMateriaux[]
```

### genererPlanConstruction (src/lib/escaliers/plan-construction.ts)

```typescript
function genererPlanConstruction(
  dimensions: DimensionsEscalier,
  options: OptionsConstruction,
  conformite: ConformiteResultat
): EtapeConstruction[]
```
