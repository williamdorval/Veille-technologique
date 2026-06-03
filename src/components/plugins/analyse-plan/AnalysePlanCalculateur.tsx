'use client';

import { useState } from 'react';
import { Camera, Sparkles, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { lireChampsExcel } from '@/lib/analyse-plan/excel';
import { preparerImages } from '@/lib/analyse-plan/image';
import type { ResultatAnalyse } from '@/lib/analyse-plan/types';
import { UploadPhotos } from './UploadPhotos';
import { UploadExcel } from './UploadExcel';
import { BoutonAnalyser } from './BoutonAnalyser';
import { ListeValidation } from './ListeValidation';

type Etat = 'idle' | 'analyse' | 'validation' | 'erreur';

// ─── Indicateur d'étapes ──────────────────────────────────────────────────────

interface Etape {
  numero: number;
  label: string;
  icon: React.ReactNode;
}

const ETAPES: Etape[] = [
  { numero: 1, label: 'Photos & Excel', icon: <Camera className="h-4 w-4" /> },
  { numero: 2, label: 'Analyse IA', icon: <Sparkles className="h-4 w-4" /> },
  { numero: 3, label: 'Validation', icon: <ClipboardCheck className="h-4 w-4" /> },
];

function etapeActive(etat: Etat): number {
  if (etat === 'analyse') return 2;
  if (etat === 'validation') return 3;
  return 1;
}

function IndicateurEtapes({ etat }: { etat: Etat }) {
  const active = etapeActive(etat);

  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {ETAPES.map((etape, idx) => {
        const estActive = etape.numero === active;
        const estComplete = etape.numero < active;
        const estFuture = etape.numero > active;

        return (
          <div key={etape.numero} className="flex items-center flex-1 min-w-0">
            {/* Step pill */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
                  estComplete
                    ? 'bg-green-500 text-white'
                    : estActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200 dark:shadow-amber-900/40'
                      : 'bg-muted text-muted-foreground',
                ].join(' ')}
                aria-current={estActive ? 'step' : undefined}
              >
                {estComplete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  etape.icon
                )}
              </div>
              <span
                className={[
                  'mt-1 text-xs font-medium leading-tight text-center whitespace-nowrap',
                  estComplete
                    ? 'text-green-600 dark:text-green-400'
                    : estActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-muted-foreground',
                ].join(' ')}
              >
                {etape.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {idx < ETAPES.length - 1 && (
              <div
                className={[
                  'flex-1 h-0.5 mx-2 mt-[-14px] rounded-full transition-all duration-300',
                  active > etape.numero
                    ? 'bg-green-400 dark:bg-green-600'
                    : 'bg-border',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Calculateur principal ────────────────────────────────────────────────────

export function AnalysePlanCalculateur() {
  const [files, setFiles] = useState<File[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [etat, setEtat] = useState<Etat>('idle');
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);
  const [erreurMessage, setErreurMessage] = useState<string | null>(null);
  const [excelBuffer, setExcelBuffer] = useState<ArrayBuffer | null>(null);

  function handleExcelChange(file: File | null) {
    setExcelFile(file);
    setResultat(null);
    setErreurMessage(null);
    setEtat('idle');
  }

  async function lancerAnalyse() {
    if (!excelFile || files.length === 0) return;
    setEtat('analyse');
    setErreurMessage(null);
    try {
      const buffer = await excelFile.arrayBuffer();
      setExcelBuffer(buffer);
      const champs = await lireChampsExcel(buffer);
      const images = await preparerImages(files);
      const res = await fetch('/api/analyse-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, champs }),
      });
      if (!res.ok) {
        const data = await res.json() as { erreur?: string };
        throw new Error(data.erreur ?? `Erreur ${res.status}`);
      }
      const resultatApi = await res.json() as ResultatAnalyse;
      setResultat(resultatApi);
      setEtat('validation');
    } catch (e) {
      setEtat('erreur');
      setErreurMessage(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }

  if (etat === 'validation' && resultat && excelBuffer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <IndicateurEtapes etat={etat} />
        <ListeValidation
          resultat={resultat}
          excelBuffer={excelBuffer}
          onRecommencer={() => {
            setEtat('idle');
            setResultat(null);
            setErreurMessage(null);
            setFiles([]);
            setExcelFile(null);
            setExcelBuffer(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <IndicateurEtapes etat={etat} />
      <UploadPhotos files={files} onChangerFiles={setFiles} />
      <UploadExcel excelFile={excelFile} onChangerExcel={handleExcelChange} />
      <BoutonAnalyser
        disabled={files.length === 0 || !excelFile}
        enChargement={etat === 'analyse'}
        onAnalyser={lancerAnalyse}
      />
      {erreurMessage && (
        <Alert variant="destructive">
          <AlertTitle>Erreur d&apos;analyse</AlertTitle>
          <AlertDescription>{erreurMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
