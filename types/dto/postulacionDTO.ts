export class PostulacionDTO {
  id!: number;
  idOferta!: number;

  // Datos propios de la postulación
  cartaPresentacion!: string;
  observacion!: string;

  // Datos derivados
  estadoPostulacion!: string;      // último estado
  fechaPostulacion!: string;       // fecha formateada desde el back
  motivo?: string | null;          // motivo de aprobación/rechazo del historial

  // Datos de la Oferta y sus relaciones
  nombreEmpresa!: string;
  tituloOferta!: string;
  descripcionOferta!: string;
  descripcionModalidad!: string;
  descripcionTipoContrato!: string;
  nombreCandidato!: string;
}