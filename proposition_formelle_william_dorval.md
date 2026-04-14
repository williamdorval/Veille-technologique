# Proposition formelle – Veille technologique

**Projet :** Prototype de boucle d'automatisation du développement web avec Claude Code et Claude dans Chrome

**Date de remise :** 19 avril 2026

**Étudiant :** William Dorval

**Cours :** Veille technologique – Volet 1 (Specification Driven Development)

**Dépôt Git :** À déterminer

---

## Introduction

L'intelligence artificielle occupe une place de plus en plus concrète dans le quotidien des développeurs. Des outils comme GitHub Copilot, Claude Code ou encore des agents capables d'interagir directement avec un navigateur commencent à changer la façon dont on écrit, teste et corrige du code. Ce ne sont plus seulement des outils d'autocomplétion : dans certains cas, ils peuvent prendre en charge des parties entières du cycle de développement.

Ce projet s'inscrit dans ce contexte. L'idée de départ est simple : est-ce qu'on peut créer une mini boucle où un agent IA développe une application, un autre agent vérifie visuellement le résultat dans le navigateur, puis renvoie un retour structuré pour continuer ? Ce genre de boucle, même partielle, représente une évolution importante dans la façon dont les développeurs pourraient travailler dans les prochaines années.

Dans le cadre du volet 1 (Specification Driven Development), l'approche GSD sera utilisée pour structurer les spécifications initiales du projet. C'est à partir de ces spécifications que Claude Code travaillera, et c'est Claude dans Chrome qui validera le résultat visuellement.

Le projet vise à créer un prototype fonctionnel, réaliste et documenté en 7 jours, avec une mini application web très simple et au moins deux itérations complètes de la boucle.

---

## Prérecherche

Avant de choisir le projet principal, trois idées ont été explorées. Le tableau suivant résume cette démarche.

| Sujet exploré | Résumé | Pourquoi retenu / rejeté |
|---|---|---|
| Prototype de boucle d'automatisation du développement web avec Claude Code et Claude dans Chrome | Claude Code génère une app web à partir de spécifications GSD, Claude dans Chrome vérifie visuellement le résultat et renvoie un retour structuré pour corriger, ou le but est vraiment de cré une automatisation complete ou tu donne ton idee est claude code et l'extension verifie et donne els erreur a claude code pour corriegr juste que attend que sa sa fini ou c,est une boucle infinie sans rien toucehr . | Retenu car original, directement lié au thème et réaliste en 7 jours avec un périmètre limité. et super interressant pour les devellopeur|
| Générateur automatique de messages de commit Git avec Claude | Script local qui analyse le `git diff` et génère un message de commit via l'API Claude. | Utile mais trop ciblé. Pas assez ambitieux pour le volet 1. |
| Générateur de base de données en PlantUML via une interface web | Site web où Claude pose des questions à l'utilisateur sur son projet, puis génère automatiquement un diagramme de base de données complet et un fichier `.wsd` téléchargeable. | Idée créative, mais idée 1 meilleur. Moins lié à l'automatisation du cycle de développement que l'idée 1. |

L'idée 1 a été retenue car c,est la meilleur pour mon interret personnel de faire une automatisation de site web au complet sans aucun toucher et review et de copier coller juste donner idée et par la suite totue se faire ou claude repond au qestion de lcaude code ou totue est logique .

---

## Choix du projet principal

**Projet retenu : Prototype de boucle d'automatisation du développement web avec Claude Code et Claude dans Chrome**

Ce projet a été retenu pour plusieurs raisons.

D'abord, il est original. Alors que beaucoup d'outils IA se limitent à assister le développeur sur une seule tâche (compléter du code, trouver des bugs, écrire des tests), ce projet tente de connecter deux agents distincts dans une boucle : l'un pour coder, l'autre pour observer. C'est une configuration encore peu documentée de façon pratique.

Ensuite, il est directement lié au thème « L'IA au service du développeur ». Il ne s'agit pas d'utiliser l'IA pour faire à la place du développeur, mais d'explorer comment elle peut accélérer et structurer certaines parties du travail.

Enfin, il respecte les contraintes du volet 1. Grâce à GSD, les spécifications seront rédigées de façon formelle avant que Claude Code ne commence à travailler. Cela correspond exactement à l'approche Specification Driven Development demandée dans le cadre du cours.

Le projet se concentre sur un prototype simple, pas sur un système autonome parfait. L'objectif est de démontrer que la boucle fonctionne, même de façon imparfaite, sur un exemple concret.

---

## Objectifs du projet

### Objectif principal

Créer un prototype fonctionnel d'une boucle automatisée où Claude Code développe une mini application web à partir de spécifications GSD, Claude dans Chrome vérifie visuellement le résultat, et un retour structuré est produit pour guider les corrections suivantes.

### Objectifs spécifiques

- Rédiger des spécifications initiales claires avec GSD pour une mini application web simple
- Utiliser Claude Code pour générer ou modifier le code de l'application à partir de ces spécifications
- Utiliser Claude dans Chrome pour analyser visuellement l'interface de l'application et produire un retour structuré
- Réaliser au moins deux itérations complètes de la boucle (spécification → génération → vérification → correction)
- Documenter chaque itération pour comparer les résultats et évaluer l'efficacité de l'approche

---

## MVP (Minimum Viable Product)

Le MVP du projet est volontairement limité pour rester réaliste dans un délai de 7 jours.

**Application cible :** Une mini application web simple (ex. : une page de liste de tâches ou un formulaire de contact) développée en HTML, CSS et JavaScript de base. L'interface doit être suffisamment visible pour que Claude dans Chrome puisse l'analyser visuellement.

**Ce que le MVP doit permettre de faire :**

1. Rédiger les spécifications initiales de la mini application avec GSD
2. Lancer Claude Code avec ces spécifications pour générer une première version fonctionnelle de l'application
3. Ouvrir l'application dans le navigateur et demander à Claude dans Chrome d'analyser l'interface
4. Obtenir un retour structuré de Claude dans Chrome (problèmes détectés, éléments manquants, suggestions)
5. Transmettre ce retour à Claude Code pour effectuer des corrections ciblées
6. Réaliser au minimum deux itérations complètes et documentées de cette boucle
7. Comparer les versions produites à chaque itération

**Ce que le MVP ne prétend pas faire :**

- Automatiser entièrement la boucle sans intervention du développeur au debut ou quand sa bloque pour une question de precision que le debut faut donner l'idee avec un bon plan et apres l'execution autonome ou claude chrme va retourner automatiquement a claude code se qui doit etre corriegr ui ou logique selon l'application qu'ilest en train de construire 
- Gérer des applications complexes ou multi-pages
- Remplacer un vrai processus de développement professionnel

Le MVP vise uniquement à démontrer que la boucle est possible et utile, même à petite échelle sans que le developer soti directement devant l'ecran a chaque fin de prompt envoeyr .

---

## Méthodologie et plan de réalisation

Le projet se déroule sur 7 jours selon le plan suivant.

### Phase 1 — Recherche et mise en place (Jours 1)

- Recherche sur le fonctionnement de GSD et comment rédiger des spécifications efficaces
- Exploration des capacités de Claude Code pour la génération de code à partir de spécifications
- Exploration de Claude dans Chrome pour la vérification visuelle d'interfaces
- Mise en place de l'environnement de travail (VS Code, Git, dossier de projet)
- Rédaction des spécifications initiales de la mini application avec GSD

### Phase 2 — Première itération (Jours 2)

- Génération de la première version de l'application avec Claude Code à partir des spécifications GSD
- Ouverture de l'application dans le navigateur
- Vérification visuelle par Claude dans Chrome et collecte du retour structuré
- Documentation des résultats de la première itération

### Phase 3 — Deuxième itération et ajustements (Jours 3-4-5–6)

- Transmission du retour de Claude dans Chrome à Claude Code ( le plsu dure) pour envoyer prompt de claude extension a claude code et qui ne fasse pas la retroaction trop vite qui attende que claude caude aye fini son prompt 
- Génération d'une version corrigée de l'application
- Nouvelle vérification par Claude dans Chrome
- Documentation des résultats de la deuxième itération
- Comparaison des deux versions et analyse des améliorations
- optimisation de detail pour une meilleur automatisation
- l'envoie dans un git commit a chaque changeemnt

### Phase 4 — Rapport et finalisation (Jour 7)

- Rédaction du rapport final
- Mise à jour du dépôt Git
- Préparation de la présentation
- Révision du document de proposition

---

## Outils et technologies utilisées

| Outil / Technologie | Rôle dans le projet |
|---|---|
| **GSD** | Rédaction et structuration des spécifications initiales du projet (approche Specification Driven Development) |
| **Claude Code** | Génération et modification du code de la mini application web à partir des spécifications,et base donner si besoin  |
| **Claude dans Chrome** | Analyse visuelle de l'interface dans le navigateur et production d'un retour structuré |
| **VS Code** | Environnement de développement principal |
| **Git / GitHub** | Gestion des versions du projet et conservation des différentes itérations |
| **HTML / CSS / JavaScript** | Technologies utilisées pour la mini application web |

---

## Résultats attendus et critères de réussite

### Résultats attendus

- Une mini application web fonctionnelle générée à partir de spécifications GSD
- Au moins deux itérations complètes et documentées de la boucle (génération → vérification → correction)
- Un rapport clair comparant les versions produites à chaque itération et évaluant l'efficacité de l'approche

### Critères de réussite

- Les spécifications GSD sont claires, complètes et ont effectivement guidé le travail de Claude Code
- La boucle a fonctionné de bout en bout au moins deux fois, avec un retour utile de Claude dans Chrome à chaque itération
- Les corrections apportées entre chaque itération sont visibles et mesurables
- Le projet est bien documenté et le dépôt Git est organisé et à jour

---

## Conclusion

Ce projet représente une façon concrète d'explorer l'une des questions les plus importantes pour les développeurs d'aujourd'hui : jusqu'où l'IA peut-elle prendre en charge des étapes du cycle de développement de façon autonome ou semi-autonome ?

En combinant GSD pour structurer les spécifications, Claude Code pour générer le code et Claude dans Chrome pour vérifier le résultat visuellement, ce prototype tente de reproduire à petite échelle une boucle de développement partiellement automatisée. Ce n'est pas un système parfait ni complètement autonome, mais c'est une démonstration réelle et documentée que ce genre de boucle est possible.

Sur le plan personnel, ce projet m'intéresse parce qu'il touche directement à mon futur comme développeur. Comprendre comment intégrer des outils IA dans un flux de travail réel — pas juste pour générer des lignes de code, mais pour structurer, vérifier et corriger — c'est une compétence qui va devenir de plus en plus utile. Ce prototype est un premier pas dans cette direction.

---

## Utilisation de l'IA

L'intelligence artificielle a été utilisée à plusieurs étapes de la préparation de ce travail :
- chat gpt a ete utilisiser pour les idée a faire 
- **Génération d'idées :** Claude a été utilisé pour explorer des pistes de projet liées au thème « L'IA au service du développeur » et pour évaluer leur faisabilité en 7 jours.
- **Structuration de la proposition :** Claude a aidé à organiser les sections du document et à s'assurer que la structure respectait les consignes du professeur.
- **Reformulation :** Certaines parties du texte ont été reformulées avec l'aide de Claude pour améliorer la clarté et adopter un ton naturel et adapté au niveau cégep.
- **Amélioration du contenu :** Claude a suggéré des ajustements pour rendre le MVP plus réaliste et la méthodologie plus précise.
- **Correction linguistique :** Claude a été utilisé pour corriger les fautes d'orthographe, de grammaire et de syntaxe.

Toutes les décisions de contenu, le choix du projet et la démarche globale restent ceux de l'étudiant. L'IA a servi d'outil de soutien, pas de remplacement.

---

## Annexe — Prompts utilisés

Les prompts ci-dessous regroupent les principaux échanges qui ont influencé le résultat final. Certains sont recopiés presque mot pour mot, d'autres sont légèrement nettoyés pour être lisibles, mais leur contenu reflète fidèlement les vraies demandes faites pendant la démarche. Deux outils ont été utilisés : ChatGPT pour les premières recherches d'idées, et Claude pour la rédaction et la structuration du document.

---

### A. Prompts utilisés avec ChatGPT

---

**Prompt 1 — Chercher des idées de projet**

> « j'ai un cours de veille techno et je dois faire un projet en lien avec l'IA au service du développeur, donne moi des idées de projet que je pourrais faire en 7 jours »

---

**Prompt 2 — Affiner les idées**

> « ok mais je veux quelque chose qui est vraiment en lien avec le métier de développeur, pas juste utiliser une API pour faire afficher du texte, quelque chose de plus concret »

---

**Prompt 3 — Rejeter les idées trop faciles**

> « non celle là c'est trop facile tu demandes juste à Claude de faire des specs et c'est tout, je veux quelque chose de plus intéressant, donne moi d'autre idée »

---

**Prompt 4 — Proposer l'idée principale**

> « est-ce que ce serait possible de faire une boucle ou Claude Code code une application, Claude dans Chrome regarde l'application dans le navigateur et envoie un retour à Claude Code pour corriger, genre une boucle automatique sans que tu touches à rien »

---

**Prompt 5 — Proposer l'idée de base de données**

> « une autre idée que j'ai c'est un site web où tu décris ton projet, Claude te pose des questions pour être sûr de comprendre, et à la fin ça génère un schéma de base de données complet en PlantUML avec un fichier .wsd téléchargeable »

---

### B. Prompts utilisés avec Claude

---

**Prompt 6 — Rédiger la proposition formelle complète**

> « tu dois me rédiger un fichier Markdown complet pour un travail scolaire en français, avec un ton naturel, simple, sérieux, niveau cégep. Je veux que tu suives le même style de structure que l'exemple de proposition formelle fourni par mon professeur. Je veux imiter la forme, pas copier le contenu. Le nom de l'étudiant c'est William Dorval, le cours c'est Veille technologique, volet 1 Specification Driven Development, la date de remise c'est le 19 avril 2026. »

---

**Prompt 7 — Forcer la prérecherche en tableau**

> « je veux que la prérecherche soit faite avec un tableau Markdown comme dans l'exemple du prof, avec 3 colonnes : sujet exploré, résumé, pourquoi retenu ou rejeté »

---

**Prompt 8 — Raccourcir le tableau**

> « met les prérecherche vraiment plus petit les texte, genre regarde l'exemple c'est vraiment petit comme résumé et pourquoi rejeté »

---

**Prompt 9 — Changer l'idée 3**

> « rajoute que c'est pour créer une base de données en PlantUML ou tu vas écrire avec Claude ou lui il va te poser des questions pour être sûr, et où à la fin ça va créer un .wsd dans le site web ou ça va te donner ta base de données complète en dessin »


