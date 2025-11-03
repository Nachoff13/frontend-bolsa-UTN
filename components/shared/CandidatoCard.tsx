"use client";

import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

interface CandidatoPostuladoCardProps {
  postulacion: PostulacionDTO;
  onVer?: (p: PostulacionDTO) => void;
}

export default function CandidatoPostuladoCard({
  postulacion,
  onVer,
}: CandidatoPostuladoCardProps) {
  const { nombreCandidato, tituloOferta, fechaPostulacion, estadoPostulacion } =
    postulacion;

  const router = useRouter();
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
      className="relative border border-neutral-200 rounded-xl bg-white shadow-sm 
                 hover:shadow-md transition-all duration-200 p-5"
    >
      {/* 🔹 Chip de estado */}
      <div className="absolute top-3 right-4 flex gap-2">
        <Chip
          label={estadoPostulacion ?? "Sin estado"}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: `${getEstadoColor(estadoPostulacion)}22`, // fondo suave
            color: getEstadoColor(estadoPostulacion),
          }}
        />
      </div>

      {/* 🧑 Nombre del candidato */}
      <div className="flex items-center mb-2">
        <PersonIcon fontSize="small" className="text-sky-700 mr-1" />
        <h3 className="text-lg font-semibold text-sky-800">
          {nombreCandidato || "Candidato sin nombre"}
        </h3>
      </div>

      <Divider sx={{ mb: 1 }} />

      {/* 💼 Puesto */}
      <div className="flex items-center text-sm text-neutral-700 mb-2">
        <WorkIcon fontSize="small" className="mr-1 text-neutral-500" />
        <span className="font-medium">{tituloOferta || "Sin puesto"}</span>
      </div>

      {/* 📅 Fecha */}
      <div className="flex items-center text-sm text-neutral-500 mb-3">
        <CalendarIcon fontSize="small" className="mr-1 text-neutral-400" />
        <span>Postulado el {fechaPostulacion ?? "-"}</span>
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* 🔘 Botones */}

    </div>
  );
}
