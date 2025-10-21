export interface OfertaCreate {
  idPerfilEmpresa: number;
  titulo: string;
  descripcion: string;
  idModalidad: number;
  idTipoContrato: number;
  idLocalidad: number;
  fechaInicio: string; // ISO yyyy-MM-dd
  fechaFin?: string | null;
}

export interface Oferta {
  id: number;
  titulo: string;
  empresa: string;
  ubicacion: string;
  carrera: Carrera;
  contrato: Contrato;
  fechaPublicacion: string; // ISO format
  postulados: number;
  modalidad: ModalidadTipo;
  descripcion: string;
}

export type Contrato = 'Full Time' | 'Part Time' | 'Pasantía';
export type ModalidadTipo = 'Presencial' | 'Híbrido' | 'Remoto';
export type Carrera = 'Sistemas' | 'Química' | 'Industrial' | 'Civil' | 'Eléctrica' | 'Mecánica';

export interface FiltrosOfertas {
  query: string;
  carreras: Carrera[];
  modalidades: ModalidadTipo[];
  ubicacion: string;
  tiposContrato: Contrato[];
}

export interface OfertasResponse {
  ofertas: Oferta[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface Modalidad {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface TipoContrato {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface Localidad {
  id: number;
  nombre: string;
  provincia?: {
    id: number;
    nombre: string;
    pais?: {
      id: number;
      nombre: string;
    };
  };
}

export interface CatalogoResponse<T> {
  data: T[];
  success: boolean;
  message?: string;
}