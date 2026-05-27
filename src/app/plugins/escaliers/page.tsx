import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EscalierCalculateur } from '@/components/plugins/escaliers/EscalierCalculateur';

export const metadata = {
  title: 'Calculateur d\'escaliers — Plateforme constructeurs',
  description:
    'Calculez les dimensions de votre escalier et vérifiez la conformité aux normes du Code de construction du Québec (CCQ).',
};

export default function EscaliersPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Avertissement légal permanent — toujours visible, jamais effaçable */}
      <Alert
        className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20"
        data-print-alert
      >
        <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
          ⚠ Outil d&apos;aide à la planification — Pas un avis professionnel
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm mt-1">
          Ce calculateur est un outil éducatif uniquement. Il ne remplace pas l&apos;expertise
          d&apos;un professionnel certifié (architecte, ingénieur ou entrepreneur licencié RBQ).
          Avant de construire, consultez un professionnel et vérifiez les exigences de permis
          auprès de votre municipalité. Les normes présentées sont basées sur le CCQ —
          vérifiez toujours avec la version officielle en vigueur (rbq.gouv.qc.ca).
        </AlertDescription>
      </Alert>

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Calculateur d&apos;escaliers
        </h1>
        <p className="text-muted-foreground">
          Entrez les dimensions de votre espace pour obtenir les dimensions conformes
          au Code de construction du Québec, la liste des matériaux et un plan de construction.
        </p>
      </div>

      {/* Calculateur principal */}
      <EscalierCalculateur />

    </main>
  );
}
