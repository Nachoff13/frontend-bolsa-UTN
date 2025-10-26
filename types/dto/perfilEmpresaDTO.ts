import { OfertaDTO } from "./ofertaDTO";

export interface PerfilEmpresaDTO {
  // Campos de PerfilEmpresa
  id: number;
  idUsuario: number;
  descripcion: string | null;
  razonSocial: string;
  cuit?: string | null;
  idEstadoValidacion?: number | null;
  fechaAlta?: string | null;
  fechaModificacion?: string | null;
  fechaBaja?: string | null;

  // Derivados/relacionados desde Usuario
  nombre?: string | null;
  email?: string | null;
  usuarioActivo?: boolean | null;
  idRol?: number | null;
  fotoPerfil?: string | null;

  // Derivados/relacionados desde Rol
  rolNombre?: string | null;
  rolCodigo?: string | null;

  // Derivados/relacionados desde EstadoValidacion
  estadoValidacionNombre?: string | null;
  estadoValidacionCodigo?: string | null;

  // Campos adicionales de contacto
  telefono?: string | null;
  localidad?: string | null;

  // Lista de ofertas publicadas por la empresa
  ofertas?: OfertaDTO[] | null;

  // Calculado por el backend
  porcentajePerfil?: number | null;
}

