"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  TextField,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

//se agrega para mostrar segun el rol
import { USER_ROLES } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";
import UserMenu from "@/components/shared/UserMenu";
import NotificationBell from "@/components/shared/NotificationBell";

const drawerWidth = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const { rol, perfilId, user } = useAuth();

  const navItems: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    roles: number[];
  }> = [
    {
      href: "/empresa/dashboard",
      label: "Menú Principal",
      icon: <HomeIcon />,
      roles: [USER_ROLES.EMPRESA],
    },
 {
      href: "/estudiante/dashboard",
      label: "Menú Principal",
      icon: <HomeIcon />,
      roles: [USER_ROLES.ESTUDIANTE],
    },
{
      href: "/admin/dashboard",
      label: "Menú Principal",
      icon: <HomeIcon />,
      roles: [USER_ROLES.ADMIN],
    },

    {
      href: "/estudiante/ofertas",
      label: "Ofertas Laborales",
      icon: <WorkIcon />,
      roles: [USER_ROLES.ESTUDIANTE],
    },
    {
      href: "/estudiante/postulaciones",
      label: "Mis Postulaciones",
      icon: <DescriptionIcon />,
      roles: [USER_ROLES.ESTUDIANTE],
    },

    {
      href: "/empresa/ofertas-publicadas",
      label: "Mis Publicaciones",
      icon: <WorkIcon />,
      roles: [USER_ROLES.EMPRESA],
    },
    {
      href: "/empresa/candidatos-postulados",
      label: "Candidatos Postulados",
      icon: <DescriptionIcon />,
      roles: [USER_ROLES.EMPRESA],
    },
    {
      href: "/admin/usuarios",
      label: "Gestión de Usuarios",
      icon: <PersonIcon />,
      roles: [USER_ROLES.ADMIN],
    },
     {
      href: "/admin/solicitantes",
      label: "Gestión de Empresas",
      //el icono de empresa tiene que ser un edificio o algo asi
      icon: <WorkIcon />,
      roles: [USER_ROLES.ADMIN],
    },
  ];

  const footerItems: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    roles: number[];
  }> = [
    {
      href: perfilId ? `/estudiante/perfil/${perfilId}` : "/estudiante/perfil",
      label: "Mi Perfil",
      icon: <PersonIcon />,
      roles: [USER_ROLES.ESTUDIANTE],
    },
    {
      href: perfilId ? `/empresa/perfil/${perfilId}` : "/empresa/perfil",
      label: "Mi Perfil",
      icon: <PersonIcon />,
      roles: [USER_ROLES.EMPRESA],
    },
    //tengo que agregar el rol de los 3
    { href: "/configuracion", label: "Configuración", icon: <SettingsIcon/>, roles: [USER_ROLES.ADMIN, USER_ROLES.EMPRESA, USER_ROLES.ESTUDIANTE] },
    { href: "/auth/logout", label: "Cerrar Sesión", icon: <LogoutIcon />, roles: [USER_ROLES.ADMIN, USER_ROLES.EMPRESA, USER_ROLES.ESTUDIANTE] },
  ];

  const DrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Branding: imagen centrada (reemplaza texto) */}
      <Toolbar sx={{ px: 2, justifyContent: "center" }}>
        <Box
          sx={{
            position: "relative",
            width: 160,
            height: 64,
            mx: "auto",
            mb: 1,
            filter: theme.palette.mode === "dark" ? "brightness(0) invert(1)" : "none",
          }}
        >
          <Image
            src="/logo-bolsa.png"
            alt="Bolsa UTN FRLP Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>
      </Toolbar>
      <Divider />

      {/* Información del usuario */}
      {user && (
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} color="primary">
            {user.name || user.email || "Usuario"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {rol === USER_ROLES.ADMIN && "Administrador"}
            {rol === USER_ROLES.EMPRESA && "Empresa"}
            {rol === USER_ROLES.ESTUDIANTE && "Estudiante"}
          </Typography>
        </Box>
      )}
      <Divider />

      {/* Nav principal */}
      
      <List>
        {navItems
          .filter((item) => item.roles.includes(rol))
          .map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton component={Link} href={item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />

      {/* Footer */}
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {footerItems
        .filter((item) => item.roles.includes(rol))
        .map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />

      {/* HEADER */}
      <AppBar
        position="fixed"
        color="inherit"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          {/* Burger en mobile */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>

          {/* Buscador */}
          <Box sx={{ ml: "auto", width: 500, maxWidth: "100%" }}>
          </Box>

          {/* Acciones (derecha) */}
          <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationBell />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR – drawer permanente en sm+, temporal en xs */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu"
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {DrawerContent}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {DrawerContent}
        </Drawer>
      </Box>

      {/* CONTENIDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 2,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* separador para que el contenido no quede debajo del AppBar */}
        <Toolbar />
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}
