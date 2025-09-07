"use client";

import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { empresaService } from "@/services/empresa.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import Titulo from "@/components/shared/Titulo";
import FilterSearch from "@/components/shared/FilterSearch";
import CardGenerica from "@/components/shared/CardGenerica";
import { GrupoFiltro } from "@/types/dto/filter/grupoFiltroDTO";
import CardFiltros from "@/components/shared/CardFiltro";
import { ResponseError } from "@/types/Generics/responseError";
import { useSnackbar } from "@/components/providers/snackbar";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";

export default function EstudianteOfertasPage() {
  //Para el modal de carga
  const [loading, setLoading] = useState(true);

  // Busqueda de datos desde la API
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [tipoContratos, setTipoContratos] = useState<OpcionFiltro[]>([]);
  const [modalidades, setModalidades] = useState<OpcionFiltro[]>([]);
  const [carreras, setCarreras] = useState<OpcionFiltro[]>([]);
  const { showMessage } = useSnackbar();

  //VALORES PARA FILTROS Y BUSQUEDA
  const [busquedaInputFiltro, setBusquedaInputFiltro] = useState("");
  const [mostrarBotonAccion, setMostrarBotonAccion] = useState(false);

  //para setear los filtros seleccionados
  const [modalidadesSeleccionadas, setModalidadesSeleccionadas] = useState<
    string[]
  >([]);
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>(
    []
  );
  const [tiposContratoSeleccionados, setTiposContratoSeleccionados] = useState<
    string[]
  >([]);

  //DATOS DE LOS FILTROS
  const filtrosAPI = [
    {
      //le pongo id porque necesito identificar el grupo y para que no rompa
      id: "modalidad",
      titulo: "Modalidad",
      opciones: modalidades.map((mod) => ({
        codigo: mod.codigo,
        descripcion: mod.descripcion,
      })),
    },
    {
      id: "carrera",
      titulo: "Carrera",
      opciones: carreras.map((carrera) => ({
        codigo: carrera.codigo,
        descripcion: carrera.descripcion,
      })),
    },
    {
      id: "tipoContrato",
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
      case "modalidad":
        valoresSeleccionados = modalidadesSeleccionadas;
        break;
      case "carrera":
        valoresSeleccionados = carrerasSeleccionadas;
        break;
      case "tipoContrato":
        valoresSeleccionados = tiposContratoSeleccionados;
        break;
    }

    return {
      ...grupo,
      valoresSeleccionados,
    };
  });

  //funcion que se activa cuando cambia la seleccion de un filtro
  const handleSeleccionFiltro = (idGrupo: string, nuevos: string[]) => {
    switch (idGrupo) {
      case "modalidad":
        setModalidadesSeleccionadas(nuevos);
        break;
      case "carrera":
        setCarrerasSeleccionadas(nuevos);
        break;
      case "tipoContrato":
        setTiposContratoSeleccionados(nuevos);
        break;
    }

    console.log("Filtrar por", { idGrupo, nuevos });
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        debugger;
        const [ofertas, tipos, modos, carreras] = await Promise.all([
          empresaService.getPublicacionesEmpleo(),
          empresaService.getTipoContrato(),
          empresaService.getModalidad(),
          empresaService.getCarreras(),
        ]);

        setOfertas(ofertas);
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

    cargarDatos();
  }, []);

  if (loading) return <Typography>Cargando…</Typography>;
  if (!ofertas.length)
    return <Typography>No hay ofertas disponibles</Typography>;

  const handleBuscar = () => {
    console.log("Buscar ofertas con:", busquedaInputFiltro);
  };

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
        onAccion1={handleBuscar}
        tituloBoton2="Limpiar"
        onAccion2={() => setMostrarBotonAccion(true)}
      />

      <Box display="flex" gap={3} mt={4}>
        <Box flex={1} maxWidth={300}>
          <CardFiltros
            grupos={gruposFiltros}
            onSeleccionCambio={handleSeleccionFiltro}
          />
        </Box>

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
                onAccion2={() => console.log("Postularme", oferta.id)}
                textoAccion2="Postularme"
              />
            ))}
          </Card>
        </Box>
      </Box>
    </>
  );
}
