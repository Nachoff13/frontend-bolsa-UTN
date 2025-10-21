import CardGenerica from "@/components/shared/CardGenerica";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function OfertaCard({ oferta }: { oferta: OfertaDTO }) {
  return (
    <CardGenerica
      titulo={oferta.titulo}
      subtitulo={oferta.nombreEmpresa}
      descripcion={oferta.descripcion}
      chips={[
        { label: oferta.modalidad, color: "primary" },
        { label: oferta.tipoContrato, color: "secondary" },
      ]}
      infoExtra={[
        { icon: <LocationOnIcon fontSize="small" />, texto: `${oferta.nombreLocalidad ?? ""}` }, // falta agregar provbincia
        { icon: <WorkOutlineIcon fontSize="small" />, texto: `Desde: ${oferta.fechaInicio}` },
      ]}
      onAccion2={() => console.log("Ver detalles de la oferta", oferta.id)}
      textoAccion2="Ver detalles"
    />
  );
}
