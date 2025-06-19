// import { useUser } from '@auth0/nextjs-auth0/client'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { UserRole } from '@/types/auth'

// Hook para manejo de autenticación
export function useAuth() {
  // Aquí irá la lógica de autenticación
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
  }
} 