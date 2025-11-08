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
  disabledAccion1 = false,
  onAccion2,
  textoAccion2,
  disabledAccion2 = false,
}: CardGenericaProps) {
  return (
 <Card
      variant="outlined"
      sx={{
        borderWidth: 3, 
        borderColor: "primary.divider", 
        mb: 3, // Aumentado de 2 a 3
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}> {/* Aumentado de p: 2 a p: 3 */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box flex={1}>
            <Typography variant="h6" color="primary" fontWeight={600} sx={{ mb: 1 }}>
              {titulo}
            </Typography>
            {subtitulo && (
              <Typography
                variant="body1" // Cambiado de subtitle2 a body1 para mayor tamaño
                color="text.secondary"
                gutterBottom
              >
                {subtitulo}
              </Typography>
            )}
          </Box>

          {/* Chips */}
          {chips.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {chips.map((chip, idx) => (
                <Chip
                  key={idx}
                  label={chip.label}
                  color={chip.backgroundColor || chip.textColor ? undefined : (chip.color || "default")}
                  sx={chip.backgroundColor || chip.textColor ? {
                    backgroundColor: chip.backgroundColor,
                    color: chip.textColor,
                    fontWeight: 700,
                    borderRadius: "10px",
                    fontSize: "1rem",
                    height: "38px",
                    padding: "0 16px",
                  } : undefined}
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
            sx={{ my: 2.5, flexWrap: "wrap", gap: 2 }} // Aumentado spacing
          >
            {infoExtra.map((info, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={0.75}>
                {info.icon}
                <Typography variant="body2">{info.texto}</Typography> {/* Cambiado de caption a body2 */}
              </Box>
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 2.5 }} /> {/* Aumentado margen */}

        {/* Descripción */}
        {descripcion && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}> {/* Cambiado de subtitle2 a subtitle1 */}
              Descripción
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}> {/* Cambiado de body2 a body1 */}
              {descripcion}
            </Typography>
          </>
        )}

        {/* Acciones */}
        {(onAccion1 || onAccion2) && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" gap={1.5}>
            {onAccion1 && (
              <Button variant="outlined" onClick={onAccion1} disabled={disabledAccion1}>
                {textoAccion1}
              </Button>
            )}
            {onAccion2 && (
              <Button variant="contained" onClick={onAccion2} disabled={disabledAccion2}>
                {textoAccion2}
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}