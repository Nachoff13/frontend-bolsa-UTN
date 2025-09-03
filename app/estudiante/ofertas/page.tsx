"use client";

import { useEffect, useState } from "react";
import { listarOfertas } from "@/services/empresas.service";
import { Typography } from "@mui/material";
import { OfertaDTO } from "@/types/ofertaDTO";

export default function EstudianteOfertasPage() {
  const [data, setData] = useState<OfertaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarOfertas().then(setData).finally(() => setLoading(false));
    console.log("Ejecucion")
  }, []);

  if (loading) return <Typography>Cargando…</Typography>;
  if (!data.length) return <Typography>No hay ofertas</Typography>;

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>Ofertas para Estudiante</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}