import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function HomePage() {
  return (
    <div className="space-y-4">
      <Input placeholder="Escribe tu email" />
      <Button>Enviar</Button>
    </div>
  )
} 