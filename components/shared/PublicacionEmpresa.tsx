"use client";

import { useState } from "react";
import CardGenerica from "@/components/shared/CardGenerica";
import DetalleModal from "@/components/shared/DetalleModal";
import { OfertaDTO } from "@/types/dto/ofertaDTO";

import { useTheme } from "@mui/material/styles";

import CardPublicacion from "./CardPublicacion";
import { calcularTiempoTranscurrido } from "@/lib/dateUtils";

interface Props {
  ofertas: OfertaDTO[];
  loading: boolean;
}


export default function PublicacionesEmpresa({ ofertas, loading }: Props) {
  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaDTO | null>(null);

  const handleVerDetalle = (oferta: OfertaDTO) => {
    setOfertaSeleccionada(oferta);
    setOpenDetalle(true);
  };

  const theme = useTheme();

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
  <section
    style={{
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease-in-out",
    }}
    className="h-full flex flex-col"
  >
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
          { 
            label: "Cupos disponibles", 
            value: `${ofertaSeleccionada.cantidadPostulantes || 0}/${ofertaSeleccionada.cupos || 1}` 
          },
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
