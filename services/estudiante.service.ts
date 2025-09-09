import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApplicationCardDto } from "@/types/dto/postulacionDTO";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";

class CandidatoService extends GenericService {
  async getPostulaciones(idEstudiante: number | string) {
    try {
      const res = await http.get<ApplicationCardDto[]>(
        ENDPOINTS.POSTULACIONES.GET_BY_ESTUDIANTE(idEstudiante)
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPostulacionesUltimoMes(idEstudiante: number | string) {
    try {
      const res = await http.get<number>(
        ENDPOINTS.POSTULACIONES.GET_ULTIMO_MES(idEstudiante)
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPublicacionesRecientes() {
    try {
      const res = await http.get<OfertaDTO[]>(
        ENDPOINTS.PUBLICACION.GET_RECIENTES
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const candidatoService = new CandidatoService();
