export interface ApiResponse<T> {
  message: string;
  result: T;
  statusCode?: number;
  isError?: boolean;
  responseException?: {
    exceptionMessage?: string;
    referenceErrorCode?: string;
    [k: string]: any;
  };
  version?: string;
}
