# Intégration Excel

## Bibliothèque utilisée

Le plugin utilise **ExcelJS** (`exceljs: ^4.4.0`) pour lire et écrire les fichiers `.xlsx` entièrement côté client, dans le navigateur. Aucun serveur n'est impliqué pour cette partie.

ExcelJS a été choisi parce qu'il fonctionne dans le navigateur (avec un peu de configuration), supporte les fichiers `.xlsx` modernes, et permet de modifier des cellules individuelles sans réécrire tout le fichier.

---

## Lecture du fichier source

La fonction `lireChampsDuFichierExcel(buffer)` dans `src/lib/analyse-plan/excel.ts` lit le fichier `.xlsx` fourni par l'utilisateur et retourne la liste des champs à analyser.

### Convention de format du fichier

L'utilisateur prépare son fichier Excel selon cette convention simple :

- **Colonne A** : nom lisible du champ (ex. « Giron »)
- **Colonne B** : cellule vide qui indique où écrire la valeur

La fonction parcourt chaque ligne. Si la colonne A contient du texte et que la colonne B est vide, elle enregistre ce champ avec :
- `etiquette` : le texte de la colonne A
- `cle` : version slug du texte (ex. `giron`, `largeur-escalier`)
- `celluleCible` : la référence de la cellule B (ex. `B4`)

Les lignes où B est déjà remplie sont ignorées (elles contiennent d'autres données du fichier).

---

## Écriture des résultats

La fonction `ecrireResultatsDansExcel(buffer, valeursValidees)` reçoit :
- le fichier Excel original (en mémoire, en tant que buffer)
- la liste des valeurs validées par l'utilisateur, chacune avec sa `celluleCible` et sa `valeur`

Elle ouvre le fichier, écrit chaque valeur dans la cellule correspondante, puis génère un nouveau buffer `.xlsx` que le navigateur télécharge.

### Résultat pour l'utilisateur

Le fichier téléchargé est identique au fichier original, sauf que les cellules cibles sont maintenant remplies avec les valeurs extraites et validées. La mise en forme, les formules et le reste du contenu sont conservés intacts.

---

## Pourquoi ExcelJS est chargé côté client seulement

ExcelJS utilise des modules Node.js qui ne fonctionnent pas côté serveur dans Next.js App Router sans configuration supplémentaire. Le composant `AnalysePlanClient.tsx` utilise `dynamic(() => import(...), { ssr: false })` pour s'assurer qu'ExcelJS n'est chargé que dans le navigateur.
