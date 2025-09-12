export interface PerfilCandidatoDTO {
  id: number;
  descripcion: string | null; // LONGTEXT en backend, puede venir null
  idUsuario: number;
  idGenero?: number | null;
  legajo?: string | null;
  anioEgreso?: number | null;
  cv?: string | null; // backend guarda BLOB; en API usar string base64 o url

  // Derivados/relacionados desde Usuario (para la UI)
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;

  // Extras de UI que el backend podría calcular o exponer
  localidad?: string | null;
  carrera?: string | null;
  porcentajePerfil?: number | null;
  generoNombre?: string | null;
} 