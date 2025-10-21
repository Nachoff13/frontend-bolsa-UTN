import type { OfertaDTO } from "@/types/dto/ofertaDTO";

export type OfertaRecienteDTO = {
  ofertas: OfertaDTO[];
  cantidadOfertas: number;
};

export type ApiResponse<T> = {
  message: string;
  result: T;
};
