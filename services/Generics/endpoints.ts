// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  GENERIC : "/generic",
  POSTULACION: "/postulacion",
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
  },

  GENERIC: {
    GET_TIPO_CONTRATO: `${CONTROLLERS.GENERIC}/get_tipos_contratos`,
    GET_MODALIDAD: `${CONTROLLERS.GENERIC}/get_modalidades`,
    GET_CARRERAS: `${CONTROLLERS.GENERIC}/get_carreras`,
    GET_LOCALIDADES: `${CONTROLLERS.GENERIC}/get_localidades`,
    CARGAR_USUARIO: `${CONTROLLERS.GENERIC}/cargar_usuario`,
    GET_PERFIL_EMPRESA_USUARIO: `${CONTROLLERS.GENERIC}/get_perfil_empresa_usuario`,
  },
  POSTULACION: {
    GET_POSTULACIONES: `${CONTROLLERS.POSTULACION}/get_postulaciones`,
    POSTULARSE: `${CONTROLLERS.POSTULACION}/postularse_oferta`,
  },
  CANDIDATO: {
    GET_PERFIL: `/api/candidato/get_perfil`,
    UPDATE_PERFIL: `/api/candidato/update_perfil`,
    UPLOAD_CV: `/api/candidato/upload_cv`,
  },
} as const;