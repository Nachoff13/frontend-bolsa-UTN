interface CardPublicacionProps {
  titulo?: string;
  empresa?: string;
  descripcionCorta?: string;
  modalidad?: string;
  tipoContrato?: string;
  ubicacion?: string;
  fechaPublicacion?: string;
  carrera: string;
  onVerDetalle?: () => void;
  onPostularme?: () => void;
}