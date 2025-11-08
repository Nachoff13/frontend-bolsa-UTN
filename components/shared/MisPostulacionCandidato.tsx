"use client";

import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { PostulacionCard } from "@/components/shared/CardPostulacion";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
  postulaciones: PostulacionDTO[];
  loading: boolean;
}

export default function MisPostulacionesCandidato({ postulaciones, loading }: Props) {
  const theme = useTheme();

  if (loading) return <p className="text-neutral-500">Cargando postulaciones...</p>;

  return (
    <section
      style={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
      }}
      className="h-full flex flex-col"
    >
       <h3 className="mb-3 text-base font-semibold text-gray-800">
        Mis postulaciones
      </h3>

      {postulaciones.length === 0 ? (
        <EmptyState mensaje="No tenés postulaciones todavía" />
      ) : (
        <Stack spacing={2}>
          {postulaciones.slice(0, 4).map((p) => (
            <PostulacionCard key={p.id} postulacion={p} />
          ))}
        </Stack>
      )}
    </section>
  );
}
