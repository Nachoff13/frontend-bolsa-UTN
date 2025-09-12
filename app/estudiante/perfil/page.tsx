"use client";

import { Card, CardContent, Typography, Chip, Button, Stack, Box, Avatar, IconButton } from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import { Person as PersonIcon, Mail as MailIcon, Phone as PhoneIcon, LocationOn as LocationIcon, Edit as EditIcon, School as SchoolIcon, Description as DescriptionIcon, Download as DownloadIcon, Upload as UploadIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LoadingModal from "@/components/shared/LoadingModal";
import { useSnackbar } from "@/components/providers/snackbar";
import { candidatoService } from "@/services/candidato.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import { SnackbarType } from "@/types/enums/snackbar";

export default function PerfilEstudiantePage() {
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilCandidatoDTO | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        const data = await candidatoService.getPerfil();
        setPerfil(data);
      } catch (e: any) {
        showMessage(e?.message ?? "Error cargando perfil", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [showMessage]);

  if (loading) return <LoadingModal open={loading} />;
  if (!perfil) return null;

  const habilidades = ["Python", "SQL", "React", "Angular", "Metodologías Ágiles"]; // TODO: traer de API cuando exista
  const educacion = {
    titulo: perfil.carrera ?? "",
    institucion: "Universidad Tecnológica Nacional - FRLP",
    periodo: perfil.anioEgreso ? `Hasta ${perfil.anioEgreso}` : "En curso",
    progreso: `${perfil.porcentajePerfil ?? 90}% completado`,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Titulo titulo="Perfil" />
        <IconButton color="primary" aria-label="Editar">
          <EditIcon />
        </IconButton>
      </Stack>

      <Stack spacing={3}>
        {/* Tarjeta principal */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ width: 80, height: 80, bgcolor: "grey.300" }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {perfil.nombre}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  {educacion.titulo || "Carrera no informada"}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {perfil.legajo && (
                    <Chip label={`Legajo: ${perfil.legajo}`} color="primary" size="small" sx={{ fontWeight: 500 }} />
                  )}
                  <Chip label="Estudiante" variant="outlined" size="small" sx={{ fontWeight: 500 }} />
                </Stack>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1 }}>
                  {perfil.email && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{perfil.email}</Typography>
                      </Stack>
                    </Box>
                  )}
                  {perfil.telefono && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{perfil.telefono}</Typography>
                      </Stack>
                    </Box>
                  )}
                  {perfil.localidad && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{perfil.localidad}</Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Sobre mí */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Sobre Mí</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">{perfil.descripcion || "Sin descripción."}</Typography>
          </CardContent>
        </Card>

        {/* Habilidades + Educación */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Habilidades y Competencias</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {habilidades.map((h, i) => (
                    <Chip key={i} label={h} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <SchoolIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Educación</Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight={600}>{educacion.titulo || "Sin datos"}</Typography>
                <Typography variant="body2" color="text.secondary">{educacion.institucion} • {educacion.periodo}</Typography>
                <Chip label={educacion.progreso} variant="outlined" size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* CV */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Curriculum Vitae</Typography>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <DescriptionIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{perfil.cv ? "CV cargado" : "Sin CV"}</Typography>
                  <Typography variant="caption" color="text.secondary">{perfil.cv ? "Disponible para descargar" : "Subí tu CV para mejorar tu perfil"}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon />} disabled={!perfil.cv}>Descargar</Button>
                <Button variant="outlined" size="small" startIcon={<UploadIcon />}>Actualizar</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
