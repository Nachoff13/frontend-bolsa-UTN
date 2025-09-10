"use client";

import { Card, CardContent, Typography, Chip, Button, Stack, Box, Avatar, IconButton } from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import { Person as PersonIcon, Mail as MailIcon, Phone as PhoneIcon, LocationOn as LocationIcon, Edit as EditIcon, School as SchoolIcon, Description as DescriptionIcon, Download as DownloadIcon, Upload as UploadIcon } from "@mui/icons-material";

export default function PerfilEstudiantePage() {
  const profile = {
    nombre: "Juan Perez",
    carrera: "Ingeniería en Sistemas de Información",
    legajo: "31999",
    email: "juanperez@hotmail.com",
    telefono: "+54 9 221 999-9999",
    localidad: "La Plata",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempor magna nec hendrerit semper. Nunc pretium diam sem, nec iaculis massa rhoncus ac. Ut euismod sem feugiat orci pharetra mattis.",
    habilidades: ["Python", "SQL", "React", "Angular", "Metodologías Ágiles"],
    educacion: {
      titulo: "Ingeniería en Sistemas de Información",
      institucion: "Universidad Tecnológica Nacional - FRLP",
      periodo: "2020 - 2025 (En curso)",
      progreso: "90% completado",
    },
    cvFile: "Juan_Perez_CV.pdf",
    ultimaActualizacion: "hace 10 días",
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
                  {profile.nombre}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  {profile.carrera}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={`Legajo: ${profile.legajo}`} color="primary" size="small" sx={{ fontWeight: 500 }} />
                  <Chip label="Estudiante" variant="outlined" size="small" sx={{ fontWeight: 500 }} />
                </Stack>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2">{profile.email}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2">{profile.telefono}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2">{profile.localidad}</Typography>
                    </Stack>
                  </Box>
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
            <Typography variant="body2" color="text.secondary">{profile.descripcion}</Typography>
          </CardContent>
        </Card>

        {/* Habilidades + Educación */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Habilidades y Competencias</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {profile.habilidades.map((h, i) => (
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
                <Typography variant="subtitle1" fontWeight={600}>{profile.educacion.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.educacion.institucion} • {profile.educacion.periodo}</Typography>
                <Chip label={profile.educacion.progreso} variant="outlined" size="small" sx={{ mt: 1 }} />
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
                  <Typography variant="subtitle2" fontWeight={600}>{profile.cvFile}</Typography>
                  <Typography variant="caption" color="text.secondary">Última actualización {profile.ultimaActualizacion}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>Descargar</Button>
                <Button variant="outlined" size="small" startIcon={<UploadIcon />}>Actualizar</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
