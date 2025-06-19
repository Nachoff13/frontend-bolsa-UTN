# Bolsa de Trabajo UTN - Frontend

Sistema de bolsa de trabajo para estudiantes y empresas de la Universidad Tecnológica Nacional (UTN).

## 🚀 Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Auth0** - Autenticación y autorización
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **React Query** - Gestión de estado del servidor

## 📁 Estructura del Proyecto

```
frontend-bolsa-UTN/
├── app/                    # App Router de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── estudiante/        # Páginas para estudiantes
│   ├── empresa/           # Páginas para empresas
│   ├── admin/             # Páginas administrativas
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI básicos
│   ├── shared/           # Componentes compartidos
│   ├── ofertas/          # Componentes de ofertas
│   └── postulaciones/    # Componentes de postulaciones
├── features/             # Componentes con lógica compleja
├── services/             # Capa de comunicación con API
│   ├── api.ts           # Cliente Axios
│   ├── httpClient.ts    # Funciones HTTP tipadas
│   └── endpoints.ts     # Constantes de endpoints
├── types/               # Definiciones TypeScript
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y funciones auxiliares
├── styles/              # Estilos globales
├── public/              # Recursos estáticos
└── pages/api/auth/      # Endpoints de Auth0
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd frontend-bolsa-UTN
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📋 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript

## 🔐 Configuración de Auth0

1. Crear una cuenta en [Auth0](https://auth0.com)
2. Crear una nueva aplicación (Single Page Application)
3. Configurar las URLs permitidas:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
4. Configurar las reglas de Auth0 para asignar roles según el email o dominio

## 🎨 Personalización

### Colores y Temas
Los colores principales se pueden personalizar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... más tonos
    900: '#1e3a8a',
  }
}
```

## 🔧 Desarrollo

### Convenciones de Código
- **Componentes**: PascalCase (ej: `UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth.ts`)
- **Tipos**: PascalCase (ej: `UserProfile.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_ENDPOINTS`)

### Estructura de Componentes
```typescript
// Componente funcional con TypeScript
interface ComponentProps {
  title: string
  onAction?: () => void
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      {onAction && <button onClick={onAction}>Acción</button>}
    </div>
  )
}
```

### Manejo de Estado
- **Estado local**: `useState`
- **Estado del servidor**: `useFetch`, `useMutation`
- **Estado global**: Context API o React Query

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de Auth0 y Next.js

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:

```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest
```

---

**Desarrollado con ❤️ para la UTN**
