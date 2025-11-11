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
import { useTheme } from "@mui/material/styles";

export default function CardGenerica({
  titulo,
  subtitulo,
  descripcion,
  chips = [],
  infoExtra = [],
  onAccion1,
  textoAccion1,
  disabledAccion1 = false,
  colorAccion1 = "primary",
  onAccion2,
  textoAccion2,
  disabledAccion2 = false,
  colorAccion2 = "primary",
}: CardGenericaProps) {
  const theme = useTheme();
  
  // Función para determinar si un chip es de estado especial
  const isEstadoEspecial = (label: string): boolean => {
    const lower = label.toLowerCase();
    return lower === "iniciada" || lower === "rechazada" || lower === "aprobada";
  };

  // Función para obtener el color del estado especial
  const getEstadoColor = (label: string): { backgroundColor: string; color: string } | null => {
    const lower = label.toLowerCase();
    switch (lower) {
      case "iniciada":
        return {
          backgroundColor: `${theme.palette.customStatus.iniciada}22`,
          color: theme.palette.customStatus.iniciada,
        };
      case "aprobada":
        return {
          backgroundColor: `${theme.palette.customStatus.aprobada}22`,
          color: theme.palette.customStatus.aprobada,
        };
      case "rechazada":
        return {
          backgroundColor: `${theme.palette.customStatus.rechazada}22`,
          color: theme.palette.customStatus.rechazada,
        };
      default:
        return null;
    }
  };
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
              {chips.map((chip, idx) => {
                const estadoEspecial = isEstadoEspecial(chip.label);
                const estadoColor = estadoEspecial ? getEstadoColor(chip.label) : null;
                const isDarkMode = theme.palette.mode === "dark";
                
                // Si tiene colores personalizados del prop, usarlos
                if (chip.backgroundColor && chip.textColor) {
                  return (
                    <Chip
                      key={idx}
                      label={chip.label}
                      sx={{
                        backgroundColor: chip.backgroundColor,
                        color: chip.textColor,
                        fontWeight: 600,
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        height: "32px",
                        padding: "0 12px",
                        "& .MuiChip-label": {
                          padding: "0 4px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: chip.textColor,
                        },
                      }}
                    />
                  );
                }
                
                // Si es estado especial, usar colores del tema
                if (estadoColor) {
                  return (
                    <Chip
                      key={idx}
                      label={chip.label}
                      sx={{
                        backgroundColor: estadoColor.backgroundColor,
                        color: estadoColor.color,
                        fontWeight: 600,
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        height: "32px",
                        padding: "0 12px",
                        "& .MuiChip-label": {
                          padding: "0 4px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: estadoColor.color,
                        },
                      }}
                    />
                  );
                }
                
                // Chips genéricos: gris en modo claro, blanco en modo oscuro
                return (
                  <Chip
                    key={idx}
                    label={chip.label}
                    sx={{
                      backgroundColor: isDarkMode ? "#424242" : "#E5E7EB",
                      color: isDarkMode ? "#ffffff" : "#374151",
                      fontWeight: 600,
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      height: "32px",
                      padding: "0 12px",
                      "& .MuiChip-label": {
                        padding: "0 4px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      },
                    }}
                  />
                );
              })}
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
                color={colorAccion1} 
                onClick={onAccion1} 
                disabled={disabledAccion1}
                sx={{
                  borderWidth: 3,
                  "&:hover": {
                    borderWidth: 4,
                  },
                }}
              >
                {textoAccion1}
              </Button>
            )}
            {onAccion2 && (
              <Button
                variant="contained"
                color={colorAccion2}
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
