/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida un teléfono argentino
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Valida un DNI argentino
 */
export const validateDNI = (dni: string): boolean => {
  const cleaned = dni.replace(/\D/g, '')
  return cleaned.length === 8
}

/**
 * Valida un CUIL argentino
 */
export const validateCUIL = (cuil: string): boolean => {
  const cleaned = cuil.replace(/\D/g, '')
  return cleaned.length === 11
}

/**
 * Valida que un campo no esté vacío
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Valida la longitud mínima de un texto
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

/**
 * Valida la longitud máxima de un texto
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

/**
 * Valida que un número esté en un rango
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Valida un archivo por tipo y tamaño
 */
export const validateFile = (
  file: File,
  allowedTypes: string[] = ['application/pdf'],
  maxSizeMB: number = 10
): { isValid: boolean; error?: string } => {
  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
    }
  }

  // Validar tamaño
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`
    }
  }

  return { isValid: true }
}

/**
 * Valida una contraseña
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula')
  }

  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Valida que dos campos sean iguales (para confirmar contraseña)
 */
export const validateMatch = (value1: string, value2: string): boolean => {
  return value1 === value2
}

/**
 * Valida una URL
 */
export const validateURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida un código postal argentino
 */
export const validatePostalCode = (postalCode: string): boolean => {
  const cleaned = postalCode.replace(/\D/g, '')
  return cleaned.length === 4
}

/**
 * Valida un nombre (solo letras y espacios)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  return nameRegex.test(name) && name.trim().length >= 2
}

/**
 * Valida un legajo de estudiante
 */
export const validateLegajo = (legajo: string): boolean => {
  const cleaned = legajo.replace(/\D/g, '')
  return cleaned.length >= 5 && cleaned.length <= 10
}

/**
 * Valida un salario
 */
export const validateSalary = (salary: number): boolean => {
  return salary > 0 && salary <= 10000000 // 10 millones como máximo
}

/**
 * Valida una fecha futura
 */
export const validateFutureDate = (date: Date): boolean => {
  return date > new Date()
}

/**
 * Valida una fecha pasada
 */
export const validatePastDate = (date: Date): boolean => {
  return date < new Date()
}

/**
 * Valida que una fecha esté en un rango
 */
export const validateDateRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate
} 