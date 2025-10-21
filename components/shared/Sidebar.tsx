'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Briefcase, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  Users,
  Building
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function Sidebar() {
  const pathname = usePathname()
  const { rol, user } = useAuth()
  const { perfilId } = useAuth()

  const isActive = (path: string) => pathname === path

  // Menú dinámico basado en el rol
  const getMenuItems = () => {
    const baseItems = [
      { href: '/', label: 'Menú Principal', icon: Home, isActive: true }
    ]

    if (rol === 1) { // Estudiante
      return [
        ...baseItems,
        { href: '/estudiante/ofertas', label: 'Ofertas Laborales', icon: Briefcase },
        { href: '/estudiante/postulaciones', label: 'Mis Postulaciones', icon: FileText },
        { href: perfilId ? `/estudiante/perfil/${perfilId}` : '/estudiante/perfil', label: 'Mi Perfil', icon: User },
      ]
    } else if (rol === 2) { // Empresa
      return [
        ...baseItems,
        { href: '/empresa/ofertas-publicadas', label: 'Ofertas Publicadas', icon: Briefcase },
        { href: '/empresa/candidatos-postulados', label: 'Candidatos Postulados', icon: Users },
        { href: '/empresa/perfil', label: 'Perfil Empresa', icon: Building },
      ]
    }

    return baseItems
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-full h-[calc(100vh-16px)] bg-gray-50 border border-gray-300 flex flex-col rounded-[10px] mx-2 my-2 overflow-hidden sticky top-2">
      {/* Header con logo y título */}
      <div className="p-5 border-b border-gray-300">
        <div className="flex items-center space-x-3">
          {/* Logo UTN - cuadrado azul sólido */}
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
          </div>
          <div>
            <h1 className="text-black font-bold text-sm uppercase tracking-wide">UTN FRLP</h1>
            <p className="text-black text-xs">Bolsa de Trabajo</p>
          </div>
        </div>
        {/* Nombre del usuario */}
        {user && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">{user.nombre}</p>
            <p className="text-xs text-gray-500">
              {rol === 1 ? 'Estudiante' : rol === 2 ? 'Empresa' : 'Usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Menú principal */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-black'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer con configuración y logout */}
      <div className="px-3 py-4 space-y-2">
        <button className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-black hover:bg-gray-100 w-full text-left">
          <Settings className="w-4 h-4 text-black" />
          <span>Configuración</span>
        </button>
        <button className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-gray-100 w-full text-left">
          <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
} 