'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntreesRampe, TypeUsageRampe, MateriauRampe, TypeInstallation } from '@/lib/rampes/types';
import { LABELS_TYPE_USAGE, LABELS_MATERIAU, LABELS_TYPE_INSTALLATION } from '@/lib/rampes/normes';

const schema = z.object({
  longueurRampe: z.number().min(300, 'Min 300 mm').max(30000, 'Max 30 000 mm'),
  hauteurChute: z.number().min(0, 'Min 0 mm').max(10000, 'Max 10 000 mm'),
  typeUsage: z.enum(['residentiel_prive', 'residentiel_commun', 'commercial'] as const),
  materiau: z.enum(['bois', 'metal', 'verre', 'cable'] as const),
  typeInstallation: z.enum(['escalier', 'balcon', 'terrasse'] as const),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onCalculer: (entrees: EntreesRampe) => void;
}

export function FormulaireRampe({ onCalculer }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      longueurRampe: 3000,
      hauteurChute: 1200,
      typeUsage: 'residentiel_prive',
      materiau: 'bois',
      typeInstallation: 'escalier',
    },
  });

  const watchedValues = watch();

  const soumettre = useCallback((values: FormValues) => {
    onCalculer({
      longueurRampe: values.longueurRampe,
      hauteurChute: values.hauteurChute,
      typeUsage: values.typeUsage as TypeUsageRampe,
      materiau: values.materiau as MateriauRampe,
      typeInstallation: values.typeInstallation as TypeInstallation,
    });
  }, [onCalculer]);

  useEffect(() => {
    const timer = setTimeout(() => { handleSubmit(soumettre)(); }, 300);
    return () => clearTimeout(timer);
  }, [
    watchedValues.longueurRampe, watchedValues.hauteurChute,
    watchedValues.typeUsage, watchedValues.materiau, watchedValues.typeInstallation,
    handleSubmit, soumettre,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la rampe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="longueur">Longueur de la rampe (mm)</Label>
            <p className="text-xs text-muted-foreground">Distance totale de la rampe, de bout en bout</p>
            <Input id="longueur" type="number" step="10"
              {...register('longueurRampe', { valueAsNumber: true })} />
            {errors.longueurRampe && <p className="text-destructive text-sm">{errors.longueurRampe.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="hauteurChute">Hauteur de chute possible (mm)</Label>
            <p className="text-xs text-muted-foreground">Distance entre le plancher protégé et le sol en dessous</p>
            <Input id="hauteurChute" type="number" step="10"
              {...register('hauteurChute', { valueAsNumber: true })} />
            {errors.hauteurChute && <p className="text-destructive text-sm">{errors.hauteurChute.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Type d&apos;usage</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_TYPE_USAGE) as [TypeUsageRampe, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeUsage', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeUsage === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Matériau</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_MATERIAU) as [MateriauRampe, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('materiau', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.materiau === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Type d&apos;installation</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LABELS_TYPE_INSTALLATION) as [TypeInstallation, string][]).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setValue('typeInstallation', val)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${watchedValues.typeInstallation === val ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Calculer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
