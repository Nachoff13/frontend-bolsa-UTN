"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CandidatoCard from "./CandidatoCard";
import DetalleCandidatoModal from "@/components/shared/DetalleCandidatoModal";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";


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


  if (loading) return <p className="text-neutral-500">Cargando candidatos...</p>;

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
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Candidatos postulados
        </h3>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/empresa/candidatos-postulados")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
            px: 2.5,
          }}
        >
          Ver Postulaciones
        </Button>
      </div>

      {/* 📋 Lista de candidatos */}
     {postulaciones.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No hay postulaciones recibidas aún.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {postulaciones.slice(0, 4).map((p) => (   // 👈 limita a 4 elementos
            <CandidatoCard key={p.id} postulacion={p} onVer={handleVer} />
          ))}
        </div>
      )}
    </section>
  );
}
