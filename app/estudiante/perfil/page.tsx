"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { candidatoService } from "@/services/candidato.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import LoadingModal from "@/components/shared/LoadingModal";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarType } from "@/types/enums/snackbar";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import FileUpload from "@/components/shared/FileUpload";
import PhotoEditor from "@/components/shared/PhotoEditor";
import {
  Email,
  Phone,
  LocationOn,
  School,
  Description,
  CheckCircle,
  Cancel,
  Edit,
  Save,
  Close,
  CameraAlt,
} from "@mui/icons-material";
import { genericService } from "@/services/generic.service";

interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
}

export default function PerfilEstudiantePage() {
  const { user, perfilId } = useAuth();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilCandidatoDTO | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // Estados para edición
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [savingChanges, setSavingChanges] = useState(false);
  
  // Estados para foto de perfil
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        
        console.log("🔍 Cargando perfil con perfilId:", perfilId);
        
        if (!perfilId) {
          showMessage("No se encontró el ID del perfil del usuario", SnackbarType.Error);
          return;
        }
        
        // Obtener el perfil usando el perfilId del contexto
        const data = await candidatoService.getPerfilById(perfilId);
        console.log("✅ Perfil cargado:", data);
        setPerfil(data);
        setEditedData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          idCarrera: data.idCarrera || 0,
          anioEgreso: data.anioEgreso || new Date().getFullYear(),
        });
      } catch (e: any) {
        console.error("❌ Error cargando perfil:", e);
        showMessage(e?.message ?? "Error cargando perfil", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo cargar cuando perfilId esté disponible
    if (perfilId) {
      fetchPerfil();
    }
  }, [perfilId, showMessage]);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response: any = await genericService.getCarreras();
        setCarreras(response || []);
      } catch (error) {
        console.error("Error al cargar carreras:", error);
      }
    };
    
    if (editMode && carreras.length === 0) {
      fetchCarreras();
    }
  }, [editMode]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Restaurar datos originales
    if (perfil) {
      setEditedData({
        nombre: perfil.nombre || "",
        descripcion: perfil.descripcion || "",
        idCarrera: perfil.idCarrera || 0,
        anioEgreso: perfil.anioEgreso || new Date().getFullYear(),
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSavingChanges(true);
      
      if (!perfil || !perfilId) return;

      const updatedPerfil: PerfilCandidatoDTO = {
        ...perfil,
        nombre: editedData.nombre,
        descripcion: editedData.descripcion,
        idCarrera: editedData.idCarrera,
        anioEgreso: editedData.anioEgreso,
      };

      await candidatoService.updatePerfil(updatedPerfil);
      
      // Recargar perfil usando el perfilId del contexto
      const data = await candidatoService.getPerfilById(perfilId);
      setPerfil(data);
      
      setEditMode(false);
      showMessage("Perfil actualizado exitosamente", SnackbarType.Success);
    } catch (error: any) {
      showMessage(error?.message || "Error al actualizar perfil", SnackbarType.Error);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setCvUploadError(null);
    setUploadedFileName(null);
  };

  const handleCvUpload = async (file: File) => {
    try {
      setUploadingCv(true);
      setCvUploadError(null);
      
      if (!perfil?.id) {
        throw new Error("ID de perfil inválido");
      }
      
      await candidatoService.uploadCv(file, perfil.id);
      
      setUploadedFileName(file.name);
      showMessage("CV subido exitosamente", SnackbarType.Success);
      
      // Recargar el perfil
      const data = await candidatoService.getPerfilById(perfil.id);
      setPerfil(data);
      
    } catch (error: any) {
      const errorMessage = error?.message || "Error al subir el CV";
      setCvUploadError(errorMessage);
      showMessage(errorMessage, SnackbarType.Error);
    } finally {
      setUploadingCv(false);
    }
  };

  const handleCvDownload = () => {
    if (!perfil?.cv) {
      showMessage("No hay CV disponible para descargar", SnackbarType.Error);
      return;
    }

    try {
      const byteCharacters = atob(perfil.cv);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${perfil.nombre || 'candidato'}_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage("CV descargado exitosamente", SnackbarType.Success);
    } catch (error) {
      showMessage("Error al descargar el CV", SnackbarType.Error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !perfil?.id) return;

    // Validar que sea una imagen
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showMessage("Por favor selecciona una imagen válida (JPG, PNG, GIF o WEBP)", SnackbarType.Error);
      return;
    }

    // Validar tamaño máximo (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage("La imagen no debe superar los 2MB", SnackbarType.Error);
      return;
    }

    // Crear vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setPhotoEditorOpen(true);
    };
    reader.readAsDataURL(file);
    
    // Limpiar el input para permitir seleccionar la misma imagen de nuevo
    event.target.value = '';
  };

  const handleConfirmPhoto = async (croppedImageBlob: Blob) => {
    if (!perfil?.id) return;

    try {
      setUploadingPhoto(true);
      
      // Convertir blob a File
      const croppedFile = new File([croppedImageBlob], 'profile-photo.jpg', { 
        type: 'image/jpeg' 
      });
      
      await candidatoService.uploadFotoPerfil(croppedFile, perfil.id);
      
      showMessage("Foto de perfil actualizada exitosamente", SnackbarType.Success);
      
      // Recargar el perfil para mostrar la nueva foto
      const data = await candidatoService.getPerfilById(perfil.id);
      setPerfil(data);
      
      // Cerrar el diálogo y limpiar estados
      setPhotoEditorOpen(false);
      setPhotoPreview(null);
    } catch (error: any) {
      showMessage(error?.message || "Error al subir la foto de perfil", SnackbarType.Error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoEditorOpen(false);
    setPhotoPreview(null);
  };

  if (loading) return <LoadingModal open={loading} />;
  if (!perfil) return (
    <Box sx={{ maxWidth: 1200, mx: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h6" color="text.secondary">
        No se pudo cargar el perfil
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Titulo titulo="Mi Perfil" />
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${perfil.porcentajePerfil ?? 0}% completado`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          {!editMode && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditClick}
              sx={{ textTransform: "none" }}
            >
              Editar Perfil
            </Button>
          )}
        </Stack>
      </Stack>

      <Stack spacing={3}>
        {/* Información Personal */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={perfil.fotoPerfil ? `data:image/jpeg;base64,${perfil.fotoPerfil}` : undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "2.5rem",
                    fontWeight: 600,
                  }}
                >
                  {!perfil.fotoPerfil && perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <input
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                  id="foto-perfil-upload"
                  type="file"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                <label htmlFor="foto-perfil-upload">
                  <IconButton
                    component="span"
                    disabled={uploadingPhoto}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      boxShadow: 2,
                    }}
                    size="small"
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </label>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                  {perfil.nombre || "Nombre no disponible"}
                </Typography>
                {perfil.carreraNombre && (
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    {perfil.carreraNombre}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                  {perfil.legajo && (
                    <Chip 
                      label={`Legajo: ${perfil.legajo}`} 
                      color="primary" 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {perfil.generoNombre && (
                    <Chip 
                      label={perfil.generoNombre} 
                      variant="outlined" 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Stack>
                <Stack spacing={1}>
                  {perfil.email && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.email}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Sobre mí */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Sobre mí
            </Typography>
            {perfil.descripcion ? (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {perfil.descripcion}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No hay descripción disponible
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Educación */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <School color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Educación
              </Typography>
            </Stack>
            <Box sx={{ pl: 4 }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                {perfil.carreraNombre ?? "Carrera no especificada"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Universidad Tecnológica Nacional - FRLP
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {perfil.anioEgreso && (
                  <Chip 
                    label={`Egreso: ${perfil.anioEgreso}`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* CV */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Description color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Curriculum Vitae
              </Typography>
            </Stack>
            
            {perfil.cv ? (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body2" color="success.main" fontWeight={500}>
                    CV cargado exitosamente
                  </Typography>
                </Stack>
                <Chip
                  icon={<Description />}
                  label="Descargar CV"
                  color="primary"
                  variant="outlined"
                  clickable
                  onClick={handleCvDownload}
                  sx={{ fontWeight: 500, cursor: 'pointer' }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
                  No hay CV cargado. Sube tu CV en formato PDF.
                </Typography>
              </Box>
            )}

            <FileUpload
              onFileSelect={handleFileSelect}
              onUpload={handleCvUpload}
              isUploading={uploadingCv}
              uploadedFileName={uploadedFileName || undefined}
              accept=".pdf"
              maxSize={5}
              error={cvUploadError || undefined}
            />
          </CardContent>
        </Card>
      </Stack>

      {/* Modal de Edición */}
      <Dialog open={editMode} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Editar Perfil
            </Typography>
            <IconButton onClick={handleCancelEdit} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={editedData.nombre}
              onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Carrera</InputLabel>
              <Select
                value={editedData.idCarrera}
                label="Carrera"
                onChange={(e) => setEditedData({ ...editedData, idCarrera: e.target.value })}
              >
                <MenuItem value={0}>Seleccionar carrera...</MenuItem>
                {carreras.map((carrera) => (
                  <MenuItem key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Año de egreso"
              inputProps={{ min: 2000, max: 2030 }}
              value={editedData.anioEgreso}
              onChange={(e) => setEditedData({ ...editedData, anioEgreso: parseInt(e.target.value) })}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              placeholder="Cuéntanos sobre ti, tus intereses profesionales..."
              value={editedData.descripcion}
              onChange={(e) => setEditedData({ ...editedData, descripcion: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCancelEdit} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            startIcon={<Save />}
            disabled={savingChanges}
          >
            {savingChanges ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Editor de Foto de Perfil */}
      {photoPreview && (
        <PhotoEditor
          open={photoEditorOpen}
          imageSrc={photoPreview}
          onCancel={handleCancelPhoto}
          onConfirm={handleConfirmPhoto}
          uploading={uploadingPhoto}
        />
      )}
    </Box>
  );
}