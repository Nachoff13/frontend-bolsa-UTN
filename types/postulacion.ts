// Tipos de postulación
export interface Postulacion {
  id: string
  ofertaId: string
  estudianteId: string
  fechaPostulacion: Date
  estado: PostulacionEstado
  cv?: string
}

export type PostulacionEstado = 'Pendiente' | 'Revisando' | 'Entrevista' | 'Aceptada' | 'Rechazada'

export interface PostulacionCreate {
  ofertaId: number
  cv?: string
  cartaPresentacion?: string
}

export interface PostulacionUpdate {
  estado?: PostulacionEstado
  observaciones?: string
}

export interface Estudiante {
  id: string
  nombre: string
  email: string
  carrera: string
  legajo: string
  cv?: string
  habilidades: string[]
  experiencia?: string
  fechaRegistro: Date
}

export interface PostulacionFilters {
  estado?: PostulacionEstado
  ofertaId?: number
  estudianteId?: string
  fechaDesde?: Date
  fechaHasta?: Date
} 