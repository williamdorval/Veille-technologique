import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RampeCalculateur } from '@/components/plugins/rampes/RampeCalculateur';

export const metadata = {
  title: 'Calculateur de rampes et garde-corps — Plateforme constructeurs',
  description: 'Calculez les dimensions de vos rampes et garde-corps conformément au Code de construction du Québec.',
};

export default function RampesPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20" data-print-alert>
        <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
          ⚠ Outil d&apos;aide à la planification — Pas un avis professionnel
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm mt-1">
          Ce calculateur est un outil éducatif. Consultez un professionnel qualifié avant de construire.
        </AlertDescription>
      </Alert>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Calculateur de rampes et garde-corps</h1>
        <p className="text-muted-foreground">Calculez les dimensions conformes au Code de construction du Québec.</p>
      </div>
      <RampeCalculateur />
    </main>
  );
}
