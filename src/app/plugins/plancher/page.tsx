import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlancherCalculateur } from '@/components/plugins/plancher/PlancherCalculateur';

export const metadata = {
  title: 'Calculateur de plancher — Plateforme constructeurs',
  description: 'Dimensionnez vos solives de plancher conformément au Code national du bâtiment et au CCQ.',
};

export default function PlancherPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
          ⚠ Outil d&apos;aide à la planification — Pas un avis professionnel
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm mt-1">
          Ces calculs sont préliminaires. Faites valider la conception par un ingénieur ou un technologue avant de construire.
        </AlertDescription>
      </Alert>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Calculateur de plancher</h1>
        <p className="text-muted-foreground">Sélectionnez la bonne dimension de solive selon la portée et l&apos;usage (CNB 2020, CCQ).</p>
      </div>
      <PlancherCalculateur />
    </main>
  );
}
