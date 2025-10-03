import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5113";

if (typeof window !== "undefined") {
  console.log("API_BASE_URL:", API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega JWT automáticamente
api.interceptors.request.use(async (config) => {
  try {
    // pedimos el token al servidor Next.js
    const res = await fetch("/api/auth/token");
    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        // Agrego el token a los headers para todas las peticiones
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      }
    }
  } catch (err) {
    console.warn("No se pudo obtener token:", err);
  }

  return config;
});