'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntreesToiture } from '@/lib/toiture/types';
import { LABELS_TYPE_TOIT, LABELS_REVETEMENT, LABELS_REGION } from '@/lib/toiture/normes';
import type { RegionQuebec, TypeToit, TypeRevetement } from '@/lib/toiture/types';

const schema = z.object({
  longueurBatiment: z.number().min(200, 'Min 200 cm').max(5000, 'Max 5 000 cm'),
  largeurBatiment: z.number().min(200, 'Min 200 cm').max(3000, 'Max 3 000 cm'),
  penteDegres: z.number().min(0, 'Min 0°').max(70, 'Max 70°'),
  typeToit: z.enum(['deux_versants', 'croupe', 'appentis'] as const),
  typeRevetement: z.enum(['bardeau_asphalte', 'tole_acier', 'membrane'] as const),
  region: z.enum(['montreal', 'quebec_ville', 'saguenay', 'mauricie', 'estrie', 'outaouais', 'abitibi', 'cote_nord', 'gaspesie'] as const),
  debordToit: z.number().min(0).max(200),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onCalculer: (entrees: EntreesToiture) => void;
}

export function FormulaireToiture({ onCalculer }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      longueurBatiment: 1000,
      largeurBatiment: 800,
      penteDegres: 26,
      typeToit: 'deux_versants',
      typeRevetement: 'bardeau_asphalte',
      region: 'quebec_ville',
      debordToit: 60,
    },
  });

  const watchedValues = watch();

  const soumettre = useCallback((values: FormValues) => {
    onCalculer(values as EntreesToiture);
  }, [onCalculer]);

  useEffect(() => {
    const timer = setTimeout(() => { handleSubmit(soumettre)(); }, 300);
    return () => clearTimeout(timer);
  }, [
    watchedValues.longueurBatiment, watchedValues.largeurBatiment, watchedValues.penteDegres,
    watchedValues.typeToit, watchedValues.typeRevetement, watchedValues.region, watchedValues.debordToit,
    handleSubmit, soumettre,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du toit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="longueur">Longueur bâtiment (cm)</Label>
              <Input id="longueur" type="number" step="10"
                {...register('longueurBatiment', { valueAsNumber: true })} />
              {errors.longueurBatiment && <p className="text-destructive text-xs">{errors.longueurBatiment.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="largeur">Largeur bâtiment (cm)</Label>
              <Input id="largeur" type="number" step="10"
                {...register('largeurBatiment', { valueAsNumber: true })} />
              {errors.largeurBatiment && <p className="text-destructive text-xs">{errors.largeurBatiment.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pente">Pente (degrés)</Label>
              <Input id="pente" type="number" step="0.5"
                {...register('penteDegres', { valueAsNumber: true })} />
              {errors.penteDegres && <p className="text-destructive text-xs">{errors.penteDegres.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="debord">Débord de toit (cm)</Label>
              <Input id="debord" type="number" step="10"
                {...register('debordToit', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Type de toit</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_TYPE_TOIT) as [TypeToit, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeToit', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeToit === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Revêtement</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_REVETEMENT) as [TypeRevetement, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeRevetement', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeRevetement === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Région du Québec</Label>
            <select
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              value={watchedValues.region}
              onChange={(e) => setValue('region', e.target.value as RegionQuebec)}
            >
              {(Object.entries(LABELS_REGION) as [RegionQuebec, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full">Calculer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
