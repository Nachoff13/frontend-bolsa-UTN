"use client";

import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import CandidatoCard from "./CandidatoCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";

interface CandidatosPostuladosProps {
  postulaciones: PostulacionDTO[];
  loading: boolean;
}

export default function CandidatosPostulados({
  postulaciones = [],
  loading,
}: CandidatosPostuladosProps) {
  if (loading) return <SkeletonLoader quantity={3} />;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">
            Candidatos
          </h3>
          <p className="text-sm text-neutral-500">
            Estado de las aplicaciones
          </p>
        </div>
      </div>

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
              onVer={() => console.log("Ver detalle:", p)}
              onCambiarEstado={() => console.log("Cambiar estado:", p)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
