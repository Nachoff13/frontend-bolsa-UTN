import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { PostulacionDTO } from "@/types/dto/postulacionDTO";
import type { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";
import { GenericService } from "./generic.service";

class CandidatoService extends GenericService {
  async getPostulaciones() {
    try {
      const res : PostulacionDTO[] = await http.get<PostulacionDTO[]>(
        ENDPOINTS.POSTULACIONES.GET_POSTULACIONES
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  // async getPostulacionesRecientes(idEstudiante: number | string) {
  // try {
  //   const res = await http.get<PostulacionDTO[]>(
  //     ENDPOINTS.POSTULACIONES.GET_RECIENTES(idEstudiante)
  //   );
  //   // res es ApplicationCardDto[]
  //   return res.slice(0, 3); // 👈 quedate solo con 3
  // } catch (error) {
  //   throw error;
  // }
// }


  async getPublicacionesRecientes(limit: number = 3) {
    try {
      const res : OfertaRecienteDTO = await http.get<OfertaRecienteDTO>(
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
      const res = await http.get<PostulacionDTO[]>(
        ENDPOINTS.POSTULACIONES.GET_POSTULACION_POR_ESTADO(idEstudiante, idEstado)
      );
      return res; // 👈 mantenemos AxiosResponse
    } catch (error) {
      throw error;
    }
  }

}

export const candidatoService = new CandidatoService();
