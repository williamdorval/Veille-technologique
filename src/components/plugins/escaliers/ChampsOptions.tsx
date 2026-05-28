'use client';

import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TypeUsage, MateriauLimon, TypeMarche } from '@/lib/escaliers/types';
import { LABELS_TYPE_USAGE, LABELS_MATERIAU_LIMON, LABELS_TYPE_MARCHE } from '@/lib/escaliers/normes';

// Type partagé entre FormulaireEscalier et ce composant
export interface FormValues {
  hauteurTotaleSaisie: number;
  largeur: number;
  hauteurPlafond: number;
  typeUsage: TypeUsage;
  contremargesFermees: boolean;
  materiauLimon: MateriauLimon;
  typeMarche: TypeMarche;
}

interface Props {
  form: UseFormReturn<FormValues>;
}

export function ChampsOptions({ form }: Props) {
  const { watch, setValue } = form;
  const watched = watch();

  return (
    <>
      {/* Type d'usage */}
      <div className="space-y-1">
        <Label>Type d&apos;usage</Label>
        <Select value={watched.typeUsage}
          onValueChange={(v) => setValue('typeUsage', v as TypeUsage)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.entries(LABELS_TYPE_USAGE) as [TypeUsage, string][]).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Matériaux */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Matériau du limon</Label>
          <Select value={watched.materiauLimon}
            onValueChange={(v) => setValue('materiauLimon', v as MateriauLimon)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(LABELS_MATERIAU_LIMON) as [MateriauLimon, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Type de marches</Label>
          <Select value={watched.typeMarche}
            onValueChange={(v) => setValue('typeMarche', v as TypeMarche)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(LABELS_TYPE_MARCHE) as [TypeMarche, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contremarches fermées */}
      <div className="flex items-center gap-3">
        <Switch id="ferme" checked={watched.contremargesFermees}
          onCheckedChange={(v) => setValue('contremargesFermees', v)} />
        <Label htmlFor="ferme">Contremarches fermées</Label>
      </div>
    </>
  );
}
