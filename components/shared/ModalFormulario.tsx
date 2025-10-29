"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
export type CampoFormulario = {
  id: string;
  label: string;
  placeholder?: string;
  tipo?: "text" | "textarea";
  valorInicial?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (valores: Record<string, string>) => void;
  titulo: string;
  campos: CampoFormulario[];
};

export default function ModalFormulario({
  open,
  onClose,
  onSubmit,
  titulo,
  campos,
}: Props) {
  const [valores, setValores] = useState<Record<string, string>>(
    Object.fromEntries(campos.map((c) => [c.id, c.valorInicial ?? ""]))
  );

  const handleChange = (id: string, valor: string) => {
    setValores((prev) => ({ ...prev, [id]: valor }));
  };

  const handleGuardar = () => {
    onSubmit(valores);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">{titulo}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {campos.map((campo) => (
            <Grid key={campo.id} size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline={campo.tipo === "textarea"}
                minRows={campo.tipo === "textarea" ? 3 : 1}
                label={campo.label}
                placeholder={campo.placeholder}
                value={valores[campo.id]}
                onChange={(e) => handleChange(campo.id, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 120,
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          sx={{
            minWidth: 120,
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
