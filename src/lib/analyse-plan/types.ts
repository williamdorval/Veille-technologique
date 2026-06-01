export type StatutChamp = 'ok' | 'incertain' | 'introuvable' | 'illisible';

export interface ChampExcel {
  cle: string;          // slug de l'étiquette, ex: "giron"
  etiquette: string;    // ex: "Giron"
  celluleCible: string; // ex: "B4"
}

export interface ChampAnalyse {
  cle: string;
  etiquette: string;
  valeur: number | string | null;
  unite: string | null; // toujours en pouces, ex: "po" ou '"'
  confiance: number;    // 0-100
  statut: StatutChamp;
  celluleCible: string;
  note: string;
}

export interface ResultatAnalyse {
  champs: ChampAnalyse[];
}

export interface ImagePayload {
  mimeType: string;
  base64: string;
}

export interface RequeteAnalyse {
  images: ImagePayload[];
  champs: ChampExcel[];
}

export interface ValeurValidee {
  celluleCible: string;
  valeur: number | string;
}
