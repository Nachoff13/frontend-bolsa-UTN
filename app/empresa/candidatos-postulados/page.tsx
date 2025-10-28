"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import Titulo from "@/components/shared/Titulo";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";
import { SnackbarType } from "@/types/enums/snackbar";
import { empresaService } from "@/services/empresa.service";
import { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";

export default function CandidatosPostuladosPage() {
  const [loading, setLoading] = useState(true);
  const [candidatos, setCandidatos] = useState<PerfilCandidatoDTO[]>([]);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        setLoading(true);
        const response = await empresaService.getCandidatosByPostulaciones();
        setCandidatos(response || []);
      } catch {
        showMessage("Error al cargar candidatos", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, []);

  const handleVerCV = (candidato: PerfilCandidatoDTO) => {
    if (candidato.cv) {
      const byteCharacters = atob(candidato.cv);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      showMessage("Este candidato no tiene CV disponible", SnackbarType.Warning);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  return (
    <>
      <Titulo
        titulo="Candidatos Postulados"
        subtitulo="Revisá los perfiles de los estudiantes que aplicaron a tus ofertas"
      />

      <Box mt={4}>
        {candidatos.length === 0 ? (
          <EmptyState mensaje="No tenés candidatos postulados aún. Cuando los estudiantes se postulen a tus ofertas, aparecerán aquí." />
        ) : (
          <>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {`${candidatos.length} candidato${
                candidatos.length !== 1 ? "s" : ""
              } postulado${candidatos.length !== 1 ? "s" : ""}`}
            </Typography>

            <Stack spacing={2}>
              {candidatos.map((candidato) => (
                <Card
                  key={candidato.id}
                  variant="outlined"
                  sx={{ p: 3, boxShadow: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                      }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {candidato.nombre
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {candidato.nombre || "Sin nombre"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📧 {candidato.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🎓 {candidato.carreraNombre || "Carrera no especificada"}
                        </Typography>
                        {candidato.anioEgreso && (
                          <Typography variant="body2" color="text.secondary">
                            📅 Año de egreso: {candidato.anioEgreso}
                          </Typography>
                        )}
                        {candidato.generoNombre && (
                          <Typography variant="body2" color="text.secondary">
                            ⚧ {candidato.generoNombre}
                          </Typography>
                        )}
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
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </>
  );
}
