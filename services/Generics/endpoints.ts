// services/endpoints.ts

import { GET } from "@/app/api/auth/token/route";

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  GENERIC : "/generic",
  POSTULACION: "/postulacion",
  CANDIDATO: "/candidato",
  EMPRESA: "/empresa",
  ADMIN: "/admin",
} as const;

export const ENDPOINTS = {
   PUBLICACION: {
    GET_ALL: `${CONTROLLERS.PUBLICACION}/get_publicaciones_empleo`,
    GET_ALL_OFERTAS: `${CONTROLLERS.PUBLICACION}/get_all_ofertas`,
    GET_OFERTAS_BY_EMPRESA: `${CONTROLLERS.PUBLICACION}/get_ofertas_by_empresa`,
    GET_PUBLICACIONES_EMPLEO: `${CONTROLLERS.PUBLICACION}/get_publicaciones_empleo`,
    CREAR_OFERTA: `${CONTROLLERS.PUBLICACION}/crear_oferta`,
    ACTUALIZAR_OFERTA: `${CONTROLLERS.PUBLICACION}/actualizar_oferta`,
    ELIMINAR_OFERTA: `${CONTROLLERS.PUBLICACION}/eliminar_oferta`,

    GET_OFERTA_BY_ID: (id: number) =>
      `${CONTROLLERS.PUBLICACION}/get_oferta/${id}`,

    GET_RECIENTES: (limit: number = 3) =>
      `${CONTROLLERS.PUBLICACION}/get_publicaciones_recientes?limit=${limit}`,

    GET_PUBLICACIONES_EMPRESA: (emailEmpresa: string) =>
      `${CONTROLLERS.PUBLICACION}/get_publicaciones_empresa/${emailEmpresa}`,
  },

  POSTULACIONES: {
    // ← ahora es función, porque la ruta necesita el id
    GET_POSTULACIONES: `${CONTROLLERS.POSTULACION}/get_postulaciones`,

    GET_ULTIMO_MES: (idEstudiante: number | string) =>
      `${CONTROLLERS.POSTULACION}/${idEstudiante}/ultimo-mes`,

    // la de estado que teníamos
    GET_POSTULACION_POR_ESTADO: (idEstudiante: number | string, idEstado: number | string) =>
      `${CONTROLLERS.POSTULACION}/get_postulaciones_por_estado/${idEstudiante}?idEstado=${idEstado}`,

    POSTULARSE: `${CONTROLLERS.POSTULACION}/postularse_oferta`,

    GET_POSTULACIONES_EMPRESA: (emailEmpresa: string) =>
      `${CONTROLLERS.PUBLICACION}/get_postulaciones_empresa?email=${emailEmpresa}`,

    GET_POSTULACIONES_CANDIDATOS_EMPRESA: `${CONTROLLERS.POSTULACION}/get_postulaciones_candidatos_empresa`,

     CAMBIAR_ESTADO: (idPostulacion: number | string) =>
      `${CONTROLLERS.POSTULACION}/${idPostulacion}/estado`,
  },


  GENERIC: {
    GET_TIPO_CONTRATO: `${CONTROLLERS.GENERIC}/get_tipos_contratos`,
    GET_MODALIDAD: `${CONTROLLERS.GENERIC}/get_modalidades`,
    GET_CARRERAS: `${CONTROLLERS.GENERIC}/get_carreras`,
    GET_LOCALIDADES: `${CONTROLLERS.GENERIC}/get_localidades`,
    CARGAR_USUARIO: `${CONTROLLERS.GENERIC}/cargar_usuario`,
    GET_PERFIL_EMPRESA_USUARIO: `${CONTROLLERS.GENERIC}/get_perfil_empresa_usuario`,
    GET_ESTADOS_VALIDACION: `${CONTROLLERS.GENERIC}/get_estados_validacion`,
    GET_ROLES: `${CONTROLLERS.GENERIC}/get_roles`,
  },
  POSTULACION: {
    GET_POSTULACIONES: `${CONTROLLERS.POSTULACION}/get_postulaciones`,
    POSTULARSE: `${CONTROLLERS.POSTULACION}/postularse_oferta`,
  },
  CANDIDATO: {
    GET_PERFIL: `/Candidato/get_perfil`,
    UPDATE_PERFIL: `/Candidato/update_perfil`,
    UPLOAD_CV: `/Candidato/upload_cv`,
    UPLOAD_FOTO_PERFIL: `/Candidato/upload_foto_perfil`,
    VERIFICAR_PERFIL: `/Candidato/verificar_perfil`,
    COMPLETAR_PERFIL: `/Candidato/completar_perfil`,
  },
  EMPRESA: {
    GET_PERFIL: `/Empresa/get_perfil`,
    UPDATE_PERFIL: `/Empresa/update_perfil`,
    UPLOAD_FOTO_PERFIL: `/Empresa/upload_foto_perfil`,
  },
  ADMIN: {
    GET_EMPRESAS: `${CONTROLLERS.ADMIN}/get_empresas_por_verificar`,
    CAMBIAR_ESTADO_VALIDACION: `${CONTROLLERS.ADMIN}/cambiar_estado_validacion`,
    GET_USUARIOS: `${CONTROLLERS.ADMIN}/get_usuarios`,
    BAJA_USUARIO: `${CONTROLLERS.ADMIN}/baja_usuario`,
    ALTA_USUARIO: `${CONTROLLERS.ADMIN}/alta_usuario`,
    VER_DETALLE_USUARIO: `${CONTROLLERS.ADMIN}/ver_detalle_usuario`,
    ACTUALIZAR_ROL_USUARIO: `${CONTROLLERS.ADMIN}/actualizar_rol_usuario`,
  }
} as const;
