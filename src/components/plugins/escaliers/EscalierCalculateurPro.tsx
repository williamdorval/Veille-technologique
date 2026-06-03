'use client';
import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormulaireEscalierPro } from './FormulaireEscalierPro';
import { ResultatsRecommandation } from './ResultatsRecommandation';
import { ResultatsAlternatives } from './ResultatsAlternatives';
import { ResultatsCrochet } from './ResultatsCrochet';
import { ResultatsPuits } from './ResultatsPuits';
import { ResultatsFormules } from './ResultatsFormules';
import { EstimationPro } from './EstimationPro';
import { ListeMateriaux } from './ListeMateriaux';
import { PlanConstruction } from './PlanConstruction';
import { Visualisation3D } from './Visualisation3D';
import { StairInput, StairResult } from '@/lib/escaliers/stair-types';
import { DEFAULT_STAIR_RULES } from '@/lib/escaliers/stair-rules';
import { calculateUnlimitedRunStair } from '@/lib/escaliers/stair-unlimited-run';
import { calculateLimitedRunStair } from '@/lib/escaliers/stair-limited-run';
import { calculerMateriaux, calculerEstimation } from '@/lib/escaliers/stair-materials';
import { genererPlanConstruction } from '@/lib/escaliers/stair-construction-plan';
import { EntreeFormulaire, ResultatCalcul, DimensionsEscalier } from '@/lib/escaliers/types';
import { verifierConformiteComplete } from '@/lib/escaliers/conformite';

function adaptForLegacy(result: StairResult, input: StairInput): { resultat: ResultatCalcul; entree: EntreeFormulaire } | null {
  const rec = result.recommended;
  if (rec.status === 'impossible') return null;
  const dim: DimensionsEscalier = { nombreMarches: rec.stepCount, hauteurContremarche: rec.riserHeightMm, giron: rec.treadDepthMm, longueurAuSol: rec.totalRunMm, longueurLimon: rec.stringerLengthMm, angleDegres: rec.angleDeg, blondel: rec.stepRuleMm };
  const entreeLegacy: EntreeFormulaire = { hauteurTotale: input.totalHeightMm, hauteurTotaleSaisie: input.totalHeightMm, uniteMesure: 'mm', largeur: input.stairWidthMm, hauteurPlafond: input.headroomMm + input.ceilingThicknessMm, typeUsage: input.typeUsage, contremargesFermees: input.closedRisers, materiauLimon: input.materiauLimon, typeMarche: input.typeMarche };
  const conformite = verifierConformiteComplete(dim, input.typeUsage, entreeLegacy.hauteurPlafond, input.stairWidthMm);
  const materiaux = calculerMateriaux(dim, { largeur: input.stairWidthMm, materiauLimon: input.materiauLimon, typeMarche: input.typeMarche, contremargesFermees: input.closedRisers });
  const etapesConstruction = genererPlanConstruction({ ...dim, longueurAuSol: rec.totalRunMm }, { largeur: input.stairWidthMm, contremargesFermees: input.closedRisers, typeMarche: input.typeMarche, hauteurTotale: input.totalHeightMm });
  const estimation = calculerEstimation({ nombreMarches: rec.stepCount }, materiaux, { typeMarche: input.typeMarche });
  const nbErreurs = Object.values(conformite).filter(i => i.statut === 'non_conforme').length;
  const nbAvert = Object.values(conformite).filter(i => i.statut === 'avertissement').length;
  const resultat: ResultatCalcul = { nombreMarches: rec.stepCount, hauteurContremarche: rec.riserHeightMm, giron: rec.treadDepthMm, longueurAuSol: rec.totalRunMm, longueurLimon: rec.stringerLengthMm, angleDegres: rec.angleDeg, blondel: rec.stepRuleMm, conformite, materiaux, etapesConstruction, estimation, estConforme: nbErreurs === 0, nbAvertissements: nbAvert, nbErreurs };
  return { resultat, entree: entreeLegacy };
}

export function EscalierCalculateurPro() {
  const [result, setResult] = useState<StairResult | null>(null);
  const [legacy, setLegacy] = useState<{ resultat: ResultatCalcul; entree: EntreeFormulaire } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculer = useCallback((input: StairInput) => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = input.mode === 'limited_run'
        ? calculateLimitedRunStair(input, DEFAULT_STAIR_RULES)
        : calculateUnlimitedRunStair(input, DEFAULT_STAIR_RULES);
      setResult(res);
      setErreur(res.recommended.status === 'impossible' ? res.recommended.errors[0] : null);
      setLegacy(adaptForLegacy(res, input));
      setIsCalculating(false);
    }, 0);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div>
        <FormulaireEscalierPro onCalculer={handleCalculer} isCalculating={isCalculating} />
      </div>
      <div>
        {!result && !isCalculating && (
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
            Entrez les dimensions pour obtenir les résultats.
          </div>
        )}
        {isCalculating && (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Calcul en cours…</div>
        )}
        {erreur && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive text-sm">
            <p className="font-medium">Impossible de calculer</p>
            <p>{erreur}</p>
          </div>
        )}
        {result && !isCalculating && (
          <Tabs defaultValue="recommandation" className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1">
              <TabsTrigger value="recommandation">Résultats</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              {result.mode === 'limited_run' && result.hookAdjustment && (
                <TabsTrigger value="crochet">Crochet</TabsTrigger>
              )}
              <TabsTrigger value="puits">Puits</TabsTrigger>
              <TabsTrigger value="formules">Formules</TabsTrigger>
              {legacy && <TabsTrigger value="estimation">Estimation $</TabsTrigger>}
              {legacy && <TabsTrigger value="materiaux">Matériaux</TabsTrigger>}
              {legacy && <TabsTrigger value="plan">Plan</TabsTrigger>}
              {legacy && <TabsTrigger value="3d">3D</TabsTrigger>}
            </TabsList>

            <TabsContent value="recommandation" className="mt-4">
              <ResultatsRecommandation result={result} unit={result.input.unit} />
            </TabsContent>

            <TabsContent value="alternatives" className="mt-4">
              <ResultatsAlternatives result={result} unit={result.input.unit} />
            </TabsContent>

            {result.mode === 'limited_run' && result.hookAdjustment && (
              <TabsContent value="crochet" className="mt-4">
                <ResultatsCrochet hook={result.hookAdjustment} unit={result.input.unit} />
              </TabsContent>
            )}

            <TabsContent value="puits" className="mt-4">
              <ResultatsPuits pit={result.pit} unit={result.input.unit} />
            </TabsContent>

            <TabsContent value="formules" className="mt-4">
              <ResultatsFormules result={result} unit={result.input.unit} />
            </TabsContent>

            {legacy && (
              <TabsContent value="estimation" className="mt-4">
                <EstimationPro
                  materiaux={legacy.resultat.materiaux}
                  estimation={legacy.resultat.estimation}
                  nombreMarches={legacy.resultat.nombreMarches}
                  largeurMm={legacy.entree.largeur}
                />
              </TabsContent>
            )}

            {legacy && (
              <TabsContent value="materiaux" className="mt-4">
                <ListeMateriaux
                  materiaux={legacy.resultat.materiaux}
                  estimation={legacy.resultat.estimation}
                  nombreMarches={legacy.resultat.nombreMarches}
                  largeurEscalier={legacy.entree.largeur}
                  hauteurChute={legacy.entree.hauteurTotale}
                />
              </TabsContent>
            )}

            {legacy && (
              <TabsContent value="plan" className="mt-4">
                <PlanConstruction etapes={legacy.resultat.etapesConstruction} />
              </TabsContent>
            )}

            {legacy && (
              <TabsContent value="3d" className="mt-4">
                <Visualisation3D resultat={legacy.resultat} entree={legacy.entree} />
              </TabsContent>
            )}
          </Tabs>
        )}
        <p className="text-xs text-muted-foreground mt-4">
          Outil d&apos;aide à la planification — Pas un avis professionnel.
          Valider avec un professionnel certifié RBQ avant construction.
        </p>
      </div>
    </div>
  );
}
