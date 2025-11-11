"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Card, Chip, Divider, Typography, IconButton } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import Titulo from "@/components/shared/Titulo";
import LoadingModal from "@/components/shared/LoadingModal";
import { ofertaService } from "@/services/oferta.service";
import { postulanteService } from "@/services/postulacion.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarType, SnackbarSize, SnackbarPosition } from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import { showConfirmDialog } from "@/components/shared/swalHelper";
import ModalFormulario, { CampoFormulario } from "@/components/shared/ModalFormulario";
import { 
  getEmpresaChipColor, 
  getModalidadChipColor, 
  getTipoContratoChipColor 
} from "@/lib/chipColors";
import { useTheme } from "@/components/providers/ThemeProvider";
import { calcularFechaCierre } from "@/lib/dateUtils";

export default function DetalleOfertaPage() {
  const params = useParams();
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [oferta, setOferta] = useState<OfertaDTO | null>(null);
  const [modalPostulacionOpen, setModalPostulacionOpen] = useState(false);

  const ofertaId = params.id as string;

  useEffect(() => {
    cargarOferta();
  }, [ofertaId]);

  const cargarOferta = async () => {
    try {
      setLoading(true);
      // Nota: Necesitaremos agregar este método al servicio
      const ofertaData = await ofertaService.getOfertaById(Number(ofertaId));
      setOferta(ofertaData);
    } catch (error) {
      const err = error as ResponseError;
      showMessage(err.message || "Error al cargar la oferta", SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
      // Si hay error, volver a la lista
      router.push("/estudiante/ofertas");
    } finally {
      setLoading(false);
    }
  };

  const handlePostularse = async () => {
    const confirmado = await showConfirmDialog(
      "¿Está seguro que desea continuar?",
      "Esta acción lo va a postular a la oferta de empleo."
    );

    if (confirmado) {
      setModalPostulacionOpen(true);
    }
  };

  const handleSubmitPostulacion = async (valores: Record<string, string>) => {
    try {
      setLoading(true);
      const postulacion = new PostulacionDTO();
      postulacion.idOferta = Number(ofertaId);
      postulacion.cartaPresentacion = valores.cartaPresentacion;
      postulacion.observacion = valores.observacion;

      const response: string = await postulanteService.postularseOferta(postulacion);
      showMessage(response, SnackbarType.Success, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });

      setModalPostulacionOpen(false);
      cargarOferta(); // Recargar para actualizar el estado de postulación
    } catch (error) {
      const err = error as ResponseError;
      showMessage(err.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    } finally {
      setLoading(false);
    }
  };

  const camposPostulacion: CampoFormulario[] = [
    {
      id: "cartaPresentacion",
      label: "Carta de presentación",
      tipo: "textarea",
      placeholder: "Escribí una breve carta explicando por qué te interesa la oferta...",
    },
    {
      id: "observacion",
      label: "Observación",
      tipo: "textarea",
      placeholder: "Podés agregar comentarios adicionales si lo deseás...",
    },
  ];

  if (loading) return <LoadingModal open={loading} />;
  if (!oferta) return null;

  const empresaColor = getEmpresaChipColor();
  const modalidadColor = getModalidadChipColor(oferta.modalidad);
  const contratoColor = getTipoContratoChipColor(oferta.tipoContrato);

  return (
    <Box>
      {/* Botón Volver */}
      <Box mb={3}>
        <IconButton
          onClick={() => router.push("/estudiante/ofertas")}
          sx={{
            color: mode === "dark" ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          component="span"
          sx={{
            ml: 1,
            color: mode === "dark" ? "#fff" : "#000",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => router.push("/estudiante/ofertas")}
        >
          Volver a ofertas
        </Typography>
      </Box>

      {/* Card Principal */}
      <Card
        variant="outlined"
        sx={{
          p: 4,
          boxShadow: 2,
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#fff",
          borderColor: mode === "dark" ? "#333" : "#e0e0e0",
        }}
      >
        {/* Header con título y chips */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box flex={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: mode === "dark" ? "#fff" : "#000",
                mb: 2,
              }}
            >
              {oferta.titulo}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <BusinessIcon sx={{ color: mode === "dark" ? "#9ca3af" : "#6b7280" }} />
              <Typography
                variant="h6"
                sx={{
                  color: mode === "dark" ? "#9ca3af" : "#6b7280",
                  fontWeight: 500,
                }}
              >
                {oferta.nombreEmpresa}
              </Typography>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              {oferta.nombreCarrera && (
                <Chip
                  label={oferta.nombreCarrera}
                  sx={{
                    backgroundColor: "#E5E7EB",
                    color: "#374151",
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    height: "32px",
                    padding: "0 12px",
                    "& .MuiChip-label": {
                      padding: "0 4px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                    },
                  }}
                />
              )}
              <Chip
                label={oferta.modalidad}
                sx={{
                  backgroundColor: mode === "dark" ? "#424242" : "#E5E7EB",
                  color: mode === "dark" ? "#ffffff" : "#374151",
                  fontWeight: 600,
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  height: "32px",
                  padding: "0 12px",
                  "& .MuiChip-label": {
                    padding: "0 4px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: mode === "dark" ? "#ffffff" : "#374151",
                  },
                }}
              />
              <Chip
                label={oferta.tipoContrato}
                sx={{
                  backgroundColor: mode === "dark" ? "#424242" : "#E5E7EB",
                  color: mode === "dark" ? "#ffffff" : "#374151",
                  fontWeight: 600,
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  height: "32px",
                  padding: "0 12px",
                  "& .MuiChip-label": {
                    padding: "0 4px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: mode === "dark" ? "#ffffff" : "#374151",
                  },
                }}
              />
              <Chip
                label={
                  (oferta.cantidadPostulantes || 0) >= (oferta.cupos || 1)
                    ? "Cupo Lleno"
                    : `Cupos: ${oferta.cantidadPostulantes || 0}/${oferta.cupos || 1}`
                }
                sx={{
                  backgroundColor: "#E5E7EB",
                  color: "#374151",
                  fontWeight: 600,
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  height: "32px",
                  padding: "0 12px",
                  "& .MuiChip-label": {
                    padding: "0 4px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Información adicional */}
        <Box display="flex" gap={3} mb={3} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon sx={{ color: mode === "dark" ? "#9ca3af" : "#6b7280" }} />
            <Typography sx={{ color: mode === "dark" ? "#d1d5db" : "#374151" }}>
              {oferta.nombreLocalidad}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon sx={{ color: mode === "dark" ? "#9ca3af" : "#6b7280" }} />
            <Typography sx={{ color: mode === "dark" ? "#d1d5db" : "#374151" }}>
              Publicado el {oferta.fechaInicio}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon sx={{ color: mode === "dark" ? "#9ca3af" : "#6b7280" }} />
            <Typography sx={{ color: mode === "dark" ? "#d1d5db" : "#374151" }}>
              Cierra el {calcularFechaCierre(oferta.fechaInicio, oferta.fechaFin)}
            </Typography>
          </Box>
          {oferta.nombreCarrera && (
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolIcon sx={{ color: mode === "dark" ? "#9ca3af" : "#6b7280" }} />
              <Typography sx={{ color: mode === "dark" ? "#d1d5db" : "#374151" }}>
                {oferta.nombreCarrera}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Botones de acción */}
        <Box display="flex" gap={2} mb={4}>
          <Box
            component="button"
            onClick={handlePostularse}
            disabled={!oferta.puedePostularse}
            sx={{
              flex: 1,
              py: 1.5,
              px: 3,
              backgroundColor: oferta.puedePostularse ? "#14b8a6" : "#9ca3af",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: oferta.puedePostularse ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: oferta.puedePostularse ? "#0d9488" : "#9ca3af",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            {oferta.puedePostularse ? "Postularme" : "Ya estás postulado"}
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: mode === "dark" ? "#333" : "#e0e0e0" }} />

        {/* Descripción del puesto */}
        <Box mb={4}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: mode === "dark" ? "#fff" : "#000",
            }}
          >
            Descripción del puesto
          </Typography>
    <Typography
    sx={{
      color: mode === "dark" ? "#d1d5db" : "#374151",
      lineHeight: 1.8,
      whiteSpace: "pre-line", 
    }}
          >
    {oferta.descripcion}
          </Typography>
        </Box>

      </Card>

      {/* Modal de postulación */}
      <ModalFormulario
        open={modalPostulacionOpen}
        onClose={() => setModalPostulacionOpen(false)}
        onSubmit={handleSubmitPostulacion}
        titulo="Completar Postulación"
        campos={camposPostulacion}
      />
    </Box>
  );
}

