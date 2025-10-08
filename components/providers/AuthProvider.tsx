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

const AuthContext = createContext<any>(null);

export default function AuthProvider({
  children,
  initialUser,
  initialToken,
}: any) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [rol, setRol] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
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
        debugger;
        const res: UsuarioDTO = await genericService.cargarUsuario();
        setRol(res.idRol); // <-- guardo el rol
      } catch (e) {
        const err = e as ResponseError;
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

  return (
    <AuthContext.Provider value={{ user, token, rol }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);