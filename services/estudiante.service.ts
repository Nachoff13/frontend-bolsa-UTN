import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApplicationCardDto } from "@/types/dto/postulacionDTO";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";

class CandidatoService extends GenericService {
  async getPostulaciones(idEstudiante: number | string) {
    try {
      const res = await http.get<ApplicationCardDto[]>(
        ENDPOINTS.POSTULACIONES.GET_POSTULACIONES(idEstudiante)
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPostulacionesRecientes(idEstudiante: number | string) {
  try {
    const res = await http.get<ApplicationCardDto[]>(
      ENDPOINTS.POSTULACIONES.GET_POSTULACIONES(idEstudiante)
    );
    // res es ApplicationCardDto[]
    return res.slice(0, 3); // 👈 quedate solo con 3
  } catch (error) {
    throw error;
  }
}


  async getPublicacionesRecientes(limit: number = 3) {
    try {
      const res = await http.get<OfertaDTO[]>(
        ENDPOINTS.PUBLICACION.GET_RECIENTES(limit)
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPostulacionesPorEstado(
    idEstudiante: number | string,
    idEstado: number | string
  ) {
    try {
      const res = await http.get<ApplicationCardDto[]>(
        ENDPOINTS.POSTULACIONES.GET_POSTULACION_POR_ESTADO(idEstudiante, idEstado)
      );
      return res; // 👈 mantenemos AxiosResponse
    } catch (error) {
      throw error;
    }
  }

}

export const candidatoService = new CandidatoService();
