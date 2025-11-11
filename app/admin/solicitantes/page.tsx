"use client";

import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  showConfirmDialog,
  showError,
  showSuccess,
} from "@/components/shared/swalHelper";

//#endregion

import Titulo from "@/components/shared/Titulo";
import CardGenerica from "@/components/shared/CardGenerica";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";

import { adminService } from "@/services/admin.service";
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
import { EstadoValidacionCodigo, GrupoFiltroID } from "@/types/constants";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import CardFiltros from "@/components/shared/CardFiltro";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import constants from "constants";

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
    const theme = useTheme();
  
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
      id: GrupoFiltroID.EstadoValidacion,
      titulo: "Estado de Validación",
      opciones: estadosValidacion.map((e) => ({
        codigo: e.codigo,
        descripcion: e.descripcion,
      })),
    },
  ];

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

    const getEstadoColor = (estado?: string) => {
    const lower = estado?.toLowerCase();
    switch (lower) {
      
      case "iniciada":
        return theme.palette.customStatus.iniciada;
      case "en revisión":
        return theme.palette.customStatus.enRevision;
      case "aprobada":
        return theme.palette.customStatus.aprobada;
      case "rechazada":
        return theme.palette.customStatus.rechazada;
      default:
        return theme.palette.info.main;
    }
  };

  const buscarEmpresas = async () => {
    try {
      setLoading(true);

      const empresas = await adminService.buscarEmpresas(filtros);
      console.log("Empresas obtenidas:", empresas);
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
      const confirmado = await showConfirmDialog(
        "¿Está seguro que desea continuar?",
        "Esta acción modificará el estado de validación."
      );

      if (confirmado) {
        setLoading(true);

        const body = { idPerfilEmpresa: id, aprobado };
        await adminService.cambiarEstadoValidacion(body);
        showSuccess("El estado se modificó correctamente.");
        buscarEmpresas();
      }
    } catch (e) {
      showError("No se pudo modificar el estado de validación.");
      const err = e as ResponseError;
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <Titulo
        titulo="Empresas Solicitantes"
        subtitulo="Listado de empresas registradas en la plataforma"
      /> */}

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
                titulo="Empresas Solicitantes"
                subtitulo="Listado de empresas registradas en la plataforma"
                variantTitulo="h5"
                variantSubtitulo="body2"
              />
              {empresas.map((empresa) => (
                <CardGenerica
                  key={empresa.id}
                  titulo={empresa.razonSocial || "Sin razón social"}
                  subtitulo={ empresa.descripcion || "Sin descripción"}
                  descripcion={"Nro Cuit : " + (empresa.cuit || "Sin CUIT")}
                  chips={[
                    {
                      label: empresa.estadoValidacionNombre || "Sin estado",
                      color: getEstadoColor(empresa.estadoValidacionNombre != null ? empresa.estadoValidacionNombre : undefined),
                    },
                  ]}
                  onAccion1={() => {
                    cambiarEstadoValidacion(empresa.id, false);
                  }}
                  textoAccion1="Deshabilitar"
                  disabledAccion1={
                    empresa.estadoValidacionCodigo ===
                    EstadoValidacionCodigo.Rechazado
                  }
                  disabledAccion2={
                    empresa.estadoValidacionCodigo ===
                    EstadoValidacionCodigo.Aprobado
                  }
                  onAccion2={() => {
                    cambiarEstadoValidacion(empresa.id, true);
                  }}
                  textoAccion2="Habilitar"
                />
              ))}
            </Card>
          </Box>
        ) : (
          <Box flex={3}>
            <EmptyState mensaje="No se han encontrado empresas." />
          </Box>
        )}
      </Box>
    </>
  );
}
