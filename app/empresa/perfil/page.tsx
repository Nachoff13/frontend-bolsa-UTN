"use client";

import { useEffect, useState } from "react";
import { Box, Card, Typography, TextField, Button } from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import { SnackbarType } from "@/types/enums/snackbar";

export default function PerfilEmpresaPage() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState({
    razonSocial: "",
    email: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    sitioWeb: ""
  });
  const { showMessage } = useSnackbar();

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
      // Aquí iría la llamada a la API para obtener el perfil de la empresa
    }, 1000);
  }, []);

  const handleSave = () => {
    // Aquí iría la lógica para guardar el perfil
    showMessage("Perfil actualizado correctamente", SnackbarType.Success);
  };

  if (loading) return <LoadingModal open={loading} />;

  return (
    <>
      <Titulo
        titulo="Perfil de Empresa"
        subtitulo="Gestiona la información de tu empresa"
      />

      <Box mt={4}>
        <Card variant="outlined" sx={{ p: 3, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Razón Social"
                value={perfil.razonSocial}
                onChange={(e) => setPerfil({...perfil, razonSocial: e.target.value})}
                sx={{ minWidth: 300 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                sx={{ minWidth: 300 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Teléfono"
                value={perfil.telefono}
                onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                sx={{ minWidth: 300 }}
              />
              <TextField
                fullWidth
                label="Sitio Web"
                value={perfil.sitioWeb}
                onChange={(e) => setPerfil({...perfil, sitioWeb: e.target.value})}
                sx={{ minWidth: 300 }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Dirección"
              value={perfil.direccion}
              onChange={(e) => setPerfil({...perfil, direccion: e.target.value})}
            />
            
            <TextField
              fullWidth
              label="Descripción de la empresa"
              multiline
              rows={4}
              value={perfil.descripcion}
              onChange={(e) => setPerfil({...perfil, descripcion: e.target.value})}
            />
            
            <Button 
              variant="contained" 
              onClick={handleSave}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}
