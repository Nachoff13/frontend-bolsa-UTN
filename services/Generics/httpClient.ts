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
    return (res.data.result ?? res.data.message) as T;
    } catch (err) {
      throw ParseError(err);
    }
  }

  async getById<T>(id: string | number): Promise<T> {
    try {
      const res = await api.get<ApiResponse<T>>(`${this.baseURL}/${id}`);
      if (res.data?.isError) {
        throw ParseError({ response: { data: res.data } } as any);
      }
    return (res.data.result ?? res.data.message) as T;
    } catch (err) {
      throw ParseError(err);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const res = await api.post<ApiResponse<T>>(url, data);
      if (res.data?.isError) {
        throw ParseError({ response: { data: res.data } } as any);
      }
    return (res.data.result ?? res.data.message) as T;
    } catch (err) {
      throw ParseError(err);
    }
  }

  async put<T>(url: string, data?: T): Promise<T> {
    try {
      const res = await api.put<ApiResponse<T>>(url, data);
      if (res.data?.isError) {
        throw ParseError({ response: { data: res.data } } as any);
      }
    return (res.data.result ?? res.data.message) as T;
    } catch (err) {
      throw ParseError(err);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const res = await api.delete<ApiResponse<T>>(url);
      if (res.data?.isError) {
        throw ParseError({ response: { data: res.data } } as any);
      }
    return (res.data.result ?? res.data.message) as T;
    } catch (err) {
      throw ParseError(err);
    }
  }
}

// Instancio el cliente HTTP con la URL base de la API
export const http = new HttpClient(process.env.NEXT_PUBLIC_API_URL || "");

export function ParseError(err: unknown): ResponseError {
  const ax = err as AxiosError<ApiResponse<any>>;
  const data = ax?.response?.data;

  const exception = data?.responseException?.exceptionMessage;

  const isValidationError =
    exception && typeof exception === "object" && "errors" in exception;

  if (isValidationError) {
    const validationException = exception as {
      errors: Record<string, string[]>;
      title?: string;
    };
    const errors = validationException.errors;
    const allErrors = Object.entries(errors)
      .map(([field, messages]) => messages.join("\n"))
      .join("\n");
    return {
      message: allErrors || validationException.title || "Error de validación",
      status: ax.response?.status ?? 500,
    };
  }

  if (typeof exception === "string" && exception.length > 0) {
    return {
      message: exception,
      status: ax.response?.status ?? 500,
    };
  }

  return {
    message:
      typeof data?.message === "string"
        ? data.message
        : ax?.message ?? "Ocurrió un error inesperado",
    status: ax.response?.status ?? 500,
  };
}
