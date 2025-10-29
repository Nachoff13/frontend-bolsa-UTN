"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { PerfilCompletoDTO } from "@/types/dto/perfilCompleetoDTO";
import { RolNombre } from "@/types/constants";
import { Campo } from "../shared/Campo";

type Props = {
  open: boolean;
  onClose: () => void;
  perfil: PerfilCompletoDTO | null;
};

export default function ModalDetalleUsuario({
  open,
  onClose,
  perfil,
}: Props) {
  if (!perfil) return null;

  const esEmpresa = perfil.rolNombre === RolNombre.Empresa;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      key={perfil.email ?? perfil.nombre ?? "perfil"}
    >
      <DialogTitle>
        <Typography variant="h6">
          Detalle del usuario: {perfil.nombre}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* --- Datos generales --- */}
          <Campo label="Email" valor={perfil.email} />
          <Campo label="Rol actual" valor={perfil.rolNombre} />
          <Campo label="Fecha alta" valor={perfil.fechaAlta} />
          <Campo label="Activo" valor={perfil.activo ? "Sí" : "No"} />

          {/* --- Empresa --- */}
          {esEmpresa && (
            <>
              <Campo label="Razón Social" valor={perfil.razonSocial} />
              <Campo label="CUIT" valor={perfil.cuit} />
              <Campo label="Descripción" valor={perfil.descripcionEmpresa} />
              <Campo label="Estado Validación" valor={perfil.estadoValidacion} />
            </>
          )}

          {/* --- Candidato --- */}
          {!esEmpresa && (
            <>
              <Campo label="Carrera" valor={perfil.nombreCarrera} />
              <Campo label="Legajo" valor={perfil.legajo} />
              <Campo label="Género" valor={perfil.genero} />
              <Campo label="Descripción" valor={perfil.descripcionCandidato} />
            </>
          )}
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
      </DialogActions>
    </Dialog>
  );
}