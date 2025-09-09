"use client";
//use client para que se renderice en el cliente y no en el servidor, esto se usa cuando se usan hooks o estados

//#region IMPORTACIOENS REACT
import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { useMemo } from "react";

//#endregion

//#region IMPORTACIONES COMPONENTES PROPIOS
import Titulo from "@/components/shared/Titulo";
import FilterSearch from "@/components/shared/FilterSearch";
import CardGenerica from "@/components/shared/CardGenerica";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";

//#endregion

//#region IMPORTACIONES SERVICIOS Y TIPOS
//Servicio para llamadas a la API
import { postulanteService } from "@/services/postulante.service";

//#region Tipos y constantes
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import CardFiltros from "@/components/shared/CardFiltro";
import { ResponseError } from "@/types/Generics/responseError";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import { GrupoFiltroID } from "@/types/constants";
import { OpcionFiltro } from "@/types/dto/filter/opcionFiltroDTO";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

//#endregion

//#region LOGICA DE LA PAGINA
export default function EstudiantePostulacionesPage() {
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);
  const { showMessage } = useSnackbar();

  //#region FILTROS
  const [tipoContratos, setTipoContratos] = useState<OpcionFiltro[]>([]);
  const [modalidades, setModalidades] = useState<OpcionFiltro[]>([]);
  const [carreras, setCarreras] = useState<OpcionFiltro[]>([]);

  const [modalidadesSeleccionadas, setModalidadesSeleccionadas] = useState<
    string[]
  >([]);
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>(
    []
  );
  const [tiposContratoSeleccionados, setTiposContratoSeleccionados] = useState<
    string[]
  >([]);

  const filtrosAPI = [
    {
      //le pongo id porque necesito identificar el grupo y para que no rompa
      id: GrupoFiltroID.Modalidad,
      titulo: "Modalidad",
      opciones: modalidades.map((mod) => ({
        codigo: mod.codigo,
        descripcion: mod.descripcion,
      })),
    },
    {
      id: GrupoFiltroID.Carrera,
      titulo: "Carrera",
      opciones: carreras.map((carrera) => ({
        codigo: carrera.codigo,
        descripcion: carrera.descripcion,
      })),
    },
    {
      id: GrupoFiltroID.TipoContrato,
      titulo: "Tipo de Contrato",
      opciones: tipoContratos.map((tipoContrato) => ({
        codigo: tipoContrato.codigo,
        descripcion: tipoContrato.descripcion,
      })),
    },
  ];

    //Grupos filtros guarda el valor de los grupos y los seleccionados
  const gruposFiltros: GrupoFiltro[] = filtrosAPI.map((grupo) => {
    let valoresSeleccionados: string[] = [];

    switch (grupo.id) {
      case GrupoFiltroID.Modalidad:
        valoresSeleccionados = modalidadesSeleccionadas;
        break;
      case GrupoFiltroID.Carrera:
        valoresSeleccionados = carrerasSeleccionadas;
        break;
      case GrupoFiltroID.TipoContrato:
        valoresSeleccionados = tiposContratoSeleccionados;
        break;
    }

    return {
      ...grupo,
      valoresSeleccionados,
    };
  });

    //el useMemo memoriza el valor de los filtros para no recalcularlos en cada render
  const filtros: FiltrosBusquedaDTO = useMemo(() => {
    const f: FiltrosBusquedaDTO = {};

    if (modalidadesSeleccionadas.length > 0)
      f.modalidades = modalidadesSeleccionadas;

    if (carrerasSeleccionadas.length > 0) f.carreras = carrerasSeleccionadas;

    if (tiposContratoSeleccionados.length > 0)
      f.tiposContrato = tiposContratoSeleccionados;

    return f;
  }, [
    modalidadesSeleccionadas,
    carrerasSeleccionadas,
    tiposContratoSeleccionados,
  ]);

    useEffect(() => {
      cargarDatos();
    }, []);
  
    const cargarDatos = async () => {
      try {
        setLoading(true);
  
        const [tipos, modos, carreras] = await Promise.all([
          postulanteService.getTipoContrato(),
          postulanteService.getModalidad(),
          postulanteService.getCarreras(),
        ]);
  
        setTipoContratos(tipos);
        setModalidades(modos);
        setCarreras(carreras);
      } catch (e) {
        const err = e as ResponseError;
        showMessage(err.message, SnackbarType.Error, {
          size: SnackbarSize.Medium,
          position: SnackbarPosition.BottomCenter,
        });
      } finally {
        setLoading(false);
      }
    };


      const handleSeleccionFiltro = (idGrupo: string, nuevos: string[]) => {
        switch (idGrupo) {
          case GrupoFiltroID.Modalidad:
            setModalidadesSeleccionadas(nuevos);
            break;
          case GrupoFiltroID.Carrera:
            setCarrerasSeleccionadas(nuevos);
            break;
          case GrupoFiltroID.TipoContrato:
            setTiposContratoSeleccionados(nuevos);
            break;
        }
    
        console.log("Filtrar por", { idGrupo, nuevos });
      };


  //#endregion

  //#endregion

  //#region DATOS DE LA API EN VARIABLES
  // Busqueda de datos desde la API
  useEffect(() => {
    buscarPostulaciones();
  }, []);
  //#endregion

  const buscarPostulaciones = async () => {
    try {
      setLoading(true);

      const postulaciones = await postulanteService.getPostulaciones();
      setPostulaciones(postulaciones);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  //#endregion

  //#region RENDERIZADO DE LA PAGINA
  return (
    <>
      <Titulo
        titulo="Mis postulaciones"
        subtitulo="Seguimiento del estado de tus aplicaciones laborales"
      />

      <Box display="flex" gap={3} mt={4}>
        <Box flex={1} maxWidth={300}>
          <CardFiltros
            grupos={gruposFiltros}
            onSeleccionCambio={handleSeleccionFiltro}
          />
        </Box>
        {postulaciones.length > 0 ? (
          <Box flex={3}>
            <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
              <Titulo
                titulo=""
                subtitulo={`${
                  postulaciones.length === 1
                    ? "1 postulación encontrada"
                    : `${postulaciones.length} postulaciones encontradas`
                }`}
                variantSubtitulo="subtitle1"
              />
              {postulaciones.map((postulacion) => (
                <CardGenerica
                  key={postulacion.id}
                  titulo={postulacion.tituloOferta}
                  subtitulo={postulacion.nombreEmpresa}
                  descripcion={postulacion.descripcionOferta}
                  chips={[
                    { label: postulacion.estadoPostulacion, color: "primary" },
                    {
                      label: postulacion.descripcionModalidad,
                      color: "secondary",
                    },
                    {
                      label: postulacion.descripcionTipoContrato,
                      color: "info",
                    },
                  ]}
                  infoExtra={[
                    {
                      icon: <></>,
                      texto: `Observación: ${postulacion.observacion}`,
                    },
                    {
                      icon: <></>,
                      texto: `Carta: ${postulacion.cartaPresentacion}`,
                    },
                  ]}
                  onAccion1={() => console.log("Ver detalle", postulacion.id)}
                  textoAccion1="Ver detalle"
                />
              ))}
            </Card>
          </Box>
        ) : (
          <Box flex={3}>
            <EmptyState mensaje="No hay postulaciones disponibles" />
          </Box>
        )}
      </Box>
    </>
  );
  //#endregion
}

//#endregion
