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
  },

  GENERIC: {
    GET_TIPO_CONTRATO: `${CONTROLLERS.GENERIC}/get_tipos_contratos`,
    GET_MODALIDAD: `${CONTROLLERS.GENERIC}/get_modalidades`,
    GET_CARRERAS: `${CONTROLLERS.GENERIC}/get_carreras`,
  },
  POSTULANTE: {
    GET_POSTULACIONES: `${CONTROLLERS.POSTULACION}/get_postulaciones`,
    POSTULARSE: `${CONTROLLERS.POSTULACION}/postularse_oferta`,
  },
} as const;