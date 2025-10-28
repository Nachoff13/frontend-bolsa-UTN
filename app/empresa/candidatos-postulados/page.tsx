"use client";

import { useEffect, useState } from "react";
import { Box, Card, Typography, Button, Chip, Stack, Avatar } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Titulo from "@/components/shared/Titulo";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";
import { SnackbarType } from "@/types/enums/snackbar";
import { empresaService } from "@/services/empresa.service";
import { email } from "zod";

interface CandidatoPostulado {
  id: number;
  nombre: string;
  email: string;
  carrera: string;
  ofertaTitulo: string;
  fechaPostulacion: string;
  estado: "Pendiente" | "En Revisión" | "Aprobado" | "Rechazado";
  experiencia: string;
  cvUrl?: string;
}

export default function CandidatosPostuladosPage() {
  const [loading, setLoading] = useState(true);
  const [candidatos, setCandidatos] = useState<CandidatoPostuladoDTO[]>([]);
  const { showMessage } = useSnackbar();
  const emailEmpresa = "gezbaez@gmail.com"; // Reemplazar con email real de la empresa

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        setLoading(true);
        const response = await empresaService.getPostulacionesEmpresa(emailEmpresa);
        setCandidatos(response?.data || []);
      } catch {
        showMessage("Error al cargar candidatos", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatos();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "default";
      case "En Revisión":
        return "warning";
      case "Aprobado":
        return "success";
      case "Rechazado":
        return "error";
      default:
        return "default";
    }
  };

  const handleVerCV = (candidato: CandidatoPostulado) => {
    if (candidato.cvUrl) {
      window.open(candidato.cvUrl, "_blank");
    } else {
      showMessage("Este candidato no tiene CV disponible", SnackbarType.Warning);
    }
  };

  const handleAprobar = async (candidato: CandidatoPostulado) => {
    try {
      await postulanteService.actualizarEstado(candidato.id, "Aprobado");
      showMessage(`Candidato ${candidato.nombre} aprobado`, SnackbarType.Success);
      setCandidatos((prev) =>
        prev.map((c) =>
          c.id === candidato.id ? { ...c, estado: "Aprobado" } : c
        )
      );
    } catch {
      showMessage("Error al aprobar candidato", SnackbarType.Error);
    }
  };

  const handleRechazar = async (candidato: CandidatoPostulado) => {
    try {
      await postulanteService.actualizarEstado(candidato.id, "Rechazado");
      showMessage(`Candidato ${candidato.nombre} rechazado`, SnackbarType.Warning);
      setCandidatos((prev) =>
        prev.map((c) =>
          c.id === candidato.id ? { ...c, estado: "Rechazado" } : c
        )
      );
    } catch {
      showMessage("Error al rechazar candidato", SnackbarType.Error);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  return (
    <>
      <Titulo
        titulo="Candidatos Postulados"
        subtitulo="Revisa las postulaciones recibidas para tus ofertas"
      />

      <Box mt={4}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          {candidatos.length === 0
            ? "No tienes candidatos postulados"
            : `${candidatos.length} candidato${
                candidatos.length !== 1 ? "s" : ""
              } postulado${candidatos.length !== 1 ? "s" : ""}`}
        </Typography>

        {candidatos.length > 0 ? (
          <Stack spacing={2}>
            {candidatos.map((candidato) => (
              <Card key={candidato.id} variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {candidato.nombre.split(" ").map((n) => n[0]).join("")}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {candidato.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📧 {candidato.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🎓 {candidato.carrera} • 💼 {candidato.experiencia} de experiencia
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip label={candidato.ofertaTitulo} size="small" variant="outlined" />
                        <Chip
                          label={candidato.estado}
                          size="small"
                          color={getEstadoColor(candidato.estado) as any}
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleVerCV(candidato)}
                    >
                      Ver CV
                    </Button>

                    {candidato.estado === "Pendiente" || candidato.estado === "En Revisión" ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleAprobar(candidato)}
                          color="success"
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleRechazar(candidato)}
                          color="error"
                        >
                          Rechazar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          showMessage(
                            `Ver detalles de ${candidato.nombre}`,
                            SnackbarType.Info
                          )
                        }
                      >
                        Ver Detalles
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState mensaje="No tienes candidatos postulados aún. Las postulaciones aparecerán aquí cuando los estudiantes se postulen a tus ofertas." />
        )}
      </Box>
    </>
  );
}
