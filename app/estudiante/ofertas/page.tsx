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
import { empresaService } from "@/services/empresa.service";
import { postulanteService } from "@/services/postulacion.service";

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
export default function EstudianteOfertasPage() {
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbar();
  //#endregion

  //#region DATOS DE LA API EN VARIABLES
  // Busqueda de datos desde la API
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [tipoContratos, setTipoContratos] = useState<OpcionFiltro[]>([]);
  const [modalidades, setModalidades] = useState<OpcionFiltro[]>([]);
  const [carreras, setCarreras] = useState<OpcionFiltro[]>([]);

  //#endregion

  //#region VARIABLES CARD FILTRO
  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [inputBusquedaFinal, setInputBusquedaFinal] = useState("");

  const [mostrarBotonAccion, setMostrarBotonAccion] = useState(false);

  //#region para setear los filtros seleccionados
  const [modalidadesSeleccionadas, setModalidadesSeleccionadas] = useState<
    string[]
  >([]);
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>(
    []
  );
  const [tiposContratoSeleccionados, setTiposContratoSeleccionados] = useState<
    string[]
  >([]);

  //#endregion

  //#region ASIGNACION DE VALORES A GRUPOS DE FILTROS
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

    if (inputBusquedaFinal.trim()) f.input = inputBusquedaFinal.trim();
    return f;
  }, [
    modalidadesSeleccionadas,
    carrerasSeleccionadas,
    tiposContratoSeleccionados,
    inputBusquedaFinal,
  ]);

  //#endregion

  //#region CARGA INICIAL DE LA PAGINA (useEffect)
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [tipos, modos, carreras] = await Promise.all([
        empresaService.getTipoContrato(),
        empresaService.getModalidad(),
        empresaService.getCarreras(),
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

  //uso otro useEffect para cargar las ofertas cuando cambian los filtros
  useEffect(() => {
    buscarOfertas();
  }, [filtros]);

  const buscarOfertas = async () => {
    try {
      setLoading(true);

      const nuevasOfertas : OfertaDTO[] = await empresaService.getPublicacionesEmpleo(
        filtros
      );
      setOfertas(nuevasOfertas);
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

  useEffect(() => {
    if (busquedaInputFiltro.trim() === "") {
      setInputBusquedaFinal(""); // dispara búsqueda sin input
    }
  }, [busquedaInputFiltro]);
  //#endregion

  //#region Renderizado de carga hasta obtener datos
  if (loading) return <LoadingModal open={loading} />;

  //#endregion

  //#region EVENTO CAMBIO DE FILTROS
  const handleBuscar = () => {
    setInputBusquedaFinal(busquedaInputFiltro);
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
    } catch (e) {
      const error = e as ResponseError;
      showMessage(error.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    }
  }

  //#endregion

  //#region RENDERIZADO DE LA PAGINA
  return (
    <>
      <Titulo
        titulo="Ofertas Laborales"
        subtitulo="Encontrá tu próxima oportunidad profesional"
      />

      <FilterSearch
        titulo="Buscar ofertas"
        subtitulo="Encontrá tu próxima oportunidad profesional"
        placeholder="Buscar por título, empresa, carrera…"
        valor={busquedaInputFiltro}
        onChange={(e) => setBusquedaInputFiltro(e.target.value)}
        onAccion1={handleBuscar} //
        tituloBoton2="Limpiar"
        onAccion2={() => {
          setBusquedaInputFiltro("");
          setInputBusquedaFinal(""); // esto hace que se dispare el useEffect
          setModalidadesSeleccionadas([]);
          setCarrerasSeleccionadas([]);
          setTiposContratoSeleccionados([]);
        }}
      />

      <Box display="flex" gap={3} mt={4}>
        <Box flex={1} maxWidth={300}>
          <CardFiltros
            grupos={gruposFiltros}
            onSeleccionCambio={handleSeleccionFiltro}
          />
        </Box>
        {ofertas.length > 0 ? (
          <Box flex={3}>
            <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
              <Titulo
                titulo="Publicaciones de empleo recientes"
                subtitulo="Nuevas oportunidades laborales"
                variantTitulo="h5"
                variantSubtitulo="body2"
              />
              {ofertas.map((oferta) => (
                <CardGenerica
                  key={oferta.id}
                  titulo={oferta.titulo}
                  subtitulo={`🏢 ${oferta.nombreEmpresa}`}
                  descripcion={oferta.descripcion}
                  chips={[
                    { label: oferta.nombreEmpresa, color: "success" },
                    { label: oferta.modalidad, color: "secondary" },
                    { label: oferta.tipoContrato, color: "info" },
                  ]}
                  infoExtra={[
                    {
                      icon: <LocationOnIcon fontSize="small" />,
                      texto: oferta.nombreLocalidad,
                    },
                    {
                      icon: <CalendarTodayIcon fontSize="small" />,
                      texto: `Publicado el ${oferta.fechaInicio}`,
                    },
                    {
                      icon: <EventIcon fontSize="small" />,
                      texto: `Cierra el ${oferta.fechaFin}`,
                    },
                  ]}
                  onAccion1={() => console.log("Ver detalle", oferta.id)}
                  textoAccion1="Ver detalles"
                  onAccion2={() => onClickPostularse(oferta.id)}
                  textoAccion2="Postularme"
                />
              ))}
            </Card>
          </Box>
        ) : (
          <Box flex={3}>
            <EmptyState mensaje="No hay ofertas disponibles" />
          </Box>
        )}
      </Box>
    </>
  );
  //#endregion
}

//#endregion
