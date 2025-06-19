// Tipos de autenticación
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export type UserRole = 'Estudiante' | 'Empresa' | 'Admin'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
} 