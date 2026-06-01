'use client';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
    // Reset so the same file can be re-selected after removal
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
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 dark:bg-muted/20">
          <span className="text-lg" aria-hidden>📊</span>
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
        <Button
          variant="outline"
          size="lg"
          className="w-full min-h-12 text-sm"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          📊 Choisir un fichier Excel
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Sur mobile, le sélecteur ouvre Fichiers / OneDrive / Drive — naviguez jusqu&apos;à votre fichier .xlsx.
      </p>
    </div>
  );
}
