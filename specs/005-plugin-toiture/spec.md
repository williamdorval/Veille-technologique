# Feature: Plugin Estimation de toiture

## Description
Outil d'estimation de surface et de matériaux de toiture, avec vérification de la pente minimale.

## Entrées
- Longueur et largeur du bâtiment (mm)
- Pente en degrés
- Type de toit : deux versants / croupe / appentis
- Type de revêtement : bardeau asphalte / tôle acier / membrane
- Région du Québec (pour charges de neige)
- Débord de toit (mm)

## Sorties
- Surface horizontale et surface développée (m²)
- Quantité de paquets de bardeaux ou surface de membrane
- Nombre et longueur des chevrons
- Surface de ventilation requise (entrée + sortie)
- Charge de neige de la région
- Indicateur de conformité pente (CCQ 9.26)
- Visualisation 3D du bâtiment avec toit

## Normes applicables
- CCQ 9.26.1 : pente min bardeau asphalte (4/12 = 18,4°)
- CCQ 9.26.2 : pente min tôle acier (2/12 = 9,5°)
- CCQ 9.26.3 : pente min membrane (~1,1°)
- CCQ 9.19.1.1 : ventilation ratio 1/300
- CNB 2020, Annexe C : charges de neige par région
