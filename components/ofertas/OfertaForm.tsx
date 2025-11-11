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
import 'dayjs/locale/es';
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
  idCarreras: z.array(z.number()).min(1, 'Debe seleccionar al menos una carrera'),
  cupos: z.number()
    .min(1, 'Debe haber al menos 1 cupo disponible')
    .max(999, 'El número de cupos no puede exceder 999'),
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
  const [carreras, setCarreras] = useState<CatalogOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [cuposInput, setCuposInput] = useState<string>('');

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
      idCarreras: [],
      cupos: 1,
      fechaInicio: '',
      fechaFin: ''
    }
  });

  // Inicializar el valor de cuposInput cuando se carga el componente
  useEffect(() => {
    setCuposInput('1');
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      setLoading(true);
      
      const [modos, tipos, locs, cars] = await Promise.all([
        genericService.getModalidad(),
        genericService.getTipoContrato(),
        genericService.getLocalidades(),
        genericService.getCarreras()
      ]);
      
      setModalidades(modos as CatalogOption[]);
      setTiposContrato(tipos as CatalogOption[]);
      setLocalidades(locs as CatalogOption[]);
      setCarreras(cars as CatalogOption[]);
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
      idCarreras: data.idCarreras,
      cupos: data.cupos,
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Card sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}> {/* Aumentado de 800 a 900 */}
        <CardContent sx={{ p: 5 }}> {/* Aumentado de 4 a 5 */}
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 5 }}> {/* Aumentado mb */}
            Crear Nueva Oferta
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Stack spacing={3.5}> {/* Aumentado de 3 a 3.5 */}
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

              {/* Carreras */}
              <Controller
                name="idCarreras"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={carreras}
                    getOptionLabel={(option) => {
                      if (option.nombre) {
                        return option.nombre;
                      }
                      if (option.descripcion) {
                        return option.descripcion;
                      }
                      return String(option);
                    }}
                    isOptionEqualToValue={(option, value) => {
                      const optionId = option.id || (option.codigo ? parseInt(option.codigo) : null);
                      const valueId = value.id || (value.codigo ? parseInt(value.codigo) : null);
                      return optionId !== null && valueId !== null && optionId === valueId;
                    }}
                    value={carreras.filter(carrera => {
                      const carreraId = carrera.id || (carrera.codigo ? parseInt(carrera.codigo) : null);
                      return carreraId !== null && field.value?.includes(carreraId);
                    })}
                    onChange={(_, newValue) => {
                      const ids = newValue
                        .map(item => {
                          if (item.id) return item.id;
                          if (item.codigo) {
                            const parsed = parseInt(item.codigo);
                            return isNaN(parsed) ? null : parsed;
                          }
                          return null;
                        })
                        .filter((id): id is number => id !== null && id !== 0);
                      field.onChange(ids);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Carreras"
                        error={!!errors.idCarreras}
                        helperText={errors.idCarreras?.message || 'Selecciona las carreras para esta oferta'}
                        placeholder="Selecciona una o más carreras"
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
                    label="Cantidad de Cupos"
                    fullWidth
                    type="number"
                    error={!!errors.cupos}
                    helperText={errors.cupos?.message || 'Número de puestos disponibles para esta oferta'}
                    placeholder="Ej: 1"
                    variant="outlined"
                    inputProps={{ min: 1, max: 999 }}
                    value={cuposInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permitir que el usuario borre completamente el campo
                      setCuposInput(value);
                      
                      // Actualizar el formulario solo si hay un valor válido
                      if (value === '') {
                        // No actualizar el formulario mientras está vacío
                        return;
                      }
                      
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 999) {
                        field.onChange(numValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Asegurar que siempre haya un valor válido al perder el foco
                      const value = e.target.value;
                      if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 1) {
                        setCuposInput('1');
                        field.onChange(1);
                      } else {
                        const numValue = parseInt(value);
                        if (numValue > 999) {
                          setCuposInput('999');
                          field.onChange(999);
                        } else {
                          setCuposInput(String(numValue));
                        }
                      }
                    }}
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
                    minDate={dayjs()}
                    format="DD/MM/YYYY"
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
                    minDate={dayjs()}
                    format="DD/MM/YYYY"
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
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 5 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  sx={{ minWidth: 140, py: 1.5 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ minWidth: 140, py: 1.5 }}
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