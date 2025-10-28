"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CandidatoCard from "./CandidatoCard";
import DetalleCandidatoModal from "@/components/shared/DetalleCandidatoModal";

interface CandidatosPostuladosProps {
  postulaciones: PostulacionDTO[];
  loading: boolean;
}

export default function CandidatosPostulados({
  postulaciones,
  loading,
}: CandidatosPostuladosProps) {
  const [selectedPostulacion, setSelectedPostulacion] = useState<PostulacionDTO | null>(null);
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

  if (loading) return <p>Cargando candidatos...</p>;

  

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold">Candidatos postulados</h3>

      {postulaciones.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No hay postulaciones recibidas aún.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {postulaciones.map((p) => (
            <CandidatoCard
              key={p.id}
              postulacion={p}
              onVer={handleVer}
              onCambiarEstado={(post: any) =>
                console.log("Cambiar estado:", post)
              }
            />
          ))}
        </div>
      )}

      {/*  Modal Detalle del Candidato */}
      {selectedPostulacion && (
        <DetalleCandidatoModal
          open={openModal}
          onClose={handleCloseModal}
          postulacion={selectedPostulacion}
        />
      )}
    </section>
  );
}
