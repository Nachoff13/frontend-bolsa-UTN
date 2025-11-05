import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5113";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Interceptor para que siempre meta el token en cada request
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es error 401 (no autorizado), el token expiró o es inválido
    if (error.response?.status === 401) {
      console.error("🔒 Error 401: Token inválido o expirado");
      
      // Solo redirigir a logout si estamos en el cliente
      if (typeof window !== 'undefined') {
        // Evitar loops infinitos - no redirigir si ya estamos en /auth
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/auth')) {
          console.log("🚪 Redirigiendo a logout...");
          window.location.href = "/auth/logout";
        }
      }
    }
    
    return Promise.reject(error);
  }
);