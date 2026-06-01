'use client';
import { useRef, useState, useEffect, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  files: File[];
  onChangerFiles: (files: File[]) => void;
}

export function UploadPhotos({ files, onChangerFiles }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setThumbnails(urls);
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [files]);

  function ajouterFichiers(nouveaux: FileList | null) {
    if (!nouveaux || nouveaux.length === 0) return;
    const arr = Array.from(nouveaux).filter((f) => f.type.startsWith('image/'));
    onChangerFiles([...files, ...arr]);
  }

  function supprimerFichier(index: number) {
    const updated = files.filter((_, i) => i !== index);
    onChangerFiles(updated);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    ajouterFichiers(e.dataTransfer.files);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Photos du plan</h2>
        {files.length > 0 && (
          <button
            onClick={() => onChangerFiles([])}
            className="text-xs text-muted-foreground underline hover:text-destructive transition-colors"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => ajouterFichiers(e.target.files)}
        // Reset value so same file can be re-selected
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => ajouterFichiers(e.target.files)}
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
      />

      {/* Boutons d'ajout */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 text-sm"
          onClick={() => cameraRef.current?.click()}
          type="button"
        >
          📷 Prendre une photo
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 text-sm"
          onClick={() => galleryRef.current?.click()}
          type="button"
        >
          🖼 Choisir des photos
        </Button>
      </div>

      {/* Zone drag & drop (desktop) */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'hidden md:flex items-center justify-center rounded-lg border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors cursor-pointer',
          dragOver
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:border-primary/50 dark:border-border dark:hover:border-primary/50',
        ].join(' ')}
        onClick={() => galleryRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') galleryRef.current?.click(); }}
      >
        Glisser-déposer des photos ici, ou cliquer pour sélectionner
      </div>

      {/* Compteur */}
      <p className="text-sm text-muted-foreground">
        {files.length === 0
          ? 'Aucune photo ajoutée'
          : `${files.length} photo${files.length > 1 ? 's' : ''} prête${files.length > 1 ? 's' : ''}`}
      </p>

      {/* Miniatures */}
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {thumbnails.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={files[i]?.name ?? `Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => supprimerFichier(i)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label={`Supprimer photo ${i + 1}`}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
