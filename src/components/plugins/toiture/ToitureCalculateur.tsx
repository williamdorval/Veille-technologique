'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EntreesToiture, ResultatsToiture } from '@/lib/toiture/types';
import { calculerToiture } from '@/lib/toiture/calculs';
import { FormulaireToiture } from './FormulaireToiture';
import { ResultatsToiture as ResultatsToitureUI } from './ResultatsToiture';
import { Visualisation3D } from './Visualisation3D';

const ENTREES_DEFAUT: EntreesToiture = {
  longueurBatiment: 10000,
  largeurBatiment: 8000,
  penteDegres: 26,
  typeToit: 'deux_versants',
  typeRevetement: 'bardeau_asphalte',
  region: 'quebec_ville',
  debordToit: 600,
};

export function ToitureCalculateur() {
  const [entrees, setEntrees] = useState<EntreesToiture>(ENTREES_DEFAUT);
  const [resultats, setResultats] = useState<ResultatsToiture | null>(() => {
    const r = calculerToiture(ENTREES_DEFAUT);
    return r.succes ? r.resultat : null;
  });
  const [erreurMessage, setErreurMessage] = useState<string | null>(null);

  const handleCalculer = useCallback((nouvellesEntrees: EntreesToiture) => {
    setEntrees(nouvellesEntrees);
    const r = calculerToiture(nouvellesEntrees);
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
        <FormulaireToiture onCalculer={handleCalculer} />
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
              <ResultatsToitureUI resultats={resultats} />
            </TabsContent>

            <TabsContent value="visuel" className="mt-4">
              <Visualisation3D
                resultats={resultats}
                longueur={entrees.longueurBatiment}
                largeur={entrees.largeurBatiment}
                penteDegres={entrees.penteDegres}
                debord={entrees.debordToit}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
