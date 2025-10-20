import CardGenerica from "@/components/shared/CardGenerica";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

interface Props {
  ofertas: OfertaDTO[];
  loading: boolean;
}

// 🕒 Función auxiliar para calcular tiempo transcurrido
function calcularTiempoTranscurrido(fechaInicio: string | undefined): string {
  if (!fechaInicio) return "-";

  const fecha = new Date(fechaInicio);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 1) return "hoy";
  if (diffDias === 1) return "hace 1 día";
  if (diffDias < 7) return `hace ${diffDias} días`;
  const semanas = Math.floor(diffDias / 7);
  return semanas === 1 ? "hace 1 semana" : `hace ${semanas} semanas`;
}

export default function PublicacionesEmpresa({ ofertas, loading }: Props) {
  if (loading) return <p>Cargando publicaciones...</p>;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold">
        Publicaciones de empleo recientes
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        Revisá el estado de tus publicaciones
      </p>

      {ofertas.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No hay publicaciones registradas todavía.
        </p>
      ) : (
        ofertas.map((oferta) => (
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
                icon: <SchoolIcon fontSize="small" />,
                texto: oferta.nombreCarrera ?? "Carrera no especificada",
              },
              {
                icon: <GroupIcon fontSize="small" />,
                texto: `${oferta.cantidadPostulantes} postulante/s`,
              },
              {
                icon: <AccessTimeIcon fontSize="small" />,
                texto: calcularTiempoTranscurrido(oferta.fechaInicio),
              },
              {
                icon: <CalendarTodayIcon fontSize="small" />,
                texto: `Inicio ${oferta.fechaInicio ?? "-"}`,
              },
              {
                icon: <EventIcon fontSize="small" />,
                texto: `Fin ${oferta.fechaFin ?? "-"}`,
              },
            ]}
            textoAccion1="Ver detalles"
            onAccion1={() =>
              console.log("Ver detalles de:", oferta.titulo)
            }
          />
        ))
      )}
    </section>
  );
}
