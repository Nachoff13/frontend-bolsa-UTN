"use client";

import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
} from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { useRouter } from "next/navigation";

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

  const getEstadoColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "iniciada":
      case "en revisión":
        return "info";
      case "aceptada":
        return "success";
      case "rechazada":
        return "error";
      default:
        return "default";
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
          color={getEstadoColor(estadoPostulacion) as any}
          size="small"
          sx={{ fontWeight: 600 }}
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
      <div className="flex justify-end gap-2">
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/empresa/candidatos-postulados")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
            px: 2.5,
          }}
        >
          Ver Postulaciones
        </Button>
      </div>
    </div>
  );
}
