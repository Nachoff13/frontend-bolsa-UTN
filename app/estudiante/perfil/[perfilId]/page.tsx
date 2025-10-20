"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { candidatoService } from "@/services/candidato.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import LoadingModal from "@/components/shared/LoadingModal";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarType } from "@/types/enums/snackbar";
import { useAuth } from "@/components/providers/AuthProvider";
import { genericService } from "@/services/generic.service";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  Paper,
  LinearProgress,
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
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Description,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
  Edit,
  Save,
  Close,
} from "@mui/icons-material";

interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
}

export default function PerfilEstudiantePage() {
  const params = useParams();
  const { showMessage } = useSnackbar();
  const { perfilId: userPerfilId } = useAuth(); // perfilId del usuario logueado
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

  // Obtener el perfilId de los parámetros de la ruta
  const perfilId = params?.perfilId ? parseInt(params.perfilId as string, 10) : 2;
  
  // Verificar si el perfil que se está viendo es del usuario logueado
  const isOwnProfile = userPerfilId === perfilId;
  
  // Debug: verificar el perfilId
  console.log('🔧 PerfilId from params:', params?.perfilId);
  console.log('🔧 Parsed perfilId:', perfilId);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        if (!perfilId || isNaN(perfilId)) {
          showMessage("ID de perfil inválido", SnackbarType.Error);
          return;
        }
        const data = await candidatoService.getPerfilById(perfilId);
        setPerfil(data);
        
        // Inicializar datos para edición
        setEditedData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          idCarrera: data.idCarrera || 0,
          anioEgreso: data.anioEgreso || new Date().getFullYear(),
        });
      } catch (e: any) {
        showMessage(e?.message ?? "Error cargando perfil", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
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
      
      // Recargar perfil
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
      
      // Validar que perfilId sea válido
      if (!perfilId || isNaN(perfilId)) {
        throw new Error("ID de perfil inválido");
      }
      
      console.log('🔧 Uploading CV for perfilId:', perfilId);
      
      await candidatoService.uploadCv(file, perfilId);
      
      setUploadedFileName(file.name);
      showMessage("CV subido exitosamente", SnackbarType.Success);
      
      // Recargar el perfil para obtener la información actualizada
      const data = await candidatoService.getPerfilById(perfilId);
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
      // Convertir base64 a blob
      const byteCharacters = atob(perfil.cv);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crear URL del blob y descargar
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

  if (loading) return <LoadingModal open={loading} />;
  if (!perfil) return (
    <Box sx={{ maxWidth: 1200, mx: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h6" color="text.secondary">
        No se pudo cargar el perfil
      </Typography>
    </Box>
  );

  const educacion = {
    titulo: perfil.carreraNombre ?? perfil.carrera ?? "Carrera no especificada",
    institucion: "Universidad Tecnológica Nacional - FRLP",
    periodo: perfil.anioEgreso ? `Hasta ${perfil.anioEgreso}` : "En curso",
    progreso: `${perfil.porcentajePerfil ?? 0}% completado`,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Titulo titulo={`Perfil ${perfil.nombre ? `de ${perfil.nombre}` : ''}`} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${perfil.porcentajePerfil ?? 0}% completado`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          {isOwnProfile && !editMode && (
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
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: "2.5rem",
                  fontWeight: 600,
                }}
              >
                {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : "U"}
              </Avatar>
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
                  {perfil.rolNombre && (
                    <Chip 
                      label={perfil.rolNombre} 
                      variant="outlined" 
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
                  {perfil.telefono && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.telefono}
                      </Typography>
                    </Stack>
                  )}
                  {perfil.localidad && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {perfil.localidad}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Sobre mí */}
        {perfil.descripcion && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Sobre mí
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {perfil.descripcion}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Habilidades y Competencias */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Habilidades y Competencias
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
              {/* Habilidades hardcodeadas por ahora */}
              <Chip label="Python" color="primary" />
              <Chip label="SQL" color="primary" />
              <Chip label="React" color="primary" />
              <Chip label="Angular" color="primary" />
              <Chip label="Metodologías Ágiles" color="primary" />
            </Stack>
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
                {educacion.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {educacion.institucion}
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
                  {isOwnProfile ? "No hay CV cargado. Sube tu CV en formato PDF." : "Este usuario no ha cargado un CV aún."}
                </Typography>
              </Box>
            )}

            {isOwnProfile && (
              <FileUpload
                onFileSelect={handleFileSelect}
                onUpload={handleCvUpload}
                isUploading={uploadingCv}
                uploadedFileName={uploadedFileName || undefined}
                accept=".pdf"
                maxSize={5}
                error={cvUploadError || undefined}
              />
            )}
          </CardContent>
        </Card>

        {/* Información adicional del sistema */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Información del Sistema
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">ID de Perfil</Typography>
                <Typography variant="body2">{perfil.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID de Usuario</Typography>
                <Typography variant="body2">{perfil.idUsuario}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Estado del Usuario</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {perfil.usuarioActivo ? (
                    <CheckCircle color="success" sx={{ fontSize: 16 }} />
                  ) : (
                    <Cancel color="error" sx={{ fontSize: 16 }} />
                  )}
                  <Typography variant="body2">
                    {perfil.usuarioActivo ? "Activo" : "Inactivo"}
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Fecha de Alta</Typography>
                <Typography variant="body2">
                  {perfil.fechaAlta ? new Date(perfil.fechaAlta).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Modal de Edición - Solo visible para el dueño del perfil */}
      {isOwnProfile && (
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
      )}
    </Box>
  );
}
