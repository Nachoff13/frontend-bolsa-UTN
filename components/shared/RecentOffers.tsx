"use client";

import React, { useEffect, useState } from "react";
import { candidatoService } from "@/services/estudiante.service";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import { OfertaCard } from "./CardOferta";
import SkeletonLoader from "./SkeletonLoader";
import EmptyState from "./EmptyState";

type Props = {
  limit?: number; // por si mañana querés cambiarlo; default = 3
};

export default function RecentOffers({ limit = 3 }: Props) {
  const [items, setItems] = useState<OfertaDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await candidatoService.getPublicacionesRecientes(limit);
        const data: OfertaDTO[] = res ?? [];
        if (mounted) setItems(data.slice(0, limit));
      } catch {
        if (mounted) {
          setError("No se pudieron cargar las publicaciones.");
          setItems([]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [limit]);

  // Loading
  if (items === null) {
    return (
      <div className="flex flex-col gap-8">
        <SkeletonLoader quantity={3} variant="rectangular" height={86} />
      </div>
    );
  }

  // Empty / Error
  if (error || items.length === 0) {
    return <EmptyState mensaje="No hay publicaciones recientes" minHeight="auto" />;
  }

  // Listado
  return (
    <div className="flex flex-col gap-2">
      {items.map((o) => (
        <OfertaCard key={o.id} oferta={o} />
      ))}
    </div>
  );
}
