// services/httpClient.ts
import { ApiResponse } from "@/types/Generics/apiResponse";
import { api } from "./api";
import { AxiosError } from "axios";
import { ResponseError } from "@/types/Generics/responseError";

export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const res = await api.get<ApiResponse<T>>(url, { params });
      if (res.data?.isError) {
        throw ParseError({ response: { data: res.data } } as any);
      }
      return res.data.result.data;
    } catch (err) {
      throw ParseError(err); 
    }
  }

  async getById<T>(id: string | number): Promise<T> {
    const res = await http.get<ApiResponse<T>>(`${this.baseURL}/${id}`);
    return res.result.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const res = await api.post<ApiResponse<T>>(url, data);
    return res.data.result.data;
  }

  async put<T>(url: string, data?: T): Promise<T> {
    const res = await api.put<ApiResponse<T>>(url, data);
    return res.data.result.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await api.delete<ApiResponse<T>>(url);
    return res.data.result.data;
  }
}

// Instancio el cliente HTTP con la URL base de la API
export const http = new HttpClient(process.env.NEXT_PUBLIC_API_URL || "");




export function ParseError(err: unknown): ResponseError {
  const ax = err as AxiosError<ApiResponse<any>>;
  const data = ax.response?.data;

  return {
    message:
      data?.responseException?.exceptionMessage ||
      data?.message ||
      ax.message ||
      "Ocurrió un error",
    status: ax.response?.status,
  };
}