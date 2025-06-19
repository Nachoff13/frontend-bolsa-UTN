// Configuración básica de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Cliente HTTP básico
export const apiClient = {
  get: async (url: string) => {
    // Implementar lógica de GET
  },
  post: async (url: string, data: any) => {
    // Implementar lógica de POST
  },
  put: async (url: string, data: any) => {
    // Implementar lógica de PUT
  },
  delete: async (url: string) => {
    // Implementar lógica de DELETE
  }
} 