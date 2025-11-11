import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { CrearOfertaDTO } from "@/types/dto/ofertaDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { UsuarioDTO } from "@/types/dto/usuarioDTO";
import { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import { PerfilCompletoDTO } from "@/types/dto/perfilCompleetoDTO";
import type { DashboardAdminDTO } from "@/types/dto/dashboardAdminDTO";
import { ResponseError } from "@/types/Generics/responseError";

class AdminService extends GenericService {
  async cambiarEstadoValidacion(body: object): Promise<void> {
    try {
      await http.post<PerfilEmpresaDTO[]>(
        ENDPOINTS.ADMIN.CAMBIAR_ESTADO_VALIDACION,
        body
      );
    } catch (error) {
      throw error;
    }
  }

  async buscarEmpresas(
    filtros: FiltrosBusquedaDTO
  ): Promise<PerfilEmpresaDTO[]> {
    try {
      const res = await http.post<PerfilEmpresaDTO[]>(
        ENDPOINTS.ADMIN.GET_EMPRESAS,
        filtros
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  //voy a hacer un get pero debo mandarle un parametro que es el rol seleccionado desde el filtro
  async getUsuarios(): Promise<UsuarioDTO[]> {
    try {
      //al get le paso el rol como parametro
      const res = await http.get<UsuarioDTO[]>(ENDPOINTS.ADMIN.GET_USUARIOS);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async bajaUsuario(idUsuario: number) {
    try {
      await http.post(`${ENDPOINTS.ADMIN.BAJA_USUARIO}`, idUsuario);
    } catch (error) {
      throw error;
    }
  }

  async altaUsuario(idUsuarioAlta: number) {
    try {
      await http.post(`${ENDPOINTS.ADMIN.ALTA_USUARIO}`, idUsuarioAlta);
    } catch (error) {
      throw error;
    }
  }

  async verDetalleUsuario(idUsuarioRegistrado: number) {
    try {
      const res: PerfilCompletoDTO = await http.post<PerfilCompletoDTO>(
        ENDPOINTS.ADMIN.VER_DETALLE_USUARIO,
        idUsuarioRegistrado
      );
      return res;
    } catch (error) {
      throw error;
    }
  }


  async actualizarRolUsuario(idUsuarioRegistrado: number, idRolEditado: number | null) {
    try {
      await http.post(ENDPOINTS.ADMIN.ACTUALIZAR_ROL_USUARIO, {
        idUsuario: idUsuarioRegistrado,
        idRol: idRolEditado,
      });
    } catch (error) {
      throw error;
    }
  }

  async dashboardAdmin(): Promise<DashboardAdminDTO> {
    try {
      const res = await http.get<DashboardAdminDTO>(
        ENDPOINTS.ADMIN.DASHBOARD
      );

      console.log("📡 DashboardAdmin - respuesta cruda:", res);

      return res;
    } catch (e) {
      const err = e as ResponseError;
      console.error("Error al obtener el dashboard del administrador:", err.message);
      throw err;
    }
  }
}

export const adminService = new AdminService();
