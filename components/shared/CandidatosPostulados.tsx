"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CandidatoCard from "./CandidatoCard";
import DetalleCandidatoModal from "@/components/shared/DetalleCandidatoModal";
import { Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmptyState from "./EmptyState";

interface CandidatosPostuladosProps {
  postulaciones: PostulacionDTO[];
  loading: boolean;
}

export default function CandidatosPostulados({
  postulaciones,
  loading,
}: CandidatosPostuladosProps) {
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<PostulacionDTO | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleVer = (post: PostulacionDTO) => {
    setSelectedPostulacion(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPostulacion(null);
    setOpenModal(false);
  };

  const router = useRouter();
  const theme = useTheme();


  if (loading)
    return (
      <Typography variant="body2" color="text.secondary">
        Cargando candidatos...
      </Typography>
    );

  return (
    <section
      style={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
      }}
      className="h-full flex flex-col"
    >
      {/* 🧭 Header con título y botón */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Candidatos postulados
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/empresa/candidatos-postulados")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
          }}
        >
          Ver Postulaciones
        </Button>
      </Box>

      {/* 📋 Lista de candidatos */}
      {postulaciones.length === 0 ? (
        <EmptyState
          mensaje="Aún no has recibido postulaciones para tus ofertas."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {postulaciones.slice(0, 4).map(
            (
              p // 👈 limita a 4 elementos
            ) => (
              <CandidatoCard key={p.id} postulacion={p} onVer={handleVer} />
            )
          )}
        </div>
      )}
    </section>
  );
}
