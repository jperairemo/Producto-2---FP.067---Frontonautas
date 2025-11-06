export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: 'Base' | 'Escolta' | 'Alero' | 'Ala-Pívot' | 'Pívot' | string;
  age: number;
  height: number; // en metros
  avatar?: string; // ruta en /assets o imagen local por defecto

  // Campos para contenido multimedia
  imagenUrl?: string; // URL de la imagen subida a Firebase Storage
  videoUrl?: string;  // URL del vídeo subido a Firebase Storage

  mediaTitle?: string; // título o descripción opcional del vídeo
}

