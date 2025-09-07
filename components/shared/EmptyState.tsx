"use client";

import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({
  mensaje = "No hay información para mostrar",
  icono = <InboxIcon sx={{ fontSize: 48, color: grey[400] }} />,
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
      px={2}
    >
      {icono}
      <Typography variant="h6" color={color} mt={2}>
        {mensaje}
      </Typography>
    </Box>
  );
}
