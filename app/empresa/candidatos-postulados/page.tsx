"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  Divider,
  Stack,
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

import { showConfirmDialog } from "@/components/shared/swalHelper";
import Titulo from "@/components/shared/Titulo";
import FilterSearch from "@/components/shared/FilterSearch";
import CardFiltros from "@/components/shared/CardFiltro";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";
import { useSnackbar } from "@/components/providers/snackbar";
import { empresaService } from "@/services/empresa.service";
import { PostulacionCandidatoDTO } from "@/types/dto/postulacionCandidatoDTO";
import DetalleCandidatoModal from "@/components/shared/DetalleCandidatoModal";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useTheme } from "@mui/material/styles";
import ModalFormulario, {
  CampoFormulario,
} from "@/components/shared/ModalFormulario";
import { ResponseError } from "@/types/Generics/responseError";

// 🎨 Colores dinámicos según estado
const getEstadoChipColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "aprobada":
      return { bg: "#E8F5E9", color: "#2E7D32" };
    case "rechazada":
      return { bg: "#FFEBEE", color: "#C62828" };
    case "en revisión":
      return { bg: "#FFF3CD", color: "#856404" };
    default:
      return { bg: "#E3F2FD", color: "#0D47A1" };
  }
};

const ESTADOS = ["Iniciada", "En revisión", "Aprobada", "Rechazada"];

export default function CandidatosPostuladosPage() {
  const theme = useTheme();

  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState<PostulacionCandidatoDTO[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [postulacionSeleccionada, setPostulacionSeleccionada] =
    useState<PostulacionCandidatoDTO | null>(null);

  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [inputBusquedaFinal, setInputBusquedaFinal] = useState("");
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>(
    []
  );
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);
  const [modalPostulacionOpen, setModalPostulacionOpen] = useState(false);

  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const [postulacionEnCambio, setPostulacionEnCambio] =
    useState<PostulacionCandidatoDTO | null>(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const abrirMenu = (
    event: React.MouseEvent<HTMLElement>,
    postulacion: PostulacionCandidatoDTO
  ) => {
    setAnchorMenu(event.currentTarget);
    setPostulacionEnCambio(postulacion);
  };

  const cerrarMenu = () => {
    setAnchorMenu(null);
  };

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getPostulacionCandidatoEmpresa();
      setPostulaciones(data);
    } catch (e) {
      console.error(e);
      showMessage("Error al cargar postulaciones", SnackbarType.Error, {
        position: SnackbarPosition.BottomCenter,
        size: SnackbarSize.Medium,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerCV = (cvBase64: string | null | undefined) => {
    if (!cvBase64) {
      showMessage(
        "Este candidato no tiene CV disponible",
        SnackbarType.Warning
      );
      return;
    }
    const byteCharacters = atob(cvBase64);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const blob = new Blob([new Uint8Array(byteNumbers)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const postulacionesFiltradas = useMemo(() => {
    return postulaciones.filter((p) => {
      const fecha = new Date(p.fechaPostulacion);
      const hoy = new Date();
      const diasDiferencia =
        (hoy.getTime() - fecha.getTime()) / (1000 * 3600 * 24);

      const coincideBusqueda =
        inputBusquedaFinal.trim() === "" ||
        p.nombreCandidato
          ?.toLowerCase()
          .includes(inputBusquedaFinal.toLowerCase()) ||
        p.tituloOferta
          ?.toLowerCase()
          .includes(inputBusquedaFinal.toLowerCase());

      const coincideEstado =
        estadosSeleccionados.length === 0 ||
        estadosSeleccionados.includes(p.estadoPostulacion);

      const coincideFecha =
        fechasSeleccionadas.length === 0 ||
        fechasSeleccionadas.some((f) => {
          switch (f) {
            case "ultimaSemana":
              return diasDiferencia <= 7;
            case "ultimoMes":
              return diasDiferencia <= 30;
            case "ultimos3Meses":
              return diasDiferencia <= 90;
            case "mas3Meses":
              return diasDiferencia > 90;
            default:
              return true;
          }
        });

      return coincideBusqueda && coincideEstado && coincideFecha;
    });
  }, [
    postulaciones,
    inputBusquedaFinal,
    estadosSeleccionados,
    fechasSeleccionadas,
  ]);

  if (loading) return <LoadingModal open={loading} />;

  const total = postulaciones.length;
  const totalPorEstado = (estado: string) =>
    postulaciones.filter((p) => p.estadoPostulacion === estado).length;

  const cambiarEstado = async (nuevoEstado: string) => {

    if (!postulacionEnCambio) return;
    cerrarMenu();

    const confirmado = await showConfirmDialog(
      "¿Desea cambiar el estado de la postulación?",
      `Esta acción actualizará el estado a "${nuevoEstado}".`
    );

    if (confirmado) {
      setModalPostulacionOpen(true);
      setNuevoEstado(nuevoEstado);
    }
  };

  const camposCambioEstado: CampoFormulario[] = [
    {
      id: "motivo",
      label: "Motivo",
      tipo: "textarea",
      placeholder:
        "Escribí el motivo por el cual estás cambiando el estado de la postulación...",
    },
  ];

  async function handleSubmitPostulacion(valores: Record<string, string>) {
    try {
      setLoadingEstado(true);

      console.log("Valores del formulario:", valores.motivo);

      if (!postulacionEnCambio) return;
      await empresaService.cambiarEstadoPostulacion(
        postulacionEnCambio.idPostulacion,
        nuevoEstado
      );

      setPostulaciones((prev) =>
        prev.map((p) =>
          p.idPostulacion === postulacionEnCambio.idPostulacion
            ? { ...p, estadoPostulacion: nuevoEstado }
            : p
        )
      );

      showMessage(
        `✅ Estado cambiado a "${nuevoEstado}"`,
        SnackbarType.Success
      );
    } catch (err) {
      console.error(err);
      showMessage("❌ Error al cambiar el estado", SnackbarType.Error);
    } finally {
      setLoadingEstado(false);
    }
  }

  return (
    <>
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", p: 3 }}>
        <FilterSearch
          titulo="Buscar candidatos"
          subtitulo="Filtrá por nombre o título de la oferta"
          placeholder="Buscar por candidato u oferta…"
          valor={busquedaInputFiltro}
          onChange={(e) => setBusquedaInputFiltro(e.target.value)}
          onAccion1={() => setInputBusquedaFinal(busquedaInputFiltro)}
          tituloBoton2="Limpiar"
          onAccion2={() => {
            setBusquedaInputFiltro("");
            setInputBusquedaFinal("");
            setEstadosSeleccionados([]);
            setFechasSeleccionadas([]);
          }}
        />

        <Box display="flex" gap={2} mt={3}>
          <Card
            sx={{
              flex: 1,
              p: 2,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <Typography variant="h5" fontWeight={700} color="primary">
              {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de postulaciones
            </Typography>
          </Card>
          {ESTADOS.map((estado) => (
            <Card
              key={estado}
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" fontWeight={700} color="primary">
                {totalPorEstado(estado)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {estado}
              </Typography>
            </Card>
          ))}
        </Box>

        <Box display="flex" gap={3} mt={4}>
          <Box flex={1} maxWidth={300}>
            <CardFiltros
              grupos={[
                {
                  id: "estado",
                  titulo: "Estado",
                  opciones: ESTADOS.map((e) => ({
                    codigo: e,
                    descripcion: e,
                  })),
                  valoresSeleccionados: estadosSeleccionados,
                },
              ]}
              onSeleccionCambio={(id, nuevos) =>
                id === "estado"
                  ? setEstadosSeleccionados(nuevos)
                  : setFechasSeleccionadas(nuevos)
              }
            />
          </Box>

          <Box flex={3}>
            {postulacionesFiltradas.length > 0 ? (
              <Stack spacing={2}>
                {postulacionesFiltradas.map((p) => {
                  const estadoColor = getEstadoChipColor(p.estadoPostulacion);
                  return (
                    <Card
                      key={p.idPostulacion}
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={
                              p.fotoPerfil
                                ? `data:image/jpeg;base64,${p.fotoPerfil}`
                                : undefined
                            }
                            sx={{
                              bgcolor: "#0d47a1",
                              color: "white",
                              width: 48,
                              height: 48,
                              fontWeight: 600,
                            }}
                          >
                            {p.nombreCandidato?.[0] ?? "?"}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {p.nombreCandidato ?? "Candidato desconocido"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#555", fontSize: "0.9rem" }}
                            >
                              {p.tituloOferta ?? "Sin puesto asociado"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* CHIP INTERACTIVO */}
                        <Chip
                          label={
                            loadingEstado &&
                            postulacionEnCambio?.idPostulacion ===
                              p.idPostulacion ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              p.estadoPostulacion
                            )
                          }
                          onClick={(e) => abrirMenu(e, p)}
                          sx={{
                            backgroundColor: estadoColor.bg,
                            color: estadoColor.color,
                            fontWeight: 600,
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            height: "26px",
                            cursor: "pointer",
                            "&:hover": { opacity: 0.9 },
                          }}
                        />
                      </Box>

                      {/* Descripción */}
                      {p.descripcionPerfil && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#444",
                            mt: 2,
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {p.descripcionPerfil}
                        </Typography>
                      )}

                      {/* Observaciones */}
                      {p.observacion && (
                        <Box
                          sx={{
                            backgroundColor: "#f1f6ff",
                            borderRadius: "8px",
                            p: 1.5,
                            mt: 1.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#0d47a1" }}
                          >
                            Observaciones
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#444", whiteSpace: "pre-wrap" }}
                          >
                            {p.observacion}
                          </Typography>
                        </Box>
                      )}

                      {/* Footer */}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={3}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          {p.carreraNombre && (
                            <Chip
                              label={p.carreraNombre}
                              size="small"
                              sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#0d47a1",
                                fontWeight: 500,
                              }}
                            />
                          )}
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarTodayIcon
                              fontSize="small"
                              sx={{ color: "#888", width: 16, height: 16 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#666", fontSize: "0.8rem" }}
                            >
                              Publicado el{" "}
                              {new Date(p.fechaPostulacion).toLocaleDateString(
                                "es-AR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" gap={1}>
                          {/* 🔹 Ver CV */}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={async () => {
                              handleVerCV(p.cv); // 👈 Lógica actual

                              // 🧩 Si está en estado "Iniciada", cambiar a "En revisión"
                              if (
                                p.estadoPostulacion?.toLowerCase() ===
                                "iniciada"
                              ) {
                                try {
                                  await empresaService.cambiarEstadoPostulacion(
                                    p.idPostulacion,
                                    "En revisión"
                                  );
                                  setPostulaciones((prev) =>
                                    prev.map((post) =>
                                      post.idPostulacion === p.idPostulacion
                                        ? {
                                            ...post,
                                            estadoPostulacion: "En revisión",
                                          }
                                        : post
                                    )
                                  );
                                  showMessage(
                                    `Estado cambiado a "En revisión"`,
                                    SnackbarType.Info
                                  );
                                } catch (err) {
                                  console.error(err);
                                  showMessage(
                                    "Error al actualizar estado",
                                    SnackbarType.Error
                                  );
                                }
                              }
                            }}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              borderRadius: "8px",
                              borderColor: "#0d47a1",
                              color: "#0d47a1",
                              "&:hover": {
                                borderColor: "#1565c0",
                                backgroundColor: "#e3f2fd",
                              },
                            }}
                          >
                            Ver CV
                          </Button>

                          {/* 🔹 Ver detalles */}
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={async () => {
                              setPostulacionSeleccionada(p);
                              setOpenModal(true);

                              // 🧩 Si está en estado "Iniciada", cambiar a "En revisión"
                              if (
                                p.estadoPostulacion?.toLowerCase() ===
                                "iniciada"
                              ) {
                                try {
                                  await empresaService.cambiarEstadoPostulacion(
                                    p.idPostulacion,
                                    "En revisión"
                                  );
                                  setPostulaciones((prev) =>
                                    prev.map((post) =>
                                      post.idPostulacion === p.idPostulacion
                                        ? {
                                            ...post,
                                            estadoPostulacion: "En revisión",
                                          }
                                        : post
                                    )
                                  );
                                  showMessage(
                                    `Estado cambiado a "En revisión"`,
                                    SnackbarType.Info
                                  );
                                } catch (err) {
                                  console.error(err);
                                  showMessage(
                                    "Error al actualizar estado",
                                    SnackbarType.Error
                                  );
                                }
                              }
                            }}
                            sx={{
                              backgroundColor: "#0d47a1",
                              color: "white",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              "&:hover": { backgroundColor: "#1565c0" },
                            }}
                          >
                            Ver detalles
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <EmptyState mensaje="No hay postulaciones que coincidan con tu búsqueda" />
            )}
          </Box>
        </Box>
        <Menu
          anchorEl={anchorMenu}
          open={Boolean(anchorMenu)}
          onClose={cerrarMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => cambiarEstado("Aprobada")}>
            <ListItemIcon>
              <CheckCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Aprobada</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => cambiarEstado("Rechazada")}>
            <ListItemIcon>
              <ErrorOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rechazada</ListItemText>
          </MenuItem>
        </Menu>

        <DetalleCandidatoModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          postulacion={postulacionSeleccionada || undefined}
        />
      </Box>

      <ModalFormulario
        open={modalPostulacionOpen}
        onClose={() => setModalPostulacionOpen(false)}
        onSubmit={handleSubmitPostulacion}
        titulo="Completar Postulación"
        campos={camposCambioEstado}
      />
    </>
  );
}
