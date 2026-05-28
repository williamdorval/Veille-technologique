'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EntreesRampe, ResultatsRampe, MateriauRampe } from '@/lib/rampes/types';
import { calculerRampe } from '@/lib/rampes/calculs';
import { calculerMateriaux } from '@/lib/rampes/materiaux';
import { genererEtapesPose } from '@/lib/rampes/plan-construction';
import { FormulaireRampe } from './FormulaireRampe';
import { ResultatsConformite } from './ResultatsConformite';
import { ListeMateriaux } from './ListeMateriaux';
import { PlanConstruction } from './PlanConstruction';
import { Visualisation3D } from './Visualisation3D';

const ENTREES_DEFAUT: EntreesRampe = {
  longueurRampe: 3000,
  hauteurChute: 1200,
  typeUsage: 'residentiel_prive',
  materiau: 'bois',
  typeInstallation: 'escalier',
};

export function RampeCalculateur() {
  const [entrees, setEntrees] = useState<EntreesRampe>(ENTREES_DEFAUT);
  const [resultats, setResultats] = useState<ResultatsRampe | null>(() => {
    const r = calculerRampe(ENTREES_DEFAUT);
    return r.succes ? r.resultat : null;
  });
  const [erreurMessage, setErreurMessage] = useState<string | null>(null);

  const handleCalculer = useCallback((nouvellesEntrees: EntreesRampe) => {
    setEntrees(nouvellesEntrees);
    const r = calculerRampe(nouvellesEntrees);
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
      {/* Colonne gauche : formulaire */}
      <div className="lg:col-span-1">
        <FormulaireRampe onCalculer={handleCalculer} />
      </div>

      {/* Colonne droite : résultats */}
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
              <TabsTrigger value="materiaux" className="flex-1">Matériaux</TabsTrigger>
              <TabsTrigger value="plan" className="flex-1">Plan de pose</TabsTrigger>
            </TabsList>

            <TabsContent value="resultats" className="mt-4">
              <ResultatsConformite resultats={resultats} />
            </TabsContent>

            <TabsContent value="visuel" className="mt-4">
              <Visualisation3D
                resultats={resultats}
                materiau={entrees.materiau as MateriauRampe}
                typeInstallation={entrees.typeInstallation}
              />
            </TabsContent>

            <TabsContent value="materiaux" className="mt-4">
              <ListeMateriaux pieces={calculerMateriaux(entrees, resultats)} />
            </TabsContent>

            <TabsContent value="plan" className="mt-4">
              <PlanConstruction etapes={genererEtapesPose(entrees, resultats)} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
