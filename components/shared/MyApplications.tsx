"use client";

import React, { useEffect, useMemo, useState } from "react";
import { candidatoService as candidatoService } from "@/services/estudiante.service";
import type { ApplicationCardDto as PostulacionDTO } from "@/types/dto/postulacionDTO";
import SkeletonLoader from "./SkeletonLoader";
import EmptyState from "./EmptyState";
import {PostulacionCard} from "./CardPostulacion";
import {useAuth} from "@/hooks/useAuth";

type Props = {
  studentId?: number | string; // opcional: si no viene, lo tomo del auth
  limit?: number;
};

export default function MyApplications({ studentId, limit = 5 }: Props) {
  const { user } = useAuth();
  const id = useMemo(
    () => Number(studentId ?? user?.id ?? 1),
    [studentId, user]
    );

  const [items, setItems] = useState<PostulacionDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await candidatoService.getPostulaciones(id);
        const data = res ?? []; // 👈 sin .data
        if (mounted) setItems(limit ? data.slice(0, limit) : data);
        } catch (e: any) {
        if (mounted) {
            setError("No se pudieron cargar tus postulaciones.");
            setItems([]);
        }
    }

    })();
    return () => {
      mounted = false;
    };
  }, [id, limit]);
  
    // Loading
    if (!items) return <SkeletonLoader quantity={3} variant="rectangular" height={86} />;

    // Empty
    if (error || items.length === 0) {
    return <EmptyState mensaje="Aún no realizaste postulaciones." minHeight="auto" />;
    }
  return (
    <div className="flex flex-col gap-2">
      {items.map((p) => (
        <PostulacionCard key={p.idPostulacion} postulacion={p} />
      ))}
    </div>
  );
}
