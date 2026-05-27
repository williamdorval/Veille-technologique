import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DottedSurfaceWithHouses } from './DottedSurfaceWithHouses';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <DottedSurfaceWithHouses className="opacity-60" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">
          Plateforme constructeurs
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          Des outils pour construire selon les normes du Québec
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/plugins/escaliers"
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Ouvrir le calculateur d&apos;escaliers
          </Link>
          <a
            href="#plugins"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  );
}
