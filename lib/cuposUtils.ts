/**
 * Utilidades para manejo de cupos en ofertas
 */

/**
 * Tipo de retorno para la configuración de chip de cupos
 */
export interface CuposChipConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * Determina la configuración visual del chip de cupos según disponibilidad
 * 
 * @param cantidadPostulantes - Cantidad actual de postulantes aprobados
 * @param cupos - Cantidad total de cupos disponibles
 * @returns Configuración del chip (label, backgroundColor, textColor)
 */
export function getCuposChip(cantidadPostulantes: number = 0, cupos: number = 1): CuposChipConfig {
  const cupoLleno = cantidadPostulantes >= cupos;

  if (cupoLleno) {
    return {
      label: "Cupo Lleno",
      backgroundColor: "#FF9800", // Naranja
      textColor: "#FFFFFF",
    };
  }

  return {
    label: `Cupos: ${cantidadPostulantes}/${cupos}`,
    backgroundColor: "#E3F2FD", // Azul claro
    textColor: "#1976D2",
  };
}

/**
 * Verifica si una oferta tiene cupos llenos
 * 
 * @param cantidadPostulantes - Cantidad actual de postulantes aprobados
 * @param cupos - Cantidad total de cupos disponibles
 * @returns true si los cupos están llenos
 */
export function cuposLlenos(cantidadPostulantes: number = 0, cupos: number = 1): boolean {
  return cantidadPostulantes >= cupos;
}

