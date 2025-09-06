// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PUBLICACION: "/publicacion",
  OFERTAS: "/ofertas",
  POSTULACIONES: "/postulaciones",
  USUARIOS: "/usuarios",
} as const;

export const ENDPOINTS = {

  PUBLICACION: {
    GET_ALL: `${CONTROLLERS.PUBLICACION}`,
    BY_CRITERIA: "/get_by_criteria",
    ADD: "",
  },
} as const;