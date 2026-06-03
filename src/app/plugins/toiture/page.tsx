import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToitureCalculateurClient } from '@/components/plugins/toiture/ToitureCalculateurClient';

export const metadata = {
  title: 'Estimation de toiture — Plateforme constructeurs',
  description: 'Calculez la surface, les matériaux et la charge de neige de votre toiture selon le CCQ et le CNB 2020.',
};

export default function ToiturePage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
          ⚠ Outil d&apos;aide à la planification — Pas un avis professionnel
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm mt-1">
          Les charges de neige sont indicatives. Pour la conception structurale officielle, utilisez les valeurs du CNB 2020 et consultez un ingénieur.
        </AlertDescription>
      </Alert>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Estimation de toiture</h1>
        <p className="text-muted-foreground">Calculez la surface, les matériaux et la ventilation de votre toit selon le CCQ.</p>
      </div>
      <ToitureCalculateurClient />
    </main>
  );
}
