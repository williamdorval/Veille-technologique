// Client-side only — uses browser Canvas API
import type { ImagePayload } from './types';

const MAX_LARGEUR_PX = 1600;
const QUALITE_JPEG = 0.85;

function estHeic(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')
  );
}

async function compresserImage(file: File): Promise<ImagePayload> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > MAX_LARGEUR_PX) {
        height = Math.round((height * MAX_LARGEUR_PX) / width);
        width = MAX_LARGEUR_PX;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context non disponible'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', QUALITE_JPEG);
      const base64 = dataUrl.split(',')[1];
      if (!base64) {
        reject(new Error("Impossible de convertir l'image"));
        return;
      }
      resolve({ mimeType: 'image/jpeg', base64 });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Impossible de charger l'image: ${file.name}`));
    };

    img.src = url;
  });
}

async function passerHeicBrut(file: File): Promise<ImagePayload> {
  const buffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < uint8.length; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  const base64 = btoa(binary);
  return { mimeType: 'image/heic', base64 };
}

export async function preparerImages(files: File[]): Promise<ImagePayload[]> {
  const promesses = files.map((file) => {
    if (estHeic(file)) {
      // HEIC: non décodable par canvas hors Safari — passer brut (Gemini accepte image/heic)
      return passerHeicBrut(file);
    }
    return compresserImage(file);
  });
  return Promise.all(promesses);
}
