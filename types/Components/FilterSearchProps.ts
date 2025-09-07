interface FilterSearchProps {
  titulo: string;
  subtitulo?: string;
  placeholder?: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAccion1: () => void;
  tituloBoton1?: string;

  onAccion2?: () => void;
  tituloBoton2?: string;

  mostrarBotonFiltros?: boolean;
}