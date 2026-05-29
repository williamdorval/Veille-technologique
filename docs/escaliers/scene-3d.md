# La visualisation 3D — Comment ça fonctionne

> Fichiers source : `src/components/plugins/escaliers/EscalierScene.tsx` et sous-composants

---

## L'outil : React Three Fiber (R3F)

### Three.js c'est quoi ?

**Three.js** est une bibliothèque JavaScript open source qui permet de faire de la **3D dans le navigateur web**, sans plugin. Elle utilise WebGL (l'API graphique des navigateurs modernes) mais simplifie énormément son utilisation.

Sans Three.js, faire de la 3D dans un navigateur nécessiterait des centaines de lignes de code WebGL brut. Avec Three.js, on peut créer une scène en quelques dizaines de lignes.

### React Three Fiber (R3F) c'est quoi ?

**React Three Fiber** est une surcouche de Three.js qui permet d'utiliser Three.js **comme des composants React**. Au lieu d'écrire du code JavaScript impératif (`scene.add(mesh)`), on écrit du JSX déclaratif :

```jsx
<mesh position={[0, 1, 0]}>
  <boxGeometry args={[1, 0.2, 1]} />
  <meshStandardMaterial color="#8B6F47" />
</mesh>
```

C'est plus naturel pour un développeur React et ça s'intègre directement dans l'application Next.js.

---

## Structure de la scène

La scène est divisée en 3 composants après le refactoring :

```
EscalierScene.tsx         ← le "conteneur" de la scène (Canvas + éclairage + contrôles)
  ├── EscalierStructure.tsx  ← les marches, contremarches et limons
  └── EscalierEnvironnement.tsx  ← murs semi-transparents, sol, silhouette humaine
```

### EscalierScene.tsx — Le conteneur

C'est le point d'entrée. Il contient :

- **`<Canvas>`** : remplace un élément `<canvas>` HTML. Tout ce qui est à l'intérieur est rendu en 3D.
- **`<PerspectiveCamera>`** : la "caméra" qui regarde la scène. Elle est positionnée légèrement au-dessus et sur le côté pour avoir une vue en perspective naturelle.
- **`<OrbitControls>`** : permet à l'utilisateur de **tourner, zoomer et déplacer** la vue avec la souris.
- **`<ambientLight>`** : lumière globale diffuse (toute la scène est éclairée uniformément).
- **`<directionalLight>`** : lumière directionnelle (simule le soleil, crée des ombres douces).

### EscalierStructure.tsx — Les marches

Pour chaque marche, on crée un cube (boxGeometry) avec les bonnes dimensions :

```
largeur × hauteur_contremarche × giron
```

Les marches sont empilées les unes au-dessus des autres. La position de chaque marche est calculée :
- Position Y (vertical) : `i × hauteurContremarche` (monte à chaque marche)
- Position Z (profondeur) : `i × giron` (avance à chaque marche)

Les limons sont des boîtes inclinées qui courent le long de l'escalier. On les positionne avec une rotation (l'angle de l'escalier).

### EscalierEnvironnement.tsx — L'environnement

Ajoute du contexte visuel :
- **Sol** : une grande surface grise sous l'escalier
- **Murs** : des panneaux semi-transparents (opacity 0.2) pour simuler les murs de la cage d'escalier
- **Silhouette humaine** : un cylindre et une sphère pour donner l'échelle (voir si l'escalier est proportionné à une personne)
- **Planchers** : les dalles haut et bas entre lesquelles l'escalier monte

---

## Les matériaux PBR

PBR signifie **Physically Based Rendering** (rendu basé sur la physique). Au lieu d'une simple couleur, chaque surface a :

| Propriété | Description | Exemple bois |
|-----------|-------------|--------------|
| `color` | Couleur de base | Brun clair |
| `roughness` | Rugosité (0 = miroir, 1 = très mat) | 0,7 (bois légèrement poncé) |
| `metalness` | Aspect métallique (0 = non métallique) | 0,0 (bois n'est pas métallique) |

Le composant `escalier-scene-types.ts` définit les couleurs selon le matériau choisi dans le formulaire (épinette, bois franc, acier, composite).

---

## Comment les dimensions sont converties pour la 3D

Three.js travaille en **unités arbitraires** (sans unité physique précise). Pour que la scène soit visuellement cohérente, les dimensions en cm sont divisées pour obtenir des valeurs raisonnables dans l'espace 3D :

```javascript
// Exemple : 280 cm → 2.8 unités 3D
const hauteur3D = hauteurTotale / 100;
```

L'important, c'est que les proportions soient correctes, pas les valeurs absolues.

---

## Pourquoi la scène se met à jour en temps réel

L'application recalcule et réaffiche la scène 3D **automatiquement** chaque fois que l'utilisateur change un paramètre dans le formulaire. C'est possible parce que :

1. Le formulaire est un composant React avec état (`useState`, `useForm`)
2. Quand l'état change, React re-rend les composants concernés
3. R3F re-rend automatiquement la scène 3D quand ses props changent
4. Un `debounce` de 300ms évite de recalculer à chaque frappe (attend que l'utilisateur ait fini)

---

## Performances

Pour les boucles qui créent beaucoup de géométries (ex : 15 marches), on utilise `useMemo` pour éviter de recalculer à chaque rendu React :

```javascript
const marches = useMemo(() => {
  return Array.from({ length: nombreMarches }, (_, i) => (
    <mesh key={i} position={[...]} >
      <boxGeometry args={[...]} />
      <meshStandardMaterial color={...} />
    </mesh>
  ));
}, [nombreMarches, hauteurContremarche, giron]);
```

`useMemo` ne recalcule que si les dépendances (ici `nombreMarches`, etc.) changent.
