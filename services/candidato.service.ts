import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import { api } from "@/services/Generics/api";

class CandidatoService extends GenericService {
  async getPerfil(): Promise<PerfilCandidatoDTO> {
    try {
      return await http.get<PerfilCandidatoDTO>(ENDPOINTS.CANDIDATO.GET_PERFIL);
    } catch (error) {
      throw error;
    }
  }

  async getPerfilById(perfilId: number): Promise<PerfilCandidatoDTO> {
    try {
      return await http.get<PerfilCandidatoDTO>(`${ENDPOINTS.CANDIDATO.GET_PERFIL}?perfilId=${perfilId}`);
    } catch (error) {
      throw error;
    }
  }

  async getPerfilByUsuarioId(usuarioId: number): Promise<PerfilCandidatoDTO> {
    try {
      return await http.get<PerfilCandidatoDTO>(`${ENDPOINTS.CANDIDATO.GET_PERFIL}?usuarioId=${usuarioId}`);
    } catch (error) {
      throw error;
    }
  }

  async updatePerfil(data: PerfilCandidatoDTO): Promise<PerfilCandidatoDTO> {
    try {
      return await http.put<PerfilCandidatoDTO>(ENDPOINTS.CANDIDATO.UPDATE_PERFIL, data);
    } catch (error) {
      throw error;
    }
  }

  async uploadCv(file: File, perfilId: number): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      console.log('🔧 Uploading CV for perfilId:', perfilId);
      
      // Usar api de axios que ya tiene el interceptor con el token
      const response = await api.post(
        `${ENDPOINTS.CANDIDATO.UPLOAD_CV}?perfilId=${perfilId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.message || "CV subido exitosamente";
    } catch (error: any) {
      const errorMessage = error.response?.data?.responseException?.exceptionMessage 
        || error.response?.data?.message 
        || error.message 
        || "Error al subir CV";
      throw new Error(errorMessage);
    }
  }

  async uploadFotoPerfil(file: File, perfilId: number): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('foto', file);
      
      console.log('🔧 Uploading foto perfil for perfilId:', perfilId);
      
      // Usar api de axios que ya tiene el interceptor con el token
      const response = await api.post(
        `${ENDPOINTS.CANDIDATO.UPLOAD_FOTO_PERFIL}?perfilId=${perfilId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.message || "Foto de perfil subida exitosamente";
    } catch (error: any) {
      const errorMessage = error.response?.data?.responseException?.exceptionMessage 
        || error.response?.data?.message 
        || error.message 
        || "Error al subir foto de perfil";
      throw new Error(errorMessage);
    }
  }

  async verificarPerfil(email: string): Promise<any> {
    try {
      return await http.get<any>(`${ENDPOINTS.CANDIDATO.VERIFICAR_PERFIL}?email=${email}`);
    } catch (error) {
      throw error;
    }
  }

  async completarPerfil(data: any): Promise<PerfilCandidatoDTO> {
    try {
      return await http.post<PerfilCandidatoDTO>(ENDPOINTS.CANDIDATO.COMPLETAR_PERFIL, data);
    } catch (error) {
      throw error;
    }
  }
}

export const candidatoService = new CandidatoService(); 