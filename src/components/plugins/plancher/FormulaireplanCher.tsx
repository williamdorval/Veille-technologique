'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EntreesPlancher } from '@/lib/plancher/types';
import { LABELS_TYPE_USAGE, LABELS_TYPE_BOIS, LABELS_SOUS_PLANCHER } from '@/lib/plancher/normes';

const schema = z.object({
  longueur: z.number().min(1000, 'Min 1 000 mm').max(8000, 'Max 8 000 mm'),
  largeur: z.number().min(1000, 'Min 1 000 mm').max(20000, 'Max 20 000 mm'),
  typeUsage: z.enum(['chambre', 'salon', 'salleBain', 'garage', 'commercial'] as const),
  typeBois: z.enum(['SPF', 'douglas', 'LVL'] as const),
  typeSousPlancher: z.enum(['OSB', 'contreplaque'] as const),
  presenceElementLourd: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onCalculer: (entrees: EntreesPlancher) => void;
}

export function FormulaireplanCher({ onCalculer }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      longueur: 4000,
      largeur: 5000,
      typeUsage: 'salon',
      typeBois: 'SPF',
      typeSousPlancher: 'OSB',
      presenceElementLourd: false,
    },
  });

  const watchedValues = watch();

  const soumettre = useCallback((values: FormValues) => {
    onCalculer(values as EntreesPlancher);
  }, [onCalculer]);

  useEffect(() => {
    const timer = setTimeout(() => { handleSubmit(soumettre)(); }, 300);
    return () => clearTimeout(timer);
  }, [
    watchedValues.longueur, watchedValues.largeur, watchedValues.typeUsage,
    watchedValues.typeBois, watchedValues.typeSousPlancher, watchedValues.presenceElementLourd,
    handleSubmit, soumettre,
  ]);

  type TypeUsage = 'chambre' | 'salon' | 'salleBain' | 'garage' | 'commercial';
  type TypeBois = 'SPF' | 'douglas' | 'LVL';
  type TypeSousPlancher = 'OSB' | 'contreplaque';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du plancher</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="longueur">Portée des solives (mm)</Label>
            <p className="text-xs text-muted-foreground">Distance entre les deux murs qui supportent les solives</p>
            <Input id="longueur" type="number" step="50"
              {...register('longueur', { valueAsNumber: true })} />
            {errors.longueur && <p className="text-destructive text-sm">{errors.longueur.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="largeur">Largeur de la pièce (mm)</Label>
            <p className="text-xs text-muted-foreground">Dimension perpendiculaire aux solives</p>
            <Input id="largeur" type="number" step="50"
              {...register('largeur', { valueAsNumber: true })} />
            {errors.largeur && <p className="text-destructive text-sm">{errors.largeur.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Type d&apos;usage</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_TYPE_USAGE) as [TypeUsage, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeUsage', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeUsage === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Type de bois</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_TYPE_BOIS) as [TypeBois, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeBois', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeBois === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Sous-plancher</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_SOUS_PLANCHER) as [TypeSousPlancher, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeSousPlancher', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeSousPlancher === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="lourd"
              checked={watchedValues.presenceElementLourd}
              onCheckedChange={(v) => setValue('presenceElementLourd', v)}
            />
            <Label htmlFor="lourd">Élément lourd (baignoire, piano…) +1 kPa</Label>
          </div>

          <Button type="submit" className="w-full">Calculer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
