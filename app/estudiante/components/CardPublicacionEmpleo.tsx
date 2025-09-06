// components/ofertas/CardOfertaLaboral.tsx

import { Card, CardContent, Typography, Chip, Button, Stack, Box, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";



export default function CardOfertaLaboral({
  titulo,
  empresa,
  descripcion,
  modalidad,
  tipoContrato,
  carrera,
  ubicacion,
  fechaPublicacion,
  fechaCierre,
  onVerDetalle,
  onPostularme,
}: CardPublicacionProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        backgroundColor: "#f8fbfd",
        p: 2,
        boxShadow: 0,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            {titulo && (
              <Typography variant="h6" color="primary" fontWeight={600}>
                {titulo}
              </Typography>
            )}
            {empresa && (
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                🏢 {empresa}
              </Typography>
            )}
          </Box>

          {/* Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {carrera && <Chip label={carrera} color="success" size="small" />}
            {modalidad && <Chip label={modalidad} color="secondary" size="small" />}
            {tipoContrato && <Chip label={tipoContrato} color="info" size="small" />}
          </Stack>
        </Stack>

        {/* Info adicional: ubicación y fechas */}
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ my: 2, flexWrap: "wrap" }}
        >
          {ubicacion && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="caption">{ubicacion}</Typography>
            </Box>
          )}
          {fechaPublicacion && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarTodayIcon fontSize="small" />
              <Typography variant="caption">
                Publicado el {fechaPublicacion}
              </Typography>
            </Box>
          )}
          {fechaCierre && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <EventIcon fontSize="small" />
              <Typography variant="caption">Cierra el {fechaCierre}</Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {descripcion && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Descripción del puesto
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {descripcion}
            </Typography>
          </>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
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