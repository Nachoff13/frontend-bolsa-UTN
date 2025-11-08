"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@mui/icons-material";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { USER_ROLES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationBell() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [expandedNotifs, setExpandedNotifs] = useState<Set<number>>(new Set());
  const { rol } = useAuth();
  const {
    notificaciones,
    contador,
    loading,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
  } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleExpanded = (notifId: number) => {
    setExpandedNotifs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notifId)) {
        newSet.delete(notifId);
      } else {
        newSet.add(notifId);
      }
      return newSet;
    });
  };

  const handleNotificationClick = async (notificacion: any) => {
    // Marcar como leída si no lo está
    if (!notificacion.leido) {
      try {
        await marcarComoLeida(notificacion.id);
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }

    // Determinar a dónde navegar según el tipo de notificación
    const asunto = notificacion.asunto.toLowerCase();
    
    if (asunto.includes("perfil") || asunto.includes("edición") || asunto.includes("datos")) {
      // Navegar al perfil del estudiante
      router.push("/estudiante/perfil");
    } else if (asunto.includes("postulación") || asunto.includes("estado") || notificacion.idPostulacion) {
      // Si es empresa, navegar a candidatos postulados, si es estudiante a sus postulaciones
      if (rol === USER_ROLES.EMPRESA) {
        router.push("/empresa/candidatos-postulados");
      } else {
        router.push("/estudiante/postulaciones");
      }
    }

    // Cerrar el popover
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleMarcarLeida = async (notifId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await marcarComoLeida(notifId);
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleEliminar = async (notifId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await eliminarNotificacion(notifId);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasComoLeidas();
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
    } catch {
      return fecha;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-describedby={id}
        aria-label={`${contador.noLeidas} notificaciones no leídas`}
      >
        <Badge badgeContent={contador.noLeidas} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Notificaciones
            </Typography>
            {contador.noLeidas > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DoneAllIcon />}
                onClick={handleMarcarTodasLeidas}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 1.5,
                }}
              >
                Marcar todas leídas
              </Button>
            )}
          </Stack>
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : notificaciones.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No tienes notificaciones
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 450, overflow: "auto", p: 0 }}>
            {notificaciones.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  disablePadding
                  sx={{
                    bgcolor: notif.leido ? "transparent" : "action.hover",
                    position: 'relative',
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      {!notif.leido && (
                        <Box />
                      )}
                      {!notif.leido && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => handleMarcarLeida(notif.id, e)}
                          title="Marcar como leída"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleEliminar(notif.id, e)}
                        title="Eliminar"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                >
                  {!notif.leido && (
                    <FiberManualRecordIcon
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        color: 'error.main',
                        fontSize: 10,
                        zIndex: 10,
                      }}
                    />
                  )}
                  <ListItemButton 
                    onClick={() => handleNotificationClick(notif)}
                    sx={{ position: 'relative', pr: 10 }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ 
                            maxWidth: 'calc(100% - 20px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                          }}
                        >
                          {notif.asunto || "Notificación"}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ 
                              mt: 0.5,
                              maxWidth: 'calc(100% - 80px)',
                              wordBreak: 'break-word',
                              ...(expandedNotifs.has(notif.id) 
                                ? {
                                    // Expandido: mostrar todo el texto
                                    whiteSpace: 'normal',
                                  }
                                : {
                                    // Colapsado: limitar a 2 líneas
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }
                              ),
                            }}
                          >
                            {notif.mensaje}
                          </Typography>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatFecha(notif.fechaEnvio)}
                            </Typography>
                            {notif.mensaje && (
                              <Button
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(notif.id);
                                }}
                                sx={{ 
                                  textTransform: 'none',
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  p: 0.5,
                                }}
                                endIcon={expandedNotifs.has(notif.id) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                              >
                                {expandedNotifs.has(notif.id) ? 'Ver menos' : 'Ver más'}
                              </Button>
                            )}
                          </Stack>
                        </>
                      }
                      secondaryTypographyProps={{
                        component: "div",
                      }}
                      sx={{
                        pr: 1,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < notificaciones.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {notificaciones.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: "center" }}>
              <Button fullWidth size="small" onClick={handleClose}>
                Cerrar
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}
