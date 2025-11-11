"use client";

import {
  Business as BusinessIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider, Tooltip, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { useRouter } from "next/navigation";

interface Props {
  postulacion: PostulacionDTO;
  onVerEstado?: (p: PostulacionDTO) => void;
}

export function PostulacionCard({ postulacion, onVerEstado }: Props) {
  const theme = useTheme();
  const router = useRouter();

  // 🎨 Determinar color del estado con la misma lógica de customStatus
  const getEstadoColor = (estado?: string) => {
    const lower = estado?.toLowerCase();
    switch (lower) {
      case "en revisión":
        return theme.palette.customStatus.enRevision;
      case "entrevista":
        return theme.palette.customStatus.aprobada;
      case "rechazada":
        return theme.palette.customStatus.rechazada;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
      }}
      className="hover:shadow-md hover:-translate-y-[1px] p-5 relative"
    >
      {/* 🔹 Estado (Chip superior derecho) */}
      <div className="absolute top-4 right-4">
        <Chip
          label={postulacion.estadoPostulacion}
          size="small"
          sx={{
            backgroundColor: `${getEstadoColor(postulacion.estadoPostulacion)}22`,
            color: getEstadoColor(postulacion.estadoPostulacion),
            fontWeight: 600,
          }}
        />
      </div>

      {/* 🧠 Título y Empresa */}
      <Box mb={3}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 0.5,
          }}
        >
          {postulacion.tituloOferta}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <BusinessIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {postulacion.nombreEmpresa ?? "Empresa no especificada"}
          </Typography>
        </Box>
      </Box>

      {/* 📋 Información general */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <Tooltip title="Identificador de la oferta" arrow>
          <Box display="flex" alignItems="center" gap={0.5}>
            <WorkIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Oferta #{postulacion.idOferta}
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Fecha de postulación" arrow>
          <Box display="flex" alignItems="center" gap={0.5}>
            <EventIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(postulacion.fechaPostulacion).toLocaleDateString("es-AR")}
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* 📝 Observaciones (opcional si tu DTO lo tiene) */}
      {postulacion.observacion && (
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <DescriptionIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Observacione Realizada
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
            {postulacion.observacion}
          </Typography>
        </Box>
      )}

      {/* 🔘 Botón Ver Detalle */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push(`/estudiante/ofertas/${postulacion.idOferta}`)}
          sx={{
            borderColor: "#0ea5e9",
            color: "#0ea5e9",
            fontWeight: 600,
            textTransform: "none",
            px: 2.5,
            "&:hover": {
              backgroundColor: "#0ea5e911",
              borderColor: "#0284c7",
            },
          }}
        >
          Ver Detalle
        </Button>
      </Box>
    </div>
  );
}
