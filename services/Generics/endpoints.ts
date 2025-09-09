// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  GENERIC : "/generic",
  POSTULACIONES : "/postulaciones",
} as const;

export const ENDPOINTS = {

   PUBLICACION: {
    GET_ALL: `${CONTROLLERS.PUBLICACION}/get_publicaciones_empleo`,
    GET_RECIENTES: `${CONTROLLERS.PUBLICACION}/recientes`,
    GET_BY_CARRERA: (idCarrera: number | string) =>
      `${CONTROLLERS.PUBLICACION}/por-carrera/${idCarrera}`,
  },

  POSTULACIONES: {
    GET_BY_ESTUDIANTE: (idEstudiante: number | string) =>
      `${CONTROLLERS.POSTULACIONES}/${idEstudiante}`,
    GET_ULTIMO_MES: (idEstudiante: number | string) =>
      `${CONTROLLERS.POSTULACIONES}/${idEstudiante}/ultimo-mes`,
  },

  GENERIC: {
    GET_TIPO_CONTRATO: `${CONTROLLERS.GENERIC}/get_tipos_contratos`,
    GET_MODALIDAD: `${CONTROLLERS.GENERIC}/get_modalidades`,
    GET_CARRERAS: `${CONTROLLERS.GENERIC}/get_carreras`,
  },
  
  
} as const;