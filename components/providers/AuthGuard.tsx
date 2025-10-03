// components/guards/AuthGuard.tsx
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import AuthProvider from "@/components/providers/AuthProvider";


//el authguard es un componente del lado del servidor, es para proteger rutas y redirigir al login si no hay sesion
//si hay sesion, renderiza el AuthProvider para que los componentes hijos puedan acceder al contexto de autenticacion
export default async function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <AuthProvider initialUser={session.user} initialToken={session.tokenSet?.accessToken}>
      {children}
    </AuthProvider>
  );
}