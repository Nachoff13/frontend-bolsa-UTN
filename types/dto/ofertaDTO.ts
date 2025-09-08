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

  //datos extra para postularse
  cartaPresentacion!: string;
  observacion!: string;
}
