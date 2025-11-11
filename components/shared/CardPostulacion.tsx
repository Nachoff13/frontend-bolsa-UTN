"use client";

import {
  Business as BusinessIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

interface Props {
  postulacion: PostulacionDTO;
  onVerEstado?: (p: PostulacionDTO) => void;
}

export function PostulacionCard({ postulacion, onVerEstado }: Props) {
  const theme = useTheme();

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
      <div className="mb-3">
        <h2 className="text-lg font-bold text-sky-800">{postulacion.tituloOferta}</h2>
        <div className="flex items-center text-neutral-600 text-sm">
          <BusinessIcon fontSize="small" className="mr-1 text-neutral-500" />
          <span>{postulacion.nombreEmpresa ?? "Empresa no especificada"}</span>
        </div>
      </div>

      {/* 📋 Información general */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700 mb-3">
        <Tooltip title="Identificador de la oferta" arrow>
          <div className="flex items-center">
            <WorkIcon fontSize="small" className="mr-1 text-neutral-500" />
            Oferta #{postulacion.idOferta}
          </div>
        </Tooltip>

        <Tooltip title="Fecha de postulación" arrow>
          <div className="flex items-center">
            <EventIcon fontSize="small" className="mr-1 text-neutral-500" />
            {new Date(postulacion.fechaPostulacion).toLocaleDateString("es-AR")}
          </div>
        </Tooltip>
      </div>

      <Divider sx={{ my: 1 }} />

      {/* 📝 Observaciones (opcional si tu DTO lo tiene) */}
      {postulacion.observacion && (
        <div className="text-sm text-neutral-700 mb-4">
          <div className="flex items-center mb-1">
            <DescriptionIcon fontSize="small" className="mr-1 text-neutral-500" />
            <strong>Observaciones</strong>
          </div>
          <p className="ml-5 text-neutral-600">{postulacion.observacion}</p>
        </div>
      )}
    </div>
  );
}
