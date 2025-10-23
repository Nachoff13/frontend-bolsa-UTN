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
<Card variant="outlined" sx={{ p: 3.5, position: "sticky", top: 20 }}> {/* Aumentado padding y añadido sticky */}
      {grupos.map((grupo) => (
        <div key={grupo.id}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}> {/* Cambiado de subtitle1 a h6 */}
            {grupo.titulo}
          </Typography>

          <FormGroup sx={{ mb: 2.5 }}> {/* Aumentado mb */}
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
                    sx={{ 
                      "& .MuiSvgIcon-root": { fontSize: 24 } // Hacer los checkboxes más grandes
                    }}
                  />
                }
                label={opcion.descripcion}
                sx={{
                  mb: 0.5, // Espaciado entre opciones
                  "& .MuiFormControlLabel-label": {
                    fontSize: "1rem", // Aumentar tamaño de label
                    lineHeight: 1.5,
                  }
                }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ mb: 2.5 }} /> {/* Aumentado mb */}
        </div>
      ))}
    </Card>
  );
}