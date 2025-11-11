"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { USER_ROLES } from "@/lib/constants";

export default function UserMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { rol, perfilId, usuarioDTO } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToProfile = () => {
    if (perfilId) {
      router.push(`/estudiante/perfil/${perfilId}`);
    }
    handleMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    router.push('/auth/logout');
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string | undefined | null): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ p: 0 }}
        aria-label="Menú de usuario"
      >
        <Avatar 
          src={usuarioDTO?.fotoPerfil ? `data:image/jpeg;base64,${usuarioDTO.fotoPerfil}` : undefined}
          sx={{ width: 36, height: 36, bgcolor: "primary.main", cursor: "pointer" }}
        >
          {!usuarioDTO?.fotoPerfil && getInitials(usuarioDTO?.nombre)}
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header del menú con info del usuario */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
            {usuarioDTO?.nombre}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {usuarioDTO?.email || ""}
          </Typography>
        </Box>

        {/* Opciones del menú */}
        {rol === USER_ROLES.ESTUDIANTE && perfilId && (
          <MenuItem onClick={handleNavigateToProfile} sx={{ py: 1, mt: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Perfil</ListItemText>
          </MenuItem>
        )}
        
        {/* Toggle de Tema */}
        <MenuItem 
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            {mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </ListItemText>
          <Switch
            checked={mode === 'dark'}
            size="small"
            onClick={(e) => e.stopPropagation()}
            sx={{ ml: 1 }}
          />
        </MenuItem>
        
        {/* <MenuItem onClick={handleMenuClose} sx={{ py: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Configuración</ListItemText>
        </MenuItem>
        
        <Divider sx={{ my: 0 }} />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1, mt: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Cerrar sesión</ListItemText>
        </MenuItem> */}
      </Menu>
    </Box>
  );
}
