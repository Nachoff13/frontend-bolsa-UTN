export interface NotificacionDTO {
  id: number;
  idUsuario: number;
  mensaje: string;
  leido: boolean;
  fechaEnvio: string;
  asunto?: string;
  idPostulacion: number;
  
  // Campos adicionales del backend
  tituloOferta?: string;
  nombreEmpresa?: string;
  nombreCandidato?: string;
  emailUsuario?: string;
}

export interface CrearNotificacionDTO {
  idUsuario: number;
  mensaje: string;
  asunto?: string;
  idPostulacion: number;
}

export interface NotificacionCountDTO {
  noLeidas: number;
  total: number;
}

export interface CambiarEstadoPostulacionDTO {
  idEstado: number;
  motivo?: string;
}
