import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { OpcionFiltro } from "@/types/dto/filter/opcionFiltroDTO";
import { UsuarioDTO } from "@/types/dto/usuarioDTO";

export class GenericService {
  async getTipoContrato() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_TIPO_CONTRATO
      );
      return res;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getModalidad() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_MODALIDAD
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
  async getCarreras() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_CARRERAS
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getLocalidades() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_LOCALIDADES
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

    async getEstadosValidacion() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_ESTADOS_VALIDACION
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async cargarUsuario() {
    try {
      const res: UsuarioDTO = await http.post(ENDPOINTS.GENERIC.CARGAR_USUARIO);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPerfilEmpresaUsuario() {
    try {
      const res: { idPerfilEmpresa: number } = await http.get(ENDPOINTS.GENERIC.GET_PERFIL_EMPRESA_USUARIO);
      return res.idPerfilEmpresa;
    } catch (error) {
      throw error;
    }
  }

   async getRoles() {
    try {
      const res: OpcionFiltro[] = await http.get<OpcionFiltro[]>(
        ENDPOINTS.GENERIC.GET_ROLES
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

}

export const genericService = new GenericService();
