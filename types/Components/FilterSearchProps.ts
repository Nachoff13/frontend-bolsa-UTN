interface FilterSearchProps {
  titulo: string;
  subtitulo?: string;
  placeholder?: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBuscar: () => void;
  onAbrirFiltros?: () => void;
  mostrarBotonFiltros?: boolean;
}