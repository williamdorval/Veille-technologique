'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormulaireEscalier } from './FormulaireEscalier';
import { ResultatsConformite } from './ResultatsConformite';
import { ListeMateriaux } from './ListeMateriaux';
import { PlanConstruction } from './PlanConstruction';
import { Visualisation3D } from './Visualisation3D';
import { EstimationProjet } from './EstimationProjet';
import { calculerEscalier } from '@/lib/escaliers/calculs';
import { EntreeFormulaire, ResultatCalcul } from '@/lib/escaliers/types';

export function EscalierCalculateur() {
  const [resultat, setResultat] = useState<ResultatCalcul | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [entreeActuelle, setEntreeActuelle] = useState<EntreeFormulaire | null>(null);

  const handleCalculer = useCallback((entree: EntreeFormulaire) => {
    setIsCalculating(true);
    setErreur(null);

    // Calcul synchrone — mais on passe par un tick pour montrer l'état de chargement
    setTimeout(() => {
      const res = calculerEscalier(entree);
      if (res.succes) {
        setResultat(res.resultat);
        setEntreeActuelle(entree);
        setErreur(null);
      } else {
        setErreur(res.erreur.message);
        setResultat(null);
      }
      setIsCalculating(false);
    }, 0);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      {/* Colonne gauche — Formulaire */}
      <div className="no-print" data-no-print>
        <FormulaireEscalier onCalculer={handleCalculer} isCalculating={isCalculating} />
      </div>

      {/* Colonne droite — Résultats */}
      <div data-print-section>
        {/* État initial — aucun calcul encore */}
        {!resultat && !erreur && !isCalculating && (
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
            Entrez les dimensions de votre escalier pour obtenir les résultats.
          </div>
        )}

        {/* Calcul en cours */}
        {isCalculating && (
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
            Calcul en cours…
          </div>
        )}

        {/* Erreur de calcul */}
        {erreur && !isCalculating && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive text-sm">
            <p className="font-medium">Impossible de calculer</p>
            <p>{erreur}</p>
          </div>
        )}

        {/* Résultats */}
        {resultat && entreeActuelle && !isCalculating && (
          <>
            <Tabs defaultValue="conformite" className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-1 no-print" data-no-print>
                <TabsTrigger value="conformite">Dimensions</TabsTrigger>
                <TabsTrigger value="materiaux">Matériaux</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="visualisation">3D</TabsTrigger>
                <TabsTrigger value="estimation">Estimation</TabsTrigger>
              </TabsList>

              <TabsContent value="conformite" className="mt-4">
                <ResultatsConformite resultat={resultat} />
              </TabsContent>

              <TabsContent value="materiaux" className="mt-4">
                <ListeMateriaux
                  materiaux={resultat.materiaux}
                  estimation={resultat.estimation}
                  nombreMarches={resultat.nombreMarches}
                  largeurEscalier={entreeActuelle.largeur}
                  hauteurChute={entreeActuelle.hauteurTotale}
                />
              </TabsContent>

              <TabsContent value="plan" className="mt-4">
                <PlanConstruction etapes={resultat.etapesConstruction} />
              </TabsContent>

              <TabsContent value="visualisation" className="mt-4 visualisation-3d-wrapper">
                <Visualisation3D resultat={resultat} entree={entreeActuelle} />
              </TabsContent>

              <TabsContent value="estimation" className="mt-4">
                <EstimationProjet
                  estimation={resultat.estimation}
                  nombreMarches={resultat.nombreMarches}
                />
              </TabsContent>
            </Tabs>

            {/* Bouton impression */}
            <div className="mt-4 flex justify-end no-print" data-no-print>
              <Button variant="outline" onClick={() => window.print()}>
                Imprimer / Enregistrer PDF
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
