import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";

export async function getPublicacionesEmpleo() {
  const res = await http.get<ApiResponse<OfertaDTO[]>>(ENDPOINTS.PUBLICACION.GET_ALL);
  return res.result.data; // por el wrapper de AutoWrapper
}