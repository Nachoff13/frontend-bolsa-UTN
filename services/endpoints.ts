// Endpoints de la API
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  
  // Ofertas
  OFERTAS: {
    LIST: '/ofertas',
    CREATE: '/ofertas',
    UPDATE: (id: string) => `/ofertas/${id}`,
    DELETE: (id: string) => `/ofertas/${id}`,
    GET: (id: string) => `/ofertas/${id}`,
  },
  
  // Postulaciones
  POSTULACIONES: {
    LIST: '/postulaciones',
    CREATE: '/postulaciones',
    UPDATE: (id: string) => `/postulaciones/${id}`,
    DELETE: (id: string) => `/postulaciones/${id}`,
    GET: (id: string) => `/postulaciones/${id}`,
  },
  
  // Usuarios
  USUARIOS: {
    LIST: '/usuarios',
    CREATE: '/usuarios',
    UPDATE: (id: string) => `/usuarios/${id}`,
    DELETE: (id: string) => `/usuarios/${id}`,
    GET: (id: string) => `/usuarios/${id}`,
  },
} 