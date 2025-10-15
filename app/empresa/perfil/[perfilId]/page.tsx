"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { empresaService } from "@/services/empresa.service";
import type { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import LoadingModal from "@/components/shared/LoadingModal";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarType } from "@/types/enums/snackbar";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import {
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Cancel,
  Work,
  Article,
  VerifiedUser,
} from "@mui/icons-material";

export default function PerfilEmpresaPage() {
  const params = useParams();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilEmpresaDTO | null>(null);

  // Obtener el perfilId de los parámetros de la ruta
  const perfilId = params?.perfilId ? parseInt(params.perfilId as string, 10) : 1;

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        if (!perfilId || isNaN(perfilId)) {
          showMessage("ID de perfil inválido", SnackbarType.Error);
          return;
        }
        const data = await empresaService.getPerfilById(perfilId);
        setPerfil(data);
      } catch (e: any) {
        showMessage(e?.message ?? "Error cargando perfil", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [perfilId, showMessage]);

  if (loading) return <LoadingModal open={loading} />;
  if (!perfil)
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No se pudo cargar el perfil
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Titulo titulo="Perfil de Empresa" />
        <Chip
          label={`${perfil.porcentajePerfil ?? 0}% completado`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>
      <Stack spacing={3}>
        {/* Información Principal */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: "2.5rem",
                  fontWeight: 600,
                }}
              >
                {perfil.razonSocial ? perfil.razonSocial.charAt(0).toUpperCase() : "E"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                  {perfil.razonSocial || "Razón Social no disponible"}
                </Typography>
                {perfil.nombre && (
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Subtitulo
                  </Typography>
                )}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                  {perfil.rolNombre && (
                    <Chip 
                      label={perfil.rolNombre} 
                      color="primary" 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {perfil.estadoValidacionNombre && (
                    <Chip
                      label={perfil.estadoValidacionNombre}
                      color={perfil.estadoValidacionNombre === "Validado" ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Stack>
                <Stack spacing={1}>
                  {perfil.email && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.email}
                      </Typography>
                    </Stack>
                  )}
                  {perfil.telefono && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.telefono}
                      </Typography>
                    </Stack>
                  )}
                  {perfil.localidad && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.localidad}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Sobre Nosotros */}
        {perfil.descripcion && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Sobre Nosotros
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {perfil.descripcion}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Información de la Empresa */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Información de la Empresa
            </Typography>
            <Grid container spacing={2}>
              {perfil.cuit && (
                <Grid item xs={12} md={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Article color="action" sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        CUIT
                      </Typography>
                      <Typography variant="body2">{perfil.cuit}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VerifiedUser color="action" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Estado de Validación
                    </Typography>
                    <Typography variant="body2">
                      {perfil.estadoValidacionNombre || "Pendiente"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Ofertas Laborales */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Work color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Ofertas Laborales
              </Typography>
            </Stack>

            {perfil.ofertas && perfil.ofertas.length > 0 ? (
              <Stack spacing={2}>
                {perfil.ofertas.map((oferta, index) => (
                  <Card key={oferta.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
                          {oferta.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {oferta.descripcion}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {oferta.nombreLocalidad && (
                            <Chip
                              icon={<LocationOn />}
                              label={oferta.nombreLocalidad}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          <Chip label={oferta.modalidad} size="small" color="primary" />
                          <Chip label={oferta.tipoContrato} size="small" color="secondary" />
                        </Stack>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(oferta.fechaInicio).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay ofertas publicadas
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Información adicional del sistema */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Información del Sistema
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID de Perfil
                </Typography>
                <Typography variant="body2">{perfil.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID de Usuario
                </Typography>
                <Typography variant="body2">{perfil.idUsuario}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Estado del Usuario
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {perfil.usuarioActivo ? (
                    <CheckCircle color="success" sx={{ fontSize: 16 }} />
                  ) : (
                    <Cancel color="error" sx={{ fontSize: 16 }} />
                  )}
                  <Typography variant="body2">
                    {perfil.usuarioActivo ? "Activo" : "Inactivo"}
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Fecha de Alta
                </Typography>
                <Typography variant="body2">
                  {perfil.fechaAlta ? new Date(perfil.fechaAlta).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

