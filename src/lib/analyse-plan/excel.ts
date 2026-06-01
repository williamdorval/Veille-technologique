// Client-side only — exceljs runs in the browser for this plugin
import ExcelJS from 'exceljs';
import type { ChampExcel, ValeurValidee } from './types';

// Configuration du repérage: colonne de l'étiquette et colonne de la valeur
const COL_ETIQUETTE = 1; // colonne A
const COL_VALEUR = 2;    // colonne B

function slugifier(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function lireChampsExcel(buffer: ArrayBuffer): Promise<ChampExcel[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const feuille = workbook.worksheets[0];
  if (!feuille) return [];

  const champs: ChampExcel[] = [];
  feuille.eachRow((row, rowNumber) => {
    const cellEtiquette = row.getCell(COL_ETIQUETTE);
    const cellValeur = row.getCell(COL_VALEUR);
    const texteEtiquette = cellEtiquette.text?.trim();
    // Ligne avec étiquette non vide ET cellule valeur vide = champ à remplir
    if (texteEtiquette && !cellValeur.text?.trim()) {
      champs.push({
        cle: slugifier(texteEtiquette),
        etiquette: texteEtiquette,
        celluleCible: `B${rowNumber}`,
      });
    }
  });
  return champs;
}

export async function ecrireValeursExcel(
  buffer: ArrayBuffer,
  valeurs: ValeurValidee[]
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const feuille = workbook.worksheets[0];
  if (!feuille) throw new Error('Aucune feuille trouvée dans le fichier Excel');

  for (const { celluleCible, valeur } of valeurs) {
    const cell = feuille.getCell(celluleCible);
    // Préserver le style existant, juste changer la valeur
    cell.value = valeur as ExcelJS.CellValue;
  }

  const result = await workbook.xlsx.writeBuffer();
  // writeBuffer renvoie Buffer (Node) ou ArrayBuffer (browser) — normaliser en ArrayBuffer
  if (result instanceof ArrayBuffer) {
    return result;
  }
  // Buffer Node.js : copier dans un ArrayBuffer propre
  const src = new Uint8Array(result as unknown as ArrayBufferLike);
  const dest = new ArrayBuffer(src.byteLength);
  new Uint8Array(dest).set(src);
  return dest;
}
