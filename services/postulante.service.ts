import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

class PostulanteService extends GenericService {
  async postularseOferta(data: PostulacionDTO) {
    try {
      const res = await http.post<object>(ENDPOINTS.POSTULANTE.POSTULARSE, data);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const postulanteService = new PostulanteService();
