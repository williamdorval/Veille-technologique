"""Patch gen_rapport.py pour ajouter : section 3.4 YouTube, sections 7.3/7.4, section 9.0 Recherche, renumérotation conclusion -> 10.0"""

SCRIPT = r"C:\Users\tiwil\ecole\nico_derniere_session\scripts\gen_rapport.py"

with open(SCRIPT, encoding="utf-8") as f:
    s = f.read()

# ──────────────────────────────────────────────────────────────────────
# 1) Table des matières
# ──────────────────────────────────────────────────────────────────────
s = s.replace(
    '    ("  3.3", "Librairies et outils", "3"),\n    ("4.0", "Plugin Rampes',
    '    ("  3.3", "Librairies et outils", "3"),\n    ("  3.4", "Sources YouTube — émoicq", "3"),\n    ("4.0", "Plugin Rampes'
)

s = s.replace(
    '    ("  7.2", "Librairies et outils", "7"),\n    ("8.0", "Architecture technique", "7"),',
    '    ("  7.2", "Librairies et outils", "7"),\n    ("  7.3", "Validation séquentielle", "7"),\n    ("  7.4", "Intégration Excel", "7"),\n    ("8.0", "Architecture technique", "7"),'
)

s = s.replace(
    '    ("9.0", "Conclusion", "8"),\n    ("", "Références", "8"),',
    '    ("9.0", "Sources de recherche", "8"),\n    ("  9.1", "Calculs — émoicq (YouTube)", "8"),\n    ("  9.2", "Normes de construction", "9"),\n    ("  9.3", "Intelligence artificielle", "9"),\n    ("  9.4", "Technologies web", "9"),\n    ("10.0", "Conclusion", "9"),\n    ("", "Références", "10"),'
)

# ──────────────────────────────────────────────────────────────────────
# 2) Section 3.4 après le tableau librairies escaliers
# ──────────────────────────────────────────────────────────────────────
MARKER_34_OLD = '    ("Tailwind CSS v4", "Mise en page et styles visuels"),\n])\n\n# 4.0 Plugin Rampes'
MARKER_34_NEW = (
    '    ("Tailwind CSS v4", "Mise en page et styles visuels"),\n])\n\n'
    'pdf.sous_titre("3.4", "Sources YouTube \\u2014 émoicq")\n'
    'pdf.corps(\n'
    '    "Toute la logique de calcul du plugin Escaliers vient de la série de vidéos de la chaîne "\n'
    '    "YouTube émoicq, qui explique le calcul d\'un escalier selon les normes de charpenterie "\n'
    '    "québécoise. Chaque vidéo correspond à un exercice précis, reproduit directement dans le code."\n'
    ')\n'
    'pdf.tableau_deux_cols([\n'
    '    ("Exercice 1", "Calculs de base : contremarche, giron, longueur du limon, angle"),\n'
    '    ("Exercice 2", "Loi de Blondel : 2H + G entre 60 et 64 cm (confort de montée)"),\n'
    '    ("Exercice 3", "Blondel-Maximum : 3 rapports qualité + score /100"),\n'
    '    ("Exercice 4", "Course limitée + crochet sous le chevêtre du plancher supérieur"),\n'
    '    ("Exercice 5", "Calcul du puits d\'escalier dans le plancher supérieur"),\n'
    '], largeur_col1=30)\n'
    '\n# 4.0 Plugin Rampes'
)
s = s.replace(MARKER_34_OLD, MARKER_34_NEW)

# ──────────────────────────────────────────────────────────────────────
# 3) Sections 7.3 et 7.4 après le tableau librairies analyse-plan
# ──────────────────────────────────────────────────────────────────────
MARKER_72_OLD = '    ("Lucide React", "Icônes (vérification, avertissement, exportation, etc.)"),\n])\n\n# 8.0 Architecture technique'
MARKER_72_NEW = (
    '    ("Lucide React", "Icônes (vérification, avertissement, exportation, etc.)"),\n])\n\n'
    'pdf.sous_titre("7.3", "Assistant de validation séquentielle")\n'
    'pdf.corps(\n'
    '    "Après l\'analyse IA, les résultats s\'affichent champ par champ. Pour chaque champ, "\n'
    '    "l\'utilisateur voit la valeur trouvée, le niveau de confiance (0-100), le statut "\n'
    '    "(ok / incertain / introuvable / illisible) et une note du modèle. "\n'
    '    "Trois boutons : Oui (valeur correcte), Non (saisie manuelle), Non spécifié (cellule vide)."\n'
    ')\n\n'
    'pdf.sous_titre("7.4", "Format du fichier Excel source")\n'
    'pdf.corps(\n'
    '    "L\'utilisateur prépare un fichier Excel avec les noms de champs en colonne A "\n'
    '    "et des cellules vides en colonne B comme cibles. Après validation, le fichier original "\n'
    '    "est rempli aux cellules cibles et téléchargé sans toucher la mise en forme existante."\n'
    ')\n'
    'pdf.tableau_deux_cols([\n'
    '    ("Colonne A", "Nom du champ à extraire (ex. Giron, Contremarche, Largeur)"),\n'
    '    ("Colonne B vide", "Cellule cible : l\'IA écrit la valeur ici après validation"),\n'
    '    ("Reste du fichier", "Non modifié : formules et mise en forme conservées"),\n'
    '], largeur_col1=50)\n'
    '\n# 8.0 Architecture technique'
)
s = s.replace(MARKER_72_OLD, MARKER_72_NEW)

# ──────────────────────────────────────────────────────────────────────
# 4) Section 9.0 Sources de recherche + renumérotation conclusion -> 10.0
# ──────────────────────────────────────────────────────────────────────
MARKER_CONC_OLD = '# 9.0 Conclusion\npdf.titre_section("9.0", "Conclusion")'
MARKER_CONC_NEW = (
    '# 9.0 Sources de recherche\n'
    'pdf.titre_section("9.0", "Sources de recherche")\n\n'
    'pdf.sous_titre("9.1", "Calculs de charpenterie \\u2014 émoicq (YouTube)")\n'
    'pdf.corps(\n'
    '    "La série YouTube émoicq est la source principale des algorithmes du plugin Escaliers. "\n'
    '    "Les cinq exercices de la série couvrent toutes les formules implémentées dans le code, "\n'
    '    "des calculs de base jusqu\'au puits dans le plancher supérieur. Les formules proviennent "\n'
    '    "directement du Code de construction du Québec — ce qui garantit leur conformité."\n'
    ')\n'
    'pdf.corps(\n'
    '    "Mots-clés utilisés : calcul escalier québec charpenterie, émoicq escalier, "\n'
    '    "calcul contremarche giron québec."\n'
    ')\n\n'
    'pdf.sous_titre("9.2", "Normes de construction (CCQ / RBQ / CNB 2020)")\n'
    'pdf.tableau_deux_cols([\n'
    '    ("rbq.gouv.qc.ca", "Articles du CCQ — escaliers, rampes, garde-corps"),\n'
    '    ("qccodes.ca", "Version lisible du code, recherche par article"),\n'
    '    ("plans-architecture.ca", "Fiches pratiques sur les dimensions réglementaires"),\n'
    '    ("escalierinterieur.ca", "Tableau normes résidentielles vs commerciales"),\n'
    '    ("nrc-cnrc.gc.ca (CNB 2020)", "Charges structurelles, neige par région du Québec"),\n'
    '], largeur_col1=55)\n\n'
    'pdf.sous_titre("9.3", "Intelligence artificielle \\u2014 Gemini")\n'
    'pdf.tableau_deux_cols([\n'
    '    ("ai.google.dev/docs", "Documentation API Gemini : modèles, appel, structured output"),\n'
    '    ("Google AI Studio", "Interface pour tester les prompts en direct avant de coder"),\n'
    '    ("ai.google.dev — vision", "Guide analyse d\'images : inlineData, base64, multi-images"),\n'
    '    ("ai.google.dev — structured-output", "Forcer un JSON de structure fixe en réponse"),\n'
    '], largeur_col1=60)\n\n'
    'pdf.sous_titre("9.4", "Technologies web")\n'
    'pdf.tableau_deux_cols([\n'
    '    ("nextjs.org/docs", "App Router, routes API, désactivation SSR pour ExcelJS"),\n'
    '    ("docs.pmnd.rs/react-three-fiber", "Canvas 3D, hooks, géométries, lumières"),\n'
    '    ("threejs.org/docs", "API Three.js : géométries, matériaux PBR, OrbitControls"),\n'
    '    ("ui.shadcn.com", "Composants React copiés dans le projet"),\n'
    '    ("github.com/exceljs/exceljs", "Lecture et écriture de fichiers .xlsx côté client"),\n'
    '    ("zod.dev", "Validation de schéma TypeScript-first pour les entrées utilisateur"),\n'
    '], largeur_col1=60)\n\n'
    '# 10.0 Conclusion\n'
    'pdf.titre_section("10.0", "Conclusion")'
)
s = s.replace(MARKER_CONC_OLD, MARKER_CONC_NEW)

with open(SCRIPT, "w", encoding="utf-8") as f:
    f.write(s)

print("Patch appliqué.")
