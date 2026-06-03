# Data Model: Calculateur d'escaliers — Plugin complet

**Date**: 2026-05-27

---

## Types TypeScript (src/lib/escaliers/types.ts)

### EntreeFormulaire

```typescript
type UniteMesure = 'mm' | 'pouces';
type TypeUsage = 'residentiel_prive' | 'residentiel_commun' | 'commercial';
type MateriauLimon = 'epinette' | 'bois_franc' | 'acier' | 'composite';
type TypeMarche = 'bois_traite' | 'epinette' | 'bois_franc' | 'contrepalque' | 'composite';

interface EntreeFormulaire {
  hauteurTotale: number;        // toujours en mm (converti si pouces)
  hauteurTotaleSaisie: number;  // valeur brute saisie par l'utilisateur
  uniteMesure: UniteMesure;
  largeur: number;              // mm
  hauteurPlafond: number;       // mm
  typeUsage: TypeUsage;
  contremargesFermees: boolean;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
}
```

### Indicateur de conformité

```typescript
type StatutConformite = 'conforme' | 'avertissement' | 'non_conforme';

interface IndicateurConformite {
  nom: string;
  valeur: number;
  unite: string;
  statut: StatutConformite;
  messageStatut: string;
  plageMin: number;
  plageMax: number | null;
  articleCCQ: string;
  sourceURL: string;
}
```

### Résultat de calcul

```typescript
interface ResultatCalcul {
  // Dimensions
  nombreMarches: number;
  hauteurContremarche: number;    // mm, arrondi 1 décimale
  giron: number;                  // mm, arrondi 1 décimale
  longueurAuSol: number;          // mm
  longueurLimon: number;          // mm, arrondi 1 décimale
  angleDegres: number;            // degrés, arrondi 1 décimale
  blondel: number;                // 2H + G en mm

  // Conformité
  conformite: {
    contremarche: IndicateurConformite;
    giron: IndicateurConformite;
    blondel: IndicateurConformite;
    degagementTete: IndicateurConformite;
    largeur: IndicateurConformite;
  };

  // Matériaux
  materiaux: PieceMateriaux[];
  
  // Construction
  etapesConstruction: EtapeConstruction[];

  // Estimation
  estimation: EstimationProjet;

  // Méta
  estConforme: boolean;            // true si tous les indicateurs sont verts
  avertissements: number;          // nombre d'indicateurs orange
  erreurs: number;                 // nombre d'indicateurs rouges
}
```

### Matériaux

```typescript
interface PieceMateriaux {
  nom: string;
  quantite: number;
  largeur: number | null;     // mm
  hauteur: number | null;     // mm
  longueur: number;           // mm
  unite: string;
  materiau: string;
  prixUnitaireIndicatif: number;  // CAD
}

interface ListeMateriaux {
  pieces: PieceMateriaux[];
  coutTotalMin: number;  // CAD
  coutTotalMax: number;  // CAD
}
```

### Construction

```typescript
interface EtapeConstruction {
  numero: number;
  titre: string;
  description: string;
  dimensionsCles: { label: string; valeur: string }[];
  obligatoireSelonNormes: boolean;
}
```

### Estimation

```typescript
interface EstimationProjet {
  tempsHeures: number;        // arrondi à 0.5h
  coutMin: number;            // CAD
  coutMax: number;            // CAD
  avertissementPrix: string;  // message obligatoire
}
```

### Erreur de calcul

```typescript
interface ErreurCalcul {
  code: string;
  message: string;           // en français, lisible
  champ?: string;            // champ du formulaire concerné
}

type ResultatOuErreur = ResultatCalcul | { erreur: ErreurCalcul };
```

---

## Constantes de normes (src/lib/escaliers/normes.ts)

```typescript
// Toutes les valeurs avec source commentée

export const NORMES_CCQ = {
  // Contremarche — Article 9.8.4.1 CCQ
  CONTREMARCHE_MIN_MM: 125,
  CONTREMARCHE_MAX_PRIVE_MM: 200,
  CONTREMARCHE_MAX_COMMUN_MM: 180,
  CONTREMARCHE_IDEAL_MM: 180,

  // Giron — Article 9.8.4.2 CCQ
  GIRON_MIN_PRIVE_MM: 210,
  GIRON_MIN_COMMUN_MM: 280,
  GIRON_MAX_MM: 355,

  // Largeur — Article 9.8.2.1 CCQ
  LARGEUR_MIN_PRIVE_MM: 860,
  LARGEUR_MIN_COMMUN_MM: 900,

  // Dégagement de tête — Article 9.8.3.1 CCQ
  DEGAGEMENT_TETE_MIN_PRIVE_MM: 1950,
  DEGAGEMENT_TETE_MIN_COMMUN_MM: 2050,

  // Formule de Blondel (confort professionnel reconnu)
  BLONDEL_MIN_MM: 600,
  BLONDEL_MAX_MM: 640,
  BLONDEL_CIBLE_MM: 630,

  // Tolérances — Article 9.8.4.4 CCQ
  TOLERANCE_CONSECUTIVE_MM: 5,
  TOLERANCE_VOLEE_MM: 10,

  // Main courante — Article 9.8.7.4 CCQ
  MAIN_COURANTE_HAUTEUR_MIN_MM: 800,
  MAIN_COURANTE_HAUTEUR_MAX_MM: 965,
  MAIN_COURANTE_OBLIGATOIRE_MIN_MARCHES: 3,
  MAIN_COURANTE_DOUBLE_LARGEUR_MM: 1100,

  // Garde-corps — Article 9.8.8 CCQ
  GARDE_CORPS_HAUTEUR_MIN_PRIVE_MM: 900,
  GARDE_CORPS_HAUTEUR_MIN_ELEVE_MM: 1070,
  GARDE_CORPS_OBLIGATOIRE_HAUTEUR_MM: 600,
  GARDE_CORPS_BALUSTRE_MAX_MM: 100,

  // Hauteur de volée max avant palier
  HAUTEUR_MAX_VOLEE_MM: 3700,
} as const;
```

---

## Flux de données

```
EntreeFormulaire (formulaire validé par zod)
    ↓
calculerEscalier(entree) → ResultatOuErreur
    ↓
    ├── calculerDimensions() → dimensions
    ├── verifierConformite(dimensions, typeUsage) → conformite
    ├── calculerMateriaux(dimensions, options) → materiaux
    ├── genererPlanConstruction(dimensions, options) → etapes
    └── calculerEstimation(dimensions, materiaux) → estimation
    ↓
ResultatCalcul affiché dans les composants React
```

---

## États de l'interface

| État | Déclencheur | Affichage |
|---|---|---|
| `idle` | Page chargée, formulaire vide | Formulaire uniquement, pas de résultats |
| `calculating` | Debounce 300ms actif | Spinner discret |
| `success` | Calcul réussi | Formulaire + tous les panneaux de résultats |
| `error` | Validation échouée | Messages d'erreur inline sur les champs |
| `nonConforme` | Calcul réussi mais indicateurs rouges | Résultats avec badges rouges visibles |
