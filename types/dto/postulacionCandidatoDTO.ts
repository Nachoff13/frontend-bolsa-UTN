export interface PostulacionCandidatoDTO {
  // 🔹 Datos de la Postulación
  idPostulacion: number;
  estadoPostulacion: string;
  observacion?: string | null;
  fechaPostulacion: string; // formato ISO (ej: "2025-08-20T00:00:00")

  // 🔹 Datos del Candidato
  idCandidato: number;
  nombreCandidato?: string | null;
  email?: string | null;
  descripcionPerfil?: string | null;
  generoNombre?: string | null;
  carreraNombre?: string | null;
  anioEgreso?: number | null;
  cv?: string | null; // base64 o null si no tiene CV

  // 🔹 Datos de la Oferta
  idOferta: number;
  tituloOferta?: string | null;
  descripcionOferta?: string | null;

  // 🔹 Información complementaria
  modalidad?: string | null;
  tipoContrato?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  pais?: string | null;
}
