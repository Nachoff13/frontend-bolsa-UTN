"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { empresaService } from "@/services/empresa.service";
import type { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import LoadingModal from "@/components/shared/LoadingModal";
import { useSnackbar } from "@/components/providers/snackbar";
import { SnackbarType } from "@/types/enums/snackbar";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import Titulo from "@/components/shared/Titulo";
import {
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Cancel,
  Work,
  Article,
  VerifiedUser,
  PhotoCamera,
  Edit,
  Close,
  Save,
} from "@mui/icons-material";

export default function PerfilEmpresaPage() {
  const params = useParams();
  const { showMessage } = useSnackbar();
  const { perfilId: authPerfilId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilEmpresaDTO | null>(null);

  // Estados para foto de perfil
  const [uploadingFoto, setUploadingFoto] = useState(false);
  
  // Estados para edición de descripción
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedDescripcion, setEditedDescripcion] = useState("");
  const [savingChanges, setSavingChanges] = useState(false);

  // Obtener el perfilId de los parámetros de la ruta
  const perfilId = params?.perfilId ? parseInt(params.perfilId as string, 10) : authPerfilId;

  // Determinar si el usuario actual es dueño del perfil
  const isOwner = authPerfilId === perfilId;

  console.log("🔍 PerfilEmpresaPage - authPerfilId:", authPerfilId);
  console.log("🔍 PerfilEmpresaPage - perfilId (from URL):", params?.perfilId);
  console.log("🔍 PerfilEmpresaPage - perfilId (final):", perfilId);
  console.log("🔍 PerfilEmpresaPage - isOwner:", isOwner);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        if (!perfilId || isNaN(perfilId)) {
          showMessage("ID de perfil inválido", SnackbarType.Error);
          return;
        }
        const data = await empresaService.getPerfilById(perfilId);
        setPerfil(data);
      } catch (e: any) {
        showMessage(e?.message ?? "Error cargando perfil", SnackbarType.Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [perfilId, showMessage]);

  const handleFotoUpload = async (file: File) => {
    try {
      setUploadingFoto(true);
      
      if (!perfil?.id) {
        throw new Error("ID de perfil inválido");
      }
      
      await empresaService.uploadFotoPerfil(file, perfil.id);
      
      showMessage("Foto de perfil subida exitosamente", SnackbarType.Success);
      
      // Recargar el perfil
      const data = await empresaService.getPerfilById(perfil.id);
      setPerfil(data);
      
    } catch (error: any) {
      const errorMessage = error?.message || "Error al subir la foto de perfil";
      showMessage(errorMessage, SnackbarType.Error);
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditedDescripcion(perfil?.descripcion || "");
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditedDescripcion("");
  };

  const handleSaveDescripcion = async () => {
    try {
      setSavingChanges(true);
      
      if (!perfil) {
        throw new Error("Perfil no disponible");
      }

      const updatedPerfil: PerfilEmpresaDTO = {
        ...perfil,
        descripcion: editedDescripcion,
      };

      await empresaService.updatePerfil(updatedPerfil);
      
      showMessage("Descripción actualizada exitosamente", SnackbarType.Success);
      
      // Recargar el perfil
      const data = await empresaService.getPerfilById(perfil.id);
      setPerfil(data);
      
      handleCloseEditModal();
    } catch (error: any) {
      showMessage(error?.message || "Error al actualizar descripción", SnackbarType.Error);
    } finally {
      setSavingChanges(false);
    }
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

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Titulo titulo="Perfil de Empresa" />
        <Chip
          label={`${perfil.porcentajePerfil ?? 0}% completado`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {/* Información Principal */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ position: "relative" }}>
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
                {!perfil.fotoPerfil && perfil.razonSocial ? perfil.razonSocial.charAt(0).toUpperCase() : "E"}
              </Avatar>
              {isOwner && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                  component="label"
                >
                  <PhotoCamera sx={{ fontSize: 20, color: "white" }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFotoUpload(file);
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                {perfil.razonSocial || "Razón Social no disponible"}
              </Typography>
              {perfil.nombre && (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Subtitulo
                </Typography>
              )}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {perfil.rolNombre && (
                  <Chip 
                    label={perfil.rolNombre} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 500 }}
                  />
                )}
                {perfil.estadoValidacionNombre && (
                  <Chip
                    label={perfil.estadoValidacionNombre}
                    color={perfil.estadoValidacionNombre === "Aprobada" ? "success" : "warning"}
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

      {/* Layout con dos columnas */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={3}
        sx={{ alignItems: "stretch" }}
      >
        {/* Columna Izquierda */}
        <Box sx={{ flex: "0 0 33.333%", minWidth: { xs: "100%", md: "33.333%" } }}>
          <Stack spacing={3}>
            {/* Sobre Nosotros */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Sobre Nosotros
                  </Typography>
                  {isOwner && (
                    <IconButton 
                      size="small" 
                      onClick={handleOpenEditModal}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { 
                          color: 'primary.dark',
                          bgcolor: 'transparent'
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {perfil.descripcion || "No hay descripción disponible"}
                </Typography>
              </CardContent>
            </Card>

            {/* Información de la Empresa */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Información de la Empresa
                </Typography>
                <Stack spacing={2}>
                  {perfil.cuit && (
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Article color="action" sx={{ fontSize: 24 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          CUIT
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>{perfil.cuit}</Typography>
                      </Box>
                    </Stack>
                  )}
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <VerifiedUser color="action" sx={{ fontSize: 24 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Estado de Validación
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {perfil.estadoValidacionNombre || "Pendiente"}
                      </Typography>
                    </Box>
                  </Stack>
                  {perfil.usuarioActivo !== undefined && (
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {perfil.usuarioActivo ? (
                        <CheckCircle color="success" sx={{ fontSize: 24 }} />
                      ) : (
                        <Cancel color="error" sx={{ fontSize: 24 }} />
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Estado del Usuario
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {perfil.usuarioActivo ? "Activo" : "Inactivo"}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Columna Derecha - Ofertas Laborales */}
        <Box sx={{ flex: "1 1 66.667%", minWidth: { xs: "100%", md: "66.667%" } }}>
          <Card sx={{ minHeight: "500px", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Work color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Ofertas Laborales
                </Typography>
                {perfil.ofertas && perfil.ofertas.length > 0 && (
                  <Chip 
                    label={`${perfil.ofertas.length} oferta${perfil.ofertas.length !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>

              {perfil.ofertas && perfil.ofertas.length > 0 ? (
                <Stack spacing={2.5} sx={{ flex: 1 }}>
                  {perfil.ofertas.map((oferta) => (
                    <Card key={oferta.id} variant="outlined" sx={{ 
                      p: 3,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                            {oferta.titulo}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {oferta.descripcion}
                          </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                          {oferta.nombreLocalidad && (
                            <Chip
                              icon={<LocationOn />}
                              label={oferta.nombreLocalidad}
                              size="medium"
                              variant="outlined"
                              sx={{ fontSize: '0.875rem' }}
                            />
                          )}
                          <Chip 
                            label={oferta.modalidad} 
                            size="medium" 
                            color="primary"
                            sx={{ fontSize: '0.875rem' }}
                          />
                          <Chip 
                            label={oferta.tipoContrato} 
                            size="medium" 
                            color="secondary"
                            sx={{ fontSize: '0.875rem' }}
                          />
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Inicio: {new Date(oferta.fechaInicio).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Work sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                    No hay ofertas publicadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Las ofertas laborales aparecerán aquí cuando se publiquen
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Modal de Edición de Descripción */}
      <Dialog 
        open={editModalOpen} 
        onClose={handleCloseEditModal} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Editar Sobre Nosotros
            </Typography>
            <IconButton onClick={handleCloseEditModal} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Descripción"
            placeholder="Describe tu empresa, misión, valores, etc..."
            value={editedDescripcion}
            onChange={(e) => setEditedDescripcion(e.target.value)}
            sx={{ mt: 2 }}
            helperText={`${editedDescripcion.length} caracteres`}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseEditModal} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveDescripcion} 
            variant="contained" 
            startIcon={<Save />}
            disabled={savingChanges}
          >
            {savingChanges ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

