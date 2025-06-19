import { useState, useEffect, useCallback } from 'react'
import { httpClient, ApiError } from '@/services/httpClient'

interface UseFetchOptions<T> {
  url: string
  params?: any
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export function useFetch<T>(url: string) {
  // Aquí irá la lógica de fetch
  return {
    data: null as T | null,
    loading: false,
    error: null,
    refetch: () => {},
  }
}

interface UseMutationOptions<TData, TVariables> {
  url: string
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  onSuccess?: (data: TData) => void
  onError?: (error: ApiError) => void
}

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>
  loading: boolean
  error: ApiError | null
}

export const useMutation = <TData, TVariables>({
  url,
  method = 'POST',
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables>): UseMutationResult<TData, TVariables> => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    setLoading(true)
    setError(null)

    try {
      let result: TData

      switch (method) {
        case 'POST':
          result = await httpClient.post<TData>(url, variables)
          break
        case 'PUT':
          result = await httpClient.put<TData>(url, variables)
          break
        case 'PATCH':
          result = await httpClient.patch<TData>(url, variables)
          break
        case 'DELETE':
          result = await httpClient.delete<TData>(url)
          break
        default:
          throw new Error(`Método HTTP no soportado: ${method}`)
      }

      onSuccess?.(result)
      return result
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido', 500)
      setError(apiError)
      onError?.(apiError)
      return null
    } finally {
      setLoading(false)
    }
  }, [url, method, onSuccess, onError])

  return {
    mutate,
    loading,
    error,
  }
} 