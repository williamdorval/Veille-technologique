'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntreeFormulaire, UniteMesure, TypeUsage, MateriauLimon, TypeMarche } from '@/lib/escaliers/types';
import { useUnite, mmVers, depuisMm, formatValeur, labelUnite, stepUnite } from '@/lib/shared/use-unite';
import { SelecteurUnite } from '@/components/shared/SelecteurUnite';
import { ChampsOptions, FormValues } from './ChampsOptions';

const schemaFormulaire = z.object({
  hauteurTotaleSaisie: z.number().positive('La hauteur doit être positive'),
  // Validation UI : plage raisonnable pour le formulaire.
  // La conformité CCQ (min 860mm) est vérifiée dans conformite.ts
  largeur: z.number()
    .min(600, 'Largeur minimum : 600 mm')
    .max(2500, 'Largeur maximum : 2 500 mm'),
  hauteurPlafond: z.number()
    .min(1800, 'Hauteur de plafond minimum : 1 800 mm')
    .max(4000, 'Hauteur de plafond maximum : 4 000 mm'),
  typeUsage: z.enum(['residentiel_prive', 'residentiel_commun', 'commercial'] as const),
  contremargesFermees: z.boolean(),
  materiauLimon: z.enum(['epinette', 'bois_franc', 'acier', 'composite'] as const),
  typeMarche: z.enum(['bois_traite', 'epinette', 'bois_franc', 'contrepalque', 'composite'] as const),
});

interface Props {
  onCalculer: (entree: EntreeFormulaire) => void;
  isCalculating: boolean;
}

export function FormulaireEscalier({ onCalculer, isCalculating }: Props) {
  const { unite, choisirUnite } = useUnite('escaliers');

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaFormulaire),
    defaultValues: {
      hauteurTotaleSaisie: 2800,
      largeur: 900,
      hauteurPlafond: 2400,
      typeUsage: 'residentiel_prive',
      contremargesFermees: true,
      materiauLimon: 'epinette',
      typeMarche: 'epinette',
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  const soumettre = useCallback((values: FormValues) => {
    // Tous les champs sont déjà en mm dans le formulaire
    onCalculer({
      hauteurTotale: values.hauteurTotaleSaisie,
      hauteurTotaleSaisie: values.hauteurTotaleSaisie,
      uniteMesure: 'mm' as UniteMesure,
      largeur: values.largeur,
      hauteurPlafond: values.hauteurPlafond,
      typeUsage: values.typeUsage as TypeUsage,
      contremargesFermees: values.contremargesFermees,
      materiauLimon: values.materiauLimon as MateriauLimon,
      typeMarche: values.typeMarche as TypeMarche,
    });
  }, [onCalculer]);

  // Debounce 300ms pour le recalcul automatique
  useEffect(() => {
    const timer = setTimeout(() => { handleSubmit(soumettre)(); }, 300);
    return () => clearTimeout(timer);
  }, [
    watchedValues.hauteurTotaleSaisie, watchedValues.largeur,
    watchedValues.hauteurPlafond, watchedValues.typeUsage, watchedValues.contremargesFermees,
    watchedValues.materiauLimon, watchedValues.typeMarche, handleSubmit, soumettre,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de l&apos;escalier</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
          {/* Sélecteur d'unité partagé */}
          <SelecteurUnite unite={unite} onChangerUnite={choisirUnite} />

          {/* Hauteur totale */}
          <div className="space-y-1">
            <Label htmlFor="hauteur">Hauteur totale ({labelUnite(unite)})</Label>
            <Input
              id="hauteur"
              type="number"
              step={stepUnite(unite)}
              value={formatValeur(watchedValues.hauteurTotaleSaisie ?? 2800, unite)}
              onChange={(e) => {
                const raw = parseFloat(e.target.value);
                if (!isNaN(raw)) setValue('hauteurTotaleSaisie', depuisMm(raw, unite), { shouldValidate: true });
              }}
            />
            {errors.hauteurTotaleSaisie && (
              <p className="text-destructive text-sm">{errors.hauteurTotaleSaisie.message}</p>
            )}
          </div>

          {/* Largeur */}
          <div className="space-y-1">
            <Label htmlFor="largeur">Largeur souhaitée ({labelUnite(unite)})</Label>
            <Input
              id="largeur"
              type="number"
              step={stepUnite(unite)}
              value={formatValeur(watchedValues.largeur ?? 900, unite)}
              onChange={(e) => {
                const raw = parseFloat(e.target.value);
                if (!isNaN(raw)) setValue('largeur', depuisMm(raw, unite), { shouldValidate: true });
              }}
            />
            {errors.largeur && (
              <p className="text-destructive text-sm">{errors.largeur.message}</p>
            )}
          </div>

          {/* Hauteur plafond */}
          <div className="space-y-1">
            <Label htmlFor="plafond">Hauteur du plafond ({labelUnite(unite)})</Label>
            <Input
              id="plafond"
              type="number"
              step={stepUnite(unite)}
              value={formatValeur(watchedValues.hauteurPlafond ?? 2400, unite)}
              onChange={(e) => {
                const raw = parseFloat(e.target.value);
                if (!isNaN(raw)) setValue('hauteurPlafond', depuisMm(raw, unite), { shouldValidate: true });
              }}
            />
            {errors.hauteurPlafond && (
              <p className="text-destructive text-sm">{errors.hauteurPlafond.message}</p>
            )}
          </div>

          {/* Champs options (usage, matériaux, contremarches) */}
          <ChampsOptions form={form} />

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? 'Calcul en cours…' : 'Calculer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
