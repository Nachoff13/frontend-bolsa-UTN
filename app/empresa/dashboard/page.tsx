"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import CardGenerica from "@/components/shared/CardGenerica";
import DetalleModal from "@/components/shared/DetalleModal";

import { empresaService } from "@/services/empresa.service";

import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarPosition, SnackbarSize, SnackbarType } from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";

import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import EmptyState from "@/components/shared/EmptyState";
import PublicacionesEmpresa from "@/components/shared/PublicacionEmpresa";
import CandidatosPostulados from "@/components/shared/CandidatosPostulados"; 

// ⚠️ Reemplazar cuando se use sesión real


export default function DashboardEmpresaPage() {
  const { user } = useAuth(); // 👈 si el AuthProvider ya te da el usuario logueado
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ Fallback temporal (si no está conectado useAuth)
  const emailEmpresa = user?.email || "gezbaez@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔹 Llamamos a los endpoints del backend
        const [pubs, posts] = await Promise.all([
          empresaService.getPublicacionesEmpresa(emailEmpresa),
          empresaService.getPostulacionesEmpresa(emailEmpresa),
        ]);

        setOfertas(pubs);
        setPostulaciones(posts);
      } catch (error) {
        console.error("Error al cargar dashboard de empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emailEmpresa]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        {/* 🏷️ Encabezado */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard de la empresa</h1>
          <p className="text-sm text-neutral-600">
            Bienvenido al portal de empleos de la UTN FRLP
          </p>
        </div>

        {/* 📊 Métricas */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-4">
          <StatCard
            label="Ofertas publicadas"
            value={ofertas.length}
            subtitle="activas"
          />
          <StatCard
            label="Postulaciones recibidas"
            value={postulaciones.length}
            subtitle="en total"
          />
          <StatCard label="Perfil completado" value="85%" />
          <StatCard label="Entrevistas concretadas" value="3" subtitle="este mes" />
        </div>

        {/* 🧩 Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PublicacionesEmpresa ofertas={ofertas} loading={loading} />
          <CandidatosPostulados postulaciones={postulaciones} loading={loading} />
        </div>
      </main>
    </div>
  );
}