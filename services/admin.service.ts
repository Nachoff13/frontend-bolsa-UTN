import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { CrearOfertaDTO } from "@/types/dto/ofertaDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";

class AdminService extends GenericService {
  async cambiarEstadoValidacion(body: object): Promise<void> {
     try {
      debugger;
      await http.post<PerfilEmpresaDTO[]>(ENDPOINTS.ADMIN.CAMBIAR_ESTADO_VALIDACION, body);
    } catch (error) {
      throw error;
    }
  }
 
  async buscarEmpresas(filtros: FiltrosBusquedaDTO): Promise<PerfilEmpresaDTO[]> {
    try {
      const res = await http.post<PerfilEmpresaDTO[]>(ENDPOINTS.ADMIN.GET_EMPRESAS,filtros);
      return res;
    } catch (error) {
      throw error;
    }
  }

  


}

export const adminService = new AdminService();
