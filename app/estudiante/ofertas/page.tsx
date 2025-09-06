"use client";

import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { getPublicacionesEmpleo } from "@/services/empresa.service";
import { OfertaDTO } from "@/types/dto/ofertaDTO";
import Titulo from "@/components/shared/Titulo";
import FilterSearch from "@/components/shared/FilterSearch";
import CardGenerica from "@/components/shared/CardGenerica";

export default function EstudianteOfertasPage() {
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    getPublicacionesEmpleo()
      .then(setOfertas)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Cargando…</Typography>;
  if (!ofertas.length)
    return <Typography>No hay ofertas disponibles</Typography>;

  const handleBuscar = () => {
    // Lógica de búsqueda (filtrado) aquí
    console.log("Buscar ofertas con:", busqueda);
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
        valor={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onBuscar={handleBuscar}
        onAbrirFiltros={() => setMostrarFiltros(true)}
      />
      

      <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
        <Titulo
          titulo="Publicaciones de empleo recientes"
          subtitulo="Nuevas opor tunidades laborales"
          variantTitulo="h5"
          variantSubtitulo="body2"
        />
        {ofertas.map((oferta) => (
          <CardGenerica
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
    </>
  );
}
