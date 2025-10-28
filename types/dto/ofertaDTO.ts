export class OfertaDTO {
  id!: number;
  titulo!: string;
  descripcion!: string;
  nombreLocalidad!: string;
  modalidad!: string;
  tipoContrato!: string;
  fechaInicio!: string;
  fechaFin!: string;
  nombreEmpresa!: string;
  nombreCarrera!: string;
  cantidadPostulantes!: number;

  //datos extra para postularse
  cartaPresentacion!: string;
  observacion!: string;

  puedePostularse!: boolean;
}

export class CrearOfertaDTO {
  titulo!: string;
  descripcion!: string;
  idModalidad?: number;
  idTipoContrato?: number;
  idLocalidad?: number;
  fechaInicio?: string;
  fechaFin?: string;
}