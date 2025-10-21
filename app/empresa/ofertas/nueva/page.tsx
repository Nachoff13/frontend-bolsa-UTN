"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import OfertaForm from '@/components/ofertas/OfertaForm';
import { ofertaService } from '@/services/oferta.service';
import { CrearOfertaDTO } from '@/types/dto/ofertaDTO';
import { useSnackbar } from '@/components/providers/snackbar';
import { SnackbarType } from '@/types/enums/snackbar';

export default function CreateOfertaPage() {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CrearOfertaDTO) => {
    try {
      setIsSubmitting(true);
      
      // Convertir null a undefined para el servicio
      const ofertaData = {
        ...data,
        fechaFin: data.fechaFin === null ? undefined : data.fechaFin
      };
      
      const ofertaCreada = await ofertaService.crearOferta(ofertaData);
      
      showMessage('Oferta creada exitosamente', SnackbarType.Success);
      
      // Redirigir a la página de ofertas publicadas
      router.push('/empresa/ofertas-publicadas');
      
    } catch (error: any) {
      // Manejar errores específicos del backend
      if (error.status === 400 || error.status === 422) {
        showMessage(`Error de validación: ${error.message}`, SnackbarType.Error);
      } else {
        showMessage('Error al crear la oferta. Inténtalo nuevamente.', SnackbarType.Error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <OfertaForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
