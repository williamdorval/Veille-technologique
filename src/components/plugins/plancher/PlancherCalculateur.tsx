'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EntreesPlancher, ResultatsPlancher } from '@/lib/plancher/types';
import { calculerPlancher } from '@/lib/plancher/calculs';
import { FormulaireplanCher } from './FormulaireplanCher';
import { ResultatsPlancher as ResultatsPlancherUI } from './ResultatsPlancher';
import { Visualisation3D } from './Visualisation3D';

const ENTREES_DEFAUT: EntreesPlancher = {
  longueur: 4000,
  largeur: 5000,
  typeUsage: 'salon',
  typeBois: 'SPF',
  typeSousPlancher: 'OSB',
  presenceElementLourd: false,
};

export function PlancherCalculateur() {
  const [entrees, setEntrees] = useState<EntreesPlancher>(ENTREES_DEFAUT);
  const [resultats, setResultats] = useState<ResultatsPlancher | null>(() => {
    const r = calculerPlancher(ENTREES_DEFAUT);
    return r.succes ? r.resultat : null;
  });
  const [erreurMessage, setErreurMessage] = useState<string | null>(null);

  const handleCalculer = useCallback((nouvellesEntrees: EntreesPlancher) => {
    setEntrees(nouvellesEntrees);
    const r = calculerPlancher(nouvellesEntrees);
    if (r.succes) {
      setResultats(r.resultat);
      setErreurMessage(null);
    } else {
      setErreurMessage(r.erreur.message);
      setResultats(null);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <FormulaireplanCher onCalculer={handleCalculer} />
      </div>

      <div className="lg:col-span-2 space-y-4">
        {erreurMessage && (
          <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive text-sm">
            {erreurMessage}
          </div>
        )}

        {resultats && (
          <Tabs defaultValue="resultats">
            <TabsList className="w-full">
              <TabsTrigger value="resultats" className="flex-1">Résultats</TabsTrigger>
              <TabsTrigger value="visuel" className="flex-1">Vue 3D</TabsTrigger>
            </TabsList>

            <TabsContent value="resultats" className="mt-4">
              <ResultatsPlancherUI resultats={resultats} />
            </TabsContent>

            <TabsContent value="visuel" className="mt-4">
              <Visualisation3D resultats={resultats} portee={entrees.longueur} largeur={entrees.largeur} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
