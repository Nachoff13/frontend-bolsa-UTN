"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/shared/StatCard";

import { empresaService } from "@/services/empresa.service";

import { OfertaDTO } from "@/types/dto/ofertaDTO";

import { useAuth } from "@/components/providers/AuthProvider";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

import PublicacionesEmpresa from "@/components/shared/PublicacionEmpresa";
import CandidatosPostulados from "@/components/shared/CandidatosPostulados"; 
import { set } from "zod";

import { Briefcase, Users, Check, Percent } from "lucide-react";
import { People } from "@mui/icons-material";

export default function DashboardEmpresaPage() {
  const { user } = useAuth(); // 👈 si el AuthProvider ya te da el usuario logueado
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState<PostulacionDTO | null>(null);
  const [porcentajePerfil, setPorcentajePerfil] = useState<number>(0);

  // Fallback temporal (si no está conectado useAuth)
  const emailEmpresa = user?.email || "gezbaez@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Llamamos a los endpoints del backend
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

  useEffect(() => {
    const fetchPorcentaje = async () => {
      try {
        const porcentaje = await empresaService.getPorcentaje();
        setPorcentajePerfil(porcentaje);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPorcentaje();
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        {/* Encabezado
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard de la empresa</h1>
          <p className="text-sm text-neutral-600">
            Bienvenido al portal de empleos de la UTN FRLP
          </p>
        </div> */}

        {/* Métricas */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-4">
          <StatCard
            label="Ofertas publicadas"
            value={ofertas.length}
            subtitle="Activas"
            icono={<Briefcase size={24} strokeWidth={1.8} color="#6b7280" />} // gris suave
          />
          <StatCard
            label="Postulaciones recibidas"
            value={postulaciones.length}
            subtitle="En total"
            icono={<Users size={24} strokeWidth={1.8} color="#6b7280" />}
          />
          <StatCard
            label="Perfil completado"
            value={`${porcentajePerfil}%`}
            subtitle="Progreso del perfil"
            icono={<Percent size={24} strokeWidth={1.8} color="#6b7280" />}
          />
          <StatCard
            label="Postulaciones aprobadas"
            value={postulaciones.filter((p) => {
              if (!p.fechaPostulacion) return false;
              const fecha = new Date(p.fechaPostulacion);
              const hoy = new Date();
              return (
                p.estadoPostulacion === "Aprobada" &&
                fecha.getMonth() === hoy.getMonth() &&
                fecha.getFullYear() === hoy.getFullYear()
              );
            }).length}
            subtitle="De este mes"
            icono={<Check size={24} strokeWidth={2.2}/>} // tilde verde ✅
          />
        </div>


        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col h-full">
            <PublicacionesEmpresa ofertas={ofertas} loading={loading} />
          </div>
          <div className="flex flex-col h-full">
            <CandidatosPostulados postulaciones={postulaciones} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}