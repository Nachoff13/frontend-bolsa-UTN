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
import ResumenPostulaciones from "@/components/shared/ResumenPostulaciones";

//#endregion

//#region IMPORTACIONES SERVICIOS Y TIPOS
//Servicio para llamadas a la API
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
export default function EstudiantePostulacionesPage() {
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);
  const { showMessage } = useSnackbar();

  //#region DATOS DE LA API EN VARIABLES
  // Estados para manejar todas las postulaciones y las filtradas
  const [todasLasPostulaciones, setTodasLasPostulaciones] = useState<PostulacionDTO[]>([]);
  const [postulacionesFiltradas, setPostulacionesFiltradas] = useState<PostulacionDTO[]>([]);

  //#region FILTROS
  // Estados para filtros de ofertas laborales (se usan en otras pantallas)
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

  // Estados para filtros específicos de postulaciones
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>([]);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);
  const [empresasSeleccionadas, setEmpresasSeleccionadas] = useState<string[]>([]);

  // Opciones de filtros estáticas específicas para postulaciones
  const filtrosPostulaciones = [
    {
      id: GrupoFiltroID.Estado,
      titulo: "Estado",
      opciones: [
        { codigo: "EnRevision", descripcion: "En revisión" },
        { codigo: "Aprobada", descripcion: "Aprobada" },
        { codigo: "Rechazada", descripcion: "Rechazada" },
        { codigo: "Iniciada", descripcion: "Iniciada" },
      ],
    },
    {
      id: GrupoFiltroID.FechaPostulacion,
      titulo: "Fecha de postulación",
      opciones: [
        { codigo: "ultima_semana", descripcion: "Última semana" },
        { codigo: "ultimo_mes", descripcion: "Último mes" },
        { codigo: "ultimos_3_meses", descripcion: "Últimos 3 meses" },
        { codigo: "mas_3_meses", descripcion: "Más de 3 meses" },
      ],
    },
  ];

  // Generar opciones de empresas dinámicamente basadas en todas las postulaciones
  const empresasFiltro = useMemo(() => {
    const empresasUnicas = new Map();
    
    todasLasPostulaciones.forEach(postulacion => {
      if (postulacion.nombreEmpresa && postulacion.nombreEmpresa.trim() !== '') {
        empresasUnicas.set(postulacion.nombreEmpresa, postulacion.nombreEmpresa);
      }
    });

    return Array.from(empresasUnicas.values()).map(empresa => ({
      codigo: empresa.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      descripcion: empresa
    }));
  }, [todasLasPostulaciones]);

  // Solo filtros específicos para postulaciones
  const filtrosAPI = [
    ...filtrosPostulaciones,
    {
      id: GrupoFiltroID.Empresa,
      titulo: "Empresa",
      opciones: empresasFiltro,
    },
  ];

    //Grupos filtros guarda el valor de los grupos y los seleccionados
  const gruposFiltros: GrupoFiltro[] = filtrosAPI.map((grupo) => {
    let valoresSeleccionados: string[] = [];

    switch (grupo.id) {
      case GrupoFiltroID.Estado:
        valoresSeleccionados = estadosSeleccionados;
        break;
      case GrupoFiltroID.FechaPostulacion:
        valoresSeleccionados = fechasSeleccionadas;
        break;
      case GrupoFiltroID.Empresa:
        valoresSeleccionados = empresasSeleccionadas;
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

    // Solo filtros específicos de postulaciones
    if (estadosSeleccionados.length > 0)
      f.estados = estadosSeleccionados;

    if (fechasSeleccionadas.length > 0) 
      f.fechas = fechasSeleccionadas;

    if (empresasSeleccionadas.length > 0) {
      // Convertir códigos de empresas seleccionadas a nombres reales
      const nombresEmpresas = empresasSeleccionadas.map(codigo => {
        const empresa = empresasFiltro.find(e => e.codigo === codigo);
        return empresa ? empresa.descripcion : codigo;
      });
      f.empresas = nombresEmpresas;
    }

    return f;
  }, [
    estadosSeleccionados,
    fechasSeleccionadas,
    empresasSeleccionadas,
    empresasFiltro,
  ]);

  // Calcular estadísticas de postulaciones
  const estadisticasPostulaciones = useMemo(() => {
    const total = todasLasPostulaciones.length;
    const enRevision = todasLasPostulaciones.filter(p => p.estadoPostulacion === 'En revisión').length;
    const aprobadas = todasLasPostulaciones.filter(p => p.estadoPostulacion === 'Aprobada').length;
    const rechazadas = todasLasPostulaciones.filter(p => p.estadoPostulacion === 'Rechazada').length;
    
    return {
      total,
      enRevision,
      aprobadas,
      rechazadas
    };
  }, [todasLasPostulaciones]);

  // Cargar datos de filtros de ofertas laborales (para otras pantallas)
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
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
    }
  };

      const handleSeleccionFiltro = (idGrupo: string, nuevos: string[]) => {
        switch (idGrupo) {
          case GrupoFiltroID.Estado:
            setEstadosSeleccionados(nuevos);
            break;
          case GrupoFiltroID.FechaPostulacion:
            setFechasSeleccionadas(nuevos);
            break;
          case GrupoFiltroID.Empresa:
            setEmpresasSeleccionadas(nuevos);
            break;
        }
      };

  const limpiarFiltros = () => {
    setEstadosSeleccionados([]);
    setFechasSeleccionadas([]);
    setEmpresasSeleccionadas([]);
    setModalidadesSeleccionadas([]);
    setCarrerasSeleccionadas([]);
    setTiposContratoSeleccionados([]);
  };

  //#endregion

  //#endregion

  //#region DATOS DE LA API EN VARIABLES
  // Busqueda de datos desde la API (solo una vez al cargar)
  useEffect(() => {
    buscarPostulaciones();
  }, []);

  // Filtrado en tiempo real cuando cambian los filtros
  useEffect(() => {
    filtrarPostulaciones();
  }, [filtros, todasLasPostulaciones]);
  //#endregion

  const buscarPostulaciones = async () => {
    try {
      setLoading(true);

      const postulaciones = await postulanteService.getPostulaciones();
      setTodasLasPostulaciones(postulaciones);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPostulaciones = () => {
    let postulacionesFiltradas = [...todasLasPostulaciones];

    // Filtrar por estado
    if (filtros.estados && filtros.estados.length > 0) {
      postulacionesFiltradas = postulacionesFiltradas.filter(postulacion => 
        filtros.estados!.some(estado => {
          const estadoActual = postulacion.estadoPostulacion;
          switch (estado) {
            case 'EnRevision':
              return estadoActual === 'En revisión';
            case 'Aprobada':
              return estadoActual === 'Aprobada';
            case 'Rechazada':
              return estadoActual === 'Rechazada';
            case 'Iniciada':
              return estadoActual === 'Iniciada';
            default:
              return false;
          }
        })
      );
    }

    // Filtrar por fecha de postulación
    if (filtros.fechas && filtros.fechas.length > 0) {
      const ahora = new Date();
      // Normalizar a medianoche para comparación correcta
      ahora.setHours(0, 0, 0, 0);
      
      postulacionesFiltradas = postulacionesFiltradas.filter(postulacion => {
        // El backend envía la fecha en formato "dd/MM/yyyy" (ej: "17/10/2025")
        // Necesitamos convertir este formato a Date object
        const fechaString = postulacion.fechaPostulacion; // "17/10/2025"
        
        // Convertir "dd/MM/yyyy" a "yyyy-MM-dd" para que Date lo reconozca
        const partes = fechaString.split('/');
        if (partes.length !== 3) return false;
        
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const año = partes[2];
        
        // Crear fecha en formato ISO que Date reconoce
        const fechaISO = `${año}-${mes}-${dia}`;
        const fechaPostulacion = new Date(fechaISO);
        
        // Verificar que la fecha es válida
        if (isNaN(fechaPostulacion.getTime())) return false;
        
        // Normalizar a medianoche para comparación correcta
        fechaPostulacion.setHours(0, 0, 0, 0);
        
        const diasDiferencia = Math.floor((ahora.getTime() - fechaPostulacion.getTime()) / (1000 * 60 * 60 * 24));
        
        return filtros.fechas!.some(fecha => {
          switch (fecha) {
            case 'ultima_semana':
              return diasDiferencia >= 0 && diasDiferencia <= 7; // Hoy (0) hasta 7 días atrás
            case 'ultimo_mes':
              return diasDiferencia >= 0 && diasDiferencia <= 30; // Hoy (0) hasta 30 días atrás
            case 'ultimos_3_meses':
              return diasDiferencia >= 0 && diasDiferencia <= 90; // Hoy (0) hasta 90 días atrás
            case 'mas_3_meses':
              return diasDiferencia > 90; // Más de 90 días atrás
            default:
              return false;
          }
        });
      });
    }

    // Filtrar por empresa
    if (filtros.empresas && filtros.empresas.length > 0) {
      postulacionesFiltradas = postulacionesFiltradas.filter(postulacion => 
        filtros.empresas!.some(empresa => 
          postulacion.nombreEmpresa.toLowerCase().includes(empresa.toLowerCase())
        )
      );
    }

    setPostulacionesFiltradas(postulacionesFiltradas);
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

      <ResumenPostulaciones
        totalPostulaciones={estadisticasPostulaciones.total}
        enRevision={estadisticasPostulaciones.enRevision}
        aprobadas={estadisticasPostulaciones.aprobadas}
        rechazadas={estadisticasPostulaciones.rechazadas}
      />

      <Box display="flex" gap={3} mt={4}>
        <Box flex={1} maxWidth={300}>
          <CardFiltros
            grupos={gruposFiltros}
            onSeleccionCambio={handleSeleccionFiltro}
          />
        </Box>
        {postulacionesFiltradas.length > 0 ? (
          <Box flex={3}>
            <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
              <Titulo
                titulo=""
                subtitulo={`${
                  postulacionesFiltradas.length === 1
                    ? "1 postulación encontrada"
                    : `${postulacionesFiltradas.length} postulaciones encontradas`
                }`}
                variantSubtitulo="subtitle1"
              />
              {postulacionesFiltradas.map((postulacion) => (
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
                      icon: <CalendarTodayIcon fontSize="small" />,
                      texto: `Postulado el ${postulacion.fechaPostulacion}`,
                    },
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
            <EmptyState mensaje="No hay postulaciones que coincidan con los filtros seleccionados" />
          </Box>
        )}
      </Box>
    </>
  );
  //#endregion
}

//#endregion
