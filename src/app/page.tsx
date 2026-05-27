import {
  Check,
  Construction,
  Fence,
  Square,
  Triangle,
} from 'lucide-react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { PluginCard } from '@/components/PluginCard';

const PLUGINS = [
  {
    icon: Construction,
    title: "Calculateur d'escaliers",
    description:
      "Calcule les dimensions, les matériaux et le plan de construction d'un escalier conforme aux normes du Québec.",
    status: 'available' as const,
    href: '/plugins/escaliers',
  },
  {
    icon: Fence,
    title: 'Rampes et garde-corps',
    description: 'Calcul des dimensions de rampes et garde-corps conformes.',
    status: 'coming-soon' as const,
  },
  {
    icon: Square,
    title: 'Calcul de plancher',
    description: 'Dimensionnement des solives et poutres de plancher.',
    status: 'coming-soon' as const,
  },
  {
    icon: Triangle,
    title: 'Estimation de toiture',
    description: 'Calcul de la surface et des matériaux de toiture.',
    status: 'coming-soon' as const,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1">
        <Hero />

        {/* Section Plugins */}
        <section id="plugins" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Nos outils
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Construis selon les règles, sans deviner.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLUGINS.map((plugin) => (
                <PluginCard key={plugin.title} {...plugin} />
              ))}
            </div>
          </div>
        </section>

        {/* Section À propos */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Conçu pour les constructeurs québécois
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  La Plateforme constructeurs aide les charpentiers, entrepreneurs et
                  bricoleurs à concevoir des éléments de construction conformes au Code
                  de construction du Québec, en français simple et sans avoir besoin
                  d&apos;un ingénieur pour chaque calcul de base.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'Normes du Québec à jour',
                    'Calculs précis et conformes',
                    'Liste de matériaux complète',
                    '100 % gratuit et en ligne',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-construction-succes shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/about-construction.jpg"
                  alt="Charpentier québécois travaillant sur un escalier en bois"
                  width={800}
                  height={450}
                  className="rounded-2xl shadow-2xl w-full object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
