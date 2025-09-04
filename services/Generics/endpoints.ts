// services/endpoints.ts

// Controllers en un solo lugar
export const CONTROLLERS = {
  PRUEBA: "/prueba",
  OFERTAS: "/ofertas",
  POSTULACIONES: "/postulaciones",
  USUARIOS: "/usuarios",
} as const;

export const ENDPOINTS = {

  PRUEBA: {
    GET_ALL: `${CONTROLLERS.PRUEBA}`,
    BY_CRITERIA: "/get_by_criteria_prueba",
    ADD: "/add_prueba",
  },
} as const;