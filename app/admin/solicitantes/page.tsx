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
import CardGenerica from "@/components/shared/CardGenerica";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";

//#endregion

//#region IMPORTACIONES SERVICIOS Y TIPOS
//Servicio para llamadas a la API
import { adminService } from "@/services/admin.service";

//#region Tipos y constantes
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { ResponseError } from "@/types/Generics/responseError";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import FilterSearch from "@/components/shared/FilterSearch";
import { OpcionFiltro } from "@/types/dto/filter/opcionFiltroDTO";
import { genericService } from "@/services/generic.service";
import { GrupoFiltroID } from "@/types/constants";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import CardFiltros from "@/components/shared/CardFiltro";
import { id, no } from "zod/v4/locales";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

//#endregion

//#region LOGICA DE LA PAGINA
export default function EmpresasSolicitantesPage() {
  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [inputBusquedaFinal, setInputBusquedaFinal] = useState("");

  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<PerfilEmpresaDTO[]>([]);
  const [estadosValidacion, setEstadosValidacion] = useState<OpcionFiltro[]>(
    []
  );
  const [estadosValidacionSeleccionados, setEstadosValidacionSeleccionados] =
    useState<string[]>([]);

  const { showMessage } = useSnackbar();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      var estados = await genericService.getEstadosValidacion();
      setEstadosValidacion(estados);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error, {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      });
    } finally {
      setLoading(false);
      console.log("Estados de validación cargados:", estadosValidacion);
    }
  };

  const filtrosAPI = [
    {
      //le pongo id porque necesito identificar el grupo y para que no rompa
      id: GrupoFiltroID.EstadoValidacion,
      titulo: "Estado de Validación",
      opciones: estadosValidacion.map((e) => ({
        codigo: e.codigo,
        descripcion: e.descripcion,
      })),
    },
  ];

  //Grupos filtros guarda el valor de los grupos y los seleccionados
  const gruposFiltros: GrupoFiltro[] = filtrosAPI.map((grupo) => {
    let valoresSeleccionados: string[] = [];

    switch (grupo.id) {
      case GrupoFiltroID.EstadoValidacion:
        valoresSeleccionados = estadosValidacionSeleccionados;
        break;
    }

    return {
      ...grupo,
      valoresSeleccionados,
    };
  });

  const handleSeleccionFiltro = (idGrupo: string, nuevos: string[]) => {
    switch (idGrupo) {
      case GrupoFiltroID.EstadoValidacion:
        setEstadosValidacionSeleccionados(nuevos);
        break;
    }
  };

  //el useMemo memoriza el valor de los filtros para no recalcularlos en cada render
  const filtros: FiltrosBusquedaDTO = useMemo(() => {
    const f: FiltrosBusquedaDTO = {};

    if (estadosValidacionSeleccionados.length > 0)
      f.estados = estadosValidacionSeleccionados;

    if (inputBusquedaFinal.trim()) f.input = inputBusquedaFinal.trim();
    return f;
  }, [estadosValidacionSeleccionados, inputBusquedaFinal]);

  // Cargar datos de filtros de ofertas laborales (para otras pantallas)
  useEffect(() => {
    buscarEmpresas();
  }, [filtros]);

  const buscarEmpresas = async () => {
    try {
      setLoading(true);

      const empresas = await adminService.buscarEmpresas(filtros);
      setEmpresas(empresas);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  //#endregion

  const handleBuscar = () => {
    setInputBusquedaFinal(busquedaInputFiltro);
  };
  function limpiarFiltro() {
    setBusquedaInputFiltro("");
    setInputBusquedaFinal("");
    setEstadosValidacionSeleccionados([]);
  }
  const cambiarEstadoValidacion = async (id: number, aprobado: boolean) => {

     try {
      setLoading(true);
      const body = {
        idPerfilEmpresa: id,
        aprobado: aprobado
      }
      await adminService.cambiarEstadoValidacion(body);
      
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
      buscarEmpresas();
    }
  }


  return (
    <>
      <Titulo
        titulo="Empresas Solicitantes"
        subtitulo="Listado de empresas registradas en la plataforma"
      />

      <FilterSearch
        titulo="Buscar empresas"
        placeholder="Buscar por nombre, empresa, cuit…"
        valor={busquedaInputFiltro}
        onChange={(e) => setBusquedaInputFiltro(e.target.value)}
        onAccion1={handleBuscar}
        tituloBoton2="Limpiar"
        onAccion2={() => {
          limpiarFiltro();
        }}
      />

      <Box display="flex" gap={3} mt={4}>
        <Box flex={1} maxWidth={300}>
          <CardFiltros
            grupos={gruposFiltros}
            onSeleccionCambio={handleSeleccionFiltro}
          />
        </Box>
        {empresas.length > 0 ? (
          <Box flex={3}>
            <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
              <Titulo
                titulo="Publicaciones de empleo recientes"
                subtitulo="Nuevas oportunidades laborales"
                variantTitulo="h5"
                variantSubtitulo="body2"
              />
              {empresas.map((empresa) => (
                <CardGenerica
                  key={empresa.id}
                  titulo={empresa.descripcion || "Sin descripción"}
                  subtitulo={empresa.razonSocial || "Sin razón social"}
                  descripcion={empresa.cuit || "Sin CUIT"}
                  chips={[
                    {
                      label: empresa.estadoValidacionNombre || "Sin estado",
                      color: "primary",
                    },
                  ]}
                  onAccion1={() => {cambiarEstadoValidacion(empresa.id, false)}}
                  textoAccion1="Rechazar"
                  onAccion2={() => {cambiarEstadoValidacion(empresa.id, true)}}
                  textoAccion2="Aprobar"
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

  return (
    <>
      <Titulo
        titulo="Empresas Solicitantes"
        subtitulo="Listado de empresas registradas en la plataforma"
      />

      <Box display="flex" gap={3} mt={4}>
        {empresas.length === 0 && (
          <EmptyState mensaje="No hay empresas para verificar en este momento." />
        )}
      </Box>
    </>
  );
}
