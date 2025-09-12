'use client'

// import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  // const { user } = useUser()
  const pathname = usePathname()

  // Simular usuario para mostrar la navegación
  const user = { 'https://bolsa-utn.com/roles': ['Estudiante', 'Empresa', 'Admin'] }

  if (!user) {
    return null
  }

  const isActive = (path: string) => pathname === path

  const getMenuItems = () => {
    // if (user['https://bolsa-utn.com/roles']?.includes('Estudiante')) {
    //   return [
    //     { href: '/estudiante/postulaciones', label: 'Ver Ofertas', icon: '📋' },
    //     { href: '/estudiante/mis-postulaciones', label: 'Mis Postulaciones', icon: '📝' },
    //     { href: '/estudiante/perfil', label: 'Mi Perfil', icon: '👤' },
    //   ]
    // }
    
    // if (user['https://bolsa-utn.com/roles']?.includes('Empresa')) {
    //   return [
    //     { href: '/empresa/ofertas', label: 'Mis Ofertas', icon: '💼' },
    //     { href: '/empresa/nueva-oferta', label: 'Nueva Oferta', icon: '➕' },
    //     { href: '/empresa/postulaciones', label: 'Postulaciones', icon: '👥' },
    //     { href: '/empresa/perfil', label: 'Perfil Empresa', icon: '🏢' },
    //   ]
    // }
    
    // if (user['https://bolsa-utn.com/roles']?.includes('Admin')) {
    //   return [
    //     { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    //     { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    //     { href: '/admin/ofertas', label: 'Ofertas', icon: '💼' },
    //     { href: '/admin/postulaciones', label: 'Postulaciones', icon: '📝' },
    //     { href: '/admin/reportes', label: 'Reportes', icon: '📈' },
    //     { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
    //   ]
    // }
    
    // Mostrar todos los menús para demo
    return [
      { href: '/estudiante/postulaciones', label: 'Ver Ofertas', icon: '📋' },
      { href: '/estudiante/mis-postulaciones', label: 'Mis Postulaciones', icon: '📝' },
        { href: '/estudiante/perfil/1', label: 'Mi Perfil', icon: '👤' }, // hardcodeado
      { href: '/empresa/ofertas', label: 'Mis Ofertas', icon: '💼' },
      { href: '/empresa/nueva-oferta', label: 'Nueva Oferta', icon: '➕' },
      { href: '/empresa/postulaciones', label: 'Postulaciones', icon: '👥' },
      { href: '/empresa/perfil', label: 'Perfil Empresa', icon: '🏢' },
      { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
      { href: '/admin/ofertas', label: 'Ofertas', icon: '💼' },
      { href: '/admin/postulaciones', label: 'Postulaciones', icon: '📝' },
      { href: '/admin/reportes', label: 'Reportes', icon: '📈' },
      { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <aside>
      <h2>Sidebar</h2>
    </aside>
  )
} 