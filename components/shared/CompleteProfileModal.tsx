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
  Checkbox,
  FormControlLabel,
  FormHelperText,
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

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
    // Validación: Debe aceptar términos para continuar
    if (!acceptedTerms) {
      setTermsError("Debes aceptar los términos de privacidad para continuar y permitir que las empresas vean tu perfil.");
      return;
    }
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
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Completa tu perfil
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Por favor, completa la siguiente información para continuar
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Nombre completo"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            sx={{ mb: 3 }}
            size="medium"
          />

          <FormControl fullWidth required sx={{ mb: 3 }}>
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

          <FormControl fullWidth required sx={{ mb: 3 }}>
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
            sx={{ mb: 3 }}
            size="medium"
          />

          <TextField
            fullWidth
            
            type="number"
            label="Año de egreso"
            inputProps={{ min: 2000, max: 2030 }}
            value={formData.anioEgreso}
            onChange={(e) =>
              handleChange("anioEgreso", parseInt(e.target.value))
            }
            sx={{ mb: 3 }}
            size="medium"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción"
            placeholder="Cuéntanos sobre ti, tus intereses profesionales..."
            value={formData.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            sx={{ mb: 4 }}
          />

          {/* Términos de privacidad y visibilidad del perfil */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setTermsError(null);
                  }}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los términos de privacidad y autorizo que las empresas puedan ver mi perfil.
                </Typography>
              }
            />
            {termsError && (
              <FormHelperText error sx={{ ml: 1.5 }}>
                {termsError}
              </FormHelperText>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || formData.idCarrera === 0 || !acceptedTerms}
            sx={{ py: 2 }}
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
