// Tipos de oferta
export interface Oferta {
  id: string
  titulo: string
  empresa: string
  descripcion: string
  salario: number
  ubicacion: string
  tipoContrato: string
  fechaPublicacion: Date
  requisitos: string[]
  activa: boolean
}

export type TipoContrato = 'Full-time' | 'Part-time' | 'Contrato' | 'Pasantía' | 'Freelance'

export type ModalidadTrabajo = 'Presencial' | 'Remoto' | 'Híbrido'

export interface OfertaCreate {
  titulo: string
  descripcion: string
  salario: number
  ubicacion: string
  tipoContrato: TipoContrato
  requisitos: string[]
  categoria?: string
  experiencia?: string
  modalidad?: ModalidadTrabajo
  beneficios?: string[]
  fechaLimite?: Date
}

export interface OfertaUpdate extends Partial<OfertaCreate> {
  activa?: boolean
}

export interface OfertaFilters {
  ubicacion?: string
  tipoContrato?: TipoContrato
  modalidad?: ModalidadTrabajo
  salarioMin?: number
  salarioMax?: number
  categoria?: string
  empresa?: string
  activa?: boolean
} 