import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GenericService } from "./generic.service";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";

class EmpresaService extends GenericService {
  async getPublicacionesEmpleo(filtros : FiltrosBusquedaDTO) {
    try {
      console.log('Filtros enviados al servicio:', filtros);
      const res = await http.post<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_ALL, filtros);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPublicaciones(): Promise<OfertaRecienteDTO> {
    try {
      const res = await http.get<OfertaRecienteDTO>(ENDPOINTS.PUBLICACION.GET_RECIENTES(3));
      console.log("Respuesta de getPublicaciones:", res);
      return res; // 👈 mismo efecto que el primero
    } catch (error) {
      throw error;
    }
  }



   // contador de publicaciones del mes actual
  async getPublicacionesDelMesActual() {
    try {
      const res = await http.get<OfertaDTO[]>(
        ENDPOINTS.PUBLICACION.GET_ALL
      );

      const ahora = new Date();
      const mesActual = ahora.getMonth(); // 0 = Enero
      const anioActual = ahora.getFullYear();

      const cantidad = res.filter((oferta) => {
        if (!oferta.fechaInicio) return false;
        const fecha = new Date(oferta.fechaInicio);
        return (
          fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
        );
      }).length;

      return cantidad;
    } catch (error) {
      throw error;
    }
  }
}

export const empresaService = new EmpresaService();
