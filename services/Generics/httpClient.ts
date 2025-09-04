// services/httpClient.ts
import { api } from "./api"

export class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const res = await api.get<T>(url, { params })
    return res.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const res = await api.post<T>(url, data)
    return res.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const res = await api.put<T>(url, data)
    return res.data
  }

  async delete<T>(url: string): Promise<T> {
    const res = await api.delete<T>(url)
    return res.data
  }
}

// Instancia lista para usar
export const http = new HttpClient(process.env.NEXT_PUBLIC_API_URL || "")