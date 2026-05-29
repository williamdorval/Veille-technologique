'use client';
import { useEffect, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StairInput, StairMode, TypeUsage, MateriauLimon, TypeMarche } from '@/lib/escaliers/stair-types';
import { UnitDisplay, convertToMm, convertFromMm, stepForUnit } from '@/lib/escaliers/unit-converter';

const SCHEMA = z.object({
  totalHeightMm: z.number().positive('La hauteur doit être positive'),
  availableRunMm: z.number().positive().optional(),
  ceilingThicknessMm: z.number().positive(),
  stairWidthMm: z.number().min(600).max(3000),
  headroomMm: z.number().min(1500).max(2500),
  typeUsage: z.enum(['residentiel_prive', 'residentiel_commun', 'commercial'] as const),
  closedRisers: z.boolean(),
  materiauLimon: z.enum(['epinette', 'bois_franc', 'acier', 'composite'] as const),
  typeMarche: z.enum(['bois_traite', 'epinette', 'bois_franc', 'contrepalque', 'composite'] as const),
  upperFloorActsAsLastStep: z.boolean(),
});
type FormValues = z.infer<typeof SCHEMA>;

interface Props { onCalculer: (input: StairInput) => void; isCalculating: boolean; }

const UNIT_OPTIONS: UnitDisplay[] = ['mm', 'cm', 'm', 'po'];
const USAGE_LABELS: Record<TypeUsage, string> = { residentiel_prive: 'Résidentiel privé', residentiel_commun: 'Résidentiel commun', commercial: 'Commercial' };
const LIMON_LABELS: Record<MateriauLimon, string> = { epinette: 'Épinette', bois_franc: 'Bois franc', acier: 'Acier', composite: 'Composite' };
const MARCHE_LABELS: Record<TypeMarche, string> = { bois_traite: 'Bois traité', epinette: 'Épinette', bois_franc: 'Bois franc', contrepalque: 'Contreplaqué', composite: 'Composite' };

export function FormulaireEscalierPro({ onCalculer, isCalculating }: Props) {
  const [unit, setUnit] = useState<UnitDisplay>('mm');
  const [mode, setMode] = useState<StairMode>('unlimited_run');

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      totalHeightMm: 2800, availableRunMm: 4200, ceilingThicknessMm: 275,
      stairWidthMm: 900, headroomMm: 1950, typeUsage: 'residentiel_prive',
      closedRisers: true, materiauLimon: 'epinette', typeMarche: 'epinette',
      upperFloorActsAsLastStep: true,
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = form;
  const vals = watch();

  const soumettre = useCallback((v: FormValues) => {
    onCalculer({ mode, unit, totalHeightMm: v.totalHeightMm, availableRunMm: v.availableRunMm, ceilingThicknessMm: v.ceilingThicknessMm, stairWidthMm: v.stairWidthMm, headroomMm: v.headroomMm, typeUsage: v.typeUsage, closedRisers: v.closedRisers, materiauLimon: v.materiauLimon, typeMarche: v.typeMarche, upperFloorActsAsLastStep: v.upperFloorActsAsLastStep });
  }, [onCalculer, mode, unit]);

  useEffect(() => {
    const timer = setTimeout(() => handleSubmit(soumettre)(), 300);
    return () => clearTimeout(timer);
  }, [vals.totalHeightMm, vals.availableRunMm, vals.ceilingThicknessMm, vals.stairWidthMm, vals.headroomMm, vals.typeUsage, vals.closedRisers, vals.materiauLimon, vals.typeMarche, vals.upperFloorActsAsLastStep, mode, unit, handleSubmit, soumettre]);

  function numField(field: keyof FormValues, label: string, hint?: string) {
    const mmVal = vals[field] as number | undefined;
    const display = mmVal ? convertFromMm(mmVal, unit) : '';
    return (
      <div className="space-y-1">
        <Label>{label} ({unit}){hint && <span className="text-xs text-muted-foreground ml-2">{hint}</span>}</Label>
        <Input type="number" step={stepForUnit(unit)} value={display === 0 ? '' : display}
          onChange={(e) => { const raw = parseFloat(e.target.value); if (!isNaN(raw)) setValue(field, convertToMm(raw, unit) as never, { shouldValidate: true }); }} />
        {errors[field] && <p className="text-destructive text-xs">{(errors[field] as { message?: string })?.message}</p>}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Calculateur professionnel</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
          {/* Unité */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Unité :</span>
            {UNIT_OPTIONS.map(u => (
              <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u}
                className={`px-3 py-1 rounded text-sm border transition-colors ${unit === u ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{u}</button>
            ))}
          </div>

          {/* Mode */}
          <div className="space-y-1">
            <Label>Mode de calcul</Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as StairMode)}>
              <TabsList className="w-full">
                <TabsTrigger value="unlimited_run" className="flex-1">Course illimitée</TabsTrigger>
                <TabsTrigger value="limited_run" className="flex-1">Course limitée</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {numField('totalHeightMm', 'Hauteur totale', 'plancher à plancher')}
          {mode === 'limited_run' && numField('availableRunMm', 'Course disponible', 'espace horizontal dispo')}
          {numField('ceilingThicknessMm', 'Épaisseur plafond/chevêtre', 'pour calcul du puits')}
          {numField('stairWidthMm', 'Largeur (emmarchement)')}
          {numField('headroomMm', 'Échappée minimale', 'défaut 1950 mm')}

          <div className="space-y-1">
            <Label>Type d&apos;usage</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(USAGE_LABELS) as [TypeUsage, string][]).map(([v, l]) => (
                <button key={v} type="button" onClick={() => setValue('typeUsage', v)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${vals.typeUsage === v ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{l}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Limon</Label>
              <div className="flex flex-col gap-1">
                {(Object.entries(LIMON_LABELS) as [MateriauLimon, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setValue('materiauLimon', v)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${vals.materiauLimon === v ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Marche</Label>
              <div className="flex flex-col gap-1">
                {(Object.entries(MARCHE_LABELS) as [TypeMarche, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setValue('typeMarche', v)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${vals.typeMarche === v ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="risers" checked={vals.closedRisers} onCheckedChange={(v) => setValue('closedRisers', v)} />
            <Label htmlFor="risers">Contremarches fermées</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="upper" checked={vals.upperFloorActsAsLastStep} onCheckedChange={(v) => setValue('upperFloorActsAsLastStep', v)} />
            <Label htmlFor="upper">Plancher supérieur = dernière marche</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? 'Calcul...' : 'Calculer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
