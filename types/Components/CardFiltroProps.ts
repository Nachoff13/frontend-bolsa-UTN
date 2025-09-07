import { GrupoFiltro } from "../dto/filter/grupoFiltroDTO";

export interface CardFiltrosProps {
  grupos: GrupoFiltro[];
  onSeleccionCambio: (idGrupo: string, nuevosSeleccionados: string[]) => void;
}