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
import { ChampsOptions, FormValues } from './ChampsOptions';

const POUCE = 25.4;

const schemaFormulaire = z.object({
  hauteurTotaleSaisie: z.number().positive('La hauteur doit être positive'),
  uniteMesure: z.enum(['mm', 'pouces'] as const),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(schemaFormulaire),
    defaultValues: {
      hauteurTotaleSaisie: 2800,
      uniteMesure: 'mm',
      largeur: 900,
      hauteurPlafond: 2400,
      typeUsage: 'residentiel_prive',
      contremargesFermees: true,
      materiauLimon: 'epinette',
      typeMarche: 'epinette',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  const soumettre = useCallback((values: FormValues) => {
    const hauteurMm = values.uniteMesure === 'pouces'
      ? values.hauteurTotaleSaisie * POUCE
      : values.hauteurTotaleSaisie;
    onCalculer({
      hauteurTotale: hauteurMm,
      hauteurTotaleSaisie: values.hauteurTotaleSaisie,
      uniteMesure: values.uniteMesure as UniteMesure,
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
    watchedValues.hauteurTotaleSaisie, watchedValues.uniteMesure, watchedValues.largeur,
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
          {/* Toggle unité */}
          <div className="flex gap-2 items-center">
            <Label>Unité :</Label>
            {(['mm', 'pouces'] as const).map((u) => (
              <button key={u} type="button" onClick={() => setValue('uniteMesure', u)}
                className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.uniteMesure === u ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                {u}
              </button>
            ))}
          </div>

          {/* Hauteur totale */}
          <div className="space-y-1">
            <Label htmlFor="hauteur">Hauteur totale ({watchedValues.uniteMesure})</Label>
            <Input id="hauteur" type="number" step="1"
              {...register('hauteurTotaleSaisie', { valueAsNumber: true })} />
            {errors.hauteurTotaleSaisie && (
              <p className="text-destructive text-sm">{errors.hauteurTotaleSaisie.message}</p>
            )}
          </div>

          {/* Largeur */}
          <div className="space-y-1">
            <Label htmlFor="largeur">Largeur souhaitée (mm)</Label>
            <Input id="largeur" type="number" step="10"
              {...register('largeur', { valueAsNumber: true })} />
            {errors.largeur && (
              <p className="text-destructive text-sm">{errors.largeur.message}</p>
            )}
          </div>

          {/* Hauteur plafond */}
          <div className="space-y-1">
            <Label htmlFor="plafond">Hauteur du plafond (mm)</Label>
            <Input id="plafond" type="number" step="10"
              {...register('hauteurPlafond', { valueAsNumber: true })} />
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
