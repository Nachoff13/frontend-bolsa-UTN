"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { candidatoService } from "@/services/candidato.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
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
  Divider,
  Paper,
  LinearProgress,
} from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Description,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

export default function PerfilEstudiantePage() {
  const params = useParams();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilCandidatoDTO | null>(null);

  // Obtener el perfilId de los parámetros de la ruta
  const perfilId = params?.perfilId ? parseInt(params.perfilId as string, 10) : 2;

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        if (!perfilId || isNaN(perfilId)) {
          showMessage("ID de perfil inválido", SnackbarType.Error);
          return;
        }
        const data = await candidatoService.getPerfilById(perfilId);
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
  if (!perfil) return (
    <Box sx={{ maxWidth: 1200, mx: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h6" color="text.secondary">
        No se pudo cargar el perfil
      </Typography>
    </Box>
  );

  const educacion = {
    titulo: perfil.carrera ?? "Carrera no especificada",
    institucion: "Universidad Tecnológica Nacional - FRLP",
    periodo: perfil.anioEgreso ? `Hasta ${perfil.anioEgreso}` : "En curso",
    progreso: `${perfil.porcentajePerfil ?? 0}% completado`,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Titulo titulo={`Perfil ${perfil.nombre ? `de ${perfil.nombre}` : ''}`} />
        <Chip
          label={`${perfil.porcentajePerfil ?? 0}% completado`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>
      <Stack spacing={3}>
        {/* Información Personal */}
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
                {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                  {perfil.nombre || "Nombre no disponible"}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {perfil.legajo && (
                    <Chip label={`Legajo: ${perfil.legajo}`} color="primary" size="small" sx={{ fontWeight: 500 }} />
                  )}
                  {perfil.rolNombre && (
                    <Chip label={perfil.rolNombre} variant="outlined" size="small" sx={{ fontWeight: 500 }} />
                  )}
                  {perfil.generoNombre && (
                    <Chip label={perfil.generoNombre} variant="outlined" size="small" sx={{ fontWeight: 500 }} />
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

        {/* Sobre mí */}
        {perfil.descripcion && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Sobre mí
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {perfil.descripcion}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Habilidades y Competencias */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Habilidades y Competencias
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {/* Habilidades hardcodeadas por ahora */}
              <Chip label="Python" color="primary" />
              <Chip label="SQL" color="primary" />
              <Chip label="React" color="primary" />
              <Chip label="Angular" color="primary" />
              <Chip label="Metodologías Ágiles" color="primary" />
            </Stack>
          </CardContent>
        </Card>

        {/* Educación */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <School color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Educación
              </Typography>
            </Stack>
            <Box sx={{ pl: 4 }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
                {educacion.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {educacion.institucion}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {educacion.periodo}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Progreso del perfil:
                </Typography>
                <Box sx={{ flex: 1, maxWidth: 200 }}>
                  <LinearProgress
                    variant="determinate"
                    value={perfil.porcentajePerfil ?? 0}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {educacion.progreso}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* CV */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Description color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Curriculum Vitae
              </Typography>
            </Stack>
            {perfil.cv ? (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  CV disponible para descarga
                </Typography>
                <Chip
                  icon={<Description />}
                  label="Descargar CV"
                  color="primary"
                  variant="outlined"
                  clickable
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay CV cargado
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
                <Typography variant="caption" color="text.secondary">ID de Perfil</Typography>
                <Typography variant="body2">{perfil.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID de Usuario</Typography>
                <Typography variant="body2">{perfil.idUsuario}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Estado del Usuario</Typography>
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
                <Typography variant="caption" color="text.secondary">Fecha de Alta</Typography>
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
