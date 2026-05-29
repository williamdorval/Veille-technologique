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
import { HelpButton } from './HelpButton';

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

const UNIT_OPTIONS: UnitDisplay[] = ['cm', 'po', 'mm', 'm'];

const USAGE_LABELS: Record<TypeUsage, string> = {
  residentiel_prive: 'Résidentiel privé',
  residentiel_commun: 'Résidentiel commun',
  commercial: 'Commercial',
};
const LIMON_LABELS: Record<MateriauLimon, string> = {
  epinette: 'Épinette', bois_franc: 'Bois franc', acier: 'Acier', composite: 'Composite',
};
const MARCHE_LABELS: Record<TypeMarche, string> = {
  bois_traite: 'Bois traité', epinette: 'Épinette', bois_franc: 'Bois franc',
  contrepalque: 'Contreplaqué', composite: 'Composite',
};

// Textes d'aide pour chaque champ
const AIDE: Record<string, string> = {
  mode: 'Course illimitée : tu as de la place, tu entres juste la hauteur et le calculateur trouve le meilleur giron. Course limitée : tu as un espace précis au sol et le giron doit s\'y adapter exactement.',
  hauteur: 'Mesure du plancher du bas jusqu\'au plancher du haut (pas à la hauteur de la marche). C\'est la hauteur totale que l\'escalier doit franchir. Exemple : 2,80 m pour une maison standard.',
  course: 'L\'espace disponible au sol pour l\'escalier. Exemple : si tu as 4,20 m entre le mur et le bas de l\'escalier, tu entres 420 cm. Le calculateur s\'assure que l\'escalier entre dans cet espace.',
  plafond: 'Épaisseur de la structure du plancher supérieur (chevêtre). Utilisé pour calculer la longueur du puits (l\'ouverture dans le plancher). Typiquement 230–300 mm (23–30 cm) pour une structure en bois.',
  largeur: 'Largeur intérieure de l\'escalier entre les deux limons (c\'est l\'emmarchement). Minimum : 86 cm pour un escalier résidentiel privé selon le Code de construction du Québec (CCQ).',
  echappee: 'Hauteur libre au-dessus de chaque marche, mesurée verticalement. Le CCQ exige 195 cm minimum. C\'est pour qu\'une personne de grande taille ne se cogne pas la tête.',
  usage: 'Résidentiel privé : maison unifamiliale. Résidentiel commun : immeuble, couloir commun. Commercial : bureau, commerce. Chaque usage a ses propres normes du CCQ (contremarche max, largeur min, etc.).',
  limon: 'Le limon, c\'est la planche inclinée de chaque côté qui supporte toutes les marches. Épinette (bois commun, économique), bois franc (chêne/érable, plus beau), acier (très solide), composite (résistant à l\'humidité).',
  marche: 'Le matériau des marches horizontales. Bois traité pour l\'extérieur. Épinette pour l\'intérieur économique. Bois franc pour l\'escalier fini beau. Contreplaqué pour ensuite poser un revêtement. Composite pour résistance.',
  contremarche: 'La contremarche, c\'est la partie verticale entre deux marches. Fermée : la partie verticale est recouverte (escalier plein, plus sécuritaire). Ouverte : pas de panneau vertical (escalier ajouré, plus léger visuellement).',
  plancher: 'Quand activé (recommandé) : le plancher du haut compte comme la dernière "marche". Ça veut dire qu\'avec 16 contremarches, tu as 15 marches physiques à installer. C\'est le standard au Québec.',
};

export function FormulaireEscalierPro({ onCalculer, isCalculating }: Props) {
  const [unit, setUnit] = useState<UnitDisplay>('cm');
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
    const t = setTimeout(() => handleSubmit(soumettre)(), 300);
    return () => clearTimeout(t);
  }, [vals.totalHeightMm, vals.availableRunMm, vals.ceilingThicknessMm, vals.stairWidthMm, vals.headroomMm, vals.typeUsage, vals.closedRisers, vals.materiauLimon, vals.typeMarche, vals.upperFloorActsAsLastStep, mode, unit, handleSubmit, soumettre]);

  function numField(field: keyof FormValues, label: string, aideKey: string, hint?: string) {
    const mmVal = vals[field] as number | undefined;
    const display = mmVal ? convertFromMm(mmVal, unit) : '';
    return (
      <div className="space-y-1">
        <Label className="flex items-center gap-1">
          {label} ({unit})
          <HelpButton texte={AIDE[aideKey]} />
          {hint && <span className="text-xs text-muted-foreground ml-1">{hint}</span>}
        </Label>
        <Input type="number" step={stepForUnit(unit)}
          value={display === 0 ? '' : display}
          onChange={(e) => { const r = parseFloat(e.target.value); if (!isNaN(r)) setValue(field, convertToMm(r, unit) as never, { shouldValidate: true }); }} />
        {errors[field] && <p className="text-destructive text-xs">{(errors[field] as { message?: string })?.message}</p>}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Calculateur professionnel d&apos;escalier</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">

          {/* Unité */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Unité d&apos;affichage :</span>
            {UNIT_OPTIONS.map(u => (
              <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u}
                className={`px-3 py-1 rounded text-sm border transition-colors ${unit === u ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{u}</button>
            ))}
          </div>

          {/* Mode */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1">
              Mode de calcul <HelpButton texte={AIDE.mode} />
            </Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as StairMode)}>
              <TabsList className="w-full">
                <TabsTrigger value="unlimited_run" className="flex-1">Course illimitée</TabsTrigger>
                <TabsTrigger value="limited_run" className="flex-1">Course limitée</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground">
              {mode === 'unlimited_run'
                ? 'Tu as de la place — le calculateur trouve le meilleur giron automatiquement.'
                : 'Tu as un espace fixe au sol — le giron s\'adapte à cet espace.'}
            </p>
          </div>

          {numField('totalHeightMm', 'Hauteur totale', 'hauteur', 'plancher à plancher')}
          {mode === 'limited_run' && numField('availableRunMm', 'Course disponible', 'course', 'espace au sol')}
          {numField('ceilingThicknessMm', 'Épaisseur du chevêtre', 'plafond', 'structure plancher sup.')}
          {numField('stairWidthMm', 'Largeur (emmarchement)', 'largeur')}
          {numField('headroomMm', 'Échappée minimale', 'echappee', 'défaut : 195 cm')}

          {/* Type d'usage */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1">Type d&apos;usage <HelpButton texte={AIDE.usage} /></Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(USAGE_LABELS) as [TypeUsage, string][]).map(([v, l]) => (
                <button key={v} type="button" onClick={() => setValue('typeUsage', v)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${vals.typeUsage === v ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{l}</button>
              ))}
            </div>
          </div>

          {/* Matériaux */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-1">Matériau du limon <HelpButton texte={AIDE.limon} /></Label>
              <div className="flex flex-col gap-1">
                {(Object.entries(LIMON_LABELS) as [MateriauLimon, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setValue('materiauLimon', v)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${vals.materiauLimon === v ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1">Matériau des marches <HelpButton texte={AIDE.marche} /></Label>
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
            <Label htmlFor="risers" className="flex items-center gap-1">
              Contremarches fermées <HelpButton texte={AIDE.contremarche} />
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="upper" checked={vals.upperFloorActsAsLastStep} onCheckedChange={(v) => setValue('upperFloorActsAsLastStep', v)} />
            <Label htmlFor="upper" className="flex items-center gap-1">
              Plancher sup. = dernière marche <HelpButton texte={AIDE.plancher} />
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? 'Calcul en cours…' : 'Calculer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
