"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Avatar,
  Stack,
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

const drawerWidth = 280;

const navItems = [
  { href: "/", label: "Menú Principal", icon: <HomeIcon /> },
  {
    href: "/estudiante/ofertas",
    label: "Ofertas Laborales",
    icon: <WorkIcon />,
  },
  {
    href: "/estudiante/postulaciones",
    label: "Mis Postulaciones",
    icon: <DescriptionIcon />,
  },
        { href: "/estudiante/perfil/1", label: "Mi Perfil", icon: <PersonIcon /> }, // hardcodeado
];

const footerItems = [
  { href: "/configuracion", label: "Configuración", icon: <SettingsIcon /> },
  { href: "/auth/logout", label: "Cerrar Sesión", icon: <LogoutIcon /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const DrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Branding */}
      <Toolbar sx={{ px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 1,
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              UTN FRLP
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bolsa de Trabajo
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
      <Divider />

      {/* Nav principal */}
      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Footer */}
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {footerItems.map((item) => (
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
            <TextField size="small" fullWidth placeholder="Buscar ofertas…" />
          </Box>

          {/* Acciones (derecha) */}
          <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36 }}>GS</Avatar>
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
          mt:2,
          p:1,
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
