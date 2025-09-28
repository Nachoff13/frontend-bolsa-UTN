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
  color?: "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";
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
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
    >
      {/* Título */}
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
        {title}
      </DialogTitle>

      {/* Contenido */}
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          {fields.map((f, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={1}>
              {f.icon}
              <Typography variant="body2" fontWeight="bold">
                {f.label}:
              </Typography>
              <Typography variant="body2">{f.value}</Typography>
            </Box>
          ))}

          {chips.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
              {chips.map((chip, idx) => (
                <Chip key={idx} label={chip.label} color={chip.color ?? "default"} size="small" />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
        {actions}
      </DialogActions>
    </Dialog>
  );
}
