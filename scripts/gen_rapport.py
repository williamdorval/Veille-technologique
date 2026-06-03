"""
Génère docs/rapport.pdf — Rapport de développement Web
Plateforme d'outils pour constructeurs québécois
"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "..", "docs", "rapport.pdf")

ARIAL     = r"C:\Windows\Fonts\arial.ttf"
ARIAL_BD  = r"C:\Windows\Fonts\arialbd.ttf"

BLEU   = (31, 73, 125)
GRIS   = (80, 80, 80)
NOIR   = (20, 20, 20)
BLANC  = (255, 255, 255)
BLEUCLAIR = (220, 230, 242)

class Rapport(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=22)
        self.set_margins(25, 20, 25)
        self.add_font("Arial", "", ARIAL)
        self.add_font("Arial", "B", ARIAL_BD)
        self._current_section = ""

    def _set(self, style="", size=10):
        self.set_font("Arial", style, size)

    def header(self):
        if self.page_no() <= 1:
            return
        self._set("B", 8)
        self.set_text_color(*GRIS)
        self.cell(0, 8, "Plateforme d'outils pour constructeurs québécois - William Dorval", align="L")
        self.ln(0.5)
        self.set_draw_color(*BLEU)
        self.set_line_width(0.3)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(4)
        self.set_text_color(*NOIR)

    def footer(self):
        if self.page_no() <= 1:
            return
        self.set_y(-15)
        self.set_draw_color(*BLEU)
        self.set_line_width(0.3)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(1)
        self._set("", 8)
        self.set_text_color(*GRIS)
        self.cell(0, 8, f"{self.page_no() - 1}", align="C")

    # ------------------------------------------------------------------ helpers

    def titre_section(self, numero, titre):
        self.ln(6)
        self._set("B", 13)
        self.set_text_color(*BLEU)
        self.cell(0, 8, f"{numero}  {titre}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*BLEU)
        self.set_line_width(0.5)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(4)
        self.set_text_color(*NOIR)

    def sous_titre(self, numero, titre):
        self.ln(3)
        self._set("B", 11)
        self.set_text_color(*BLEU)
        self.cell(0, 7, f"{numero}  {titre}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)
        self.set_text_color(*NOIR)

    def corps(self, texte):
        self._set("", 10.5)
        self.set_text_color(*NOIR)
        self.multi_cell(0, 6, texte)
        self.ln(2)

    def puce(self, texte):
        self._set("", 10.5)
        self.set_text_color(*NOIR)
        x = self.get_x()
        self.set_x(30)
        self.cell(5, 6, chr(149))
        self.multi_cell(0, 6, texte)

    def tableau_deux_cols(self, lignes, largeur_col1=60):
        self._set("B", 10)
        self.set_fill_color(*BLEUCLAIR)
        self.set_text_color(*BLEU)
        self.cell(largeur_col1, 7, "Élément", border=1, fill=True)
        self.cell(0, 7, "Valeur / Description", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self._set("", 10)
        self.set_text_color(*NOIR)
        for i, (col1, col2) in enumerate(lignes):
            fill = (i % 2 == 0)
            self.set_fill_color(245, 248, 252) if fill else self.set_fill_color(*BLANC)
            self.cell(largeur_col1, 6.5, col1, border=1, fill=True)
            self.multi_cell(0, 6.5, col2, border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)


# =====================================================================  MAIN  =

pdf = Rapport()

# ─────────────────────────────────────────────  PAGE DE TITRE  ─────────────
pdf.add_page()
pdf.ln(30)
pdf._set("B", 22)
pdf.set_text_color(*BLEU)
pdf.multi_cell(0, 12, "Plateforme d'outils pour\nconstructeurs québécois", align="C")
pdf.ln(6)
pdf.set_draw_color(*BLEU)
pdf.set_line_width(1)
pdf.line(55, pdf.get_y(), 155, pdf.get_y())
pdf.ln(8)

pdf._set("", 13)
pdf.set_text_color(*GRIS)
pdf.multi_cell(0, 8, "Rapport de développement Web", align="C")
pdf.ln(30)

infos = [
    ("Présenté à :", "Nicolas Bourré"),
    ("Présenté par :", "William Dorval"),
    ("Cours :", "420-1SH-SW — Développement Web"),
    ("Établissement :", "Cégep Shawinigan"),
    ("Remis le :", "3 juin 2026"),
]
for label, valeur in infos:
    pdf._set("B", 11)
    pdf.set_text_color(*BLEU)
    pdf.cell(55, 8, label, align="R")
    pdf._set("", 11)
    pdf.set_text_color(*NOIR)
    pdf.cell(0, 8, f"  {valeur}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

pdf.ln(20)
pdf.set_draw_color(*BLEU)
pdf.set_line_width(0.3)
pdf.line(25, pdf.get_y(), 185, pdf.get_y())

# ─────────────────────────────────────────────  TABLE DES MATIÈRES  ────────
pdf.add_page()
pdf._set("B", 16)
pdf.set_text_color(*BLEU)
pdf.cell(0, 10, "Table des matières", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_draw_color(*BLEU)
pdf.set_line_width(0.5)
pdf.line(25, pdf.get_y(), 185, pdf.get_y())
pdf.ln(8)

entrees_toc = [
    ("1.0", "Introduction", "1"),
    ("2.0", "Description du projet", "1"),
    ("  2.1", "Contexte et objectif", "1"),
    ("  2.2", "Méthode de développement (SDD)", "2"),
    ("3.0", "Plugin Escaliers", "2"),
    ("  3.1", "Fonctionnement", "2"),
    ("  3.2", "Normes appliquées (CCQ)", "3"),
    ("  3.3", "Librairies et outils", "3"),
    ("4.0", "Plugin Rampes et garde-corps", "3"),
    ("  4.1", "Fonctionnement", "3"),
    ("  4.2", "Normes appliquées (CCQ)", "4"),
    ("  4.3", "Librairies et outils", "4"),
    ("5.0", "Plugin Plancher", "4"),
    ("  5.1", "Fonctionnement", "4"),
    ("  5.2", "Normes appliquées (CNB 2020 / CCQ)", "5"),
    ("  5.3", "Librairies et outils", "5"),
    ("6.0", "Plugin Toiture", "5"),
    ("  6.1", "Fonctionnement", "5"),
    ("  6.2", "Normes appliquées (CCQ)", "6"),
    ("  6.3", "Librairies et outils", "6"),
    ("7.0", "Plugin Analyse de plan (intelligence artificielle)", "6"),
    ("  7.1", "Fonctionnement", "6"),
    ("  7.2", "Librairies et outils", "7"),
    ("8.0", "Architecture technique", "7"),
    ("  8.1", "Stack technologique", "7"),
    ("  8.2", "Structure du code", "7"),
    ("9.0", "Conclusion", "8"),
    ("", "Références", "8"),
]

for num, titre, page in entrees_toc:
    gras = not num.startswith("  ")
    pdf.set_font("Helvetica", "B" if gras else "", 10.5)
    pdf.set_text_color(*BLEU if gras else GRIS)
    texte = f"{num}  {titre}" if num else titre
    largeur_texte = pdf.get_string_width(texte) + 4
    pdf.cell(largeur_texte, 7, texte)
    pdf._set("", 10.5)
    pdf.set_text_color(*GRIS)
    espace_dispo = 160 - largeur_texte
    nb_points = max(0, int(espace_dispo / pdf.get_string_width(".")) - 1)
    pdf.cell(espace_dispo, 7, "." * nb_points, align="L")
    pdf.cell(0, 7, page, align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# ─────────────────────────────────────────────  CONTENU  ────────────────────
pdf.add_page()

# 1.0 Introduction
pdf.titre_section("1.0", "Introduction")
pdf.corps(
    "Dans le domaine de la construction résidentielle au Québec, les professionnels doivent constamment "
    "jongler avec les exigences du Code de construction du Québec (CCQ) et du Code national du bâtiment "
    "(CNB 2020). Ces calculs, qui portent sur des éléments comme les escaliers, les rampes ou les solives "
    "de plancher, sont souvent effectués manuellement ou à l'aide de tableaux Excel peu fiables. Une erreur "
    "dans ces calculs peut entraîner des travaux non conformes, des risques pour la sécurité et des coûts "
    "de correction importants."
)
pdf.corps(
    "Ce projet propose une alternative concrète : une plateforme web regroupant plusieurs calculateurs "
    "spécialisés, chacun centré sur un élément de construction. L'utilisateur entre ses mesures, "
    "l'application effectue les calculs selon les normes en vigueur, indique si le résultat est conforme "
    "ou non, et produit une visualisation 3D ainsi qu'un plan de construction détaillé."
)

# 2.0 Description du projet
pdf.titre_section("2.0", "Description du projet")

pdf.sous_titre("2.1", "Contexte et objectif")
pdf.corps(
    "La plateforme est conçue comme un ensemble de plugins indépendants, accessibles depuis une interface "
    "web. Le MVP (produit minimum viable) développé dans le cadre de ce cours comprend cinq plugins : "
    "escaliers, rampes et garde-corps, plancher, toiture, et un outil d'analyse de plans par intelligence "
    "artificielle. Tous les calculs se font côté client, sans base de données ni serveur, ce qui garantit "
    "un déploiement simple et une utilisation hors ligne possible."
)

pdf.sous_titre("2.2", "Méthode de développement (SDD)")
pdf.corps(
    "Le projet suit la méthode SDD (Specification Driven Development), une approche structurée qui oblige "
    "à rédiger une spécification complète avant d'écrire une seule ligne de code. Cette méthode a été "
    "choisie pour réduire les erreurs d'implémentation, faciliter la revue de code et documenter les "
    "décisions de conception. Chaque fonctionnalité passe par cinq étapes : spécification, plan "
    "technique, liste de tâches, implémentation et validation."
)

# 3.0 Plugin Escaliers
pdf.titre_section("3.0", "Plugin Escaliers")

pdf.sous_titre("3.1", "Fonctionnement")
pdf.corps(
    "Le plugin d'escaliers est le plus complet de la plateforme. Il calcule toutes les dimensions d'un "
    "escalier intérieur et vérifie leur conformité avec le Code de construction du Québec. L'utilisateur "
    "entre la hauteur totale à monter (hauteur brute) et la longueur disponible au sol, et l'application "
    "calcule automatiquement le nombre de contremarches, la hauteur de chaque contremarche, la profondeur "
    "du giron, et applique la formule de Blondel pour s'assurer que l'escalier sera confortable à monter."
)
pdf.corps(
    "Un système de codes couleur indique l'état de chaque paramètre : vert pour conforme, orange pour "
    "dans la zone d'avertissement (proche de la limite), et rouge pour non conforme. Des recommandations "
    "sont générées automatiquement pour guider l'utilisateur vers une solution. Le plugin produit aussi "
    "une visualisation 3D interactive et un plan de construction avec liste de matériaux."
)

pdf.sous_titre("3.2", "Normes appliquées (CCQ)")
pdf.tableau_deux_cols([
    ("Contremarche (Art. 9.8.4)", "Min. 12,5 cm — Max. 20 cm"),
    ("Giron (Art. 9.8.4)", "Min. 22 cm — Max. 35,5 cm (privé)"),
    ("Formule de Blondel", "2H + G entre 60 et 64 cm (cible : 63 cm)"),
    ("Dégagement en hauteur", "Min. 195 cm (usage privé), 205 cm (commun)"),
    ("Main courante (Art. 9.8.7)", "Hauteur : 86,5 à 96,5 cm"),
    ("Garde-corps (Art. 9.8.8)", "Min. 92 cm, obligatoire si chute > 60 cm"),
    ("Espacement barreaux", "Max. 10 cm"),
    ("Tolérance d'uniformité", "5 mm entre contremarches consécutives"),
])

pdf.sous_titre("3.3", "Librairies et outils")
pdf.tableau_deux_cols([
    ("React Three Fiber", "Rendu 3D de l'escalier dans le navigateur"),
    ("Three.js", "Moteur graphique 3D sous-jacent"),
    ("Zod", "Validation des données saisies par l'utilisateur"),
    ("React Hook Form", "Gestion du formulaire de saisie"),
    ("shadcn/ui", "Composants d'interface (boutons, cartes, onglets)"),
    ("Tailwind CSS v4", "Mise en page et styles visuels"),
])

# 4.0 Plugin Rampes
pdf.titre_section("4.0", "Plugin Rampes et garde-corps")

pdf.sous_titre("4.1", "Fonctionnement")
pdf.corps(
    "Ce plugin calcule les dimensions d'une rampe ou d'un garde-corps selon le contexte d'utilisation "
    "(usage privé ou commun). L'utilisateur entre la longueur de la rampe, la hauteur de chute, choisit "
    "le type d'installation et le matériau. Le plugin vérifie ensuite que les hauteurs requises sont "
    "respectées, calcule la longueur de la main courante avec les prolongements obligatoires aux extrémités, "
    "et génère un plan de construction étape par étape."
)
pdf.corps(
    "Quatre types de matériaux sont supportés, chacun générant une visualisation 3D différente : bois, "
    "métal, verre et câble. La liste de pièces est adaptée en conséquence pour chaque matériau. C'est "
    "le plugin le plus complet en termes de bibliothèque interne, avec cinq modules distincts : types, "
    "normes, calculs, matériaux et plan de construction."
)

pdf.sous_titre("4.2", "Normes appliquées (CCQ)")
pdf.tableau_deux_cols([
    ("Hauteur garde-corps", "Min. 92 cm (privé), 107 cm si chute > 180 cm"),
    ("Obligation garde-corps", "Obligatoire si chute > 60 cm"),
    ("Main courante", "Hauteur : 86,5 à 96,5 cm"),
    ("Espacement barreaux", "Max. 10 cm (enfant ne doit pas passer)"),
    ("Prolongement main courante", "Requis aux deux extrémités"),
])

pdf.sous_titre("4.3", "Librairies et outils")
pdf.tableau_deux_cols([
    ("React Three Fiber", "Visualisation 3D de la rampe et du garde-corps"),
    ("Three.js", "Moteur graphique pour les géométries 3D"),
    ("Zod", "Validation des entrées"),
    ("shadcn/ui + Tailwind", "Interface utilisateur"),
])

# 5.0 Plugin Plancher
pdf.titre_section("5.0", "Plugin Plancher")

pdf.sous_titre("5.1", "Fonctionnement")
pdf.corps(
    "Le plugin de plancher calcule la dimension de solive (joist) nécessaire pour supporter un plancher "
    "selon la portée, la charge et l'essence de bois. Il utilise la formule de flexion d'Euler-Bernoulli "
    "(δ = 5wL⁴/384EI) pour vérifier que la déflexion reste sous la limite L/360 imposée par le CCQ. "
    "L'algorithme teste différentes combinaisons de dimensions (2x6 à 2x12) et d'espacements (300, 400 "
    "et 600 mm) pour trouver la solution la plus économique conforme aux normes."
)
pdf.corps(
    "L'utilisateur entre la portée à franchir, le type de pièce (résidentiel ou commercial/garage), "
    "et l'essence de bois. Le plugin retourne la dimension de solive recommandée, l'espacement optimal "
    "et l'épaisseur minimale de sous-plancher requise. Une visualisation 3D illustre l'assemblage."
)

pdf.sous_titre("5.2", "Normes appliquées (CNB 2020 / CCQ)")
pdf.tableau_deux_cols([
    ("Limite de déflexion", "L/360 (CCQ 9.4.3.1) sous charge vive"),
    ("Charge vive résidentielle", "1,9 kPa (CNB 2020, Table 4.1.5.3)"),
    ("Charge vive commercial/garage", "2,4 kPa"),
    ("Charge morte estimée", "0,5 kPa (fini + isolant + plafond)"),
    ("Sous-plancher ≤ 400 mm", "15,9 mm (5/8\") — CCQ 9.23.15.3"),
    ("Sous-plancher 600 mm", "19,0 mm (3/4\")"),
])

pdf.sous_titre("5.3", "Librairies et outils")
pdf.tableau_deux_cols([
    ("Calcul structurel", "Formule d'Euler-Bernoulli implémentée en TypeScript"),
    ("Essences de bois", "SPF (E=9 500 MPa), Douglas (12 000 MPa), LVL (13 800 MPa)"),
    ("React Three Fiber", "Visualisation 3D de la section de plancher"),
    ("shadcn/ui + Tailwind", "Interface et résultats visuels"),
])

# 6.0 Plugin Toiture
pdf.titre_section("6.0", "Plugin Toiture")

pdf.sous_titre("6.1", "Fonctionnement")
pdf.corps(
    "Le plugin de toiture calcule les quantités de matériaux nécessaires pour couvrir un toit selon ses "
    "dimensions, sa pente et son type. Trois formes de toit sont supportées : deux versants (gable), "
    "à croupe (hip) et en appentis (shed). Le plugin calcule la surface horizontale et la surface "
    "développée (surface réelle à couvrir en tenant compte de la pente), le nombre de chevrons requis, "
    "les quantités de bardeaux ou de membrane, et les surfaces de ventilation selon le CCQ."
)
pdf.corps(
    "La charge de neige est calculée selon la région du Québec, ce qui est particulièrement pertinent "
    "pour les régions nordiques où les charges peuvent être significativement plus élevées. Trois types "
    "de revêtements sont supportés : bardeaux d'asphalte, tôle d'acier et membrane, chacun ayant une "
    "pente minimale différente imposée par le code."
)

pdf.sous_titre("6.2", "Normes appliquées (CCQ)")
pdf.tableau_deux_cols([
    ("Pente min. bardeaux asphalte", "Imposée par CCQ 9.26.1 selon revêtement"),
    ("Pente min. tôle d'acier", "Inférieure à celle des bardeaux"),
    ("Pente min. membrane", "Peut être quasi-plate"),
    ("Ventilation (CCQ 9.19.1.1)", "1/300 de la surface de plafond (entrée + sortie égales)"),
    ("Charge de neige", "CNB 2020, Annexe C, Tableau C-2 selon région QC"),
    ("Surplus de matériaux", "+15% pour coupes et chevauchements (bardeaux)"),
])

pdf.sous_titre("6.3", "Librairies et outils")
pdf.tableau_deux_cols([
    ("Calcul géométrique", "Trigonométrie (cos, tan) en TypeScript pour surfaces développées"),
    ("React Three Fiber", "Visualisation 3D de la charpente et du toit"),
    ("shadcn/ui + Tailwind", "Interface et affichage des résultats"),
])

# 7.0 Plugin Analyse de plan
pdf.titre_section("7.0", "Plugin Analyse de plan (intelligence artificielle)")

pdf.sous_titre("7.1", "Fonctionnement")
pdf.corps(
    "Ce plugin se distingue des autres par l'utilisation d'un modèle d'intelligence artificielle. "
    "L'utilisateur téléverse des photos ou des croquis d'un plan de construction — même manuscrits — "
    "et joint un fichier Excel qui liste les champs à extraire. L'IA analyse les images et tente de "
    "lire les valeurs correspondantes, en attribuant un niveau de confiance (0 à 100) et un statut "
    "à chaque champ : trouvé, incertain, introuvable ou illisible."
)
pdf.corps(
    "Les résultats sont présentés sous forme d'assistant de validation séquentiel, où l'utilisateur "
    "confirme ou corrige chaque valeur une à la fois avant de générer le fichier Excel final. Le prompt "
    "système envoyé au modèle est spécialement conçu pour la lecture de croquis de chantier québécois, "
    "incluant la terminologie locale pour les balcons, escaliers et garde-corps."
)
pdf.corps(
    "Un mécanisme de réessai automatique gère les erreurs 503 de l'API (service temporairement "
    "surchargé), ce qui améliore la fiabilité en conditions réelles."
)

pdf.sous_titre("7.2", "Librairies et outils")
pdf.tableau_deux_cols([
    ("@google/genai", "SDK officiel pour l'API Google Gemini (modèle d'IA multimodal)"),
    ("ExcelJS", "Lecture du fichier Excel de définition des champs et écriture du résultat"),
    ("Next.js API Route", "Endpoint serveur pour appeler l'API Gemini de façon sécurisée"),
    ("shadcn/ui + Tailwind", "Interface de l'assistant de validation carte par carte"),
    ("Lucide React", "Icônes (vérification, avertissement, exportation, etc.)"),
])

# 8.0 Architecture technique
pdf.titre_section("8.0", "Architecture technique")

pdf.sous_titre("8.1", "Stack technologique")
pdf.corps(
    "Toute la plateforme est construite avec des technologies modernes du développement web. Le choix "
    "de Next.js 16 avec l'App Router permet un déploiement simple sur Vercel ou n'importe quel hébergeur "
    "compatible Node.js. React 19 gère l'interface côté client, et TypeScript en mode strict est utilisé "
    "partout pour éviter les erreurs de type qui sont particulièrement coûteuses dans un contexte de "
    "calculs techniques."
)
pdf.tableau_deux_cols([
    ("Framework", "Next.js 16 App Router"),
    ("Interface", "React 19 + TypeScript strict"),
    ("Styles", "Tailwind CSS v4 + shadcn/ui"),
    ("3D", "React Three Fiber + Three.js"),
    ("Formulaires", "React Hook Form + Zod"),
    ("IA", "Google Gemini via @google/genai"),
    ("Excel", "ExcelJS"),
    ("Thème", "next-themes (mode clair/sombre)"),
])

pdf.sous_titre("8.2", "Structure du code")
pdf.corps(
    "Chaque plugin suit la même organisation interne. La logique métier (calculs, normes, types) est "
    "séparée dans src/lib/[plugin]/, tandis que l'interface est dans src/components/plugins/[plugin]/. "
    "Cette séparation permet de tester la logique indépendamment de l'affichage et de maintenir chaque "
    "composant sous la limite de 200 lignes fixée dans les règles du projet. Les constantes de normes "
    "ne sont jamais codées directement dans les composants ; elles sont toujours importées depuis "
    "le fichier normes.ts du plugin concerné."
)

# 9.0 Conclusion
pdf.titre_section("9.0", "Conclusion")
pdf.corps(
    "Ce projet démontre qu'il est possible de produire un outil professionnel utile dans le cadre d'un "
    "cours collégial, à condition d'utiliser une méthode de développement rigoureuse. La combinaison de "
    "la méthode SDD, de TypeScript strict et d'une architecture modulaire a permis de livrer cinq plugins "
    "fonctionnels sans accumulation de dette technique."
)
pdf.corps(
    "Les calculateurs de normes de construction répondent à un besoin réel : les professionnels sur le "
    "terrain n'ont pas toujours accès à un ingénieur ou à un logiciel spécialisé pour vérifier rapidement "
    "si une configuration est conforme. Cette plateforme web, accessible sur téléphone ou tablette, "
    "représente une solution légère et accessible à ce problème."
)
pdf.corps(
    "Pour la suite, les pistes d'amélioration les plus intéressantes seraient l'ajout d'un mode impression "
    "pour produire des rapports PDF directement depuis l'application, la localisation en anglais pour "
    "rejoindre les constructeurs hors Québec, et l'intégration de mises à jour automatiques lorsque "
    "le Code de construction est modifié."
)

# Références
pdf.ln(4)
pdf._set("B", 13)
pdf.set_text_color(*BLEU)
pdf.cell(0, 8, "Références", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_draw_color(*BLEU)
pdf.set_line_width(0.5)
pdf.line(25, pdf.get_y(), 185, pdf.get_y())
pdf.ln(5)

refs = [
    "Gouvernement du Québec. (2023). Code de construction du Québec (CCQ). Régie du bâtiment du Québec. "
    "https://www.rbq.gouv.qc.ca",

    "Conseil national de recherches Canada. (2020). Code national du bâtiment — Canada 2020 (CNB 2020). "
    "https://www.nrc-cnrc.gc.ca",

    "Google LLC. (2024). Google Gemini API — Documentation. "
    "https://ai.google.dev/docs",

    "Vercel. (2024). Next.js 16 — Documentation officielle. "
    "https://nextjs.org/docs",

    "Three.js Authors. (2024). Three.js — Documentation. "
    "https://threejs.org/docs",

    "Patos Mourão, A. (2024). fpdf2 — Documentation. "
    "https://py-pdf.github.io/fpdf2/",

    "shadcn. (2024). shadcn/ui — Composants React accessibles. "
    "https://ui.shadcn.com",
]

pdf._set("", 10)
pdf.set_text_color(*NOIR)
for i, ref in enumerate(refs, 1):
    pdf.set_x(25)
    pdf.multi_cell(0, 6, f"{i}. {ref}")
    pdf.ln(1)

# ─────────────────────────────────────────────  SAUVEGARDE  ────────────────
pdf.output(OUTPUT)
print(f"PDF généré : {OUTPUT}")
