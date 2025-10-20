"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { candidatoService } from "@/services/candidato.service";
import { genericService } from "@/services/generic.service";

interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
}

interface CompleteProfileModalProps {
  isOpen: boolean;
  userEmail: string;
  onComplete: () => void;
}

export default function CompleteProfileModal({
  isOpen,
  userEmail,
  onComplete,
}: CompleteProfileModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    idGenero: 1,
    idCarrera: 0,
    legajo: "",
    anioEgreso: new Date().getFullYear(),
    descripcion: "",
  });
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCarreras();
    }
  }, [isOpen]);

  const fetchCarreras = async () => {
    console.log("🔍 Modal - Cargando carreras...");
    setLoadingCarreras(true);
    try {
      const response: any = await genericService.getCarreras();
      console.log("✅ Carreras recibidas:", response);
      console.log("📊 Cantidad de carreras:", response?.length || 0);
      setCarreras(response || []);
    } catch (error) {
      console.error("❌ Error al cargar carreras:", error);
    } finally {
      setLoadingCarreras(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await candidatoService.completarPerfil({
        email: userEmail,
        ...formData,
      });
      onComplete();
    } catch (error: any) {
      console.error("Error:", error);
      alert(error?.message || "Error al completar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Completa tu perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Por favor, completa la siguiente información para continuar
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Nombre completo"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel>Género</InputLabel>
            <Select
              value={formData.idGenero}
              label="Género"
              onChange={(e) => handleChange("idGenero", e.target.value)}
            >
              <MenuItem value={1}>Masculino</MenuItem>
              <MenuItem value={2}>Femenino</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel>Carrera</InputLabel>
            <Select
              value={formData.idCarrera}
              label="Carrera"
              onChange={(e) => handleChange("idCarrera", e.target.value)}
              disabled={loadingCarreras}
            >
              <MenuItem value={0}>
                {loadingCarreras ? "Cargando..." : "Seleccionar carrera..."}
              </MenuItem>
              {carreras.map((carrera) => (
                <MenuItem key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Legajo"
            placeholder="Ej: 12345"
            value={formData.legajo}
            onChange={(e) => handleChange("legajo", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="number"
            label="Año de egreso"
            inputProps={{ min: 2000, max: 2030 }}
            value={formData.anioEgreso}
            onChange={(e) =>
              handleChange("anioEgreso", parseInt(e.target.value))
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            placeholder="Cuéntanos sobre ti, tus intereses profesionales..."
            value={formData.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || formData.idCarrera === 0}
            sx={{ py: 1.5 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Guardando...
              </>
            ) : (
              "Guardar perfil"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
