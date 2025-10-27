"use client";
//use client para que se renderice en el cliente y no en el servidor, esto se usa cuando se usan hooks o estados

//#region IMPORTACIOENS REACT
import { useEffect, useState } from "react";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { useMemo } from "react";

//#endregion

//#region IMPORTACIONES COMPONENTES PROPIOS
import Titulo from "@/components/shared/Titulo";
import CardGenerica from "@/components/shared/CardGenerica";
import { useSnackbar } from "@/components/providers/snackbar";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";

//#endregion

//#region IMPORTACIONES SERVICIOS Y TIPOS
//Servicio para llamadas a la API
import { adminService } from "@/services/admin.service";

//#region Tipos y constantes
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { ResponseError } from "@/types/Generics/responseError";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";

//#endregion

//#region LOGICA DE LA PAGINA
export default function EmpresasSolicitantesPage() {
  //#region SNACKBAR Y MODAL CARGA
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<PerfilEmpresaDTO[]>([]);
  const { showMessage } = useSnackbar();

  // Cargar datos de filtros de ofertas laborales (para otras pantallas)
  useEffect(() => {
    buscarEmpresas();
  }, []);

  const buscarEmpresas = async () => {
    try {
      setLoading(true);

      const empresas = await adminService.buscarEmpresas();
      setEmpresas(empresas);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  //#endregion

  //#region RENDERIZADO DE LA PAGINA
  return (
    <>
      <Titulo
        titulo="Empresas Solicitantes"
        subtitulo="Listado de empresas registradas en la plataforma"
      />

      <Box display="flex" gap={3} mt={4}>
        {empresas.length === 0 && (
          <EmptyState mensaje="No hay empresas para verificar en este momento." />
        )}
        {empresas.map((empresa) => (
          <CardGenerica
            key={empresa.id}
            titulo={empresa.descripcion || "Sin descripción"}
            subtitulo={empresa.razonSocial || "Sin razón social"}
            descripcion={empresa.cuit || "Sin CUIT"}
            chips={[
              { label: empresa.estadoValidacionNombre || "Sin estado", color: "primary" },
              
            ]}
           
            onAccion1={() => {
            }}
            textoAccion1="Ver detalle"
          />
        ))}
      </Box>
    </>
  );
  //#endregion
}
//#endregion
