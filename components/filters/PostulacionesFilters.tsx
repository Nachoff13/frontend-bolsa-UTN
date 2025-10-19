"use client";

import { useState, useEffect, useMemo } from "react";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import { GrupoFiltroID } from "@/types/constants";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { FiltrosBusquedaDTO } from "@/types/dto/filter/filtroBusquedaDTO";

interface PostulacionesFiltersProps {
  todasLasPostulaciones: PostulacionDTO[];
  onFiltersChange: (filtros: FiltrosBusquedaDTO) => void;
  onFilteredPostulacionesChange: (postulaciones: PostulacionDTO[]) => void;
}

export default function PostulacionesFilters({
  todasLasPostulaciones,
  onFiltersChange,
  onFilteredPostulacionesChange,
}: PostulacionesFiltersProps) {
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
        { codigo: "en_revision", descripcion: "En revisión" },
        { codigo: "aprobada", descripcion: "Aprobada" },
        { codigo: "rechazada", descripcion: "Rechazada" },
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
  };

  // Filtrar postulaciones en tiempo real
  const filtrarPostulaciones = () => {
    let postulacionesFiltradas = [...todasLasPostulaciones];

    // Filtrar por estado
    if (filtros.estados && filtros.estados.length > 0) {
      postulacionesFiltradas = postulacionesFiltradas.filter(postulacion => 
        filtros.estados!.some(estado => {
          const estadoActual = postulacion.estadoPostulacion.toLowerCase();
          switch (estado) {
            case 'en_revision':
              return estadoActual.includes('revisión') || 
                     estadoActual.includes('revision') ||
                     estadoActual === 'en revisión' ||
                     estadoActual === 'en revision';
            case 'aprobada':
              return estadoActual.includes('aprobada') || 
                     estadoActual === 'aprobada';
            case 'rechazada':
              return estadoActual.includes('rechazada') || 
                     estadoActual === 'rechazada';
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

    onFilteredPostulacionesChange(postulacionesFiltradas);
  };

  // Notificar cambios en filtros
  useEffect(() => {
    onFiltersChange(filtros);
  }, [filtros, onFiltersChange]);

  // Filtrar cuando cambian los filtros o las postulaciones
  useEffect(() => {
    filtrarPostulaciones();
  }, [filtros, todasLasPostulaciones]);

  return {
    gruposFiltros,
    handleSeleccionFiltro,
    limpiarFiltros,
  };
}
