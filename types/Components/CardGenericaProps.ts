interface CardGenericaProps {
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  chips?: {
    label: string;
    color?: "primary" | "secondary" | "info" | "warning" | "success" | "error";
  }[];
  infoExtra?: {
    icon: React.ReactNode;
    texto: string;
  }[];
  onAccion1?: () => void;
  textoAccion1?: string;
  onAccion2?: () => void;
  textoAccion2?: string;
}