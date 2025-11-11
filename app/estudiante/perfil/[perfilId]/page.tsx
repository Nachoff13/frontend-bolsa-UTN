"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { candidatoService } from "@/services/candidato.service";
import type { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import type { CompetenciaDTO } from "@/types/dto/competenciaDTO";
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
  Autocomplete,
} from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import FileUpload from "@/components/shared/FileUpload";
import PhotoEditor from "@/components/shared/PhotoEditor";
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
  CameraAlt,
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

  // Estados para foto de perfil
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);

  // Estados para competencias
  const [allCompetencias, setAllCompetencias] = useState<CompetenciaDTO[]>([]);
  const [loadingCompetencias, setLoadingCompetencias] = useState(false);

  // Obtener el perfilId de los parámetros de la ruta
  const perfilId = params?.perfilId
    ? parseInt(params.perfilId as string, 10)
    : 2;

  // Verificar si el perfil que se está viendo es del usuario logueado
  const isOwnProfile = userPerfilId === perfilId;

  // Debug: verificar el perfilId
  // PerfilId from params processed

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
          competencias: data.competencias || [],
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

  // Cargar todas las competencias disponibles
  useEffect(() => {
    const fetchCompetencias = async () => {
      try {
        setLoadingCompetencias(true);
        const competencias = await candidatoService.getAllCompetencias();
        setAllCompetencias(competencias);
      } catch (error) {
        console.error("Error al cargar competencias:", error);
        showMessage("Error al cargar competencias", SnackbarType.Error);
      } finally {
        setLoadingCompetencias(false);
      }
    };

    if (isOwnProfile && editMode) {
      fetchCompetencias();
    }
  }, [isOwnProfile, editMode, showMessage]);

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
        competencias: perfil.competencias || [],
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSavingChanges(true);

      if (!perfil || !perfilId) return;

      // 1. Actualizar datos básicos del perfil
      const updatedPerfil: PerfilCandidatoDTO = {
        ...perfil,
        nombre: editedData.nombre,
        descripcion: editedData.descripcion,
        idCarrera: editedData.idCarrera,
        anioEgreso: editedData.anioEgreso,
      };

      await candidatoService.updatePerfil(updatedPerfil);

      // 2. Actualizar competencias
      const currentCompetencias = perfil.competencias || [];
      const newCompetencias = editedData.competencias || [];

      // Determinar competencias agregadas y eliminadas
      const added = newCompetencias.filter(
        (comp: CompetenciaDTO) =>
          !currentCompetencias.some((curr) => curr.id === comp.id)
      );
      const removed = currentCompetencias.filter(
        (curr) =>
          !newCompetencias.some((comp: CompetenciaDTO) => comp.id === curr.id)
      );

      // Agregar nuevas competencias
      for (const competencia of added) {
        await candidatoService.addCompetencia(perfil.id, competencia.id);
      }

      // Eliminar competencias
      for (const competencia of removed) {
        await candidatoService.removeCompetencia(perfil.id, competencia.id);
      }

      // 3. Recargar perfil
      const data = await candidatoService.getPerfilById(perfilId);
      setPerfil(data);
      setEditedData({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        idCarrera: data.idCarrera || 0,
        anioEgreso: data.anioEgreso || new Date().getFullYear(),
        competencias: data.competencias || [],
      });

      setEditMode(false);
      showMessage("Perfil actualizado exitosamente", SnackbarType.Success);
    } catch (error: any) {
      showMessage(
        error?.message || "Error al actualizar perfil",
        SnackbarType.Error
      );
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCompetenciasChange = (event: any, newValue: CompetenciaDTO[]) => {
    // Solo actualizar el estado local, NO guardar en el backend todavía
    setEditedData({ ...editedData, competencias: newValue });
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

      // Uploading CV for perfilId

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
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_${
        perfil.nombre || "candidato"
      }_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage("CV descargado exitosamente", SnackbarType.Success);
    } catch (error) {
      showMessage("Error al descargar el CV", SnackbarType.Error);
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !perfilId || isNaN(perfilId)) return;

    // Validar que sea una imagen
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      showMessage(
        "Por favor selecciona una imagen válida (JPG, PNG, GIF o WEBP)",
        SnackbarType.Error
      );
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
    event.target.value = "";
  };

  const handleConfirmPhoto = async (croppedImageBlob: Blob) => {
    if (!perfilId || isNaN(perfilId)) return;

    try {
      setUploadingPhoto(true);

      // Convertir blob a File
      const croppedFile = new File([croppedImageBlob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      await candidatoService.uploadFotoPerfil(croppedFile, perfilId);

      showMessage(
        "Foto de perfil actualizada exitosamente",
        SnackbarType.Success
      );

      // Recargar el perfil para mostrar la nueva foto
      const data = await candidatoService.getPerfilById(perfilId);
      setPerfil(data);

      // Cerrar el diálogo y limpiar estados
      setPhotoEditorOpen(false);
      setPhotoPreview(null);
    } catch (error: any) {
      showMessage(
        error?.message || "Error al subir la foto de perfil",
        SnackbarType.Error
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoEditorOpen(false);
    setPhotoPreview(null);
  };

  if (loading) return <LoadingModal open={loading} />;
  if (!perfil)
    return (
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Titulo
          titulo={`Perfil ${perfil.nombre ? `de ${perfil.nombre}` : ""}`}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${perfil.porcentajePerfil ?? 0}% completado`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600,

           height: 50, // igual altura que un botón MUI
              borderRadius: "8px",

             }}
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
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={
                    perfil.fotoPerfil
                      ? `data:image/jpeg;base64,${perfil.fotoPerfil}`
                      : undefined
                  }
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "2.5rem",
                    fontWeight: 600,
                  }}
                >
                  {!perfil.fotoPerfil && perfil.nombre
                    ? perfil.nombre.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                {isOwnProfile && (
                  <>
                    <input
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      style={{ display: "none" }}
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
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                          boxShadow: 2,
                        }}
                        size="small"
                      >
                        <CameraAlt fontSize="small" />
                      </IconButton>
                    </label>
                  </>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                  {perfil.nombre || "Nombre no disponible"}
                </Typography>
                {perfil.carreraNombre && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    {perfil.carreraNombre}
                  </Typography>
                )}
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 1 }}
                >
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
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
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
            {perfil.competencias && perfil.competencias.length > 0 ? (
              <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
                {perfil.competencias.map((competencia) => (
                  <Chip
                    key={competencia.id}
                    label={competencia.nombre}
                    color="primary"
                  />
                ))}
              </Stack>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {isOwnProfile
                  ? "No has agregado competencias aún. Edita tu perfil para agregar tus habilidades."
                  : "Este usuario no ha agregado competencias aún."}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Educación */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
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
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Description color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Curriculum Vitae
              </Typography>
            </Stack>

            {perfil.cv ? (
              <Box sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <CheckCircle color="success" />
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={500}
                  >
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
                  sx={{ fontWeight: 500, cursor: "pointer" }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontStyle: "italic" }}
                >
                  {isOwnProfile
                    ? "No hay CV cargado. Sube tu CV en formato PDF."
                    : "Este usuario no ha cargado un CV aún."}
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              {/* <Box>
                <Typography variant="caption" color="text.secondary">ID de Perfil</Typography>
                <Typography variant="body2">{perfil.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID de Usuario</Typography>
                <Typography variant="body2">{perfil.idUsuario}</Typography>
              </Box> */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Estado del Usuario
                </Typography>
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
                <Typography variant="caption" color="text.secondary">
                  Fecha de Alta
                </Typography>
                <Typography variant="body2">
                  {perfil.fechaAlta
                    ? new Date(perfil.fechaAlta).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Modal de Edición - Solo visible para el dueño del perfil */}
      {isOwnProfile && (
        <Dialog
          open={editMode}
          onClose={handleCancelEdit}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
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
                onChange={(e) =>
                  setEditedData({ ...editedData, nombre: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Carrera</InputLabel>
                <Select
                  value={editedData.idCarrera}
                  label="Carrera"
                  onChange={(e) =>
                    setEditedData({ ...editedData, idCarrera: e.target.value })
                  }
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
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    anioEgreso: parseInt(e.target.value),
                  })
                }
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                placeholder="Cuéntanos sobre ti, tus intereses profesionales..."
                value={editedData.descripcion}
                onChange={(e) =>
                  setEditedData({ ...editedData, descripcion: e.target.value })
                }
              />

              {/* Campo de Competencias */}
              <Autocomplete
                multiple
                options={allCompetencias}
                getOptionLabel={(option) => option.nombre}
                value={editedData.competencias || []}
                onChange={handleCompetenciasChange}
                loading={loadingCompetencias}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Habilidades y Competencias"
                    placeholder="Selecciona tus competencias..."
                    helperText="Busca y selecciona las habilidades que dominas"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.nombre}
                      {...getTagProps({ index })}
                      color="primary"
                      key={option.id}
                    />
                  ))
                }
                noOptionsText="No se encontraron competencias"
                loadingText="Cargando competencias..."
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
