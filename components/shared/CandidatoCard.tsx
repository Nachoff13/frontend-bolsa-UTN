"use client";

import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
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
      className="relative rounded-2xl border border-neutral-200 bg-neutral-50 
                 hover:bg-neutral-100 transition-all shadow-sm hover:shadow-md 
                 p-4 min-h-[210px] flex flex-col justify-between"
    >
      {/* 🔹 Chip de estado */}
      <div className="absolute top-3 right-3 flex gap-2">
        <Chip
          label={estadoPostulacion ?? "Sin estado"}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: `${getEstadoColor(estadoPostulacion)}22`,
            color: getEstadoColor(estadoPostulacion),
          }}
        />
      </div>

      {/* 🧑 Nombre del candidato */}
      <div>
        <div className="flex items-center mb-1">
          <PersonIcon fontSize="medium" className="text-sky-700 mr-1" />
          <h3 className="text-base font-semibold text-sky-800 leading-tight">
            {nombreCandidato || "Candidato sin nombre"}
          </h3>
        </div>

        <Divider sx={{ my: 1 }} />

      {/* 💼 Puesto + Fecha centrados verticalmente, alineados a la izquierda */}
      <div className="flex flex-col justify-center items-start text-left h-full mt-1">
        <div className="flex items-center text-sm text-neutral-700 mb-1">
          <WorkIcon fontSize="medium" className="mr-1 text-neutral-500" />
          <span>{tituloOferta || "Sin puesto asociado"}</span>
        </div>

        <div className="flex items-center text-sm text-neutral-500">
          <CalendarIcon fontSize="medium" className="mr-1 text-neutral-400" />
          <span>Postulado el {fechaPostulacion ?? "-"}</span>
        </div>
      </div>


      </div>

      <Divider sx={{ my: 1 }} />
    </div>
  );
}
