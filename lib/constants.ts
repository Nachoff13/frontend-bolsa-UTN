// Roles de usuario
export const USER_ROLES = {
  ESTUDIANTE: 'Estudiante',
  EMPRESA: 'Empresa',
  ADMIN: 'Admin',
} as const

// Tipos de contrato
export const TIPOS_CONTRATO = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRATO: 'Contrato',
  PASANTIA: 'Pasantía',
  FREELANCE: 'Freelance',
} as const

// Modalidades de trabajo
export const MODALIDADES_TRABAJO = {
  PRESENCIAL: 'Presencial',
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido',
} as const

// Estados de postulación
export const ESTADOS_POSTULACION = {
  PENDIENTE: 'Pendiente',
  REVISANDO: 'Revisando',
  ENTREVISTA: 'Entrevista',
  ACEPTADA: 'Aceptada',
  RECHAZADA: 'Rechazada',
} as const

// Categorías de ofertas
export const CATEGORIAS_OFERTAS = [
  'Desarrollo de Software',
  'Diseño UX/UI',
  'Marketing Digital',
  'Ventas',
  'Recursos Humanos',
  'Finanzas',
  'Operaciones',
  'Investigación',
  'Docencia',
  'Otros',
] as const

// Niveles de experiencia
export const NIVELES_EXPERIENCIA = {
  SIN_EXPERIENCIA: 'Sin experiencia',
  JUNIOR: 'Junior (0-2 años)',
  SEMI_SENIOR: 'Semi-Senior (2-5 años)',
  SENIOR: 'Senior (5+ años)',
} as const

// Ubicaciones comunes
export const UBICACIONES = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'San Miguel de Tucumán',
  'Mar del Plata',
  'Salta',
  'Santa Fe',
  'San Juan',
  'Resistencia',
  'Santiago del Estero',
  'Corrientes',
  'Posadas',
  'San Salvador de Jujuy',
  'Neuquén',
  'Bahía Blanca',
  'Paraná',
  'Formosa',
  'San Luis',
] as const

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES: 5,
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente más tarde.',
  TIMEOUT_ERROR: 'La solicitud tardó demasiado en completarse.',
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente.',
  UPDATED: 'Registro actualizado exitosamente.',
  DELETED: 'Registro eliminado exitosamente.',
  SAVED: 'Cambios guardados exitosamente.',
} as const

// Constantes de la aplicación
export const APP_NAME = 'Bolsa de Trabajo UTN'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' 