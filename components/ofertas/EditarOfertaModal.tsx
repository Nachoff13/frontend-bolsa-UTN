"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormHelperText,
  CircularProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CrearOfertaDTO, OfertaDTO } from '@/types/dto/ofertaDTO';
import { OpcionFiltro } from '@/types/dto/filter/opcionFiltroDTO';
import { genericService } from '@/services/generic.service';

// Tipo flexible para manejar tanto OpcionFiltro como DTOs del backend
type CatalogOption = {
  id?: number;
  codigo?: string;
  descripcion?: string;
  nombre?: string;
};

// Schema de validación SIN fechas
const editarOfertaSchema = z.object({
  titulo: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres'),
  descripcion: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  idModalidad: z.union([z.string(), z.number()]).refine(val => val !== '' && val !== null && val !== undefined, 'Debe seleccionar una modalidad'),
  idTipoContrato: z.union([z.string(), z.number()]).refine(val => val !== '' && val !== null && val !== undefined, 'Debe seleccionar un tipo de contrato'),
  idLocalidad: z.string().min(1, 'Debe seleccionar una localidad'),
  cupos: z.number()
    .min(1, 'Debe haber al menos 1 cupo disponible')
    .max(999, 'El número de cupos no puede exceder 999'),
});

type EditarOfertaFormData = z.infer<typeof editarOfertaSchema>;

interface EditarOfertaModalProps {
  open: boolean;
  oferta: OfertaDTO | null;
  onClose: () => void;
  onSubmit: (id: number, data: CrearOfertaDTO) => Promise<void>;
}

export default function EditarOfertaModal({ open, oferta, onClose, onSubmit }: EditarOfertaModalProps) {
  const [modalidades, setModalidades] = useState<CatalogOption[]>([]);
  const [tiposContrato, setTiposContrato] = useState<CatalogOption[]>([]);
  const [localidades, setLocalidades] = useState<CatalogOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditarOfertaFormData>({
    resolver: zodResolver(editarOfertaSchema),
  });

  useEffect(() => {
    if (open) {
      cargarCatalogos();
    }
  }, [open]);

  useEffect(() => {
    if (oferta && modalidades.length > 0 && tiposContrato.length > 0 && localidades.length > 0) {
      // Buscar los IDs correspondientes basados en los nombres
      const modalidadId = modalidades.find(m => m.descripcion === oferta.modalidad || m.nombre === oferta.modalidad)?.id || '';
      const tipoContratoId = tiposContrato.find(t => t.descripcion === oferta.tipoContrato || t.nombre === oferta.tipoContrato)?.id || '';
      const localidadId = localidades.find(l => l.descripcion === oferta.nombreLocalidad || l.nombre === oferta.nombreLocalidad)?.id || '';

      reset({
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        idModalidad: modalidadId,
        idTipoContrato: tipoContratoId,
        idLocalidad: String(localidadId),
        cupos: oferta.cupos || 1,
      });
    }
  }, [oferta, modalidades, tiposContrato, localidades, reset]);

  const cargarCatalogos = async () => {
    try {
      setLoading(true);
      
      const [modos, tipos, locs] = await Promise.all([
        genericService.getModalidad(),
        genericService.getTipoContrato(),
        genericService.getLocalidades()
      ]);
      
      setModalidades(modos as CatalogOption[]);
      setTiposContrato(tipos as CatalogOption[]);
      setLocalidades(locs as CatalogOption[]);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = async (data: EditarOfertaFormData) => {
    if (!oferta) return;

    try {
      setIsSubmitting(true);
      
      // Crear el DTO para actualización (sin fechas)
      const ofertaData: CrearOfertaDTO = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        idModalidad: typeof data.idModalidad === 'string' ? parseInt(data.idModalidad) : data.idModalidad,
        idTipoContrato: typeof data.idTipoContrato === 'string' ? parseInt(data.idTipoContrato) : data.idTipoContrato,
        idLocalidad: parseInt(data.idLocalidad),
        cupos: data.cupos,
        // NO incluimos fechaInicio ni fechaFin
      };
      
      await onSubmit(oferta.id, ofertaData);
      handleClose();
    } catch (error) {
      console.error('Error al actualizar oferta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="div" fontWeight={600}>
            Editar Oferta
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Modifica los detalles de tu oferta laboral
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" id="editar-oferta-form" onSubmit={handleSubmit(onFormSubmit)}>
            <Stack spacing={3}>
              {/* Título */}
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Título de la oferta"
                    fullWidth
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                    placeholder="Ej: Desarrollador Full Stack Senior"
                    variant="outlined"
                  />
                )}
              />

              {/* Descripción */}
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                    placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                    variant="outlined"
                  />
                )}
              />

              {/* Modalidad */}
              <Controller
                name="idModalidad"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.idModalidad} variant="outlined">
                    <InputLabel>Modalidad</InputLabel>
                    <Select
                      {...field}
                      label="Modalidad"
                      value={field.value || ''}
                    >
                      {modalidades.map((modalidad, index) => (
                        <MenuItem key={modalidad.id || modalidad.codigo || index} value={modalidad.id || modalidad.codigo || index}>
                          {modalidad.descripcion || modalidad.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.idModalidad && (
                      <FormHelperText>{errors.idModalidad.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Tipo de Contrato */}
              <Controller
                name="idTipoContrato"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.idTipoContrato} variant="outlined">
                    <InputLabel>Tipo de Contrato</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Contrato"
                      value={field.value || ''}
                    >
                      {tiposContrato.map((tipo, index) => (
                        <MenuItem key={tipo.id || tipo.codigo || index} value={tipo.id || tipo.codigo || index}>
                          {tipo.descripcion || tipo.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.idTipoContrato && (
                      <FormHelperText>{errors.idTipoContrato.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Localidad */}
              <Controller
                name="idLocalidad"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={localidades}
                    getOptionLabel={(option) => {
                      if (option.descripcion) {
                        return option.descripcion;
                      }
                      if (option.nombre) {
                        return option.nombre;
                      }
                      return String(option);
                    }}
                    value={localidades.find(loc => 
                      String(loc.codigo) === String(field.value) || 
                      String(loc.id) === String(field.value)
                    ) || null}
                    onChange={(_, newValue) => {
                      const value = newValue?.id || newValue?.codigo || '';
                      field.onChange(String(value));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Localidad"
                        error={!!errors.idLocalidad}
                        helperText={errors.idLocalidad?.message}
                        placeholder="Selecciona una localidad"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />

              {/* Cupos */}
              <Controller
                name="cupos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cantidad de Cupos"
                    fullWidth
                    type="number"
                    error={!!errors.cupos}
                    helperText={errors.cupos?.message || 'Número de puestos disponibles para esta oferta'}
                    placeholder="Ej: 1"
                    variant="outlined"
                    inputProps={{ min: 1, max: 999 }}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                )}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="editar-oferta-form"
          variant="contained"
          disabled={isSubmitting || loading}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

