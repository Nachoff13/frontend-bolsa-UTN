// app/estudiante/dashboard/page.tsx
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/shared/StatCard";
import RecentOffers from "@/components/shared/RecentOffers";
import MyApplications from "@/components/shared/MyApplications";

import { empresaService } from "@/services/empresa.service";
import { candidatoService } from "@/services/estudiante.service";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import type { ApplicationCardDto } from "@/types/dto/postulacionDTO";

// ⚠️ Reemplazar por el id real desde sesión/auth
const ID_ESTUDIANTE = 1;

// Helpers
function parseISO(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}
function isWithinLast30Days(d?: string) {
  const date = parseISO(d);
  if (!date) return false;
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 30);
  return date >= from && date <= now;
}

export default async function DashboardPage() {
  // Defaults
  let postulaciones: ApplicationCardDto[] = [];
  let postulacionesMes = 0;
  let publicaciones: OfertaDTO[] = [];

  // SSR: cargar métricas
  try {
    postulaciones = await candidatoService.getPostulaciones(ID_ESTUDIANTE);
  } catch {}
  try {
    postulacionesMes = (await candidatoService.getPostulacionesRecientes(ID_ESTUDIANTE)).length;
  } catch {}
  try {
    publicaciones = await empresaService.getPublicacionesEmpleo();
  } catch {}

  // Métricas
  const postulacionesActivas = postulaciones.filter(
    (p) => p.estado !== "Rechazada"
  ).length;

  const publicacionesUltimoMes = publicaciones.filter((o) =>
    isWithinLast30Days(o.fechaInicio)
  ).length;

  const perfilCompletado = 85; // placeholder, reemplazar por API real
  const entrevistasMes = postulaciones.filter(
    (p) => p.estado === "Entrevista" && isWithinLast30Days(p.fechaPostulacion)
  ).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Dashboard del Candidato</h1>
        <p className="text-sm text-neutral-600">
          Bienvenido al portal de empleos de la UTN FRLP
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard
          label="Postulaciones activas"
          value={postulacionesActivas}
          subtitle="esperando a revisión"
        />
        <StatCard
          label="Ofertas nuevas"
          value={publicacionesUltimoMes}
          subtitle="este mes"
        />
        <StatCard label="Perfil completado" value={`${perfilCompletado}%`} />
        <StatCard
          label="Entrevistas"
          value={entrevistasMes}
          subtitle="este mes"
        />
      </div>

      {/* Columnas principales */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ofertas recientes */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">
            Publicaciones de empleo recientes
          </h3>
          <RecentOffers limit={3} />
        </section>

        {/* Mis postulaciones */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">Mis postulaciones</h3>
          <MyApplications studentId={ID_ESTUDIANTE} />
        </section>
      </div>
    </AppLayout>
  );
}
