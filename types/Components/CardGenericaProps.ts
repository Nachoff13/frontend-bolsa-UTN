interface CardGenericaProps {
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  chips?: {
    label: string;
    color?: string;
    backgroundColor?: string;
    textColor?: string;
  }[];
  infoExtra?: {
    icon: React.ReactNode;
    texto: string;
  }[];
  onAccion1?: () => void;
  textoAccion1?: string;
  disabledAccion1?: boolean;
  colorAccion1?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  disabledAccion2?: boolean;
  onAccion2?: () => void;
  textoAccion2?: string;
  colorAccion2?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}