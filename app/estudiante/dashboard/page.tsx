"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  Stack,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

import { empresaService } from "@/services/empresa.service";
import { candidatoService } from "@/services/estudiante.service";
import { postulanteService } from "@/services/postulacion.service";

import { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

import { useSnackbar } from "@/components/providers/snackbar";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import DetalleModal from "@/components/shared/DetalleModal";
import EmptyState from "@/components/shared/EmptyState";
import LoadingModal from "@/components/shared/LoadingModal";
import Titulo from "@/components/shared/Titulo";

/* 🎨 Paleta institucional */
const COLOR_PRIMARY = "#0d47a1";
const COLOR_BG = "#f9fafb";
const BORDER_COLOR = "#e5eaf1";

/* 🎯 Chips consistentes con los de la vista empresarial */
const getChipColor = (tipo: string) => {
  const lower = tipo?.toLowerCase() ?? "";
  if (lower.includes("full")) return { bg: "#e0f7fa", color: "#00796b" };
  if (lower.includes("part")) return { bg: "#ede7f6", color: "#5e35b1" };
  if (lower.includes("híbrido")) return { bg: "#e3f2fd", color: "#1565c0" };
  if (lower.includes("presencial")) return { bg: "#fff3e0", color: "#ef6c00" };
  if (lower.includes("remoto")) return { bg: "#e8f5e9", color: "#2e7d32" };
  return { bg: "#f1f3f4", color: "#444" };
};

export default function DashboardPage() {
  const [postulacionesActivas, setPostulacionesActivas] = useState(0);
  const [ofertasNuevas, setOfertasNuevas] = useState(0);
  const [perfilCompletado, setPerfilCompletado] = useState(0);
  const [entrevistasMes, setEntrevistasMes] = useState(0);

  const [publicaciones, setPublicaciones] = useState<OfertaRecienteDTO>({
    ofertas: [],
    cantidadOfertas: 0,
  });
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);

  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] =
    useState<OfertaDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const { showMessage } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pubs = await empresaService.getPublicaciones();
      setPublicaciones(pubs);
      const posts = await candidatoService.getPostulaciones();
      setPostulaciones(posts);

      setPostulacionesActivas(
        posts.filter((p) => p.estadoPostulacion !== "Rechazada").length
      );
      setOfertasNuevas(pubs.cantidadOfertas);
      setPerfilCompletado(85);
      setEntrevistasMes(
        posts.filter((p) => p.estadoPostulacion === "En revisión").length
      );
    } catch (err) {
      console.error(err);
      showMessage("Error al cargar datos del dashboard", SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  async function onClickPostularse(id: number): Promise<void> {
    try {
      const postulacion = new PostulacionDTO();
      postulacion.idOferta = id;
      postulacion.cartaPresentacion = "Carta de presentación de prueba";
      postulacion.observacion = "Observación de prueba";

      const response: string = await postulanteService.postularseOferta(
        postulacion
      );
      showMessage(response, SnackbarType.Success, {
        position: SnackbarPosition.BottomCenter,
        size: SnackbarSize.Medium,
      });
      await fetchData();
    } catch (e) {
      const error = e as ResponseError;
      showMessage(error.message, SnackbarType.Error);
    }
  }

  if (loading) return <LoadingModal open={true} />;

  return (
    <Box sx={{ backgroundColor: COLOR_BG, minHeight: "100vh", p: 3 }}>
      <Titulo
        titulo="Dashboard del Candidato"
        subtitulo="Seguimiento de tus postulaciones y ofertas recientes"
      />

      {/* 🔹 Métricas */}
      <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
        {[
          { label: "Postulaciones activas", value: postulacionesActivas },
          { label: "Ofertas nuevas", value: ofertasNuevas },
          { label: "Perfil completado", value: `${perfilCompletado}%` },
          { label: "En revisión", value: entrevistasMes },
        ].map((m, i) => (
          <Card
            key={i}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: `1px solid ${BORDER_COLOR}`,
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              minWidth: 220,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color={COLOR_PRIMARY}
              sx={{ mb: 0.5 }}
            >
              {m.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {m.label}
            </Typography>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 🔹 Publicaciones y postulaciones */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* 🧾 Publicaciones */}
        <Box flex={1} minWidth={400}>
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: "#fff",
              border: `1px solid ${BORDER_COLOR}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color={COLOR_PRIMARY}
              sx={{ mb: 2 }}
            >
              Publicaciones recientes
            </Typography>

            {publicaciones.ofertas.length > 0 ? (
              <Stack spacing={2}>
                {publicaciones.ofertas.slice(0, 3).map((oferta) => {
                  const modalidadColor = getChipColor(oferta.modalidad ?? "");
                  const contratoColor = getChipColor(oferta.tipoContrato ?? "");
                  return (
                    <Card
                      key={oferta.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${BORDER_COLOR}`,
                        backgroundColor: "#f9fbff",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color={COLOR_PRIMARY}
                      >
                        {oferta.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {oferta.nombreEmpresa}
                      </Typography>

                      <Box display="flex" gap={1} mt={1}>
                        <Chip
                          label={oferta.modalidad}
                          size="small"
                          sx={{
                            backgroundColor: modalidadColor.bg,
                            color: modalidadColor.color,
                            fontWeight: 500,
                          }}
                        />
                        <Chip
                          label={oferta.tipoContrato}
                          size="small"
                          sx={{
                            backgroundColor: contratoColor.bg,
                            color: contratoColor.color,
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          mt: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {oferta.descripcion}
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={2}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ color: "#888" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {oferta.nombreLocalidad}
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: COLOR_PRIMARY,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { backgroundColor: "#1565c0" },
                          }}
                          onClick={() => {
                            setOfertaSeleccionada(oferta);
                            setOpenDetalle(true);
                          }}
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <EmptyState mensaje="No hay publicaciones recientes" />
            )}
          </Card>
        </Box>

        {/* 🧍 Postulaciones */}
        <Box flex={1} minWidth={400}>
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: "#fff",
              border: `1px solid ${BORDER_COLOR}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color={COLOR_PRIMARY}
              sx={{ mb: 2 }}
            >
              Mis postulaciones
            </Typography>

            {postulaciones.length > 0 ? (
              <Stack spacing={2}>
                {postulaciones.slice(0, 4).map((p) => (
                  <Card
                    key={p.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${BORDER_COLOR}`,
                      backgroundColor: "#f9fbff",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color={COLOR_PRIMARY}
                    >
                      {p.tituloOferta}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.estadoPostulacion}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Postulado el{" "}
                      {new Date(p.fechaPostulacion).toLocaleDateString("es-AR")}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            ) : (
              <EmptyState mensaje="No tenés postulaciones todavía" />
            )}
          </Card>
        </Box>
      </Box>

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
              label: `${ofertaSeleccionada.cantidadPostulantes ?? 0} Postulante/s`,
              color: "info",
            },
          ]}
        />
      )}
    </Box>
  );
}
