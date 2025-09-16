import { OpcionFiltro } from "./opcionFiltroDTO";

export class GrupoFiltro {
  id!: string;
  titulo!: string;
  opciones!: OpcionFiltro[];
  valoresSeleccionados!: string[];
}