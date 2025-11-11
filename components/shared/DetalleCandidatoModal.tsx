"use client";

import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  Paper,
  Stack,
  Button,
  DialogActions,
} from "@mui/material";

import {
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  School as CarreraIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Mail as MailIcon,
} from "@mui/icons-material";

import { PostulacionCandidatoDTO } from "@/types/dto/postulacionCandidatoDTO";

interface DetalleCandidatoModalProps {
  open: boolean;
  onClose: () => void;
  postulacion?: PostulacionCandidatoDTO;
}

export default function DetalleCandidatoModal({
  open,
  onClose,
  postulacion,
}: DetalleCandidatoModalProps) {
  if (!postulacion) return null;

  const {
    nombreCandidato,
    email,
    tituloOferta,
    descripcionOferta,
    carreraNombre,
    modalidad,
    tipoContrato,
    estadoPostulacion,
    fechaPostulacion,
    localidad,
    cartaPresentacion,
    observacion,
  } = postulacion;

  const getEstadoColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "en revisión":
        return "info";
      case "aprobada":
        return "success";
      case "rechazada":
        return "error";
      case "iniciada":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 10,
          backgroundColor: "#f9fafc",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #5395d6ff 0%, #2276a3ff 100%)",
          color: "white",
          py: 3,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={
              postulacion.fotoPerfil
                ? `data:image/jpeg;base64,${postulacion.fotoPerfil}`
                : undefined
            }
            sx={{ bgcolor: "white", color: "#1976d2", width: 56, height: 56 }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {nombreCandidato || "Candidato sin nombre"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "rgba(255,255,255,0.8)" }}
            >
              {tituloOferta || "Sin puesto asociado"}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={estadoPostulacion ?? "Sin estado"}
          color={getEstadoColor(estadoPostulacion) as any}
          sx={{
            fontWeight: 600,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: "0.85rem",
          }}
        />
      </Box>

      {/* Contenido */}
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          {/* Información básica */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <MailIcon color="action" />
              <Typography variant="body2">{email || "-"}</Typography>
            </Stack>
          </Paper>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CarreraIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Carrera:
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {carreraNombre || "No especificada"}
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Modalidad:
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {modalidad || "No especificada"}
              </Typography>
            </Paper>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Tipo de contrato:
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {tipoContrato || "No especificado"}
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Localidad:
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {localidad || "No especificada"}
              </Typography>
            </Paper>
          </Box>

          {/* Fecha */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Fecha de postulación:
            </Typography>
            <Typography variant="body2">
              {new Date(fechaPostulacion).toLocaleDateString("es-AR")}
            </Typography>
          </Box>

          <Divider />

          {/* Motivo de la postulación */}
          {postulacion.motivo && (
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <InfoIcon color="action" sx={{ mr: 1 }} />
                Motivo
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  whiteSpace: "pre-line",
                }}
              >
                {postulacion.motivo}
              </Typography>
            </Box>
          )}
          {/* Descripción de oferta */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              <WorkIcon
                color="action"
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              Descripción del puesto
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
            >
              {descripcionOferta || "No hay descripción disponible."}
            </Typography>
          </Box>

          {/* Perfil del candidato */}
          {cartaPresentacion && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                <DescriptionIcon
                  color="action"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                Carta de presentación
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
              >
                {cartaPresentacion}
              </Typography>
            </Box>
          )}
          {/* Competencias del candidato */}
          {postulacion.competencias && postulacion.competencias.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <WorkIcon color="action" sx={{ mr: 1 }} />
                Competencias del candidato
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {postulacion.competencias.map((comp, index) => (
                  <Chip
                    key={index}
                    label={comp}
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
