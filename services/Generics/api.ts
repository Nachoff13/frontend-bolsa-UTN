import axios from "axios"

// Base URL desde .env.local con fallback
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5113"

// Debug: verificar que la URL está correcta
if (typeof window !== 'undefined') {
  console.log('🔧 API_BASE_URL:', API_BASE_URL);
}

// Instancia sin token
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})