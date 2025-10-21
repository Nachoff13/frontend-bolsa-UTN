"use client";

import { useState, useEffect, useMemo } from "react";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import { GrupoFiltroID } from "@/types/constants";
import { OpcionFiltro } from "@/types/dto/filter/opcionFiltroDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";
import { postulanteService } from "@/services/postulacion.service";
import { ResponseError } from "@/types/Generics/responseError";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";

interface OfertasFiltersProps {
  onFiltersChange: (filtros: FiltrosBusquedaDTO) => void;
  showMessage: (message: string, type: SnackbarType, options?: any) => void;
}

export default function OfertasFilters({
  onFiltersChange,
  showMessage,
}: OfertasFiltersProps) {
  // Estados para filtros de ofertas laborales
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

    // Filtros de ofertas laborales
    if (modalidadesSeleccionadas.length > 0)
      f.modalidades = modalidadesSeleccionadas;

    if (carrerasSeleccionadas.length > 0) 
      f.carreras = carrerasSeleccionadas;

    if (tiposContratoSeleccionados.length > 0)
      f.tiposContrato = tiposContratoSeleccionados;

    return f;
  }, [
    modalidadesSeleccionadas,
    carrerasSeleccionadas,
    tiposContratoSeleccionados,
  ]);

  // Cargar datos de filtros de ofertas laborales
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
    setModalidadesSeleccionadas([]);
    setCarrerasSeleccionadas([]);
    setTiposContratoSeleccionados([]);
  };

  // Notificar cambios en filtros
  useEffect(() => {
    onFiltersChange(filtros);
  }, [filtros, onFiltersChange]);

  return {
    gruposFiltros,
    handleSeleccionFiltro,
    limpiarFiltros,
  };
}

