import CardGenerica from "@/components/shared/CardGenerica";
import { ApplicationCardDto } from "@/types/dto/postulacionDTO";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";

export function PostulacionCard({ postulacion }: { postulacion: ApplicationCardDto }) {
  return (
    <CardGenerica
      titulo={postulacion.tituloOferta}
      subtitulo={postulacion.nombreEmpresa}
      chips={[
        {
          label: postulacion.estado,
          color:
            postulacion.estado === "En revisión"
              ? "info"
              : postulacion.estado === "Entrevista"
              ? "success"
              : "error",
        },
      ]}
      infoExtra={[
        {
          icon: <BusinessIcon fontSize="small" />,
          texto: `Oferta #${postulacion.idOferta}`,
        },
        {
          icon: <EventIcon fontSize="small" />,
          texto: postulacion.fechaPostulacionTexto,
        },
      ]}
      onAccion1={() => console.log("Ver estado", postulacion.idPostulacion)}
      textoAccion1="Ver estado"
    />
  );
}
