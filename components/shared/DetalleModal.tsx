"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { ReactNode } from "react";
import { Info as InfoIcon } from "@mui/icons-material";

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
  onVerPublicacion?: () => void; // 👈 Nueva prop opcional
}

export default function DetalleModal({
  open,
  onClose,
  title,
  fields,
  chips = [],
  actions,
  onVerPublicacion,
}: DetalleModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 10,
          backgroundColor: "#f9fafc",
        },
      }}
    >
      {/* 🔹 Header estilizado */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #5395d6ff 0%, #2276a3ff 100%)",
          color: "white",
          py: 3,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "white", color: "#1976d2", width: 56, height: 56 }}>
            <InfoIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        {chips.length > 0 && (
          <Box display="flex" gap={1.5}>
            {chips.map((chip, idx) => (
              <Chip
                key={idx}
                label={chip.label}
                color={chip.color ?? "default"}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  backgroundColor:
                    chip.color === "info"
                      ? "#82d5ffff"
                      : chip.color === "success"
                      ? "#15803d"
                      : undefined,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 📋 Contenido con campos */}
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          {fields.map((f, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "white",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {f.icon && <Box sx={{ color: "text.secondary" }}>{f.icon}</Box>}
                <Typography variant="body1" fontWeight="bold">
                  {f.label}:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {f.value}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />
      </DialogContent>

      {/* 🔘 Acciones */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
          {onVerPublicacion && (
            <Button
              onClick={onVerPublicacion}
              variant="outlined"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
            >
              Ver Publicación
            </Button>
          )}
          {actions}
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
