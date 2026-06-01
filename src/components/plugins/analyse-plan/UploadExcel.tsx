'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileCheck, X } from 'lucide-react';

interface Props {
  excelFile: File | null;
  onChangerExcel: (file: File | null) => void;
}

const ACCEPT_EXCEL = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function UploadExcel({ excelFile, onChangerExcel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChangerExcel(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">Fichier Excel</h2>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_EXCEL}
        className="hidden"
        onChange={handleChange}
      />

      {excelFile ? (
        /* Fichier sélectionné — fond vert léger */
        <div className="flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 px-4 py-3">
          <FileCheck className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span className="flex-1 truncate text-sm font-medium text-foreground">
            {excelFile.name}
          </span>
          <button
            onClick={() => onChangerExcel(null)}
            className="flex-shrink-0 rounded-full p-1 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Supprimer le fichier Excel"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Pas de fichier — bouton outline pleine largeur */
        <Button
          variant="outline"
          size="lg"
          className="w-full min-h-14 text-lg font-semibold flex items-center gap-3 border-border hover:bg-muted/50"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <FileSpreadsheet className="h-5 w-5 flex-shrink-0" />
          Choisir le fichier Excel
        </Button>
      )}

      {/* Note informative mobile */}
      <p className="text-xs text-muted-foreground">
        Sur mobile : le sélecteur ouvre Fichiers / OneDrive / Google Drive — naviguez jusqu&apos;à votre fichier .xlsx.
      </p>
    </div>
  );
}
