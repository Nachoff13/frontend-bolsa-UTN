"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/shared/StatCard";
import MyApplications from "@/components/shared/MyApplications";
import CardGenerica from "@/components/shared/CardGenerica";

import { empresaService } from "@/services/empresa.service";
import { candidatoService } from "@/services/estudiante.service";
import type { OfertaDTO } from "@/types/dto/ofertaDTO";
import type { PostulacionDTO } from "@/types/dto/postulacionDTO";

import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";

// ⚠️ Reemplazar por el id real desde sesión/auth
const ID_ESTUDIANTE = 1;

export default function DashboardPage() {
  // Estados métricas
  const [postulacionesActivas, setPostulacionesActivas] = useState(0);
  const [ofertasNuevas, setOfertasNuevas] = useState(0);
  const [perfilCompletado, setPerfilCompletado] = useState(0);
  const [entrevistasMes, setEntrevistasMes] = useState(0);

  // Estados listas
  const [publicaciones, setPublicaciones] = useState<OfertaDTO[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Publicaciones
        const pubs = await empresaService.getPublicaciones();
        setPublicaciones(pubs);

        // 2) Postulaciones
        const posts = await candidatoService.getPostulaciones();
        setPostulaciones(posts);

        // Métricas (por ahora con lógica simple)
        setPostulacionesActivas(posts.filter((p) => p.estadoPostulacion !== "Rechazada").length);
        setOfertasNuevas(pubs.length);
        setPerfilCompletado(85); // ⚠️ reemplazar por endpoint real
        setEntrevistasMes(posts.filter((p) => p.estadoPostulacion === "Entrevista").length);
      } catch (err) {
        console.error("Error cargando dashboard", err);
      }
    };

    fetchData();
  }, []);

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
          subtitle="en proceso de revisión"
        />
        <StatCard
          label="Ofertas nuevas"
          value={ofertasNuevas}
          subtitle="este mes"
        />
        <StatCard
          label="Perfil completado"
          value={`${perfilCompletado}%`}
        />
        <StatCard
          label="Entrevistas"
          value={entrevistasMes}
          subtitle="este mes"
        />
      </div>

      {/* Columnas principales */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Izquierda: ofertas recientes */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">
            Publicaciones de empleo recientes
          </h3>

          {publicaciones.slice(0, 3).map((oferta) => (
            <CardGenerica
              key={oferta.id}
              titulo={oferta.titulo}
              subtitulo={`🏢 ${oferta.nombreEmpresa ?? "Empresa"}`}
              descripcion={oferta.descripcion}
              chips={[
                { label: oferta.modalidad ?? "Modalidad", color: "secondary" },
                { label: oferta.tipoContrato ?? "Contrato", color: "info" },
              ]}
              infoExtra={[
                {
                  icon: <LocationOnIcon fontSize="small" />,
                  texto: oferta.nombreLocalidad ?? "Ubicación no especificada",
                },
                {
                  icon: <CalendarTodayIcon fontSize="small" />,
                  texto: `Publicado el ${oferta.fechaInicio ?? "-"}`,
                },
                {
                  icon: <EventIcon fontSize="small" />,
                  texto: `Cierra el ${oferta.fechaFin ?? "-"}`,
                },
              ]}
              onAccion1={() => console.log("Ver detalle", oferta.id)}
              textoAccion1="Ver detalles"
              onAccion2={() => console.log("Postularse", oferta.id)}
              textoAccion2="Postularme"
            />
          ))}
        </section>

        {/* Derecha: mis postulaciones */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">Mis postulaciones</h3>
          <MyApplications studentId={ID_ESTUDIANTE} limit={5} />
        </section>
      </div>
    </AppLayout>
  );
}
