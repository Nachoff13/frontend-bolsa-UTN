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
  Building,
  Moon,
  Sun
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Sidebar() {
  const pathname = usePathname()
  const { rol, user } = useAuth()
  const { perfilId } = useAuth()
  const { mode, toggleTheme } = useTheme()

  const isActive = (path: string) => pathname === path

  // Menú dinámico basado en el rol
  const getMenuItems = () => {
    const baseItems = [
      { href: '/', label: 'Menú Principal', icon: Home }
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
    <aside className={`w-full h-[calc(100vh-16px)] border flex flex-col rounded-[10px] mx-2 my-2 overflow-hidden sticky top-2 transition-colors ${
      mode === 'dark' 
        ? 'bg-[#1e1e1e] border-gray-800' 
        : 'bg-gray-50 border-gray-300'
    }`}>
      {/* Header con logo y título */}
      <div className={`p-6 border-b ${mode === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
        <div className="flex items-center space-x-3">
          {/* Logo UTN - cuadrado azul sólido */}
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
          </div>
          <div>
            <h1 className={`font-bold text-base uppercase tracking-wide ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
              UTN FRLP
            </h1>
            <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              Bolsa de Trabajo
            </p>
          </div>
        </div>
        {/* Nombre del usuario */}
        {user && (
          <div className={`mt-4 pt-4 border-t ${mode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-base font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {user.nombre}
            </p>
            <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {rol === 1 ? 'Estudiante' : rol === 2 ? 'Empresa' : 'Usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Menú principal */}
      <div className="flex-1 px-4 py-5">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-teal-500 text-white'
                    : mode === 'dark'
                    ? 'text-gray-100 hover:bg-gray-900'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : mode === 'dark' ? 'text-gray-100' : 'text-black'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer con configuración y logout */}
      <div className="px-4 py-5 space-y-2">
        {/* Toggle de Tema */}
        <button 
          onClick={toggleTheme}
          className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-base font-medium w-full text-left transition-colors ${
            mode === 'dark'
              ? 'text-gray-100 hover:bg-gray-900'
              : 'text-black hover:bg-gray-100'
          }`}
        >
          {mode === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-100" />
          ) : (
            <Moon className="w-5 h-5 text-black" />
          )}
          <span>{mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
        
        {/* <button className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-base font-medium w-full text-left transition-colors ${
          mode === 'dark'
            ? 'text-gray-100 hover:bg-gray-900'
            : 'text-black hover:bg-gray-100'
        }`}>
          <Settings className={`w-5 h-5 ${mode === 'dark' ? 'text-gray-100' : 'text-black'}`} />
          <span>Configuración</span>
        </button> */}
        
        <button className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-base font-medium text-red-600 w-full text-left transition-colors ${
          mode === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
        }`}>
          <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
} 