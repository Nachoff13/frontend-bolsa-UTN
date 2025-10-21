// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  GENERIC : "/generic",
  POSTULACION: "/postulacion",
  CANDIDATO: "/candidato",
  EMPRESA: "/empresa",
} as const;

export const ENDPOINTS = {
   PUBLICACION: {
    GET_ALL: `${CONTROLLERS.PUBLICACION}/get_publicaciones_empleo`,

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
  },


  GENERIC: {
    GET_TIPO_CONTRATO: `${CONTROLLERS.GENERIC}/get_tipos_contratos`,
    GET_MODALIDAD: `${CONTROLLERS.GENERIC}/get_modalidades`,
    GET_CARRERAS: `${CONTROLLERS.GENERIC}/get_carreras`,
    CARGAR_USUARIO: `${CONTROLLERS.GENERIC}/cargar_usuario`,

  },
  POSTULACION: {
    GET_POSTULACIONES: `${CONTROLLERS.POSTULACION}/get_postulaciones`,
    POSTULARSE: `${CONTROLLERS.POSTULACION}/postularse_oferta`,
  },
  CANDIDATO: {
    GET_PERFIL: `/Candidato/get_perfil`,
    UPDATE_PERFIL: `/Candidato/update_perfil`,
    UPLOAD_CV: `/Candidato/upload_cv`,
    VERIFICAR_PERFIL: `/Candidato/verificar_perfil`,
    COMPLETAR_PERFIL: `/Candidato/completar_perfil`,
  },
  EMPRESA: {
    GET_PERFIL: `/Empresa/get_perfil`,
    UPDATE_PERFIL: `/Empresa/update_perfil`,
  },
} as const;
