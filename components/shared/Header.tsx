'use client'

// import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  // const { user, isLoading } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Simular usuario para mostrar la navegación
  const user = { name: 'Usuario Demo', email: 'demo@utn.edu.ar' }
  const isLoading = false

  return (
    <header>
      <h1>Header</h1>
    </header>
  )
} 