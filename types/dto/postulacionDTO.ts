export interface ApplicationCardDto {
  idPostulacion: number;
  idOferta: number;
  tituloOferta: string;
  nombreEmpresa: string;
  estado: "En revisión" | "Entrevista" | "Rechazada" | string;
  fechaPostulacion: string;        // ISO (lo derivás de DateTime en el back)
  fechaPostulacionTexto: string;   // "Postulado el 21 Ago 2025"
}