import { redirect } from 'next/navigation';

export default function PublicacionesPage() {
  // Redirigir a ofertas-publicadas
  redirect('/empresa/ofertas-publicadas');
}
