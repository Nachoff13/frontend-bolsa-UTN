"use client";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CardPublicacion from "@/components/shared/CardPublicacion";
import DetalleModal from "@/components/shared/DetalleModal";
import LoadingModal from "@/components/shared/LoadingModal";
import ModalFormulario, {
  CampoFormulario,
} from "@/components/shared/ModalFormulario";
import { postulanteService } from "@/services/postulacion.service";
import { useSnackbar } from "@/components/providers/snackbar";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import { calcularTiempoTranscurrido } from "@/lib/dateUtils";
import EmptyState from "./EmptyState";

interface Props {
  ofertas: OfertaDTO[];
  loading: boolean;
  postulaciones: PostulacionDTO[];
  onPostulacionExitosa?: () => void;
}

export default function PublicacionesCandidato({
  ofertas,
  loading,
  postulaciones,
  onPostulacionExitosa,
}: Props) {
  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] =
    useState<OfertaDTO | null>(null);
  const [isPostulando, setIsPostulando] = useState(false);
  const [modalPostulacionOpen, setModalPostulacionOpen] = useState(false); // 👈 para abrir/cerrar ModalFormulario
  const [formData, setFormData] = useState({
    cartaPresentacion: "",
    observacion: "",
  }); // 👈 datos del modal
  const theme = useTheme();
  const { showMessage } = useSnackbar();

  // 🟢 Verifica si ya se postuló
  const yaPostulado = ofertaSeleccionada
    ? postulaciones.some((p) => p.idOferta === ofertaSeleccionada.id)
    : false;

  //  Al hacer click en "Postularse"
  const handleAbrirModalPostulacion = () => {
    setModalPostulacionOpen(true);
  };

  //  Guardar desde el modal
  async function handleSubmitPostulacion(valores: Record<string, string>) {
    if (!ofertaSeleccionada) return;

    try {
      setIsPostulando(true);

      const postulacion = new PostulacionDTO();
      postulacion.idOferta = ofertaSeleccionada.id;
      postulacion.cartaPresentacion = valores.cartaPresentacion || "Sin carta";
      postulacion.observacion = valores.observacion || "Sin observación";

      const response: string = await postulanteService.postularseOferta(
        postulacion
      );

      showMessage(response, SnackbarType.Success, {
        position: SnackbarPosition.BottomCenter,
        size: SnackbarSize.Medium,
      });

      // ✅ refrescar y cerrar
      if (onPostulacionExitosa) onPostulacionExitosa();
      setModalPostulacionOpen(false);
      setOpenDetalle(false);
    } catch (e) {
      const error = e as ResponseError;
      showMessage(error.message, SnackbarType.Error);
    } finally {
      setIsPostulando(false);
    }
  }

  const handleVerDetalle = (oferta: OfertaDTO) => {
    setOfertaSeleccionada(oferta);
    setOpenDetalle(true);
  };

  if (loading)
    return <p className="text-neutral-500">Cargando publicaciones...</p>;

  const camposPostulacion: CampoFormulario[] = [
    {
      id: "cartaPresentacion",
      label: "Carta de presentación",
      tipo: "textarea",
      placeholder:
        "Escribí una breve carta explicando por qué te interesa la oferta...",
    },
    {
      id: "observacion",
      label: "Observación",
      tipo: "textarea",
      placeholder: "Podés agregar comentarios adicionales si lo deseás...",
    },
  ];

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
        <EmptyState mensaje="No existen publicaciones para tu carrera" />
      ) : (
        <div className="flex flex-col gap-4">
          {ofertas.slice(0, 3).map((oferta) => (
            <CardPublicacion
              key={oferta.id}
              oferta={oferta}
              calcularTiempoTranscurrido={calcularTiempoTranscurrido}
              onVerDetalle={handleVerDetalle}
            />
          ))}
        </div>
      )}

      {/* 🪟 Modal Detalle */}
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
          ]}
          chips={[
            {
              label: `${
                ofertaSeleccionada.cantidadPostulantes ?? 0
              } Postulante/s`,
              color: "info",
            },
          ]}
          actions={
            <Button
              variant="contained"
              size="small"
              disabled={isPostulando || yaPostulado}
              sx={{
                backgroundColor: yaPostulado
                  ? "#9e9e9e"
                  : isPostulando
                  ? "#9e9e9e"
                  : "#0d47a1",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: yaPostulado
                    ? "#9e9e9e"
                    : isPostulando
                    ? "#9e9e9e"
                    : "#1565c0",
                },
              }}
              onClick={handleAbrirModalPostulacion} // 👈 abre el ModalFormulario
            >
              {yaPostulado
                ? "Ya estás postulado"
                : isPostulando
                ? "Enviando..."
                : "Postularse"}
            </Button>
          }
        />
      )}

      {/* 📋 Modal para completar postulación */}
      <ModalFormulario
        open={modalPostulacionOpen}
        onClose={() => setModalPostulacionOpen(false)}
        onSubmit={handleSubmitPostulacion}
        titulo="Completar Postulación"
        campos={camposPostulacion}
      />

      {isPostulando && <LoadingModal open={true} />}
    </section>
  );
}
