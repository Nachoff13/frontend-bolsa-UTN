import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { CrearOfertaDTO } from "@/types/dto/ofertaDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";

class AdminService extends GenericService {
 
  async buscarEmpresas(): Promise<PerfilEmpresaDTO[]> {
    try {
      const res = await http.get<PerfilEmpresaDTO[]>(ENDPOINTS.ADMIN.GET_EMPRESAS);
      return res;
    } catch (error) {
      throw error;
    }
  }

  


}

export const adminService = new AdminService();
