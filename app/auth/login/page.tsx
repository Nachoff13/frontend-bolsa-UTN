'use client'

// import { useUser } from '@auth0/nextjs-auth0/client'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'

export default function LoginPage() {
  // const { user, isLoading } = useUser()
  // const router = useRouter()

  // useEffect(() => {
  //   if (user) {
  //     // Redirigir según el rol del usuario
  //     if (user['https://bolsa-utn.com/roles']?.includes('Estudiante')) {
  //       router.push('/estudiante/postulaciones')
  //     } else if (user['https://bolsa-utn.com/roles']?.includes('Empresa')) {
  //       router.push('/empresa/ofertas')
  //     } else if (user['https://bolsa-utn.com/roles']?.includes('Admin')) {
  //       router.push('/admin/dashboard')
  //     } else {
  //       router.push('/')
  //     }
  //   }
  // }, [user, router])

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  //     </div>
  //   )
  // }

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <p>Página de login</p>
    </div>
  )
} 