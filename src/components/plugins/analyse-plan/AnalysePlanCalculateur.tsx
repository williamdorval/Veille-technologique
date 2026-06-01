'use client';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { lireChampsExcel } from '@/lib/analyse-plan/excel';
import { preparerImages } from '@/lib/analyse-plan/image';
import type { ResultatAnalyse } from '@/lib/analyse-plan/types';
import { UploadPhotos } from './UploadPhotos';
import { UploadExcel } from './UploadExcel';
import { BoutonAnalyser } from './BoutonAnalyser';
// ListeValidation will be created in Task 4
// import { ListeValidation } from './ListeValidation';

type Etat = 'idle' | 'analyse' | 'validation' | 'erreur';

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
      // 1. Read Excel buffer (needed for writing later, store in state)
      const buffer = await excelFile.arrayBuffer();
      setExcelBuffer(buffer);
      // 2. Read champs from Excel
      const champs = await lireChampsExcel(buffer);
      // 3. Prepare images
      const images = await preparerImages(files);
      // 4. Call API
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

  // Suppress unused warning — excelBuffer will be used by ListeValidation (Task 4)
  void excelBuffer;

  if (etat === 'validation' && resultat) {
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground py-8">
          {/* ListeValidation sera rendu ici (Task 4) */}
          <p>Analyse terminée — {resultat.champs.length} champs détectés</p>
        </div>
        <button
          onClick={() => { setEtat('idle'); setResultat(null); }}
          className="text-sm underline text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
