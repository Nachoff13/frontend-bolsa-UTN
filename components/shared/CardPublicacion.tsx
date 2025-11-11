"use client";

import {
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider, Tooltip, Typography, Box } from "@mui/material";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { useTheme } from "@mui/material/styles";

interface CardPublicacionProps {
  oferta: OfertaDTO;
  onVerDetalle?: (oferta: OfertaDTO) => void;
  calcularTiempoTranscurrido: (fechaInicio?: string) => string;
}

export default function CardPublicacion({
  oferta,
  onVerDetalle,
  calcularTiempoTranscurrido,
}: CardPublicacionProps) {
  const theme = useTheme();

  const getEstadoColor = (estado?: string) => {
    const lower = estado?.toLowerCase();
    switch (lower) {
      case "iniciada":
        return theme.palette.customStatus.iniciada;
      case "en revisión":
        return theme.palette.customStatus.enRevision;
      case "aprobada":
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
      {/* 🔹 Chips (Modalidad y Contrato) */}
      <div className="absolute top-4 right-4 flex gap-2">
        {oferta.modalidad && (
          <Chip
            label={oferta.modalidad}
            size="small"
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#E5E7EB",
              color: theme.palette.mode === "dark" ? "#ffffff" : "#374151",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.875rem",
              height: "32px",
              padding: "0 12px",
            }}
          />
        )}
        {oferta.tipoContrato && (
          <Chip
            label={oferta.tipoContrato}
            size="small"
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#E5E7EB",
              color: theme.palette.mode === "dark" ? "#ffffff" : "#374151",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.875rem",
              height: "32px",
              padding: "0 12px",
            }}
          />
        )}
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
          {oferta.titulo}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <BusinessIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {oferta.nombreEmpresa ?? "Empresa no especificada"}
          </Typography>
        </Box>
      </Box>

      {/* 📍 Información general */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {oferta.nombreLocalidad ?? "Ubicación no especificada"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5}>
          <SchoolIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {oferta.nombreCarrera ?? "Carrera no especificada"}
          </Typography>
        </Box>

        <Tooltip title="Cantidad de postulantes" arrow>
          <Box display="flex" alignItems="center" gap={0.5}>
            <GroupIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {oferta.cantidadPostulantes ?? 0} postulante/s
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Tiempo transcurrido" arrow>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {calcularTiempoTranscurrido(oferta.fechaInicio)}
            </Typography>
          </Box>
        </Tooltip>

        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarTodayIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Publicada {oferta.fechaInicio ?? "-"}
          </Typography>
        </Box>

        {oferta.fechaFin && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <EventIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Fin {oferta.fechaFin}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* 📝 Descripción */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <DescriptionIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Descripción
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            ml: 3,
            whiteSpace: "pre-line",
          }}
        >
          {oferta.descripcion.length > 300
            ? `${oferta.descripcion.substring(0, 300)}...`
            : oferta.descripcion}
        </Typography>
      </Box>

      {/* 🔘 Acción */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          size="small"
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
          onClick={() => onVerDetalle?.(oferta)}
        >
          Ver Detalles
        </Button>
      </Box>
    </div>
  );
}
