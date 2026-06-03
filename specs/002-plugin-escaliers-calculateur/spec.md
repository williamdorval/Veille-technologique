# Feature Specification: Calculateur d'escaliers — Plugin complet (Tranche 2)

**Version**: 1.0  
**Date**: 2026-05-27  
**Statut**: Prêt pour planification  
**Répertoire**: `specs/002-plugin-escaliers-calculateur`

---

## Vue d'ensemble

### Description

Un calculateur interactif en ligne qui aide les constructeurs amateurs québécois à planifier un escalier droit conforme au Code de construction du Québec (CCQ). L'utilisateur entre les mesures de son espace et l'outil calcule automatiquement toutes les dimensions, vérifie la conformité aux normes, génère la liste des matériaux et produit un plan de construction étape par étape.

L'outil affiche en permanence un avertissement légal indiquant qu'il ne remplace pas un professionnel certifié.

### Problème résolu

Les constructeurs amateurs au Québec n'ont pas de moyen simple de vérifier si leur escalier planifié est conforme aux normes du CCQ avant de commencer à couper le bois. Ils doivent soit consulter des professionnels coûteux, soit faire confiance à leur intuition et risquer une non-conformité.

### Valeur apportée

- Économie de temps : résultats instantanés au lieu de calculs manuels
- Réduction des erreurs : conformité vérifiée automatiquement selon le CCQ
- Prise de décision éclairée : liste de matériaux et estimation de coût avant d'acheter
- Éducation : chaque indicateur cite la norme applicable, aidant l'utilisateur à comprendre les règles

---

## Acteurs

| Acteur | Description |
|---|---|
| Constructeur amateur | Propriétaire ou bricoleur qui veut construire un escalier lui-même |
| Entrepreneur licencié | Professionnel qui utilise l'outil pour une estimation rapide |

---

## Scénarios d'utilisation

### Scénario 1 — Planification initiale d'un escalier résidentiel

**Acteur** : Constructeur amateur  
**Contexte** : Il veut construire un escalier intérieur entre son rez-de-chaussée et son sous-sol.

1. L'utilisateur ouvre la page `/plugins/escaliers`
2. Il voit l'avertissement légal permanent en haut de page
3. Il entre la hauteur totale (ex. : 2 800 mm), la largeur (ex. : 900 mm), la hauteur de plafond (ex. : 2 400 mm)
4. Il sélectionne "Résidentiel privé" comme type d'usage
5. Il choisit "Épinette" comme matériau pour les limons et les marches
6. L'outil calcule automatiquement : 16 marches, contremarche 175 mm, giron 275 mm, angle 32°
7. Tous les indicateurs de conformité sont verts
8. Il consulte la liste de matériaux avec les quantités exactes
9. Il lit le plan de construction en 7 étapes
10. Il imprime la fiche complète pour l'atelier

**Résultat attendu** : L'utilisateur repart avec un plan complet, conformé au CCQ, prêt à être exécuté.

### Scénario 2 — Détection de non-conformité

**Acteur** : Constructeur amateur  
**Contexte** : Il a une contrainte d'espace et veut un escalier très compact.

1. Il entre une hauteur totale de 2 800 mm avec une longueur au sol de seulement 1 200 mm
2. L'outil calcule un giron de 75 mm (insuffisant)
3. L'indicateur "Giron" passe au rouge avec le message "Giron trop petit (75 mm). Minimum requis : 210 mm (Art. 9.8.4.2 CCQ)"
4. L'outil suggère : "Pour cette hauteur, il faut au minimum 1 680 mm de longueur au sol"
5. L'utilisateur comprend qu'il doit revoir son plan ou consulter un professionnel

**Résultat attendu** : L'utilisateur est informé de la non-conformité avant de couper du bois.

### Scénario 3 — Changement d'unité de mesure

**Acteur** : Constructeur amateur  
**Contexte** : Il a les mesures en pouces depuis ses plans existants.

1. Il sélectionne "Pouces" comme unité de mesure
2. Il entre 110 po (hauteur totale), 36 po (largeur), 95 po (plafond)
3. L'outil convertit et calcule normalement
4. Les résultats sont affichés dans les deux unités (mm et pouces)

### Scénario 4 — Visualisation 3D

**Acteur** : Constructeur amateur  
**Contexte** : Il veut visualiser l'escalier avant de commander les matériaux.

1. Après le calcul, il fait pivoter la vue 3D pour voir l'escalier sous différents angles
2. Les limons sont affichés dans la couleur du matériau choisi
3. Les marches sont dans la couleur du type de marche sélectionné
4. Sur un navigateur sans WebGL, une vue SVG 2D (profil latéral) s'affiche à la place

---

## Exigences fonctionnelles

### EF-01 — Formulaire de saisie

- L'utilisateur peut entrer : hauteur totale, largeur, hauteur de plafond, unité de mesure, type d'usage, présence de contremarches fermées, matériau du limon, type de marches
- Toutes les entrées numériques sont validées en temps réel avec des messages d'erreur en français
- Le calcul se déclenche automatiquement 300 ms après la dernière modification (debounce)
- Un bouton "Calculer" permet aussi de déclencher le calcul manuellement
- Les valeurs hors plage (ex. : hauteur < 400 mm) bloquent le calcul avec un message explicatif

### EF-02 — Calcul des dimensions

- Le nombre de marches est calculé de façon à minimiser l'écart à la contremarche idéale (180 mm)
- La hauteur de contremarche exacte est `hauteurTotale / nombreMarches`
- Le giron est calculé via la formule de Blondel : `630 - 2 × hauteurContremarche`, ajusté dans les bornes min/max
- La longueur au sol est `nombreMarches × giron`
- La longueur du limon est `sqrt(longueurAuSol² + hauteurTotale²)`
- L'angle est `arctan(hauteurTotale / longueurAuSol)` en degrés

### EF-03 — Indicateurs de conformité (P1)

- Cinq indicateurs avec pastille colorée : contremarche, giron, formule de Blondel, dégagement de tête, largeur
- Vert = conforme, Orange = avertissement (valeur proche d'une limite), Rouge = non conforme
- Chaque indicateur affiche : valeur calculée, plage requise, numéro d'article CCQ
- Les seuils varient selon le type d'usage sélectionné (résidentiel privé vs commun vs commercial)

### EF-04 — Liste de matériaux (P2)

- Limons : 2 pièces, longueur = longueur limon + 150 mm de jeu, section selon matériau
- Marches : `nombreMarches` pièces, dimensions `largeur × (giron + 25 mm nosing)`
- Contremarches : `nombreMarches` pièces si option "fermé" activée, dimensions `largeur × hauteurContremarche`
- Quincaillerie : vis, boulons et supports d'ancrage avec quantités calculées
- Affichage en tableau avec colonnes : élément, quantité, dimensions, unité

### EF-05 — Plan de construction (P2)

- 7 étapes générées automatiquement selon les paramètres
- Chaque étape contient : titre, description, dimensions clés à respecter
- Les étapes mentionnent la main courante si ≥ 3 marches et le garde-corps si hauteur de chute > 600 mm

### EF-06 — Visualisation 3D (P2)

- Vue orbite interactive (rotation, zoom, pan)
- Couleurs différenciées par matériau (limons vs marches vs contremarches)
- Fallback automatique vers une vue SVG 2D (coupe latérale) si WebGL non disponible
- Bouton pour réinitialiser la vue à la position par défaut

### EF-07 — Estimation temps et coût (P3)

- Estimation du temps de construction basée sur le nombre de marches et le matériau
- Estimation du coût en fourchette basse/haute basée sur les prix indicatifs 2025
- Avertissement visible que les prix sont indicatifs et peuvent varier

### EF-08 — Impression (P3)

- Bouton "Imprimer / Enregistrer PDF" utilisant la fonction d'impression du navigateur
- CSS d'impression optimisé : dimensions, conformité, matériaux, plan inclus ; visualisation 3D exclue

### EF-09 — Avertissement légal

- Alerte permanente affichée en haut de page, non effaçable
- Contenu : recommande de consulter un professionnel certifié, de vérifier les permis municipaux, et indique que les normes doivent être confirmées via la version officielle du CCQ

### EF-10 — Accessibilité et responsive

- Interface fonctionnelle à partir de 375 px de largeur (mobile first)
- Layout 2 colonnes sur desktop (≥ 768 px) : formulaire à gauche, résultats à droite
- Layout 1 colonne sur mobile : formulaire en haut, résultats en bas

---

## Exigences non fonctionnelles

| Catégorie | Exigence |
|---|---|
| Performance | Résultats affichés en moins de 100 ms après saisie |
| Accessibilité | Labels sur tous les champs, messages d'erreur associés aux champs |
| Navigateurs | Fonctionne sur Chrome, Firefox, Safari (2 dernières versions) |
| Mobile | Entièrement utilisable sur écran 375 px sans défilement horizontal |
| Hors ligne | Fonctionne sans connexion internet (tout côté client) |

---

## Critères de succès

1. Un utilisateur peut obtenir un résultat complet (dimensions + conformité) en moins de 2 minutes après avoir ouvert la page
2. 100 % des escaliers non conformes aux normes CCQ déclenchent au moins un indicateur rouge ou orange
3. La liste de matériaux est générée automatiquement pour 100 % des calculs valides
4. La visualisation 3D (ou SVG fallback) s'affiche pour 100 % des calculs valides
5. La page est entièrement fonctionnelle sur un écran de 375 px de large
6. L'avertissement légal est visible sur tous les écrans sans avoir à défiler

---

## Entités clés

### EntreeFormulaire

| Champ | Type | Contraintes |
|---|---|---|
| hauteurTotale | nombre (mm) | 400–6000 |
| largeur | nombre (mm) | 600–2500 |
| hauteurPlafond | nombre (mm) | 1800–4000 |
| uniteMesure | enum | 'mm' \| 'pouces' |
| typeUsage | enum | 'residentiel_prive' \| 'residentiel_commun' \| 'commercial' |
| contremargesFermees | booléen | — |
| materiauLimon | enum | 'epinette' \| 'bois_franc' \| 'acier' \| 'composite' |
| typeMarches | enum | 'bois_traite' \| 'epinette' \| 'bois_franc' \| 'contrepalque' \| 'composite' |

### ResultatCalcul

| Champ | Type | Description |
|---|---|---|
| nombreMarches | entier | Nombre total de contremarches |
| hauteurContremarche | nombre (mm) | Hauteur exacte de chaque marche |
| giron | nombre (mm) | Profondeur de chaque marche |
| longueurAuSol | nombre (mm) | Emprise horizontale totale |
| longueurLimon | nombre (mm) | Longueur des pièces de limon |
| angle | nombre (°) | Angle d'inclinaison de l'escalier |
| conformite | objet | Résultats de validation par indicateur |
| materiaux | tableau | Liste des pièces avec quantités |
| etapesConstruction | tableau | Plan de construction en étapes |

---

## Limites du périmètre

**Inclus dans cette tranche :**
- Escaliers droits à une seule volée
- Trois types d'usage : résidentiel privé, résidentiel commun, commercial
- Visualisation 3D avec fallback SVG

**Exclus de cette tranche :**
- Escaliers tournants, balancés ou colimaçons
- Escaliers à paliers intermédiaires
- Calculs de résistance structurale
- Mise à jour automatique des prix en temps réel
- Base de données ou backend (tout côté client)
- Authentification utilisateur
- Sauvegarde des calculs

---

## Hypothèses et dépendances

### Hypothèses

- Les normes CCQ documentées dans `docs/04-normes-quebec/` sont exactes et à jour
- Les prix indicatifs des matériaux sont basés sur les tarifs moyens québécois 2025
- Le nosing (nez de marche) standard est de 25 mm (pratique courante)
- La hauteur cible de contremarche idéale est 180 mm (valeur de confort reconnue)
- La cible Blondel est 630 mm (2H + G = 630)
- Les supports d'ancrage standard sont 2 en bas + 2 en haut

### Dépendances techniques

- `@react-three/fiber` et `@react-three/drei` installés (visualisation 3D)
- `react-hook-form` et `zod` installés (formulaire et validation)
- Composants shadcn : Button, Card, Badge, Input, Separator, Alert disponibles
- Next.js 16 App Router avec support Client Components (`'use client'`)

---

## Références

- `docs/03-mvp/plugin-escaliers.md` — Spécification fonctionnelle détaillée
- `docs/04-normes-quebec/index.md` — Tableau de référence complet des normes CCQ
- `docs/05-design/index.md` — Design system et couleurs
