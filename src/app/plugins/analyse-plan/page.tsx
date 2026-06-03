import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysePlanClient } from '@/components/plugins/analyse-plan/AnalysePlanClient';

export const metadata = {
  title: "Analyse de plan → Excel — Plateforme constructeurs",
  description: "Photographiez votre plan de construction, l'IA extrait les dimensions et les insère directement dans votre fichier Excel.",
};

export default function AnalysePlanPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTitle>⚠ Outil d'aide à la saisie — Vérifiez toujours les valeurs</AlertTitle>
        <AlertDescription>
          L&apos;IA peut faire des erreurs de lecture. Validez chaque valeur proposée avant de générer le fichier Excel.
          Cet outil ne remplace pas votre jugement professionnel.
        </AlertDescription>
      </Alert>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analyse de plan → Excel</h1>
        <p className="text-muted-foreground">
          Photographiez vos plans, l&apos;IA détecte les dimensions et les insère dans votre gabarit Excel.
        </p>
      </div>
      <AnalysePlanClient />
    </main>
  );
}
