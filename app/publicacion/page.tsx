import Header from '@/components/shared/Header'
import Sidebar from '@/components/shared/Sidebar'
import Publicacion from '@/components/shared/Publicacion'

export default function PublicacionPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Publicacion />
        </main>
      </div>
    </div>
  )
}

