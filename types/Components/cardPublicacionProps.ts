interface CardPublicacionProps {
  titulo?: string;
  empresa?: string;
  descripcion?: string;
  modalidad?: string;
  tipoContrato?: string;
  carrera?: string;
  ubicacion?: string;
  fechaPublicacion?: string;
  fechaCierre?: string;            
  onVerDetalle?: () => void;
  onPostularme?: () => void;
}