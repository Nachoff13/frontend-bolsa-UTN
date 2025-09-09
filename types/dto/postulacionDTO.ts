export class PostulacionDTO {
  id!: number;
  idPerfilCandidato!: number;
  idOferta!: number;

  // Datos propios de la postulación
  cartaPresentacion!: string;
  observacion!: string;

  // Datos derivados
  estadoPostulacion!: string;      // último estado
  fechaPostulacion!: string;       // fecha formateada desde el back

  // Datos de la Oferta y sus relaciones
  nombreEmpresa!: string;
  tituloOferta!: string;
  descripcionOferta!: string;
  descripcionModalidad!: string;
  descripcionTipoContrato!: string;
}