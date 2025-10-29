"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { ReactNode } from "react";

interface Field {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
}

interface ChipItem {
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
}

interface DetalleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  chips?: ChipItem[];
  actions?: ReactNode;
}

export default function DetalleModal({
  open,
  onClose,
  title,
  fields,
  chips = [],
  actions,
}: DetalleModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // Cambiado de sm a md para más espacio
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 2 } }} // Aumentado padding
    >
      {/* 🔹 Encabezado con título y chip a la derecha */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.75rem", // Aumentado de 1.4rem
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}> {/* Cambiado de h6 a h5 */}
          {title}
        </Typography>

        {chips.length > 0 && (
          <Box display="flex" gap={1.5}> {/* Aumentado gap */}
            {chips.map((chip, idx) => (
              <Chip
                key={idx}
                label={chip.label}
                color={chip.color ?? "default"}
                sx={{ fontWeight: 600 }} // Removido size="small" para usar tamaño default
              />
            ))}
          </Box>
        )}
      </DialogTitle>

      {/* 📋 Contenido principal */}
      <DialogContent dividers sx={{ py: 3 }}> {/* Añadido padding vertical */}
        <Box display="flex" flexDirection="column" gap={2.5}> {/* Aumentado gap */}
          {fields.map((f, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={1.5}> {/* Aumentado gap */}
              {f.icon && (
                <Box sx={{ fontSize: "1.5rem" }}> {/* Hacer iconos más grandes */}
                  {f.icon}
                </Box>
              )}
              <Typography variant="body1" fontWeight="bold"> {/* Cambiado de body2 a body1 */}
                {f.label}:
              </Typography>
              <Typography variant="body1">{f.value}</Typography> {/* Cambiado de body2 a body1 */}
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* 🔘 Acciones */}
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}> {/* Aumentado padding y gap */}
        <Button
          onClick={() => console.log("Ver publicación")}
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Ver Publicación
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
