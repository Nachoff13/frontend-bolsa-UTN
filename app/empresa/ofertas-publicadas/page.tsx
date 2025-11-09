"use client";
//use client para que se renderice en el cliente y no en el servidor, esto se usa cuando se usan hooks o estados

//#region IMPORTACIOENS REACT
import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography, Button, Chip, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
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
import EditarOfertaModal from "@/components/ofertas/EditarOfertaModal";

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
import { calcularFechaCierre } from "@/lib/dateUtils";
import { getCuposChip } from "@/lib/cuposUtils";

//#endregion

//#region LOGICA DE LA PAGINA
export default function EmpresaOfertasPublicadasPage() {
  const router = useRouter();
  
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbar();
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaDTO | null>(null);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [ofertaAEliminar, setOfertaAEliminar] = useState<number | null>(null);
  //#endregion

  //#region DATOS DE LA API EN VARIABLES
  // Estados para las ofertas de la empresa
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [todasLasOfertas, setTodasLasOfertas] = useState<OfertaDTO[]>([]); // Cache de todas las ofertas
  
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
        descripcion: carrera.nombre,
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

      const [tipos, modos, carreras, ofertas] = await Promise.all([
        genericService.getTipoContrato(),
        genericService.getModalidad(),
        genericService.getCarreras(),
        ofertaService.getOfertasByEmpresa(),
      ]);

      setTipoContratos(tipos);
      setModalidades(modos);
      setCarreras(carreras || []);
      setTodasLasOfertas(ofertas);
      setOfertas(ofertas);
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
    if (todasLasOfertas.length === 0) return;
    
    aplicarFiltros();
  }, [filtros, todasLasOfertas]);

  const aplicarFiltros = () => {
    let ofertasFiltradas = [...todasLasOfertas];
    if (inputBusquedaFinal.trim()) {
      const textoBusqueda = inputBusquedaFinal.toLowerCase();
      ofertasFiltradas = ofertasFiltradas.filter(oferta => 
        oferta.titulo?.toLowerCase().includes(textoBusqueda) ||
        oferta.descripcion?.toLowerCase().includes(textoBusqueda)
      );
    }
    if (modalidadesSeleccionadas.length > 0) {
      ofertasFiltradas = ofertasFiltradas.filter(oferta =>
        modalidadesSeleccionadas.some(modalidad => 
          oferta.modalidad === modalidades.find(m => m.codigo === modalidad)?.descripcion
        )
      );
    }
    if (tiposContratoSeleccionados.length > 0) {
      ofertasFiltradas = ofertasFiltradas.filter(oferta =>
        tiposContratoSeleccionados.some(tipo => 
          oferta.tipoContrato === tipoContratos.find(t => t.codigo === tipo)?.descripcion
        )
      );
    }
    if (carrerasSeleccionadas.length > 0) {
      ofertasFiltradas = ofertasFiltradas.filter(oferta =>
        carrerasSeleccionadas.some(carrera => 
          oferta.nombreCarrera === carreras.find(c => c.codigo === carrera)?.nombre
        )
      );
    }

    setOfertas(ofertasFiltradas);
  };

  useEffect(() => {
    if (busquedaInputFiltro.trim() === "") {
      setInputBusquedaFinal("");
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


  const getEstadoColor = (oferta: OfertaDTO) => {
    const fechaFin = oferta.fechaFin ? new Date(oferta.fechaFin.split('/').reverse().join('-')) : null;
    const ahora = new Date();
    
    if (fechaFin && fechaFin < ahora) {
      return 'error';
    }
    
    return 'success';
  };

  const getEstadoTexto = (oferta: OfertaDTO) => {
    const fechaFin = oferta.fechaFin ? new Date(oferta.fechaFin.split('/').reverse().join('-')) : null;
    const ahora = new Date();
    
    if (fechaFin && fechaFin < ahora) {
      return 'Cerrada';
    }
    
    return 'Activa';
  };

  const handleCrearOferta = () => {
    router.push('/empresa/ofertas/nueva');
  };

  const handleEditarOferta = (id: number) => {
    const oferta = ofertas.find(o => o.id === id);
    if (oferta) {
      setOfertaSeleccionada(oferta);
      setModalEditarOpen(true);
    }
  };

  const handleActualizarOferta = async (id: number, data: CrearOfertaDTO) => {
    try {
      await ofertaService.actualizarOferta(id, data);
      showMessage('Oferta actualizada exitosamente', SnackbarType.Success, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
      setModalEditarOpen(false);
      setOfertaSeleccionada(null);
      cargarDatos();
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    }
  };

  const handleSolicitarEliminarOferta = (id: number) => {
    setOfertaAEliminar(id);
    setModalEliminarOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (ofertaAEliminar === null) return;
    
    try {
      await ofertaService.eliminarOferta(ofertaAEliminar);
      showMessage('Oferta eliminada exitosamente', SnackbarType.Success, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
      setModalEliminarOpen(false);
      setOfertaAEliminar(null);
      cargarDatos();
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    }
  };

  const handleCancelarEliminar = () => {
    setModalEliminarOpen(false);
    setOfertaAEliminar(null);
  };

  //#endregion

  //#region RENDERIZADO DE LA PAGINA

  return (
    <>
      {/* Modal de Confirmación para Eliminar */}
      <Dialog
        open={modalEliminarOpen}
        onClose={handleCancelarEliminar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          ¿Confirmar eliminación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción eliminará permanentemente la oferta. Los candidatos no podrán ver ni aplicar a esta oferta.
            <br /><br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelarEliminar} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmarEliminar} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Eliminar Oferta
          </Button>
        </DialogActions>
      </Dialog>

      <EditarOfertaModal
        open={modalEditarOpen}
        oferta={ofertaSeleccionada}
        onClose={() => {
          setModalEditarOpen(false);
          setOfertaSeleccionada(null);
        }}
        onSubmit={handleActualizarOferta}
      />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Titulo
          titulo="Mis Ofertas Publicadas"
          subtitulo="Gestioná tus publicaciones laborales"
        />
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

      <FilterSearch
        titulo="Buscar ofertas"
        subtitulo="Encontrá y gestioná tus publicaciones"
        placeholder="Buscar por título, descripción…"
        valor={busquedaInputFiltro}
        onChange={(e) => setBusquedaInputFiltro(e.target.value)}
        onAccion1={handleBuscar}
        tituloBoton2="Limpiar"
        onAccion2={limpiarFiltros}
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
                titulo="Tus ofertas publicadas"
                subtitulo={`${ofertas.length} oferta${ofertas.length !== 1 ? 's' : ''} encontrada${ofertas.length !== 1 ? 's' : ''}`}
                variantTitulo="h5"
                variantSubtitulo="body2"
              />
              {ofertas.map((oferta) => (
                <CardGenerica
                  key={oferta.id}
                  titulo={oferta.titulo}
                  descripcion={oferta.descripcion}
                  chips={[
                    { label: oferta.modalidad, color: "primary" },
                    { label: oferta.tipoContrato, color: "secondary" },
                    { label: getEstadoTexto(oferta), color: getEstadoColor(oferta) as any },
                    // Cupos con lógica mejorada (usando utilidad centralizada)
                    getCuposChip(oferta.cantidadPostulantes, oferta.cupos),
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
                  onAccion2={() => handleSolicitarEliminarOferta(oferta.id)}
                  textoAccion2="Eliminar"
                />
              ))}
            </Card>
          </Box>
        ) : (
          <Box flex={3}>
            <EmptyState mensaje="No tienes ofertas publicadas" />
          </Box>
        )}
      </Box>
    </>
  );
  //#endregion
}
