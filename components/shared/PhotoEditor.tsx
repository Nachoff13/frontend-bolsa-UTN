"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Stack,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';

interface PhotoEditorProps {
  open: boolean;
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedImage: Blob) => void;
  uploading?: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function PhotoEditor({ 
  open, 
  imageSrc, 
  onCancel, 
  onConfirm,
  uploading = false 
}: PhotoEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Establecer tamaño del canvas
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Dibujar imagen recortada
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convertir canvas a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(croppedImage);
    } catch (error) {
      console.error('Error al recortar imagen:', error);
    }
  };

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  return (
    <Dialog 
      open={open} 
      onClose={uploading ? undefined : onCancel} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '600px',
          height: 'auto',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Editar Foto de Perfil
          </Typography>
          <IconButton 
            onClick={onCancel} 
            size="small" 
            disabled={uploading}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ position: 'relative', p: 0, overflow: 'hidden', bgcolor: '#f5f5f5', height: '500px' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            style={{
              containerStyle: {
                backgroundColor: '#f5f5f5',
              },
              mediaStyle: {
                objectFit: 'contain',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
        {/* Control de Zoom */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <ZoomOutIcon color="action" />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-label="Zoom"
            onChange={handleZoomChange}
            disabled={uploading}
            sx={{ flex: 1 }}
          />
          <ZoomInIcon color="action" />
        </Stack>

        {/* Instrucciones */}
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Arrastra para mover • Usa el deslizador o pellizca para hacer zoom
        </Typography>

        {/* Botones de Acción */}
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            onClick={onCancel} 
            variant="outlined" 
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Aplicar"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
