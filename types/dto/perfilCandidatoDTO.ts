export interface PerfilCandidatoDTO {
  // Campos de PerfilCandidato (según diagrama)
  id: number;
  descripcion: string | null; // LONGTEXT en backend, puede venir null
  idUsuario: number;
  idGenero?: number | null;
  legajo?: string | null;
  anioEgreso?: number | null;
  cv?: string | null; // backend guarda BLOB; en API usar string base64 o url
  fechaAlta?: string | null;
  fechaModificacion?: string | null;
  fechaBaja?: string | null;

  // Derivados/relacionados desde Usuario (según diagrama)
  nombre?: string | null;
  email?: string | null;
  usuarioActivo?: boolean | null;
  idRol?: number | null;
  
  // Derivados/relacionados desde Genero (según diagrama)
  generoNombre?: string | null;
  generoCodigo?: string | null;
  
  // Derivados/relacionados desde Rol (según diagrama)
  rolNombre?: string | null;
  rolCodigo?: string | null;
  
  // Calculados por el backend
  porcentajePerfil?: number | null;
  
  // Campos que no están en el diagrama (se mantienen para compatibilidad UI)
  telefono?: string | null;
  localidad?: string | null;
  carrera?: string | null;
} 