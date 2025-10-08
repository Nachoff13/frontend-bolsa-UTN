import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

class PostulacionService extends GenericService {
  async postularseOferta(data: PostulacionDTO) {
    try {
      const res = await http.post(ENDPOINTS.POSTULACION.POSTULARSE, data);
      return res as string;
    } catch (error) {
      throw error;
    }
  }

  async getPostulaciones(){
    try {
      const res = await http.get<PostulacionDTO[]>(ENDPOINTS.POSTULACION.GET_POSTULACIONES);
      return res;
    }
    catch (error) {
      throw error;
    }
  }
}

export const postulanteService = new PostulacionService();
