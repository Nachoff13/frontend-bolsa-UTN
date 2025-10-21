"use client";

import { useEffect, useState } from "react";
import { Box, Card, Typography, Button, Chip, Stack, Avatar } from "@mui/material";
import { Visibility as VisibilityIcon, Download as DownloadIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";
import Titulo from "@/components/shared/Titulo";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";
import { SnackbarType } from "@/types/enums/snackbar";

interface CandidatoPostulado {
  id: number;
  nombre: string;
  email: string;
  carrera: string;
  ofertaTitulo: string;
  fechaPostulacion: string;
  estado: 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
  experiencia: string;
  cvUrl?: string;
}

export default function CandidatosPostuladosPage() {
  const [loading, setLoading] = useState(true);
  const [candidatos, setCandidatos] = useState<CandidatoPostulado[]>([]);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
      // Datos de ejemplo para desarrollo
      setCandidatos([
        {
          id: 1,
          nombre: "Juan Pérez",
          email: "juan.perez@email.com",
          carrera: "Sistemas",
          ofertaTitulo: "Desarrollador Frontend React",
          fechaPostulacion: "2025-01-20",
          estado: "Pendiente",
          experiencia: "2 años",
          cvUrl: "/cv/juan-perez.pdf"
        },
        {
          id: 2,
          nombre: "María González",
          email: "maria.gonzalez@email.com",
          carrera: "Sistemas",
          ofertaTitulo: "Analista de Sistemas Jr",
          fechaPostulacion: "2025-01-18",
          estado: "En Revisión",
          experiencia: "1 año",
          cvUrl: "/cv/maria-gonzalez.pdf"
        },
        {
          id: 3,
          nombre: "Carlos Rodríguez",
          email: "carlos.rodriguez@email.com",
          carrera: "Sistemas",
          ofertaTitulo: "Tester QA Manual",
          fechaPostulacion: "2025-01-15",
          estado: "Aprobado",
          experiencia: "3 años",
          cvUrl: "/cv/carlos-rodriguez.pdf"
        },
        {
          id: 4,
          nombre: "Ana Martínez",
          email: "ana.martinez@email.com",
          carrera: "Sistemas",
          ofertaTitulo: "Desarrollador Frontend React",
          fechaPostulacion: "2025-01-12",
          estado: "Rechazado",
          experiencia: "6 meses",
          cvUrl: "/cv/ana-martinez.pdf"
        }
      ]);
    }, 1000);
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'default';
      case 'En Revisión':
        return 'warning';
      case 'Aprobado':
        return 'success';
      case 'Rechazado':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleVerCV = (candidato: CandidatoPostulado) => {
    showMessage(`Ver CV de ${candidato.nombre}`, SnackbarType.Info);
  };

  const handleAprobar = (candidato: CandidatoPostulado) => {
    showMessage(`Aprobar candidato: ${candidato.nombre}`, SnackbarType.Success);
  };

  const handleRechazar = (candidato: CandidatoPostulado) => {
    showMessage(`Rechazar candidato: ${candidato.nombre}`, SnackbarType.Error);
  };

  if (loading) return <LoadingModal open={loading} />;

  return (
    <>
      <Titulo
        titulo="Candidatos Postulados"
        subtitulo="Revisa las postulaciones recibidas para tus ofertas"
      />

      <Box mt={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            {candidatos.length === 0 
              ? "No tienes candidatos postulados" 
              : `${candidatos.length} candidato${candidatos.length !== 1 ? 's' : ''} postulado${candidatos.length !== 1 ? 's' : ''}`
          }
          </Typography>
        </Box>

        {candidatos.length > 0 ? (
          <Stack spacing={2}>
            {candidatos.map((candidato) => (
              <Card key={candidato.id} variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {candidato.nombre.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {candidato.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📧 {candidato.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        🎓 {candidato.carrera} • 💼 {candidato.experiencia} de experiencia
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={candidato.ofertaTitulo} size="small" variant="outlined" />
                        <Chip 
                          label={candidato.estado} 
                          size="small" 
                          color={getEstadoColor(candidato.estado) as any}
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        📅 Postulado: {new Date(candidato.fechaPostulacion).toLocaleDateString('es-AR')}
                      </Typography>
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
                    {candidato.estado === 'Pendiente' || candidato.estado === 'En Revisión' ? (
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
                        onClick={() => showMessage(`Ver detalles de ${candidato.nombre}`, SnackbarType.Info)}
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
