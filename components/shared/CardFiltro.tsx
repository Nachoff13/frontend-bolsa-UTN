"use client";

import { CardFiltrosProps } from "@/types/Components/CardFiltroProps";
import {
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";



export default function CardFiltros({
  grupos,
  onSeleccionCambio,
}: CardFiltrosProps) {
  return (
<Card variant="outlined" sx={{ p: 3}}>
      {grupos.map((grupo) => (
        <div key={grupo.id}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {grupo.titulo}
          </Typography>

          <FormGroup sx={{ mb: 2 }}>
            {grupo.opciones.map((opcion) => (
              <FormControlLabel
                key={opcion.codigo}
                control={
                  <Checkbox
                    checked={grupo.valoresSeleccionados.includes(opcion.codigo)}
                    onChange={(e) => {
                      const nuevos = e.target.checked
                        ? [...grupo.valoresSeleccionados, opcion.codigo]
                        : grupo.valoresSeleccionados.filter((v) => v !== opcion.codigo);
                      onSeleccionCambio(grupo.id, nuevos);
                    }}
                  />
                }
                label={opcion.descripcion}
              />
            ))}
          </FormGroup>

          <Divider sx={{ mb: 2 }} />
        </div>
      ))}
    </Card>
  );
}