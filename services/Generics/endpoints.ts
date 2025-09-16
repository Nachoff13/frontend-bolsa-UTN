// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  GENERIC : "/generic",
  POSTULACION: "/postulacion",
} as const;

export const ENDPOINTS = {
   PUBLICACION: {
    GET_ALL: `${CONTROLLERS.PUBLICACION}/get_publicaciones`,

    GET_RECIENTES: (limit: number = 3) =>
      `${CONTROLLERS.PUBLICACION}/get_publicaciones_recientes?limit=${limit}`,
  },

  POSTULACIONES: {
    // ← ahora es función, porque la ruta necesita el id
    GET_POSTULACIONES: (idEstudiante: number | string) =>
      `${CONTROLLERS.POSTULACION}/${idEstudiante}`,

    GET_ULTIMO_MES: (idEstudiante: number | string) =>
      `${CONTROLLERS.POSTULACION}/${idEstudiante}/ultimo-mes`,

    // la de estado que teníamos
    GET_POSTULACION_POR_ESTADO: (idEstudiante: number | string, idEstado: number | string) =>
      `${CONTROLLERS.POSTULACION}/get_postulaciones_por_estado/${idEstudiante}?idEstado=${idEstado}`,
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
