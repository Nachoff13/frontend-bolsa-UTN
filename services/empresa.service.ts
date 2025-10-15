import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import type { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { GenericService } from "./generic.service";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

class EmpresaService extends GenericService {
  async getPublicacionesEmpleo(filtros : FiltrosBusquedaDTO) {
    try {
      console.log('Filtros enviados al servicio:', filtros);
      const res : OfertaDTO[] = await http.post<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_ALL, filtros);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPerfil(): Promise<PerfilEmpresaDTO> {
    try {
      return await http.get<PerfilEmpresaDTO>(ENDPOINTS.EMPRESA.GET_PERFIL);
    } catch (error) {
      throw error;
    }
  }

  async getPerfilById(perfilId: number): Promise<PerfilEmpresaDTO> {
    try {
      return await http.get<PerfilEmpresaDTO>(`${ENDPOINTS.EMPRESA.GET_PERFIL}?perfilId=${perfilId}`);
    } catch (error) {
      throw error;
    }
  }

  async getPerfilByUsuarioId(usuarioId: number): Promise<PerfilEmpresaDTO> {
    try {
      return await http.get<PerfilEmpresaDTO>(`${ENDPOINTS.EMPRESA.GET_PERFIL}?usuarioId=${usuarioId}`);
    } catch (error) {
      throw error;
    }
  }

  async updatePerfil(data: PerfilEmpresaDTO): Promise<PerfilEmpresaDTO> {
    try {
      return await http.put<PerfilEmpresaDTO>(ENDPOINTS.EMPRESA.UPDATE_PERFIL, data);
    } catch (error) {
      throw error;
    }
  }
}

export const empresaService = new EmpresaService();
