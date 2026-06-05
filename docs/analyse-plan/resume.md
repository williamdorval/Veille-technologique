# Résumé simple — Comment fonctionne l'analyse de plan

Ce fichier explique le flux complet du plugin en termes simples, de l'envoi des fichiers jusqu'au Excel final.

---

## Le flux en 5 étapes

```
[1] Tu téléverses les photos du plan
        ↓
[2] Tu téléverses ton fichier Excel (liste des champs à chercher)
        ↓
[3] L'IA analyse les images et lit les valeurs
        ↓
[4] Tu valides champ par champ (Oui / Non / Pas trouvé)
        ↓
[5] Le fichier Excel est généré et téléchargé
```

---

## Étape 1 — Téléverser les photos

Tu glisses-déposes une ou plusieurs photos de ton plan dans la zone prévue. Ça peut être :
- une photo prise avec ton téléphone
- un scan ou une photo d'un croquis manuscrit
- plusieurs photos si le plan est en plusieurs parties

Les images sont stockées temporairement dans le navigateur — rien n'est envoyé à un serveur de fichiers.

---

## Étape 2 — Téléverser le fichier Excel

Tu prépares un fichier `.xlsx` simple avec deux colonnes :

| Colonne A | Colonne B |
|-----------|-----------|
| Giron | *(vide — l'IA va remplir ici)* |
| Contremarche | *(vide)* |
| Largeur escalier | *(vide)* |

La colonne A dit **quoi chercher**. La colonne B est l'endroit où la valeur sera écrite.

---

## Étape 3 — L'IA analyse les images

Quand tu cliques « Analyser », voici ce qui se passe :

1. Les images sont converties en base64 (un format texte que l'API comprend)
2. La liste des champs (colonne A de l'Excel) est transformée en instructions pour l'IA
3. Tout ça est envoyé à l'API Gemini 2.0 Flash — un modèle d'IA de Google qui sait lire du texte et des images en même temps
4. L'IA retourne un JSON structuré avec, pour chaque champ :
   - **La valeur trouvée** (ex. `10`, `"illisible"`, ou `null`)
   - **Un niveau de confiance** de 0 à 100 (100 = certain, moins de 50 = à vérifier)
   - **Un statut** : `ok` / `incertain` / `introuvable` / `illisible`
   - **Une note** qui explique pourquoi (ex. « valeur visible clairement » ou « champ absent des images »)

L'IA ne devine **jamais** une valeur absente — elle indique `introuvable` si elle ne voit pas le champ dans les images.

---

## Étape 4 — Tu valides champ par champ

L'assistant te présente les résultats **un champ à la fois**. Pour chacun, tu vois :

- Le nom du champ
- La valeur proposée par l'IA avec son unité (en pouces, comme c'est l'usage sur les chantiers québécois)
- Un indicateur de couleur : 🟢 vert (confiant), 🟡 orange (incertain), 🔴 rouge (douteux ou non trouvé)
- La note explicative du modèle

Tu as trois boutons :

| Bouton | Effet |
|--------|-------|
| **Oui** | La valeur est correcte → elle sera écrite dans le Excel |
| **Non** | La valeur est fausse → tu entres la bonne manuellement |
| **Non spécifié** | Le champ n'existe pas sur ce plan → cellule laissée vide |

---

## Étape 5 — Le fichier Excel est généré

Une fois tous les champs validés, tu cliques « Générer Excel ». Le plugin :

1. Reprend ton fichier Excel original (tel quel — mise en forme, formules, autres données intacts)
2. Écrit chaque valeur validée dans la cellule cible de la colonne B
3. Génère un nouveau fichier `.xlsx` et déclenche le téléchargement dans ton navigateur

Rien n'est envoyé à un serveur. Tout se passe dans le navigateur.

---

## Ce que l'IA ne fait pas

| Limitation | Pourquoi |
|-----------|---------|
| Elle ne lit pas les croquis trop flous | Impossible à distinguer même pour un humain |
| Elle ne connaît pas les normes CCQ | Elle lit les valeurs, elle ne les vérifie pas |
| Elle ne corrige pas les erreurs de mesure | Elle retranscrit ce qui est visible, sans interpréter |
| Elle ne mémorise pas les plans précédents | Chaque analyse est indépendante |

C'est pour ça que la validation manuelle (étape 4) est obligatoire — l'IA est un assistant de lecture, pas un ingénieur.
