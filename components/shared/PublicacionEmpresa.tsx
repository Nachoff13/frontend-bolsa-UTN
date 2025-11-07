"use client";

import { useState } from "react";
import CardGenerica from "@/components/shared/CardGenerica";
import DetalleModal from "@/components/shared/DetalleModal";
import { OfertaDTO } from "@/types/dto/ofertaDTO";

import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import CardPublicacion from "./CardPublicacion";

interface Props {
  ofertas: OfertaDTO[];
  loading: boolean;
}

// 🕒 Función auxiliar para calcular tiempo transcurrido
function calcularTiempoTranscurrido(fechaInicio: string | undefined): string {
  if (!fechaInicio) return "-";

  const fecha = new Date(fechaInicio);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 1) return "hoy";
  if (diffDias === 1) return "hace 1 día";
  if (diffDias < 7) return `hace ${diffDias} días`;
  const semanas = Math.floor(diffDias / 7);
  return semanas === 1 ? "hace 1 semana" : `hace ${semanas} semanas`;
}

export default function PublicacionesEmpresa({ ofertas, loading }: Props) {
  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaDTO | null>(null);

  const handleVerDetalle = (oferta: OfertaDTO) => {
    setOfertaSeleccionada(oferta);
    setOpenDetalle(true);
  };

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
  <section className="rounded-2xl border border-neutral-200 bg-white p-4 h-full flex flex-col">
    <h3 className="mb-3 text-base font-semibold text-gray-800">
      Publicaciones de empleo recientes
    </h3>

    {ofertas.length === 0 ? (
      <p className="text-sm text-neutral-500">
        No hay publicaciones registradas todavía.
      </p>
    ) : (
      <div className="flex flex-col gap-4">
        {ofertas.map((oferta) => (
          <CardPublicacion
            key={oferta.id}
            oferta={oferta}
            calcularTiempoTranscurrido={calcularTiempoTranscurrido}
            onVerDetalle={handleVerDetalle}
          />
        ))}
      </div>
    )}

    {ofertaSeleccionada && (
      <DetalleModal
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        title={ofertaSeleccionada.titulo}
        fields={[
          { label: "Empresa", value: ofertaSeleccionada.nombreEmpresa },
          { label: "Carrera", value: ofertaSeleccionada.nombreCarrera },
          { label: "Modalidad", value: ofertaSeleccionada.modalidad },
          { label: "Tipo de contrato", value: ofertaSeleccionada.tipoContrato },
          { label: "Localidad", value: ofertaSeleccionada.nombreLocalidad },
          { label: "Descripción", value: ofertaSeleccionada.descripcion },
        ]}
        chips={[
          {
            label: `${ofertaSeleccionada.cantidadPostulantes ?? 0} Postulante/s`,
            color: "info",
          },
        ]}
        onVerPublicacion={() =>
          console.log("Abrir publicación en nueva pestaña")
       //   window.open(`/empresa/oferta/${ofertaSeleccionada.id}`, "_blank")
        } // 👈 abre la publicación en nueva pestaña
      />
    )}
  </section>

);}
