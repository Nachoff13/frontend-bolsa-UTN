export interface ApiResponse<T> {
  message: string
  result: {
    data: T
  }
  statusCode?: number
  isError?: boolean
  responseException?: any
  version?: string
}
