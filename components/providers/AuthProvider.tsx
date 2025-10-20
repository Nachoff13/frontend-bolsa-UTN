"use client";
import { createContext, useContext, useEffect, useState } from "react";
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

  // inyectar token en axios
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // sincronizar con backend
  useEffect(() => {
    const syncUser = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 AuthProvider - Sincronizando usuario...");
        const res: UsuarioDTO = await genericService.cargarUsuario();
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
                                   perfil?.legajo && 
                                   perfil?.anioEgreso;
            
            if (!perfilCompleto) {
              console.log("⚠️ Perfil incompleto, mostrando modal...");
              setShowProfileModal(true);
            } else {
              console.log("✅ Perfil completo");
            }
          } catch (error) {
            console.error("❌ Error al obtener perfil:", error);
          }
        }
      } catch (e) {
        const err = e as ResponseError;
        console.error("❌ Error al sincronizar usuario:", err);
        showMessage(
          "Ha ocurrido un problema con el servidor. Cerrando sesión…",
          SnackbarType.Error,
          {
            size: SnackbarSize.Medium,
            position: SnackbarPosition.BottomCenter,
          }
        );

        // Logout global
        window.location.href = "/auth/logout";
        return;
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [user, token]);

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