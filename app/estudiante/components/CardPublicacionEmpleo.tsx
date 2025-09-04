// components/ofertas/CardOfertaLaboral.tsx

import { Card, CardContent, Typography, Chip, Button, Stack, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
export default function CardOfertaLaboral({
  titulo,
  empresa,
  descripcionCorta,
  modalidad,
  tipoContrato,
  ubicacion,
  fechaPublicacion,
  onVerDetalle,
  onPostularme,
}: CardPublicacionProps) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <CardContent>
        {/* Título */}
        {titulo && (
          <Typography variant="h6" gutterBottom>
            {titulo}
          </Typography>
        )}

        {/* Empresa */}
        {empresa && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {empresa}
          </Typography>
        )}

        {/* Descripción */}
        {descripcionCorta && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {descripcionCorta}
          </Typography>
        )}

        {/* Chips */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
          {modalidad && <Chip label={modalidad} color="secondary" />}
          {tipoContrato && <Chip label={tipoContrato} color="primary" />}
        </Stack>

        {/* Ubicación y fecha */}
        {(ubicacion || fechaPublicacion) && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {ubicacion && (
              <Box display="flex" alignItems="center">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption">{ubicacion}</Typography>
              </Box>
            )}
            {fechaPublicacion && (
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption">
                  Publicado el {fechaPublicacion}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Botones */}
        <Stack direction="row" spacing={2}>
          {onVerDetalle && (
            <Button variant="outlined" onClick={onVerDetalle}>
              Ver detalles
            </Button>
          )}
          {onPostularme && (
            <Button variant="contained" onClick={onPostularme}>
              Postularme
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}