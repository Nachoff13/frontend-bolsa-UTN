"use client";

import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({
  mensaje = "No hay información para mostrar",
  icono = <InboxIcon sx={{ fontSize: 64, color: grey[400] }} />, // Aumentado de 48 a 64
  color = grey[500],
  minHeight = "70vh",
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      width="100%"
      textAlign="center"
      px={3} // Aumentado de 2 a 3
      py={4} // Añadido padding vertical
    >
      {icono}
      <Typography variant="h5" color={color} mt={3} sx={{ fontWeight: 500 }}> {/* Cambiado de h6 a h5 */}
        {mensaje}
      </Typography>
    </Box>
  );
}
