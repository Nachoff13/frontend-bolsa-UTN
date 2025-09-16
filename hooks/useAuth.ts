import type { AuthState } from "@/types/auth";

export function useAuth(): AuthState & { login: () => void; logout: () => void } {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: () => {},
    logout: () => {},
  };
}
