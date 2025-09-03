import axios from "axios"

// Base URL desde .env.local
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL 

// Instancia sin token
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})