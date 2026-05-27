Proposition formelle – Veille technologique

Projet : Plateforme web d'aide aux constructeurs avec calculateur d'escaliers conforme aux normes du Québec, développée par Specification Driven Development

Date de remise : À confirmer avec l'enseignant

Étudiant : William Dorval

Cours : Veille technologique – Volet 1 (Specification Driven Development)

Dépôt Git : À déterminer
Introduction

L'intelligence artificielle change beaucoup la façon de développer des applications web. Des outils comme Claude Code, GitHub Copilot et plusieurs autres permettent maintenant à un développeur de générer une grande partie de son code à partir de descriptions écrites. Le problème, c'est que la qualité du résultat dépend presque entièrement de la qualité des instructions données à l'IA. Sans cadre clair, le code produit part dans toutes les directions, oublie des règles importantes ou invente des comportements qui ne sont pas demandés.

Ce projet s'inscrit directement dans ce contexte. L'idée est de démontrer concrètement comment l'approche Specification Driven Development (SDD) permet de structurer le travail d'un développeur qui utilise une IA, et de produire une vraie application web professionnelle en partant d'une spécification rigoureuse plutôt que de prompts improvisés.

Le projet a deux livrables liés : d'un côté une plateforme web destinée aux constructeurs avec un premier plugin fonctionnel (un calculateur d'escaliers conforme aux normes du Québec), et de l'autre une démonstration claire du workflow SDD qui a permis de la construire. L'outil retenu pour le SDD est SpecKit, un cadre développé par GitHub spécifiquement pensé pour fonctionner avec des agents de code comme Claude Code.

Dans le cadre du volet 1, ce projet illustre l'IA au service du développeur de façon concrète : on ne se contente pas d'utiliser une IA pour compléter du code, on lui donne un contexte préparé (spécification, plan, tâches, documentation des règles métier) pour qu'elle puisse implémenter l'application de façon quasi autonome tout en respectant des contraintes réelles.
Prérecherche

Avant de choisir le projet principal, trois idées ont été explorées.
Sujet exploré	Résumé	Pourquoi retenu / rejeté
Plateforme web d'aide aux constructeurs avec plugin calculateur d'escaliers selon les normes du Québec, développée via SDD et Claude Code	Site web modulaire qui regroupe des outils pour les constructeurs. Premier plugin : calculateur qui donne le nombre de marches, la hauteur et la largeur selon les règles du Code de construction du Québec. Le projet sert aussi à démontrer un vrai workflow Specification Driven Development de bout en bout.	Retenu car projet concret et utile (cas d'usage métier réel), parfait pour démontrer le SDD avec Claude Code, et faisable en 7 jours avec un périmètre limité au plugin escaliers.
Générateur automatique de messages de commit Git avec Claude	Script local qui analyse le git diff et génère un message de commit via l'API Claude.	Utile mais trop ciblé. Pas assez ambitieux pour démontrer une vraie méthodologie SDD complète.
Générateur de base de données en PlantUML via une interface web	Site web où Claude pose des questions à l'utilisateur sur son projet, puis génère un diagramme de base de données complet et un fichier .wsd téléchargeable.	Idée créative, mais l'idée 1 permet mieux de démontrer le SDD car elle implique des règles métier précises (normes du Québec) qui forcent une documentation rigoureuse.

L'idée 1 a été retenue parce qu'elle combine deux choses qui m'intéressent vraiment : un cas d'usage métier concret (mon entourage est dans la construction et un outil comme ça serait utile pour de vrai), et la possibilité de démontrer un workflow SDD complet où la qualité de la documentation détermine directement la qualité du code produit par l'IA.
Choix du projet principal

Projet retenu : Plateforme web d'aide aux constructeurs avec calculateur d'escaliers conforme aux normes du Québec, développée par Specification Driven Development

Ce projet a été retenu pour plusieurs raisons.

D'abord, il est directement aligné avec le thème « L'IA au service du développeur ». La méthode utilisée — préparer un contexte complet (spécification, plan, tâches, documentation métier) avant de laisser une IA coder — représente une vraie évolution dans la façon de travailler avec des outils comme Claude Code. C'est très différent du vibe coding où on improvise prompt par prompt.

Ensuite, il respecte les contraintes du volet 1. SpecKit, l'outil SDD choisi, fournit un workflow officiel en quatre phases (Spec → Plan → Tasks → Implement). Chaque phase produit un document écrit qui sert de base à la suivante. C'est exactement l'esprit de la Specification Driven Development.

Le projet a aussi un intérêt personnel fort. Plusieurs personnes de mon entourage travaillent dans la construction et un outil de ce type aurait une vraie utilité. Le sujet me motive donc à fournir un produit propre et pas seulement une démonstration scolaire.

Enfin, le projet est volontairement borné. Pour rester réaliste en sept jours, seul le plugin calculateur d'escaliers est inclus dans le MVP. La plateforme est conçue pour être modulaire afin que d'autres plugins puissent être ajoutés plus tard, mais ils ne font pas partie du livrable de cette session.
Objectifs du projet
Objectif principal

Développer une plateforme web fonctionnelle qui inclut un calculateur d'escaliers conforme aux normes du Québec, en suivant rigoureusement la méthode Specification Driven Development avec SpecKit et Claude Code, afin de démontrer comment une documentation bien structurée permet à une IA d'implémenter une application complète avec un minimum d'intervention manuelle.
Objectifs spécifiques

    Documenter les règles de construction d'escaliers du Code de construction du Québec dans un wiki Obsidian clair et exploitable par Claude Code
    Rédiger une spécification complète du projet avec SpecKit (objectifs, architecture, contraintes, design)
    Produire un plan d'implémentation détaillé et une liste de tâches à partir de la spécification
    Laisser Claude Code implémenter le site web et le plugin escaliers à partir du contexte préparé
    Démontrer le workflow SDD complet de bout en bout pour la communication orale

MVP (Minimum Viable Product)

Le MVP est volontairement limité pour rester réaliste dans un délai de sept jours.

Application cible : Une plateforme web modulaire avec :

    Une page d'accueil qui présente la plateforme et la liste des plugins disponibles
    Un premier plugin fonctionnel : un calculateur d'escaliers conforme aux normes du Québec
    Une structure pensée pour accueillir facilement d'autres plugins plus tard

La plateforme fonctionne entièrement en local (pas de base de données ni de serveur backend nécessaire pour le MVP), en HTML, CSS et JavaScript.

Ce que le MVP doit permettre de faire :

    Naviguer sur la page d'accueil et accéder au plugin escaliers
    Entrer les paramètres de base d'un escalier (hauteur totale à franchir, contraintes d'espace, etc.)
    Obtenir un résultat clair : nombre de marches, hauteur et largeur de chaque marche, conformité aux normes du Québec
    Voir une explication des règles appliquées (basée sur la documentation préparée)

Ce que le MVP ne prétend pas faire :

    Inclure plusieurs plugins (seul l'escalier est dans le MVP, les autres viendront plus tard)
    Intégrer une IA dans le calculateur lui-même (l'algorithme reste mathématique et déterministe pour le MVP, l'intégration d'une IA spécialisée est envisagée dans une version future selon la réponse de l'enseignant sur cette possibilité)
    Gérer des configurations d'escaliers très complexes (escaliers tournants, à paliers multiples, etc.)
    Servir de remplacement à une consultation avec un professionnel certifié

Le MVP démontre surtout que la méthode SDD + Claude Code permet de produire une application réelle, conforme à des règles précises, à partir d'un contexte bien préparé.
Méthodologie et plan de réalisation

Le projet se déroule sur sept jours selon le plan suivant.
Phase 1 — Recherche et documentation des normes (Jours 1-2)

    Recherche sur le Code de construction du Québec, section escaliers (CNB-Québec, partie 9)
    Documentation des règles importantes dans un wiki Obsidian : hauteur et largeur de marche, dégagement de tête, angle de l'escalier, etc.
    Mise en place de l'environnement de travail (VS Code, Git, dépôt GitHub, Obsidian)
    Installation et configuration de SpecKit avec Claude Code

Phase 2 — Spécification et plan (Jour 3)

    Rédaction du fichier CLAUDE.md qui donne tout le contexte du projet à Claude Code
    Rédaction de la spécification complète avec SpecKit (/speckit.specify)
    Génération du plan d'implémentation (/speckit.plan)
    Découpage en tâches concrètes (/speckit.tasks)
    Validation du contexte préparé avant de lancer l'implémentation

Phase 3 — Implémentation du site et du plugin (Jours 4-5-6)

    Lancement de l'implémentation par Claude Code à partir des tâches générées
    Construction de la page d'accueil et de la structure modulaire du site
    Construction du plugin escaliers avec l'algorithme de calcul conforme aux normes
    Commits Git réguliers à chaque tâche complétée
    Ajustements ponctuels si Claude Code dévie de la spécification

Phase 4 — Documentation, rapport et finalisation (Jour 7)

    Vérification finale que les calculs respectent les normes documentées
    Mise à jour du dépôt Git et du wiki Obsidian
    Rédaction du rapport final qui présente la démarche SDD utilisée
    Préparation de la communication orale qui présente le workflow et le résultat

Outils et technologies utilisées
Outil / Technologie	Rôle dans le projet
SpecKit	Cadre Specification Driven Development. Fournit les commandes pour rédiger la spec, générer le plan, découper en tâches et lancer l'implémentation
Claude Code	Agent IA qui implémente le site et le plugin à partir de la spécification, du plan et de la documentation préparée
Obsidian	Wiki local pour documenter les règles du Code de construction du Québec et donner du contexte structuré à Claude Code
VS Code	Environnement de développement principal
Git / GitHub	Gestion des versions du projet, commits réguliers à chaque tâche
HTML / CSS / JavaScript	Technologies utilisées pour le site web et le plugin (vanilla, pas de framework lourd pour rester simple et léger)
Code de construction du Québec	Source officielle des règles applicables pour le calculateur d'escaliers
Résultats attendus et critères de réussite
Résultats attendus

    Une plateforme web fonctionnelle avec page d'accueil et plugin calculateur d'escaliers
    Un calculateur qui respecte les règles du Code de construction du Québec
    Un wiki Obsidian qui documente clairement les règles utilisées
    Une spécification SpecKit complète, un plan détaillé et une liste de tâches qui ont guidé l'implémentation
    Un rapport et une communication orale qui présentent le workflow SDD utilisé

Critères de réussite

    La spécification, le plan et les tâches générés par SpecKit sont clairs et ont effectivement guidé le travail de Claude Code
    Le calculateur d'escaliers donne des résultats conformes aux normes documentées dans le wiki
    Le site est fonctionnel en local sans configuration complexe
    Le dépôt Git est bien organisé avec des commits réguliers qui montrent la progression
    La démarche SDD est claire et reproductible (quelqu'un d'autre pourrait suivre la même méthode)

Conclusion

Ce projet répond à une question concrète pour les développeurs d'aujourd'hui : comment travailler efficacement avec une IA de code comme Claude Code sans tomber dans le vibe coding où le résultat est imprévisible. La réponse explorée ici est la Specification Driven Development : préparer un contexte rigoureux (spécification, plan, tâches, documentation métier) avant que l'IA ne touche au code.

En appliquant cette méthode à un projet réel — une plateforme web pour constructeurs avec un calculateur d'escaliers conforme aux normes du Québec — ce travail démontre concrètement que le SDD permet à une IA de produire une application complète, fonctionnelle et conforme à des règles précises, avec un minimum d'intervention manuelle.

Sur le plan personnel, ce projet me sert deux fois : il me permet de maîtriser une méthode de travail qui va devenir incontournable dans ma carrière de développeur, et il produit un outil concret qui peut être utile à des gens de mon entourage qui travaillent dans la construction.
Utilisation de l'IA

L'intelligence artificielle a été utilisée à plusieurs étapes de la préparation de ce travail.

    ChatGPT a été utilisé pour les premières recherches d'idées de projet.
    Génération d'idées : Claude a été utilisé pour explorer des pistes de projet liées au thème « L'IA au service du développeur » et pour évaluer leur faisabilité en sept jours.
    Choix de l'outil SDD : Claude a aidé à comparer GSD, SpecKit, SuperPowers et OpenSpec, et à choisir SpecKit comme outil le plus adapté au projet.
    Structuration de la proposition : Claude a aidé à organiser les sections du document et à s'assurer que la structure respecte les consignes du professeur.
    Reformulation : Certaines parties du texte ont été reformulées avec l'aide de Claude pour améliorer la clarté et adopter un ton naturel et adapté au niveau cégep.
    Amélioration du contenu : Claude a suggéré des ajustements pour rendre le MVP plus réaliste et la méthodologie plus précise.
    Correction linguistique : Claude a été utilisé pour corriger les fautes d'orthographe, de grammaire et de syntaxe.

Toutes les décisions de contenu, le choix du projet et la démarche globale restent ceux de l'étudiant. L'IA a servi d'outil de soutien, pas de remplacement.
Annexe — Prompts utilisés

Les prompts ci-dessous regroupent les principaux échanges qui ont influencé le résultat final. Certains sont recopiés presque mot pour mot, d'autres sont légèrement nettoyés pour être lisibles, mais leur contenu reflète fidèlement les vraies demandes faites pendant la démarche. Deux outils ont été utilisés : ChatGPT pour les premières recherches d'idées, et Claude pour la rédaction et la structuration du document.
A. Prompts utilisés avec ChatGPT

Prompt 1 — Chercher des idées de projet

    « j'ai un cours de veille techno et je dois faire un projet en lien avec l'IA au service du développeur, donne moi des idées de projet que je pourrais faire en 7 jours »

Prompt 2 — Affiner les idées

    « ok mais je veux quelque chose qui est vraiment en lien avec le métier de développeur, pas juste utiliser une API pour faire afficher du texte, quelque chose de plus concret »

Prompt 3 — Proposer l'idée d'un site pour constructeurs

    « est-ce que ce serait une bonne idée de faire un site web pour des constructeurs avec des plugins genre un calculateur d'escaliers, et de l'utiliser comme un cas d'étude pour montrer comment je peux préparer un contexte parfait pour Claude Code et qu'il code l'app tout seul »

Prompt 4 — Proposer l'idée de générateur de commits Git

    « une autre idée serait un script qui analyse les changements Git et génère automatiquement les messages de commit avec Claude, est-ce que c'est assez pour un projet de 7 jours »

Prompt 5 — Proposer l'idée de base de données

    « une autre idée que j'ai c'est un site web où tu décris ton projet, Claude te pose des questions pour être sûr de comprendre, et à la fin ça génère un schéma de base de données complet en PlantUML avec un fichier .wsd téléchargeable »

B. Prompts utilisés avec Claude

Prompt 6 — Comprendre le SDD et choisir l'outil

    « peux-tu m'expliquer c'est quoi exactement la Specification Driven Development et lequel des outils suggérés par le prof (SuperPowers, SpecKit, OpenSpec, GSD) tu me recommandes pour mon projet de site web pour constructeurs avec un calculateur d'escaliers »

Prompt 7 — Rédiger la proposition formelle complète

    « tu dois me rédiger un fichier Markdown complet pour un travail scolaire en français, avec un ton naturel, simple, sérieux, niveau cégep. Je veux que tu suives le même style de structure que l'exemple de proposition formelle fourni par mon professeur. Je veux imiter la forme, pas copier le contenu. Le nom de l'étudiant c'est William Dorval, le cours c'est Veille technologique, volet 1 Specification Driven Development. »

Prompt 8 — Forcer la prérecherche en tableau

    « je veux que la prérecherche soit faite avec un tableau Markdown comme dans l'exemple du prof, avec 3 colonnes : sujet exploré, résumé, pourquoi retenu ou rejeté »

Prompt 9 — Adapter au nouveau sujet

    « on change le projet, on laisse tomber la boucle Claude Code + Claude dans Chrome, on garde juste un site web d'aide aux constructeurs avec un plugin de calculateur d'escaliers selon les normes du Québec, et on garde l'angle SDD comme méthodologie principale »

e