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
      <CardContent sx={{ p: 4 }}>
        {" "}
        {/* Aumentado padding para más aire */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <Box flex={1}>
            <Typography
              variant="h4"
              color="primary"
              fontWeight={700}
              sx={{
                mb: 1.5,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }, // Responsive
                lineHeight: 1.2,
              }}
            >
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
                  sx={{
                    backgroundColor: `${chip.color}22`,
                    color: chip.color,
                    fontWeight: 600,
                  }}
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
                <Typography variant="body2">{info.texto}</Typography>{" "}
                {/* Cambiado de caption a body2 */}
              </Box>
            ))}
          </Stack>
        )}
        <Divider sx={{ my: 2.5 }} /> {/* Aumentado margen */}
        {/* Descripción */}
        {descripcion && (
          <>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
      Descripción
    </Typography>

    <Typography
      variant="body1"
      sx={{
        mb: 3,
        color: "text.secondary",
        whiteSpace: "pre-line", // 👈 respeta los saltos de línea (\n)
        lineHeight: 1.7,
      }}
    >
      {descripcion.length > 300
        ? `${descripcion.substring(0, 300)}...`
        : descripcion}
    </Typography>
          </>
        )}
        {/* Acciones */}
        {(onAccion1 || onAccion2) && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            flexWrap="wrap"
            gap={1.5}
          >
            {onAccion1 && (
              <Button
                variant="outlined"
                onClick={onAccion1}
                disabled={disabledAccion1}
              >
                {textoAccion1}
              </Button>
            )}
            {onAccion2 && (
              <Button
                variant="contained"
                onClick={onAccion2}
                disabled={disabledAccion2}
              >
                {textoAccion2}
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
