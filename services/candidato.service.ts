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

  async uploadCv(formData: FormData): Promise<string> {
    try {
      // Para subida de archivos, usamos api directamente por headers multipart
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.CANDIDATO.UPLOAD_CV}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al subir CV");
      const text = await res.text();
      return text;
    } catch (error) {
      throw error;
    }
  }
}

export const candidatoService = new CandidatoService(); 