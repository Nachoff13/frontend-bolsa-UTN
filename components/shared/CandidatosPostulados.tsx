"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CandidatoCard from "./CandidatoCard";
import DetalleCandidatoModal from "@/components/shared/DetalleCandidatoModal";
import { Button } from "@mui/material";

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

  if (loading) return <p className="text-neutral-500">Cargando candidatos...</p>;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
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
