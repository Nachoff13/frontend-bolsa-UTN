// Cliente HTTP básico
export class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(url: string): Promise<T> {
    // Implementar GET
    throw new Error('Not implemented')
  }

  async post<T>(url: string, data: any): Promise<T> {
    // Implementar POST
    throw new Error('Not implemented')
  }

  async put<T>(url: string, data: any): Promise<T> {
    // Implementar PUT
    throw new Error('Not implemented')
  }

  async delete<T>(url: string): Promise<T> {
    // Implementar DELETE
    throw new Error('Not implemented')
  }
} 