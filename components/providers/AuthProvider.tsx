"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setAuthToken } from "@/services/Generics/api";
import { genericService } from "@/services/generic.service";
import { useSnackbar } from "@/components/providers/snackbar";
import { ResponseError } from "@/types/Generics/responseError";
import {
  SnackbarPosition,
  SnackbarSize,
  SnackbarType,
} from "@/types/enums/snackbar";
import { UsuarioDTO } from "@/types/dto/usuarioDTO";
import LoadingModal from "@/components/shared/LoadingModal";
import CompleteProfileModal from "@/components/shared/CompleteProfileModal";
import { candidatoService } from "@/services/candidato.service";

const AuthContext = createContext<any>(null);

export default function AuthProvider({
  children,
  initialUser,
  initialToken,
}: any) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [usuarioDTO, setUsuarioDTO] = useState<UsuarioDTO | null>(null);
  const [rol, setRol] = useState<number | null>(null);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();

  // inyectar token en axios
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // sincronizar con backend
  useEffect(() => {
    let mounted = true;
    
    const syncUser = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 Sincronizando usuario con backend...");
        const res: UsuarioDTO = await genericService.cargarUsuario();
        
        if (!mounted) return; // Evitar actualizar estado si el componente se desmontó
        
        console.log("✅ Usuario cargado:", res);
        
        // Guardar el UsuarioDTO completo en el contexto
        setUsuarioDTO(res);
        setRol(res.idRol);
        
        // Si es candidato (rol 3), obtener su perfilId directamente usando el usuarioId
        if (res.idRol === 3 && res.id) {
          console.log("🎓 Usuario es candidato, obteniendo perfilId...");
          try {
            // Obtener el perfil del candidato usando el usuarioId
            const perfil: any = await candidatoService.getPerfilByUsuarioId(res.id);
            
            if (!mounted) return;
            
            console.log("📋 Perfil cargado:", perfil);
            
            // Guardar el perfilId en el contexto
            if (perfil?.id) {
              setPerfilId(perfil.id);
              console.log("✅ PerfilId guardado:", perfil.id);
            }
            
            // Verificar si el perfil está completo
            const perfilCompleto = perfil?.nombre && 
                                   perfil?.idGenero && 
                                   perfil?.idCarrera && 
                                   perfil?.legajo 
            
            if (!perfilCompleto) {
              console.log("⚠️ Perfil incompleto, mostrando modal...");
              setShowProfileModal(true);
            } else {
              console.log("✅ Perfil completo");
            }
          } catch (error: any) {
            console.error("❌ Error al obtener perfil del candidato:", error);
            // No cerrar sesión por error en perfil, solo loguear
          }
        }
        
        // Si es empresa (rol 2), obtener su perfilId usando el JWT del backend
        if (res.idRol === 2) {
          console.log("🏢 Usuario es empresa, obteniendo perfilId...");
          try {
            // Obtener el perfilId de empresa usando el endpoint que consume JWT
            const idPerfilEmpresa = await genericService.getPerfilEmpresaUsuario();
            
            if (!mounted) return;
            
            console.log("📋 PerfilId de empresa obtenido:", idPerfilEmpresa);
            
            // Guardar el perfilId en el contexto
            if (idPerfilEmpresa) {
              setPerfilId(idPerfilEmpresa);
              console.log("✅ PerfilId de empresa guardado:", idPerfilEmpresa);
            }
          } catch (error: any) {
            console.error("❌ Error al obtener perfil de empresa:", error);
            // No cerrar sesión por error en perfil, solo loguear
          }
        }
      } catch (e) {
        const err = e as ResponseError;
        console.error("❌ Error al sincronizar usuario:", err);
        
        if (!mounted) return;
        
        // Solo cerrar sesión si es error 401 (no autorizado) o 403 (forbidden)
        // Para otros errores (500, red, etc), solo mostrar mensaje pero mantener sesión
        if (err.status === 401 || err.status === 403) {
          console.log("🔒 Token inválido o expirado, cerrando sesión...");
          showMessage(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            SnackbarType.Error,
            {
              size: SnackbarSize.Medium,
              position: SnackbarPosition.BottomCenter,
            }
          );
          // Esperar un poco para que el usuario vea el mensaje
          setTimeout(() => {
            window.location.href = "/auth/logout";
          }, 1500);
        } else {
          // Error del servidor o de red - no cerrar sesión
          console.log("⚠️ Error temporal del servidor, manteniendo sesión...");
          showMessage(
            "Hubo un problema al cargar tu perfil. Por favor, recarga la página.",
            SnackbarType.Warning,
            {
              size: SnackbarSize.Medium,
              position: SnackbarPosition.BottomCenter,
            }
          );
          // Establecer loading false para que la app sea usable
          setLoading(false);
        }
        return;
      } finally {
        if (mounted) {
          setLoading(false);
          if(rol == 1 ){
            // redirijo al dashboard admin
            router.push('/admin/dashboard');
          }
          else if(rol == 2 ){
            // redirijo al dashboard empresa
            router.push('/empresa/dashboard');
          }
          else if(rol == 3 ){
            // redirijo al dashboard estudiante
            router.push('/estudiante/dashboard');
          }
        }
      }
    };

    syncUser();
    
    // Cleanup function para evitar memory leaks
    return () => {
      mounted = false;
    };
  }, [user, token]);

  // Redirect automático al dashboard correcto según el rol
  useEffect(() => {
    // Solo redirigir si:
    // 1. No estamos cargando
    // 2. Tenemos un usuario autenticado
    // 3. Ya tenemos el rol cargado
    // 4. Estamos en la página raíz "/"
    if (!loading && user && token && rol !== null && pathname === '/') {
      console.log("🔀 Redirigiendo automáticamente según rol:", rol);
      
      // Rol 3 = Estudiante/Candidato
      if (rol === 3) {
        console.log("📚 Redirigiendo a dashboard de estudiante...");
        router.push('/estudiante/dashboard');
      }
      // Rol 2 = Empresa
      else if (rol === 2) {
        console.log("🏢 Redirigiendo a dashboard de empresa...");
        router.push('/empresa/dashboard');
      }
      // Rol 1 = Admin
      else if (rol === 1) {
        console.log("👑 Redirigiendo a dashboard de admin...");
        router.push('/admin/dashboard');
      }
    }
  }, [loading, user, token, rol, pathname, router]);

  if (loading || (user && token && rol === null)) {
    return <LoadingModal open={true} />;
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false);
    showMessage(
      "Perfil completado exitosamente",
      SnackbarType.Success,
      {
        size: SnackbarSize.Medium,
        position: SnackbarPosition.BottomCenter,
      }
    );
    // Recargar para actualizar el estado
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, token, rol, usuarioDTO, perfilId }}>
      {children}
      {user?.email && (
        <CompleteProfileModal
          isOpen={showProfileModal}
          userEmail={user.email}
          onComplete={handleProfileComplete}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);