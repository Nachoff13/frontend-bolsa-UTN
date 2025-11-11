"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  Stack,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

import StatCard from "@/components/shared/StatCard";
import { Briefcase, FilePlus2, Percent, Search } from "lucide-react";

import { empresaService } from "@/services/empresa.service";
import { candidatoService } from "@/services/estudiante.service";
import { postulanteService } from "@/services/postulacion.service";

import { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

import { useSnackbar } from "@/components/providers/snackbar";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import DetalleModal from "@/components/shared/DetalleModal";
import EmptyState from "@/components/shared/EmptyState";
import LoadingModal from "@/components/shared/LoadingModal";
import Titulo from "@/components/shared/Titulo";
import PublicacionesCandidato from "@/components/shared/PuclicacionesCandidato";
import MisPostulacionesCandidato from "@/components/shared/MisPostulacionCandidato";
import { debug } from "console";

export default function DashboardPage() {
  const [postulacionesActivas, setPostulacionesActivas] = useState(0);
  const [ofertasNuevas, setOfertasNuevas] = useState(0);
  const [perfilCompletado, setPerfilCompletado] = useState(0);
  const [entrevistasMes, setEntrevistasMes] = useState(0);

  const [publicaciones, setPublicaciones] = useState<OfertaRecienteDTO>({
    ofertas: [],
    cantidadOfertas: 0,
  });
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);

  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] =
    useState<OfertaDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [porcentajePerfil, setPorcentajePerfil] = useState<number>(0);

  const { showMessage } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pubs = await empresaService.getPublicaciones();
      setPublicaciones(pubs);
      const posts = await candidatoService.getPostulaciones();
      setPostulaciones(posts);

      setPostulacionesActivas(
        posts.filter((p) => p.estadoPostulacion !== "Rechazada").length
      );
      setOfertasNuevas(pubs.cantidadOfertas);
      setPerfilCompletado(85);
      setEntrevistasMes(
        posts.filter((p) => p.estadoPostulacion === "En revisión").length
      );
    } catch (err) {
      console.error(err);
      showMessage("Error al cargar datos del dashboard", SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPorcentaje = async () => {
      try {
        const porcentaje = await candidatoService.getPorcentaje();
        setPorcentajePerfil(porcentaje);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPorcentaje();
  }, []);

  if (loading) return <LoadingModal open={true} />;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        {/* 🔹 Métricas principales */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
          <StatCard
            label="Postulaciones activas"
            value={postulacionesActivas}
            subtitle="Vigentes"
            icono={<Briefcase size={24} strokeWidth={1.8} color="#6b7280" />}
          />
          <StatCard
            label="Ofertas nuevas"
            value={ofertasNuevas}
            subtitle="Este mes"
            icono={<FilePlus2 size={24} strokeWidth={1.8} color="#6b7280" />}
          />
          <StatCard
            label="Perfil completado"
            value={`${porcentajePerfil}%`}
            subtitle="Avance del perfil"
            icono={<Percent size={24} strokeWidth={1.8} color="#6b7280" />}
          />
          <StatCard
            label="En revisión"
            value={entrevistasMes}
            subtitle="Postulaciones"
            icono={<Search size={24} strokeWidth={1.8} color="#6b7280" />}
          />
        </div>

        {/* 🔹 Publicaciones y postulaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* 🧾 Publicaciones */}
          <div className="flex flex-col h-full">
           <PublicacionesCandidato
              ofertas={publicaciones.ofertas}
              loading={loading}
              onPostulacionExitosa={fetchData}
              postulaciones={postulaciones}
            />
          </div>
          <div className="flex flex-col h-full">
            <MisPostulacionesCandidato postulaciones={postulaciones} loading={loading} />
          </div>
        </div>


        {/* 🪟 Modal Detalle */}
        {ofertaSeleccionada && (
          <DetalleModal
            open={openDetalle}
            onClose={() => setOpenDetalle(false)}
            title={ofertaSeleccionada.titulo}
            fields={[
              { label: "Empresa", value: ofertaSeleccionada.nombreEmpresa },
              { label: "Carrera", value: ofertaSeleccionada.nombreCarrera },
              { label: "Modalidad", value: ofertaSeleccionada.modalidad },
              { label: "Tipo de contrato", value: ofertaSeleccionada.tipoContrato },
              { label: "Localidad", value: ofertaSeleccionada.nombreLocalidad },
              { label: "Descripción", value: ofertaSeleccionada.descripcion },
              { 
                label: "Cupos disponibles", 
                value: `${ofertaSeleccionada.cantidadPostulantes || 0}/${ofertaSeleccionada.cupos || 1}` 
              },
            ]}
            chips={[
              {
                label: `${ofertaSeleccionada.cantidadPostulantes ?? 0} Postulante/s`,
                color: "info",
              },
            ]}
          />
        )}
      </main>
    </div>
  );

}
