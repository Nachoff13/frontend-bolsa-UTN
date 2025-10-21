"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
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
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CrearOfertaDTO } from '@/types/dto/ofertaDTO';
import { OpcionFiltro } from '@/types/dto/filter/opcionFiltroDTO';
import { genericService } from '@/services/generic.service';

// Tipo flexible para manejar tanto OpcionFiltro como DTOs del backend
type CatalogOption = {
  id?: number;
  codigo?: string;
  descripcion?: string;
  nombre?: string;
};

// Schema de validación simplificado
const ofertaCreateSchema = z.object({
  titulo: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres'),
  descripcion: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  idModalidad: z.union([z.string(), z.number()]).refine(val => val !== '' && val !== null && val !== undefined, 'Debe seleccionar una modalidad'),
  idTipoContrato: z.union([z.string(), z.number()]).refine(val => val !== '' && val !== null && val !== undefined, 'Debe seleccionar un tipo de contrato'),
  idLocalidad: z.string().min(1, 'Debe seleccionar una localidad'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional()
}).refine((data) => {
  if (data.fechaFin) {
    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);
    return fechaFin >= fechaInicio;
  }
  return true;
}, {
  message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
  path: ["fechaFin"]
});

type OfertaFormData = z.infer<typeof ofertaCreateSchema>;

interface OfertaFormProps {
  onSubmit: (data: CrearOfertaDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function OfertaForm({ onSubmit, onCancel, isSubmitting }: OfertaFormProps) {
  const [modalidades, setModalidades] = useState<CatalogOption[]>([]);
  const [tiposContrato, setTiposContrato] = useState<CatalogOption[]>([]);
  const [localidades, setLocalidades] = useState<CatalogOption[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<OfertaFormData>({
    resolver: zodResolver(ofertaCreateSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      idModalidad: '',
      idTipoContrato: '',
      idLocalidad: '',
      fechaInicio: '',
      fechaFin: ''
    }
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

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

  const onFormSubmit = (data: OfertaFormData) => {
    const ofertaData: CrearOfertaDTO = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      idModalidad: typeof data.idModalidad === 'string' ? parseInt(data.idModalidad) : data.idModalidad,
      idTipoContrato: typeof data.idTipoContrato === 'string' ? parseInt(data.idTipoContrato) : data.idTipoContrato,
      idLocalidad: parseInt(data.idLocalidad),
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin || undefined
    };
    
    onSubmit(ofertaData);
  };

  if (loading) {
    return (
      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando formulario...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Crear Nueva Oferta
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
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
                      // Manejar tanto el formato OpcionFiltro como LocalidadDTO
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
                      // Usar id si está disponible, sino codigo, siempre como string
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

              {/* Fecha de Inicio */}
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Inicio"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : '');
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fechaInicio,
                        helperText: errors.fechaInicio?.message,
                        variant: 'outlined'
                      }
                    }}
                  />
                )}
              />

              {/* Fecha de Fin */}
              <Controller
                name="fechaFin"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Fin (Opcional)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : '');
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fechaFin,
                        helperText: errors.fechaFin?.message || 'Si no se especifica, se calculará automáticamente',
                        variant: 'outlined'
                      }
                    }}
                  />
                )}
              />

              {/* Botones */}
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  sx={{ minWidth: 120 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ minWidth: 120 }}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Oferta'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}