'use client';

import { useRef, useState, useEffect, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Images, X, Upload } from 'lucide-react';

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
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Photos du plan</h2>
        {files.length > 0 && (
          <button
            onClick={() => onChangerFiles([])}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors underline-offset-2 hover:underline"
            type="button"
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

      {/* Bouton principal — Prendre une photo */}
      <Button
        variant="default"
        size="lg"
        className="w-full min-h-14 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all duration-200 flex items-center gap-3"
        onClick={() => cameraRef.current?.click()}
        type="button"
      >
        <Camera className="h-5 w-5 flex-shrink-0" />
        Prendre une photo
      </Button>

      {/* Bouton secondaire — Choisir depuis galerie */}
      <Button
        variant="outline"
        size="lg"
        className="w-full min-h-14 text-lg font-semibold flex items-center gap-3 border-border hover:bg-muted/50"
        onClick={() => galleryRef.current?.click()}
        type="button"
      >
        <Images className="h-5 w-5 flex-shrink-0" />
        Choisir des photos
      </Button>

      {/* Zone drag & drop — desktop uniquement */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'hidden md:flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
          dragOver
            ? 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400'
            : 'border-border bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:border-primary/50',
        ].join(' ')}
        onClick={() => galleryRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Zone de glisser-déposer des photos"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') galleryRef.current?.click(); }}
      >
        <Upload className="h-6 w-6 opacity-60" />
        <span className="text-sm font-medium">Glisser des images ici</span>
        <span className="text-xs opacity-70">ou cliquer pour sélectionner</span>
      </div>

      {/* Compteur + grille de miniatures */}
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {files.length} photo{files.length > 1 ? 's' : ''} prête{files.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {thumbnails.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={files[i]?.name ?? `Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => supprimerFichier(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label={`Supprimer photo ${i + 1}`}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-1">
          Aucune photo ajoutée
        </p>
      )}
    </div>
  );
}
