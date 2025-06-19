'use client'

// import { useUser } from '@auth0/nextjs-auth0/client'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'

export default function LogoutPage() {
  // const { user, isLoading } = useUser()
  // const router = useRouter()

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/')
  //   }
  // }, [user, isLoading, router])

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  //     </div>
  //   )
  // }

  return (
    <div>
      <h1>Cerrar Sesión</h1>
      <p>Página de logout</p>
    </div>
  )
} 