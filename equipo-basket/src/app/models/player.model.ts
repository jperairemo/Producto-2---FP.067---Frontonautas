export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: 'Base' | 'Escolta' | 'Alero' | 'Ala-Pívot' | 'Pívot' | string;
  age: number;
  height: number; // en metros
  avatar?: string; // ruta en /assets
  videoUrl?: string; // local
  mediaTitle?: string;
}
