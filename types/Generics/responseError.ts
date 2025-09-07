export type ResponseError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown; 
};