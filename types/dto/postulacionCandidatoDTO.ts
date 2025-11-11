export interface PostulacionCandidatoDTO {
  // 🔹 Datos de la Postulación
  idPostulacion: number;
  estadoPostulacion: string;
  observacion?: string | null;
  fechaPostulacion: string; // formato ISO

  // 🔹 Datos del Candidato
  idCandidato: number;
  nombreCandidato?: string | null;
  email?: string | null;
  descripcionPerfil?: string | null;
  generoNombre?: string | null;
  carreraNombre?: string | null;
  anioEgreso?: number | null;
  cv?: string | null;
  fotoPerfil?: string | null;
  motivo?: string | null;

  // 🔹 Competencias del candidato
  competencias?: string[] | null;

  // 🔹 Datos de la Oferta
  idOferta: number;
  tituloOferta?: string | null;
  descripcionOferta?: string | null;
  cartaPresentacion?: string | null;

  // 🔹 Información complementaria
  modalidad?: string | null;
  tipoContrato?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  pais?: string | null;
}
