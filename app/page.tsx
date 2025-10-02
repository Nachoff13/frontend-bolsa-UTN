import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login"); // fuerza login
  }

  return (
    <div>
      <h1>Bienvenido a la Bolsa de Trabajo</h1>
      <p>Usuario: {session.user.email}</p>
    </div>
  );
}