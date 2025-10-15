"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function PerfilEmpresaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener perfilId de query params o usar 1 por defecto
    const perfilId = searchParams?.get('perfilId') || '1';
    
    // Redirigir a la nueva URL con parámetros de ruta
    router.replace(`/empresa/perfil/${perfilId}`);
  }, [router, searchParams]);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Redirigiendo...
        </Typography>
      </Box>
    </Box>
  );
}

