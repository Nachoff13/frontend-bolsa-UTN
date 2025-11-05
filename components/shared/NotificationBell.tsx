"use client";

import React, { useState } from "react";
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
} from "@mui/icons-material";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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
                startIcon={<DoneAllIcon />}
                onClick={handleMarcarTodasLeidas}
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
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
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
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="subtitle2"
                            fontWeight={notif.leido ? 400 : 600}
                            sx={{ flex: 1 }}
                          >
                            {notif.asunto || "Notificación"}
                          </Typography>
                          {!notif.leido && (
                            <Chip label="Nueva" size="small" color="primary" />
                          )}
                        </Stack>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 0.5 }}
                          >
                            {notif.mensaje}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {formatFecha(notif.fechaEnvio)}
                          </Typography>
                          {notif.tituloOferta && (
                            <Typography
                              variant="caption"
                              color="primary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              Oferta: {notif.tituloOferta}
                            </Typography>
                          )}
                        </>
                      }
                      secondaryTypographyProps={{
                        component: "div",
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
