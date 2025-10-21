"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Apartment as EmpresaIcon,
  Assignment as CartaIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

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

  // 🎨 color dinámico del chip según estado
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
          borderRadius: 3,
          p: 1.5,
          boxShadow: 6,
        },
      }}
    >
      {/* 🧑‍💼 Título */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PersonIcon color="primary" />
        {nombreCandidato || "Candidato sin nombre"}
      </DialogTitle>

      {/* 📄 Contenido */}
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Empresa */}
          <Box display="flex" alignItems="center" gap={1}>
            <EmpresaIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Empresa:
            </Typography>
            <Typography variant="body2">
              {nombreEmpresa || "No especificada"}
            </Typography>
          </Box>

          {/* Puesto */}
          <Box display="flex" alignItems="center" gap={1}>
            <WorkIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Puesto postulado:
            </Typography>
            <Typography variant="body2">{tituloOferta || "-"}</Typography>
          </Box>

          {/* Tipo de contrato */}
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Tipo de contrato:
            </Typography>
            <Typography variant="body2">
              {descripcionTipoContrato || "No especificado"}
            </Typography>
          </Box>

          {/* Modalidad */}
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Modalidad:
            </Typography>
            <Typography variant="body2">
              {descripcionModalidad || "No especificada"}
            </Typography>
          </Box>

          {/* Fecha postulación */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon color="action" />
            <Typography variant="body2" fontWeight="bold">
              Fecha de postulación:
            </Typography>
            <Typography variant="body2">{fechaPostulacion || "-"}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Descripción de la oferta */}
          <Box display="flex" alignItems="flex-start" gap={1}>
            <DescriptionIcon color="action" />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Descripción del puesto:
              </Typography>
              <Typography variant="body2" whiteSpace="pre-line">
                {descripcionOferta || "No hay descripción disponible."}
              </Typography>
            </Box>
          </Box>

          {/* Carta de presentación */}
          {cartaPresentacion && (
            <Box display="flex" alignItems="flex-start" gap={1}>
              <CartaIcon color="action" />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Carta de presentación:
                </Typography>
                <Typography variant="body2" whiteSpace="pre-line">
                  {cartaPresentacion}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Observación */}
          {observacion && (
            <Box display="flex" alignItems="flex-start" gap={1}>
              <DescriptionIcon color="action" />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Observaciones:
                </Typography>
                <Typography variant="body2">{observacion}</Typography>
              </Box>
            </Box>
          )}

          {/* Estado */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Chip
              label={estadoPostulacion ?? "Sin estado"}
              color={getEstadoColor(estadoPostulacion) as any}
              size="medium"
              sx={{ fontWeight: 600, px: 2 }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* 🔘 Acciones */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
                <Button
                onClick={() => handleVerPerfil(postulacion!)}
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600 }}
                >
                Ver perfil
                </Button>
                <Button
                onClick={onClose}
                variant="outlined"
                color="secondary"
                sx={{ textTransform: "none", fontWeight: 600 }}
                >
                Cerrar
                </Button>
            </Box>
        </DialogActions>
    </Dialog>
  );
}
