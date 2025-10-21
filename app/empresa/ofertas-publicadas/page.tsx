"use client";
//use client para que se renderice en el cliente y no en el servidor, esto se usa cuando se usan hooks o estados

//#region IMPORTACIOENS REACT
import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography, Button, Chip, Stack, TextField } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { useRouter } from "next/navigation";
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
import { ofertaService } from "@/services/oferta.service";
import { genericService } from "@/services/generic.service";

//#region Tipos y constantes
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import { CrearOfertaDTO } from "@/types/dto/ofertaDTO";
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
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

//#endregion

//#region LOGICA DE LA PAGINA
export default function EmpresaOfertasPublicadasPage() {
  const router = useRouter();
  
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbar();
  //#endregion

  //#region DATOS DE LA API EN VARIABLES
  // Estados para las ofertas de la empresa
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  
  // Estados para filtros
  const [tipoContratos, setTipoContratos] = useState<OpcionFiltro[]>([]);
  const [modalidades, setModalidades] = useState<OpcionFiltro[]>([]);
  const [carreras, setCarreras] = useState<OpcionFiltro[]>([]);

  // Estados para filtros seleccionados
  const [modalidadesSeleccionadas, setModalidadesSeleccionadas] = useState<string[]>([]);
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>([]);
  const [tiposContratoSeleccionados, setTiposContratoSeleccionados] = useState<string[]>([]);

  // Estado para búsqueda
  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [inputBusquedaFinal, setInputBusquedaFinal] = useState("");

  //#endregion

  //#region VARIABLES CARD FILTRO
  const filtrosAPI = [
    {
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
        genericService.getTipoContrato(),
        genericService.getModalidad(),
        genericService.getCarreras(),
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

      // Obtener el ID de la empresa del usuario logueado
      const idEmpresa = await genericService.getPerfilEmpresaUsuario();
      
      const nuevasOfertas: OfertaDTO[] = await ofertaService.getOfertasByEmpresa();
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
  };

  const limpiarFiltros = () => {
    setBusquedaInputFiltro("");
    setInputBusquedaFinal("");
    setModalidadesSeleccionadas([]);
    setCarrerasSeleccionadas([]);
    setTiposContratoSeleccionados([]);
  };

  // Función para calcular fecha de cierre por defecto (60 días después de fechaInicio)
  const calcularFechaCierre = (fechaInicio: string, fechaFin?: string): string => {
    // Si hay fechaFin específica, la usamos
    if (fechaFin && fechaFin.trim() !== '') {
      return fechaFin;
    }
    
    // Si no hay fechaFin, calculamos 60 días después de fechaInicio
    // El formato viene como "dd/MM/yyyy" del backend
    const partes = fechaInicio.split('/');
    if (partes.length !== 3) return fechaInicio; // Si el formato es incorrecto, devolvemos la fecha original
    
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Los meses en JavaScript van de 0-11
    const año = parseInt(partes[2]);
    
    const fechaInicioDate = new Date(año, mes, dia);
    const fechaCierreDate = new Date(fechaInicioDate);
    fechaCierreDate.setDate(fechaInicioDate.getDate() + 60); // Agregar 60 días
    
    // Formatear de vuelta a "dd/MM/yyyy"
    const diaCierre = fechaCierreDate.getDate().toString().padStart(2, '0');
    const mesCierre = (fechaCierreDate.getMonth() + 1).toString().padStart(2, '0');
    const añoCierre = fechaCierreDate.getFullYear();
    
    return `${diaCierre}/${mesCierre}/${añoCierre}`;
  };

  const getEstadoColor = (oferta: OfertaDTO) => {
    // Determinar estado basado solo en fecha de fin
    const fechaFin = oferta.fechaFin ? new Date(oferta.fechaFin.split('/').reverse().join('-')) : null;
    const ahora = new Date();
    
    if (fechaFin && fechaFin < ahora) {
      return 'error'; // Cerrada
    }
    
    return 'success'; // Activa (por defecto, independientemente de fecha de inicio)
  };

  const getEstadoTexto = (oferta: OfertaDTO) => {
    const fechaFin = oferta.fechaFin ? new Date(oferta.fechaFin.split('/').reverse().join('-')) : null;
    const ahora = new Date();
    
    if (fechaFin && fechaFin < ahora) {
      return 'Cerrada';
    }
    
    return 'Activa'; // Por defecto, independientemente de fecha de inicio
  };

  const handleCrearOferta = () => {
    router.push('/empresa/ofertas/nueva');
  };

  const handleEditarOferta = (id: number) => {
    // TODO: Implementar edición de oferta
  };

  const handleEliminarOferta = async (id: number) => {
    try {
      await ofertaService.eliminarOferta(id);
      showMessage('Oferta eliminada exitosamente', SnackbarType.Success, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
      // Recargar las ofertas
      buscarOfertas();
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    }
  };

  //#endregion

  //#region RENDERIZADO DE LA PAGINA
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F4FBF9' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Mis Ofertas Publicadas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gestioná tus publicaciones laborales
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrearOferta}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.5
            }}
          >
            Crear Nueva Oferta
          </Button>
        </Box>

        {/* Barra de búsqueda */}
        <FilterSearch
          titulo="Buscar Ofertas"
          subtitulo="Encuentra y gestiona tus ofertas publicadas"
          placeholder="Buscar por título, descripción..."
          valor={busquedaInputFiltro}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusquedaInputFiltro(e.target.value)}
          onAccion1={handleBuscar}
          tituloBoton1="Buscar"
          onAccion2={limpiarFiltros}
          tituloBoton2="Limpiar"
          mostrarBotonFiltros={true}
        />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ p: 3 }}>
        <Box display="flex" gap={3}>
          {/* Sidebar de filtros */}
          <Box flex={1} maxWidth={300}>
            <CardFiltros
              grupos={gruposFiltros}
              onSeleccionCambio={handleSeleccionFiltro}
            />
          </Box>
          
          {/* Lista de ofertas */}
          <Box flex={3}>
            {ofertas.length > 0 ? (
              <Box>
                <Titulo
                  titulo="Ofertas Publicadas"
                  subtitulo={`${ofertas.length} oferta${ofertas.length !== 1 ? 's' : ''} encontrada${ofertas.length !== 1 ? 's' : ''}`}
                  variantTitulo="h5"
                  variantSubtitulo="body2"
                />
                
                <Stack spacing={2}>
                  {ofertas.map((oferta) => (
                    <CardGenerica
                      key={oferta.id}
                      titulo={oferta.titulo}
                      descripcion={oferta.descripcion}
                      chips={[
                        { label: oferta.modalidad, color: "primary" },
                        { label: oferta.tipoContrato, color: "secondary" },
                        { label: getEstadoTexto(oferta), color: getEstadoColor(oferta) as any },
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
                          texto: `Cierra el ${calcularFechaCierre(oferta.fechaInicio, oferta.fechaFin)}`,
                        },
                      ]}
                      onAccion1={() => handleEditarOferta(oferta.id)}
                      textoAccion1="Editar"
                      onAccion2={() => handleEliminarOferta(oferta.id)}
                      textoAccion2="Eliminar"
                    />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Card elevation={1}>
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tienes ofertas publicadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comienza creando tu primera oferta laboral
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCrearOferta}
                    sx={{ textTransform: 'none' }}
                  >
                    Crear Primera Oferta
                  </Button>
                </Box>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
