"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import OfertaForm from '@/components/ofertas/OfertaForm';
import { ofertaService } from '@/services/oferta.service';
import { CrearOfertaDTO } from '@/types/dto/ofertaDTO';
import { useSnackbar } from '@/components/providers/snackbar';
import { SnackbarPosition, SnackbarSize, SnackbarType } from '@/types/enums/snackbar';
import { ResponseError } from '@/types/Generics/responseError';

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
      
    } catch (e) {
          const err = e as ResponseError;
          showMessage(err.message, SnackbarType.Error, {
            size: SnackbarSize.Medium,
            position: SnackbarPosition.BottomCenter,
          });
        } 
        finally {
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
