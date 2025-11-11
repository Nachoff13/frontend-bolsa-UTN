import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { CrearOfertaDTO } from "@/types/dto/ofertaDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { any } from "zod";

class OfertaService extends GenericService {
  // Obtener todas las ofertas (para candidatos)
  async getAllOfertas(): Promise<OfertaDTO[]> {
    try {
      const res = await http.get<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_ALL_OFERTAS);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Buscar ofertas con filtros (para candidatos)
  async buscarOfertas(filtros: FiltrosBusquedaDTO): Promise<OfertaDTO[]> {
    try {
      const res = await http.post<OfertaDTO[]>(ENDPOINTS.PUBLICACION.GET_PUBLICACIONES_EMPLEO, filtros);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una oferta por ID
  async getOfertaById(id: number): Promise<OfertaDTO> {
    try {
      const res = await http.get<OfertaDTO>(ENDPOINTS.PUBLICACION.GET_OFERTA_BY_ID(id));
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Obtener ofertas por empresa (para empresas)
  async getOfertasByEmpresa(): Promise<OfertaDTO[]> {
    try {
      const res = await http.get<OfertaDTO[]>(`${ENDPOINTS.PUBLICACION.GET_OFERTAS_BY_EMPRESA}`);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Crear oferta (para empresas)
  async crearOferta(data: CrearOfertaDTO): Promise<OfertaDTO> {
    try {
      const res = await http.post<OfertaDTO>(ENDPOINTS.PUBLICACION.CREAR_OFERTA, data);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar oferta (para empresas)
  async actualizarOferta(id: number, data: CrearOfertaDTO): Promise<OfertaDTO> {
    try {
      const res = await http.put<OfertaDTO>(`${ENDPOINTS.PUBLICACION.ACTUALIZAR_OFERTA}/${id}`, data as any);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar oferta (para empresas)
  async eliminarOferta(id: number): Promise<void> {
    try {
      await http.delete(`${ENDPOINTS.PUBLICACION.ELIMINAR_OFERTA}/${id}`);
    } catch (error) {
      throw error;
    }
  }
}

export const ofertaService = new OfertaService();
