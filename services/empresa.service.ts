import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

class EmpresaService extends GenericService {
  async getPublicacionesEmpleo(filtros : FiltrosBusquedaDTO) {
    try {
      console.log('Filtros enviados al servicio:', filtros);
      debugger;
      const res = await http.post<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_ALL, filtros);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const empresaService = new EmpresaService();
