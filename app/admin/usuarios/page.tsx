"use client";

import { adminService } from "@/services/admin.service";
import { genericService } from "@/services/generic.service";
import { OpcionFiltro } from "@/types/dto/filter/opcionFiltroDTO";
import { UsuarioDTO } from "@/types/dto/usuarioDTO";
import { SnackbarType } from "@/types/enums/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/components/providers/snackbar";
import Titulo from "@/components/shared/Titulo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import {
  showConfirmDialog,
  showError,
  showSuccess,
} from "@/components/shared/swalHelper";

import AccionMenu from "@/components/shared/AccionMenu";
import LoadingModal from "@/components/shared/LoadingModal";
import { PerfilCandidatoDTO } from "@/types/dto/perfilCandidatoDTO";
import { PerfilEmpresaDTO } from "@/types/dto/perfilEmpresaDTO";
import { PerfilCompletoDTO } from "@/types/dto/perfilCompleetoDTO";
import ModalDetalleUsuario from "@/components/admin/ModalDetalleUsuario";

export default function GestionUsuarios() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilCompletoDTO | null>(
    null
  );
  const [mostrarModal, setMostrarModal] = useState(false);

  const { showMessage } = useSnackbar();

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      setLoading(true);

      var usuarios = await adminService.getUsuarios();
      console.log(usuarios);
      setUsuarios(usuarios);
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────── Acciones tabla ─────────────────────

  //PARA LA TABLA
  //Declaro las columnas
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "nombre", headerName: "Nombre de Usuario", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "rolNombre", headerName: "Rol", flex: 1.5 },
    { field: "fechaAlta", headerName: "Fecha de Alta", flex: 1 },
    { field: "fechaBaja", headerName: "Fecha de Baja", flex: 1 },
    { field: "activo", headerName: "Activo", flex: 0.7 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.7,
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <AccionMenu
          opciones={[
            { label: "Ver detalle", onClick: () => verDetalle(params.row) },
            params.row.activo == "Sí"
              ? { label: "Dar de baja", onClick: () => bajaUsuario(params.row) }
              : { label: "Activar", onClick: () => altaUsuario(params.row) },
          ]}
        />
      ),
    },
  ];
  //Defino las filas
  const rows = usuarios;

  //acciones de la tabla
  const bajaUsuario = async (row: UsuarioDTO) => {
    try {
      const confirmado = await showConfirmDialog(
        "¿Está seguro que desea continuar?",
        "Esta acción modificará el estado de validación."
      );
      if (confirmado) {
        setLoading(true);
        console.log(row);

        await adminService.bajaUsuario(row.id);
      }
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
      buscarUsuarios();
    }
  };

  const altaUsuario = async (row: UsuarioDTO) => {
    try {
      const confirmado = await showConfirmDialog(
        "¿Está seguro que desea continuar?",
        "Esta acción modificará el estado de validación."
      );
      if (confirmado) {
        setLoading(true);
        await adminService.altaUsuario(row.id);
      }
    } catch (e) {
      const err = e as ResponseError;
      showMessage(err.message, SnackbarType.Error);
    } finally {
      setLoading(false);
      buscarUsuarios();
    }
  };

  // Abre el modal, carga el perfil y configura el rol controlado
  const verDetalle = async (row: UsuarioDTO) => {
    try {
      setLoading(true);
      const perfil = await adminService.verDetalleUsuario(row.id);
      setPerfilUsuario(perfil);
      setMostrarModal(true);
    } catch (e) {
      showError((e as ResponseError).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal open={loading} />;

  return (
    <>
      <Titulo
        titulo="Gestión de Usuarios"
        subtitulo="Listado de usuarios registrados en la plataforma"
      />
      <DataGrid
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        // checkboxSelection
        disableRowSelectionOnClick
        showToolbar
      />

      <ModalDetalleUsuario
        open={mostrarModal}
        onClose={() => setMostrarModal(false)}
        perfil={perfilUsuario}
      />
    </>
  );
}
