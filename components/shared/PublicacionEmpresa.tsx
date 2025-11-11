"use client";

import { useState } from "react";
import CardPublicacion from "./CardPublicacion";
import DetalleModal from "@/components/shared/DetalleModal";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { calcularTiempoTranscurrido } from "@/lib/dateUtils";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import EmptyState from "./EmptyState";

interface Props {
  ofertas: OfertaDTO[];
  loading: boolean;
}

export default function PublicacionesEmpresa({ ofertas, loading }: Props) {
  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] =
    useState<OfertaDTO | null>(null);

  const handleVerDetalle = (oferta: OfertaDTO) => {
    setOfertaSeleccionada(oferta);
    setOpenDetalle(true);
  };

  const router = useRouter();
  const theme = useTheme();

  if (loading)
    return <p className="text-neutral-500">Cargando publicaciones...</p>;

  return (
    <section
      style={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
      }}
      className="h-full flex flex-col"
    >
      {/* 🧭 Header con título y botón */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Publicaciones de empleo recientes
        </h3>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/empresa/publicaciones")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
            px: 2.5,
          }}
        >
          Ver Publicaciones
        </Button>
      </div>

      {/* 📋 Lista de publicaciones */}
      {ofertas.length === 0 ? (
        <EmptyState 
          mensaje="No hay publicaciones de empleo disponibles."
        />

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

      {/* 📄 Modal de detalle */}
      {ofertaSeleccionada && (
        <DetalleModal
          open={openDetalle}
          onClose={() => setOpenDetalle(false)}
          title={ofertaSeleccionada.titulo}
          fields={[
            { label: "Empresa", value: ofertaSeleccionada.nombreEmpresa },
            { label: "Carrera", value: ofertaSeleccionada.nombreCarrera },
            { label: "Modalidad", value: ofertaSeleccionada.modalidad },
            {
              label: "Tipo de contrato",
              value: ofertaSeleccionada.tipoContrato,
            },
            { label: "Localidad", value: ofertaSeleccionada.nombreLocalidad },
            { label: "Descripción", value: ofertaSeleccionada.descripcion },
            {
              label: "Cupos disponibles",
              value: `${ofertaSeleccionada.cantidadPostulantes || 0}/${
                ofertaSeleccionada.cupos || 1
              }`,
            },
          ]}
          chips={[
            {
              label: `${
                ofertaSeleccionada.cantidadPostulantes ?? 0
              } Postulante/s`,
              color: "info",
            },
          ]}
        />
      )}
    </section>
  );
}
