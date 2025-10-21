import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import type { ApiResponse } from "@/types/Generics/apiResponse";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import type { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { GenericService } from "./generic.service";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { ResponseError } from "@/types/Generics/responseError";

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

  async getPublicacionesEmpresa(emailEmpresa: string): Promise<OfertaDTO[]> {
    try {
      const res = await http.get<OfertaDTO[]>(
        ENDPOINTS.PUBLICACION.GET_PUBLICACIONES_EMPRESA(emailEmpresa)
      );
      console.log("Respuesta de getPublicacionesEmpresa: ", res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPostulacionesEmpresa(emailEmpresa: string): Promise<PostulacionDTO[]> {
    try {
      const res = await http.get<PostulacionDTO[]>(
        ENDPOINTS.POSTULACIONES.GET_POSTULACIONES_EMPRESA(emailEmpresa)
      );
      return res;
    } catch (e) {
      const err = e as ResponseError;
      console.error("Error al obtener postulaciones de la empresa:", err.message);
      throw err;
    }
  }
}

export const empresaService = new EmpresaService();
