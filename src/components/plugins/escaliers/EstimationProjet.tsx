'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EstimationProjet as EstimationProjetType } from '@/lib/escaliers/types';

interface Props {
  estimation: EstimationProjetType;
  nombreMarches: number;
}

export function EstimationProjet({ estimation, nombreMarches }: Props) {
  // Formater le temps en heures et minutes lisibles
  const heures = Math.floor(estimation.tempsHeures);
  const minutes = Math.round((estimation.tempsHeures - heures) * 60);
  const tempsFormate = minutes > 0
    ? `${heures} h ${minutes} min`
    : `${heures} h`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimation du projet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temps */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Temps de construction estimé</p>
          <p className="text-2xl font-bold">{tempsFormate}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Pour {nombreMarches} marches — constructeur amateur avec outils standard.
            Ce temps est indicatif et peut varier selon votre expérience.
          </p>
        </div>

        <Separator />

        {/* Coût */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Coût estimé des matériaux</p>
          <p className="text-2xl font-bold">
            {estimation.coutMin} $ – {estimation.coutMax} $ <span className="text-base font-normal text-muted-foreground">CAD</span>
          </p>
        </div>

        <Separator />

        {/* Avertissement */}
        <div className="bg-muted rounded-md p-3">
          <p className="text-xs text-muted-foreground">
            ⚠ {estimation.avertissementPrix}
          </p>
        </div>

        {/* Conseils */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Avant de commencer</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Vérifier si un permis de construction est requis auprès de votre municipalité</li>
            <li>Obtenir au moins 3 soumissions pour les matériaux</li>
            <li>Consulter un professionnel certifié (entrepreneur RBQ) si vous avez des doutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
