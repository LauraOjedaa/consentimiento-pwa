// src/types.ts
export interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'radio' | 'signature';
  page?: number;         // página a la que pertenece
  x: number;
  y: number;
  width?: number;
  height?: number;
  options?: string[];
}

export interface Template {
  id: string;
  label: string;
  src?: string;          // si quieres usar sólo página 1
  srcPages: string[];    // lista de URLs de todas las páginas
  imageWidth: number;
  imageHeight: number;
  fields: Field[];
}
