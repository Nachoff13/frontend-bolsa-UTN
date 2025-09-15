'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Briefcase, 
  FileText, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: '/', label: 'Menú Principal', icon: Home, isActive: true },
    { href: '/estudiante/ofertas', label: 'Ofertas Laborales', icon: Briefcase },
    { href: '/estudiante/postulaciones', label: 'Mis Postulaciones', icon: FileText },
    { href: '/estudiante/perfil', label: 'Mi Perfil', icon: User },
  ]

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