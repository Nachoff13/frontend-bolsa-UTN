// app/candidato/dashboard/page.tsx
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/shared/StatCard";
import RecentOffers from "@/components/shared/RecentOffers";
import MyApplications from "@/components/shared/MyApplications";
import { candidatoService } from "@/services/estudiante.service";
import { empresaService } from "@/services/empresa.service"; // tu ejemplo
import type { ApplicationCardDto } from "@/types/dto/postulacionDTO";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";

// TODO: reemplazar por tu proveedor real (cookies/session/JWT)
async function getCurrentStudentId(): Promise<number> {
  // e.g. leer de cookies/headers o llamar a /me
  return 123;
}

function parseISO(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function isWithinLastMonth(d?: string) {
  const date = parseISO(d);
  if (!date) return false;
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  return date >= thirtyDaysAgo && date <= now;
}

export default async function DashboardPage() {
  const idEstudiante = await getCurrentStudentId();

  // Defaults
  let postulaciones: ApplicationCardDto[] = [];
  let postulacionesMes = 0;
  let publicaciones: OfertaDTO[] = [];

  // Cargas SSR (livianas, solo para las métricas)
  try {
    postulaciones = await candidatoService.getPostulaciones(idEstudiante);
  } catch {
    postulaciones = [];
  }
  try {
    postulacionesMes = await candidatoService.getPostulacionesUltimoMes(idEstudiante);
  } catch {
    postulacionesMes = 0;
  }
  try {
    const res = await empresaService.getPublicacionesEmpleo();
    publicaciones = res?.data ?? res ?? [];
  } catch {
    publicaciones = [];
  }

  // Métricas
  const postulacionesActivas = postulaciones.filter(
    (p) => p.estado !== "Rechazada"
  ).length;

  // “Publicaciones del último mes” (card arriba)
  const publicacionesUltimoMes = publicaciones.filter((o) =>
    isWithinLastMonth(o.fechaInicio)
  ).length;

  // Si algún día querés traer el % perfil desde API, reemplazá esto
  const perfilCompletado = 0;

  return (
    <AppLayout title="Dashboard del Candidato">
      <div className="mb-4 text-sm text-neutral-600">
        Bienvenido al portal de empleos de la UTN FRLP
      </div>

      {/* Métricas superiores */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard
          label="Postulaciones activas"
          value={postulacionesActivas}
          subtitle="en proceso de revisión"
        />
        <StatCard
          label="Postulaciones este mes"
          value={postulacionesMes}
          subtitle="últimos 30 días"
        />
        <StatCard
          label="Publicaciones del último mes"
          value={publicacionesUltimoMes}
          subtitle="ofertas nuevas"
        />
        <StatCard
          label="Perfil completado"
          value={`${perfilCompletado}%`}
        />
      </div>

      {/* Listas principales */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Publicaciones de empleo recientes (CSR) */}
        <RecentOffers />

        {/* Mis postulaciones (CSR) */}
        <MyApplications />
      </div>
    </AppLayout>
  );
}
