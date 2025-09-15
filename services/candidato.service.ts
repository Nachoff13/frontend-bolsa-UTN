import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { GenericService } from "./generic.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";

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
      
      // Usar la URL base configurada
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5113";
      const url = `${baseURL}${ENDPOINTS.CANDIDATO.UPLOAD_CV}?perfilId=${perfilId}`;
      
      console.log('🔧 Upload CV URL:', url); // Debug
      
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.responseException?.exceptionMessage || "Error al subir CV");
      }
      
      const result = await res.json();
      return result.message || "CV subido exitosamente";
    } catch (error) {
      throw error;
    }
  }
}

export const candidatoService = new CandidatoService(); 