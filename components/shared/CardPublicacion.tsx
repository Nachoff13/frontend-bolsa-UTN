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
import { Button, Chip, Divider, Tooltip } from "@mui/material";
import { OfertaDTO } from "@/types/dto/ofertaDTO";

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
  return (
    <div
      className="rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 
                 transition-all shadow-sm hover:shadow-md p-5 relative"
    >
      {/* 🔹 Chips (Modalidad y Contrato) */}
      <div className="absolute top-4 right-4 flex gap-2">
        {oferta.modalidad && (
          <Chip
            label={oferta.modalidad}
            color="secondary"
            size="small"
            sx={{
              backgroundColor: "#be185d",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
        {oferta.tipoContrato && (
          <Chip
            label={oferta.tipoContrato}
            color="info"
            size="small"
            sx={{
              backgroundColor: "#0ea5e9",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </div>

      {/* 🧠 Título y Empresa */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-sky-800">{oferta.titulo}</h2>
        <div className="flex items-center text-neutral-600 text-sm">
          <BusinessIcon fontSize="small" className="mr-1 text-neutral-500" />
          <span>{oferta.nombreEmpresa ?? "Empresa no especificada"}</span>
        </div>
      </div>

      {/* 📍 Información general */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700 mb-3">
        <div className="flex items-center">
          <LocationOnIcon fontSize="small" className="mr-1 text-neutral-500" />
          {oferta.nombreLocalidad ?? "Ubicación no especificada"}
        </div>

        <div className="flex items-center">
          <SchoolIcon fontSize="small" className="mr-1 text-neutral-500" />
          {oferta.nombreCarrera ?? "Carrera no especificada"}
        </div>

        <Tooltip title="Cantidad de postulantes" arrow>
          <div className="flex items-center">
            <GroupIcon fontSize="small" className="mr-1 text-neutral-500" />
            {oferta.cantidadPostulantes ?? 0} postulante/s
          </div>
        </Tooltip>

        <Tooltip title="Tiempo transcurrido" arrow>
          <div className="flex items-center">
            <AccessTimeIcon fontSize="small" className="mr-1 text-neutral-500" />
            {calcularTiempoTranscurrido(oferta.fechaInicio)}
          </div>
        </Tooltip>

        <div className="flex items-center">
          <CalendarTodayIcon fontSize="small" className="mr-1 text-neutral-500" />
          Inicio {oferta.fechaInicio ?? "-"}
        </div>

        <div className="flex items-center">
          <EventIcon fontSize="small" className="mr-1 text-neutral-500" />
          Fin {oferta.fechaFin ?? "-"}
        </div>
      </div>

      <Divider sx={{ my: 1 }} />

      {/* 📝 Descripción */}
      <div className="text-sm text-neutral-700 mb-4">
        <div className="flex items-center mb-1">
          <DescriptionIcon fontSize="small" className="mr-1 text-neutral-500" />
          <strong>Descripción</strong>
        </div>
        <p className="ml-5 text-neutral-600">{oferta.descripcion}</p>
      </div>

      {/* 🔘 Acción */}
      <div className="flex justify-end">
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
      </div>
    </div>
  );
}
