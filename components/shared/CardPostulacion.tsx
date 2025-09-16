import CardGenerica from "@/components/shared/CardGenerica";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";

export function PostulacionCard({ postulacion }: { postulacion: PostulacionDTO }) {
  return (
    <CardGenerica
      titulo={postulacion.tituloOferta}
      subtitulo={postulacion.nombreEmpresa}
      chips={[
        {
          label: postulacion.estadoPostulacion,
          color:
            postulacion.estadoPostulacion === "En revisión"
              ? "info"
              : postulacion.estadoPostulacion === "Entrevista"
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
          texto: postulacion.fechaPostulacion,
        },
      ]}
      onAccion1={() => console.log("Ver estado", postulacion.id)}
      textoAccion1="Ver estado"
    />
  );
}
