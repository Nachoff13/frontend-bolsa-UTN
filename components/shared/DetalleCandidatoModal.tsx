"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";

import {
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Apartment as EmpresaIcon,
  Assignment as CartaIcon,
  Info as InfoIcon,
  ModeComment as ObservacionIcon,
} from "@mui/icons-material";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import Grid from "@mui/material/Grid"

interface DetalleCandidatoModalProps {
  open: boolean;
  onClose: () => void;
  postulacion?: PostulacionDTO;
}

export default function DetalleCandidatoModal({
  open,
  onClose,
  postulacion,
}: DetalleCandidatoModalProps) {
  if (!postulacion) return null;

  const {
    nombreCandidato,
    nombreEmpresa,
    tituloOferta,
    descripcionOferta,
    descripcionModalidad,
    descripcionTipoContrato,
    cartaPresentacion,
    observacion,
    estadoPostulacion,
    fechaPostulacion,
  } = postulacion;

  const handleVerPerfil = (post: PostulacionDTO) => {
    console.log(`👤 Ver perfil de: ${post.nombreCandidato}`);
  };

  const getEstadoColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "en revisión":
        return "info";
      case "aceptada":
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
          background: "linear-gradient(135deg, #0d6efd 0%, #00b4d8 100%)",
          color: "white",
          py: 3,
          px: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "white", color: "#0d6efd", width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {nombreCandidato || "Candidato sin nombre"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {tituloOferta || "Postulación sin puesto"}
          </Typography>
        </Box>
        {/* Estado */}
          <Box display="flex" justifyContent="center">
            <Chip
              label={estadoPostulacion ?? "Sin estado"}
              color={getEstadoColor(estadoPostulacion) as any}
              sx={{
                fontWeight: 600,
                px: 3,
                py: 0.5,
                borderRadius: 2,
                fontSize: "0.9rem",
              }}
            />
          </Box>
      </Box>

      {/* Contenido */}
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          {/* Empresa */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmpresaIcon color="action" />
              <Typography variant="body2" fontWeight="bold">
                Empresa:
              </Typography>
              <Typography variant="body2">{nombreEmpresa || "-"}</Typography>
            </Box>
          </Paper>

          {/* Contrato y Modalidad */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Contrato:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {descripcionTipoContrato || "No especificado"}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, flex: 1, minWidth: "45%" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body2" fontWeight="bold">
                  Modalidad:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {descripcionModalidad || "No especificada"}
              </Typography>
            </Paper>
          </Box>

          {/* Fecha */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Fecha de postulación:
            </Typography>
            <Typography variant="body2">{fechaPostulacion || "-"}</Typography>
          </Box>

          <Divider />

          {/* Descripción */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              <DescriptionIcon color="action" sx={{ mr: 1, verticalAlign: "middle" }} />
              Descripción del puesto
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "text.secondary" }}>
              {descripcionOferta || "No hay descripción disponible."}
            </Typography>
          </Box>

          {/* Carta de presentación */}
          {cartaPresentacion && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                <CartaIcon color="action" sx={{ mr: 1, verticalAlign: "middle" }} />
                Carta de presentación
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "text.secondary" }}>
                {cartaPresentacion}
              </Typography>
            </Box>
          )}

          {/* Observaciones */}
          {observacion && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                <DescriptionIcon color="action" sx={{ mr: 1, verticalAlign: "middle" }} />
                Observaciones
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {observacion}
              </Typography>
            </Box>
          )}

          
        </Stack>
      </DialogContent>

      {/* Acciones
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
          <Button
            onClick={() => handleVerPerfil(postulacion!)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              background: "linear-gradient(90deg,#0d6efd,#00b4d8)",
            }}
          >
            Ver perfil
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions> */}
    </Dialog>
  );
}