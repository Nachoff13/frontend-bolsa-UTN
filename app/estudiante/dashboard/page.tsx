"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import MyApplications from "@/components/shared/MyApplications";
import CardGenerica from "@/components/shared/CardGenerica";
import DetalleModal from "@/components/shared/DetalleModal";

import { empresaService } from "@/services/empresa.service";
import { candidatoService } from "@/services/estudiante.service";
import { postulanteService } from "@/services/postulacion.service";

import { OfertaRecienteDTO } from "@/types/dto/responses/OfertaRecienteDTO";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";

import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarPosition, SnackbarSize, SnackbarType } from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";

// ⚠️ Reemplazar por el id real desde sesión/auth
const ID_ESTUDIANTE = 1;

export default function DashboardPage() {
  // Estados métricas
  const [postulacionesActivas, setPostulacionesActivas] = useState(0);
  const [ofertasNuevas, setOfertasNuevas] = useState(0);
  const [perfilCompletado, setPerfilCompletado] = useState(0);
  const [entrevistasMes, setEntrevistasMes] = useState(0);

  // Estados listas
  const [publicaciones, setPublicaciones] = useState<OfertaRecienteDTO>({
    ofertas: [],
    cantidadOfertas: 0,
  });
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);

  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);

  // modal detalle
  const [openDetalle, setOpenDetalle] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaDTO | null>(null);
  const handleOpenDetalle = (oferta: OfertaDTO) => {
    setOfertaSeleccionada(oferta);
    setOpenDetalle(true);
  };

  useEffect(() => {
  fetchData();
}, []);

  const fetchData = async () => {
    try {
      // 1) Publicaciones
      const pubs = await empresaService.getPublicaciones(); // <- Promise<OfertaRecienteDTO>
      console.log("Publicaciones cargadas:", pubs);
      setPublicaciones(pubs);

      // 2) Postulaciones
      const posts = await candidatoService.getPostulaciones();
      setPostulaciones(posts);

      // Métricas
      setPostulacionesActivas(posts.filter(p => p.estadoPostulacion !== "Rechazada").length);
      setOfertasNuevas(pubs.cantidadOfertas); // ✅ ya no rompe
      setPerfilCompletado(85);
      setEntrevistasMes(posts.filter(p => p.estadoPostulacion === "En revisión").length);
    } catch (err) {
      console.error("Error cargando dashboard", err);
    }
  };



   async function onClickPostularse(id: number): Promise<void> {
    try {
      const postulacion = new PostulacionDTO();
      postulacion.idPerfilCandidato = 1; //a futuro traer del perfil del usuario logueado
      postulacion.idOferta = id;
      postulacion.cartaPresentacion = "Carta de presentación de prueba";
      postulacion.observacion = "Observación de prueba";

      const response: string = await postulanteService.postularseOferta(
        postulacion
      );
      showMessage(response, SnackbarType.Success, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
      await fetchData();
    } catch (e) {
      const error = e as ResponseError;
      showMessage(error.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    }
  }

  return (
  <div className="flex min-h-screen">
    <main className="flex-1 p-4 md:p-6">
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
          subtitle="sin rechazar"
        />
        <StatCard
          label="Ofertas nuevas"
          value={ofertasNuevas}
          subtitle="este mes"
        />
        <StatCard label="Perfil completado" value={`${perfilCompletado}%`} />
        <StatCard
          label="Postulaciones en Revisión"
          value={entrevistasMes}
          subtitle=""
        />
      </div>

      {/* Columnas principales */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">
            Publicaciones de empleo recientes
          </h3>

          {publicaciones?.ofertas.slice(0, 3).map((oferta) => (
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
              onAccion1={() => handleOpenDetalle(oferta)}
              textoAccion1="Ver detalles"

              onAccion2={() => onClickPostularse(oferta.id)}
              textoAccion2="Postularme"
            />
          ))}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold">Mis postulaciones</h3>
          <MyApplications 
            key={postulaciones.length} 
            studentId={ID_ESTUDIANTE} 
            limit={5} 
          />

        </section>
      </div>
      <DetalleModal
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        title={ofertaSeleccionada?.titulo ?? ""}
        fields={[
          { label: "Empresa", value: ofertaSeleccionada?.nombreEmpresa ?? "-" },
          { label: "Localidad", value: ofertaSeleccionada?.nombreLocalidad ?? "-" },
          { label: "Descripción", value: ofertaSeleccionada?.descripcion ?? "-" },
          { label: "Fecha inicio", value: ofertaSeleccionada?.fechaInicio ?? "-" },
          { label: "Fecha fin", value: ofertaSeleccionada?.fechaFin || "No especificada" },
        ]}
        chips={[
          { label: ofertaSeleccionada?.modalidad ?? "Modalidad", color: "secondary" },
          { label: ofertaSeleccionada?.tipoContrato ?? "Contrato", color: "info" },
        ]}
        actions={
          <Button
            variant="contained"
            onClick={() => ofertaSeleccionada && onClickPostularse(ofertaSeleccionada.id)}
          >
            Postularme
          </Button>
        }
      />
    </main> 
  </div>
);

}
