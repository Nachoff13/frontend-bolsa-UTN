"use client";

import { useEffect, useState } from "react";
import { getPublicacionesEmpleo } from "@/services/empresa.service";
import { Typography } from "@mui/material";
import { OfertaDTO } from "@/types/ofertaDTO";
import CardPublicacionEmpleo from "../components/CardPublicacionEmpleo";

export default function EstudianteOfertasPage() {
  const [ofertas, setOfertas] = useState<OfertaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicacionesEmpleo().then(setOfertas).finally(() => setLoading(false));
    console.log("Ejecucion")
    console.log(ofertas)
  }, []);

  if (loading) return <Typography>Cargando…</Typography>;
  if (!ofertas.length) return <Typography>No hay ofertas</Typography>;

return (
    <div className="flex gap-6">
      {/* <aside className="w-1/4">
        <FiltrosOfertas />
      </aside> */}

      <main className="w-3/4 flex flex-col gap-4">
        {ofertas.map((oferta) => (
          <CardPublicacionEmpleo
            key={oferta.id}
            titulo={oferta.titulo}
            empresa={oferta.nombreEmpresa}
            descripcionCorta={oferta.descripcion}
            modalidad={oferta.modalidad}
            tipoContrato={oferta.tipoContrato}
            ubicacion={oferta.nombreLocalidad}
            fechaPublicacion={oferta.fechaInicio}
            onPostularme={() => console.log("Postular", oferta.id)}
            onVerDetalle={() => console.log("Ver detalle", oferta.id)} carrera={""}          />
        ))}
      </main>
    </div>
  );
}