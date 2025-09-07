import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
  Divider,
} from "@mui/material";

export default function CardGenerica({
  titulo,
  subtitulo,
  descripcion,
  chips = [],
  infoExtra = [],
  onAccion1,
  textoAccion1,
  onAccion2,
  textoAccion2,
}: CardGenericaProps) {
  return (
 <Card
      variant="outlined"
      sx={{
        borderWidth: 3, 
        borderColor: "primary.divider", 
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary" fontWeight={600}>
              {titulo}
            </Typography>
            {subtitulo && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {subtitulo}
              </Typography>
            )}
          </Box>

          {/* Chips */}
          {chips.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {chips.map((chip, idx) => (
                <Chip
                  key={idx}
                  label={chip.label}
                  color={chip.color || "default"}
                  size="small"
                />
              ))}
            </Stack>
          )}
        </Stack>

        {infoExtra.length > 0 && (
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{ my: 2, flexWrap: "wrap" }}
          >
            {infoExtra.map((info, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={0.5}>
                {info.icon}
                <Typography variant="caption">{info.texto}</Typography>
              </Box>
            ))}
          </Stack>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Descripción */}
        {descripcion && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Descripción
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {descripcion}
            </Typography>
          </>
        )}

        {/* Acciones */}
        {(onAccion1 || onAccion2) && (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onAccion1 && (
              <Button variant="outlined" onClick={onAccion1}>
                {textoAccion1}
              </Button>
            )}
            {onAccion2 && (
              <Button variant="contained" onClick={onAccion2}>
                {textoAccion2}
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}