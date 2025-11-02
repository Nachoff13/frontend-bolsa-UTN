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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

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

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// 🟢 Colores dinámicos adaptados al tema global
const getEstadoChipColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "aprobada":
      return {
        bg: "hsl(var(--chart-2)) / 0.15",
        color: "hsl(var(--chart-2))",
      };
    case "rechazada":
      return {
        bg: "hsl(var(--destructive)) / 0.15",
        color: "hsl(var(--destructive))",
      };
    case "en revisión":
      return {
        bg: "hsl(var(--chart-4)) / 0.15",
        color: "hsl(var(--chart-4))",
      };
    default:
      return {
        bg: "hsl(var(--chart-1)) / 0.15",
        color: "hsl(var(--chart-1))",
      };
  }
};

const ESTADOS = ["Iniciada", "En revisión", "Aprobada", "Rechazada"];

export default function CandidatosPostuladosPage() {
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
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);

  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const [postulacionEnCambio, setPostulacionEnCambio] =
    useState<PostulacionCandidatoDTO | null>(null);

  // 🟢 Background y tipografía adaptados al tema base
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

  const abrirMenuCambiarEstado = (
    event: React.MouseEvent<HTMLButtonElement>,
    postulacion: PostulacionCandidatoDTO
  ) => {
    setAnchorMenu(event.currentTarget);
    setPostulacionEnCambio(postulacion);
  };

  const cerrarMenuCambiarEstado = (nuevoEstado?: string) => {
    setAnchorMenu(null);
    if (nuevoEstado && postulacionEnCambio) {
      const actualizadas = postulaciones.map((p) =>
        p.idPostulacion === postulacionEnCambio.idPostulacion
          ? { ...p, estadoPostulacion: nuevoEstado }
          : p
      );
      setPostulaciones(actualizadas);
      showMessage(`Estado cambiado a "${nuevoEstado}"`, SnackbarType.Success);
    }
  };

  // 🧮 Filtros
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

  return (
    <Box
      className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors"
      sx={{
        minHeight: "100vh",
        padding: "2rem",
        borderRadius: "var(--radius)",
      }}
    >
      {/* 🟢 Título principal */}
      <Titulo
        titulo="Candidatos Postulados"
        subtitulo="Revisá los perfiles y estados de las postulaciones recibidas"
      />

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

      {/* 🧮 Resumen con diseño Tailwind + theme vars */}
      <Box display="flex" gap={2} mt={3}>
        <Card
          className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm"
          sx={{
            flex: 1,
            textAlign: "center",
            borderRadius: "var(--radius)",
            padding: "1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "hsl(var(--primary))" }}
          >
            {total}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "hsl(var(--muted-foreground))" }}
          >
            Total de postulaciones
          </Typography>
        </Card>

        {ESTADOS.map((estado) => (
          <Card
            key={estado}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
            sx={{
              flex: 1,
              textAlign: "center",
              borderRadius: "var(--radius)",
              padding: "1rem",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "hsl(var(--primary))" }}
            >
              {totalPorEstado(estado)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "hsl(var(--muted-foreground))" }}
            >
              {estado}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* 🧭 Filtros y contenido */}
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

        {/* 🟢 Listado con colores y sombras suaves */}
        <Box flex={3}>
          {postulacionesFiltradas.length > 0 ? (
            <Card
              className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
              sx={{
                borderRadius: "var(--radius)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: 3,
              }}
            >
              <Titulo
                titulo="Postulaciones recibidas"
                subtitulo="Revisá el estado y los detalles de cada candidato"
                variantTitulo="h5"
                variantSubtitulo="body2"
              />
              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {postulacionesFiltradas.map((p) => {
                  const estadoColor = getEstadoChipColor(p.estadoPostulacion);
                  return (
                    <Card
                      key={p.idPostulacion}
                      className="bg-[hsl(var(--background))] border border-[hsl(var(--border))]"
                      sx={{
                        p: 3,
                        borderRadius: "var(--radius)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "hsl(var(--chart-3))",
                            mr: 2,
                            color: "white",
                          }}
                        >
                          {p.nombreCandidato?.[0] ?? "?"}
                        </Avatar>

                        <Box flexGrow={1}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "hsl(var(--primary))",
                              fontWeight: 600,
                            }}
                          >
                            {p.nombreCandidato ?? "Candidato desconocido"}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "hsl(var(--muted-foreground))",
                            }}
                          >
                            {p.tituloOferta ?? "Sin título"}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={p.estadoPostulacion}
                            sx={{
                              backgroundColor: estadoColor.bg,
                              color: estadoColor.color,
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "hsl(var(--muted-foreground))" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {p.localidad ?? "-"}
                        </Typography>
                        <CalendarTodayIcon
                          fontSize="small"
                          sx={{ color: "hsl(var(--muted-foreground))" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {new Date(p.fechaPostulacion).toLocaleDateString(
                            "es-AR"
                          )}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={1}
                        mt={3}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          sx={{
                            color: "hsl(var(--primary))",
                            borderColor: "hsl(var(--border))",
                            textTransform: "none",
                          }}
                        >
                          Ver CV
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          sx={{
                            backgroundColor: "hsl(var(--chart-3))",
                            color: "hsl(var(--primary-foreground))",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "hsl(var(--chart-2))",
                            },
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            </Card>
          ) : (
            <EmptyState mensaje="No hay postulaciones que coincidan con tu búsqueda" />
          )}
        </Box>
      </Box>
    </Box>
  );
}
