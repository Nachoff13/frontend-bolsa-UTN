import { http } from "@/services/Generics/httpClient";
import { ENDPOINTS } from "@/services/Generics/endpoints";
import { NotificacionDTO, NotificacionCountDTO, CrearNotificacionDTO } from "@/types/dto/notificacionDTO";

export class NotificacionService {
  /**
   * Obtiene todas las notificaciones del usuario autenticado
   */
  async getMisNotificaciones(soloNoLeidas?: boolean): Promise<NotificacionDTO[]> {
    try {
      const url = soloNoLeidas !== undefined
        ? `${ENDPOINTS.NOTIFICACION.MIS_NOTIFICACIONES}?soloNoLeidas=${soloNoLeidas}`
        : ENDPOINTS.NOTIFICACION.MIS_NOTIFICACIONES;
      
      const res = await http.get<NotificacionDTO[]>(url);
      return res;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      throw error;
    }
  }

  /**
   * Obtiene el contador de notificaciones no leídas
   */
  async getContador(): Promise<NotificacionCountDTO> {
    try {
      const res = await http.get<NotificacionCountDTO>(ENDPOINTS.NOTIFICACION.CONTADOR);
      return res;
    } catch (error) {
      console.error("Error al obtener contador de notificaciones:", error);
      throw error;
    }
  }

  /**
   * Marca una notificación como leída
   */
  async marcarComoLeida(id: number): Promise<NotificacionDTO> {
    try {
      const res = await http.put<NotificacionDTO>(ENDPOINTS.NOTIFICACION.MARCAR_LEIDA(id));
      return res;
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      throw error;
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas(): Promise<void> {
    try {
      await http.put(ENDPOINTS.NOTIFICACION.MARCAR_TODAS_LEIDAS);
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error);
      throw error;
    }
  }

  /**
   * Elimina una notificación
   */
  async eliminarNotificacion(id: number): Promise<void> {
    try {
      await http.delete(ENDPOINTS.NOTIFICACION.ELIMINAR(id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva notificación (para testing o uso interno)
   */
  async crearNotificacion(data: CrearNotificacionDTO): Promise<NotificacionDTO> {
    try {
      const res = await http.post<NotificacionDTO>(ENDPOINTS.NOTIFICACION.CREAR, data);
      return res;
    } catch (error) {
      console.error("Error al crear notificación:", error);
      throw error;
    }
  }
}

export const notificacionService = new NotificacionService();
