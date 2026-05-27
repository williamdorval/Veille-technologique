import { Hammer } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-construction-primaire text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Colonne 1 — Logo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Hammer className="h-5 w-5 text-construction-accent" />
              <span>Plateforme constructeurs</span>
            </div>
            <p className="text-sm text-white/70 max-w-xs">
              Des outils pour concevoir des éléments de construction conformes au
              Code de construction du Québec.
            </p>
          </div>

          {/* Colonne 2 — Liens */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-1">Liens utiles</h3>
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              Accueil
            </Link>
            <Link
              href="/plugins/escaliers"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Calculateur d&apos;escaliers
            </Link>
            <a
              href="https://github.com/williamdorval/Veille-technologique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Colonne 3 — Avertissement légal */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-1">Avertissement</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              ⚠️ Cet outil ne remplace pas la consultation d&apos;un professionnel
              certifié. L&apos;utilisateur reste responsable de la conformité finale
              de toute construction.
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-xs text-white/50">
          © 2026 William Dorval — Projet scolaire, Cégep de Shawinigan, Veille technologique
        </div>
      </div>
    </footer>
  );
}
