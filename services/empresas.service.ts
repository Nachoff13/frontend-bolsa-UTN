import { http } from "@/services/httpClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse";
import type { OfertaDTO } from "@/types/ofertaDTO";

export async function listarOfertas() {
  const res = await http.get<ApiResponse<OfertaDTO[]>>(ENDPOINTS.PRUEBA.GET_ALL);
  return res.result.data; // por el wrapper de AutoWrapper
}