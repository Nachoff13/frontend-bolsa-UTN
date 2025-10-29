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
import { SnackbarPosition, SnackbarSize, SnackbarType } from "@/types/enums/snackbar";

// Colores de chips por estado
const getEstadoChipColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "aprobada":
      return { bg: "#E8F5E9", color: "#2E7D32" };
    case "rechazada":
      return { bg: "#FFEBEE", color: "#C62828" };
    case "en revisión":
      return { bg: "#FFF3CD", color: "#856404" };
    default: // iniciada u otros
      return { bg: "#E3F2FD", color: "#0D47A1" };
  }
};

const ESTADOS = ["Iniciada", "En revisión", "Aprobada", "Rechazada"];

export default function CandidatosPostuladosPage() {
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState<PostulacionCandidatoDTO[]>([]);

  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [inputBusquedaFinal, setInputBusquedaFinal] = useState("");
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>([]);

  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);

  const filtrosAPI = [
    {
      id: "estado",
      titulo: "Estado",
      opciones: ESTADOS.map((estado) => ({
        codigo: estado,
        descripcion: estado,
      })),
    },
    {
      id: "fecha",
      titulo: "Fecha de postulación",
      opciones: [
        { codigo: "ultimaSemana", descripcion: "Última semana" },
        { codigo: "ultimoMes", descripcion: "Último mes" },
        { codigo: "ultimos3Meses", descripcion: "Últimos 3 meses" },
        { codigo: "mas3Meses", descripcion: "Más de 3 meses" },
      ],
    },
  ];


  const gruposFiltros = filtrosAPI.map((grupo) => ({
    ...grupo,
    valoresSeleccionados: estadosSeleccionados,
  }));

  const filtros = useMemo(() => {
    const f: any = {};
    if (estadosSeleccionados.length > 0) f.estados = estadosSeleccionados;
    if (inputBusquedaFinal.trim()) f.input = inputBusquedaFinal.trim();
    return f;
  }, [estadosSeleccionados, inputBusquedaFinal]);

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

  const postulacionesFiltradas = useMemo(() => {
    return postulaciones.filter((p) => {
      const fecha = new Date(p.fechaPostulacion);
      const hoy = new Date();
      const diasDiferencia = (hoy.getTime() - fecha.getTime()) / (1000 * 3600 * 24);

      const coincideBusqueda =
        inputBusquedaFinal.trim() === "" ||
        p.nombreCandidato?.toLowerCase().includes(inputBusquedaFinal.toLowerCase()) ||
        p.tituloOferta?.toLowerCase().includes(inputBusquedaFinal.toLowerCase());

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
  }, [postulaciones, inputBusquedaFinal, estadosSeleccionados, fechasSeleccionadas]);




  const handleBuscar = () => setInputBusquedaFinal(busquedaInputFiltro);
  const handleSeleccionFiltro = (idGrupo: string, nuevos: string[]) => {
    if (idGrupo === "estado") setEstadosSeleccionados(nuevos);
    if (idGrupo === "fecha") setFechasSeleccionadas(nuevos);
  };

  const handleVerCV = (cvBase64: string | null | undefined) => {
    if (!cvBase64) {
      showMessage("Este candidato no tiene CV disponible", SnackbarType.Warning);
      return;
    }
    const byteCharacters = atob(cvBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (loading) return <LoadingModal open={loading} />;

  const total = postulaciones.length;
  const totalPorEstado = (estado: string) =>
    postulaciones.filter((p) => p.estadoPostulacion === estado).length;

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", p: 3 }}>
      <Titulo
        titulo="Candidatos Postulados"
        subtitulo="Revisá los perfiles y estados de las postulaciones recibidas"
      />

      {/* 🔍 Buscador */}
      <FilterSearch
        titulo="Buscar candidatos"
        subtitulo="Filtrá por nombre o título de la oferta"
        placeholder="Buscar por candidato u oferta…"
        valor={busquedaInputFiltro}
        onChange={(e) => setBusquedaInputFiltro(e.target.value)}
        onAccion1={handleBuscar}
        tituloBoton2="Limpiar"
        onAccion2={() => {
          setBusquedaInputFiltro("");
          setInputBusquedaFinal("");
          setEstadosSeleccionados([]);
        }}
      />

      {/* 🧮 Cards resumen */}
      <Box display="flex" gap={2} mt={3}>
        <Card
          sx={{
            p: 2,
            flex: 1,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(145deg, #fff, #f0f4f8)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
              p: 2,
              flex: 1,
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(145deg, #fff, #f0f4f8)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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

      {/* 🎛 Filtros + resultados */}
      <Box display="flex" gap={3} mt={4}>
        {/* Filtros laterales */}
        <Box flex={1} maxWidth={300}>
          <CardFiltros grupos={gruposFiltros} onSeleccionCambio={handleSeleccionFiltro} />
        </Box>

        {/* Listado principal */}
        <Box flex={3}>
          {postulacionesFiltradas.length > 0 ? (
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
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
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                          {p.nombreCandidato?.[0] ?? "?"}
                        </Avatar>

                        <Box flexGrow={1}>
                          <Typography variant="h6" color="primary.main" fontWeight={600}>
                            {p.nombreCandidato ?? "Candidato desconocido"}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: "#555" }}>
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
                          {p.carreraNombre && (
                            <Chip
                              label={p.carreraNombre}
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                          {p.modalidad && (
                            <Chip
                              label={p.modalidad}
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {p.localidad ?? "-"}
                        </Typography>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Postulado el{" "}
                          {new Date(p.fechaPostulacion).toLocaleDateString("es-AR")}
                        </Typography>
                      </Box>

                      {p.descripcionPerfil && (
                        <Box mt={2}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {p.descripcionPerfil}
                          </Typography>
                        </Box>
                      )}

                      <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleVerCV(p.cv)}
                        >
                          Ver CV
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            showMessage(
                              `Ver detalles de ${p.nombreCandidato}`,
                              SnackbarType.Info
                            )
                          }
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
