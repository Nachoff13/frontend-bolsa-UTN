"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { notificacionService } from "@/services/notificacion.service";
import { NotificacionDTO, NotificacionCountDTO } from "@/types/dto/notificacionDTO";

interface NotificationContextType {
  notificaciones: NotificacionDTO[];
  contador: NotificacionCountDTO;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  marcarComoLeida: (id: number) => Promise<void>;
  marcarTodasComoLeidas: () => Promise<void>;
  eliminarNotificacion: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications debe ser usado dentro de un NotificationProvider");
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  pollingInterval?: number; // en milisegundos, por defecto 30 segundos
}

export function NotificationProvider({ 
  children, 
  pollingInterval = 30000 
}: NotificationProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [notificaciones, setNotificaciones] = useState<NotificacionDTO[]>([]);
  const [contador, setContador] = useState<NotificacionCountDTO>({ noLeidas: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Esperar a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotificaciones = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setError(null);
      const [notifs, count] = await Promise.all([
        notificacionService.getMisNotificaciones().catch(err => {
          console.warn("Error al obtener notificaciones:", err);
          return [];
        }),
        notificacionService.getContador().catch(err => {
          console.warn("Error al obtener contador:", err);
          return { noLeidas: 0, total: 0 };
        })
      ]);
      setNotificaciones(notifs);
      setContador(count);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("Error al cargar las notificaciones");
      // No propagar el error para evitar que rompa otros componentes
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchNotificaciones();
  }, [fetchNotificaciones]);

  const marcarComoLeida = useCallback(async (id: number) => {
    try {
      await notificacionService.marcarComoLeida(id);
      // Actualizar el estado local
      setNotificaciones(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, leido: true } : notif
        )
      );
      setContador(prev => ({
        ...prev,
        noLeidas: Math.max(0, prev.noLeidas - 1)
      }));
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
      throw err;
    }
  }, []);

  const marcarTodasComoLeidas = useCallback(async () => {
    try {
      await notificacionService.marcarTodasComoLeidas();
      // Actualizar el estado local
      setNotificaciones(prev =>
        prev.map(notif => ({ ...notif, leido: true }))
      );
      setContador(prev => ({ ...prev, noLeidas: 0 }));
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
      throw err;
    }
  }, []);

  const eliminarNotificacion = useCallback(async (id: number) => {
    try {
      await notificacionService.eliminarNotificacion(id);
      // Actualizar el estado local
      const notifEliminada = notificaciones.find(n => n.id === id);
      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
      setContador(prev => ({
        total: Math.max(0, prev.total - 1),
        noLeidas: notifEliminada && !notifEliminada.leido 
          ? Math.max(0, prev.noLeidas - 1) 
          : prev.noLeidas
      }));
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
      throw err;
    }
  }, [notificaciones]);

  // Cargar notificaciones al montar (solo en el cliente)
  useEffect(() => {
    if (!mounted) return;
    fetchNotificaciones();
  }, [mounted, fetchNotificaciones]);

  // Polling para actualizar notificaciones automáticamente (solo en el cliente)
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      fetchNotificaciones();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [mounted, fetchNotificaciones, pollingInterval]);

  const value: NotificationContextType = {
    notificaciones,
    contador,
    loading,
    error,
    refetch,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
