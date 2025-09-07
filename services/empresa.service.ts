import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";

class EmpresaService extends GenericService {

    async getPublicacionesEmpleo() {
    try {
      const res = await http.get<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_ALL);
      return res;
    } catch (error) {
      console.error("Error fetching job postings:", error);
      throw error;
    }
  }

}

export const empresaService = new EmpresaService();