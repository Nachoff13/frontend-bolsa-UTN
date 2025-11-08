// 🎨 Funciones para obtener colores de chips según el tipo

export interface ChipColorStyle {
  backgroundColor: string;
  color: string;
}

/**
 * Obtiene los colores para chips de estado de postulación
 */
export const getEstadoChipColor = (estado: string): ChipColorStyle => {
  const estadoLower = estado?.toLowerCase() || "";
  
  switch (estadoLower) {
    case "aprobada":
      return { backgroundColor: "#E8F5E9", color: "#2E7D32" };
    case "rechazada":
      return { backgroundColor: "#FFEBEE", color: "#C62828" };
    case "en revisión":
    case "en revision":
      return { backgroundColor: "#FFF3CD", color: "#856404" };
    case "iniciada":
      return { backgroundColor: "#E3F2FD", color: "#0D47A1" };
    default:
      return { backgroundColor: "#E3F2FD", color: "#0D47A1" };
  }
};

/**
 * Obtiene los colores para chips de modalidad de trabajo
 */
export const getModalidadChipColor = (modalidad: string): ChipColorStyle => {
  const modalidadLower = modalidad?.toLowerCase() || "";
  
  if (modalidadLower.includes("remoto") || modalidadLower.includes("remote")) {
    return { backgroundColor: "#FCE4EC", color: "#C2185B" };
  }
  if (modalidadLower.includes("híbrido") || modalidadLower.includes("hibrido") || modalidadLower.includes("hybrid")) {
    return { backgroundColor: "#F3E5F5", color: "#7B1FA2" };
  }
  if (modalidadLower.includes("presencial") || modalidadLower.includes("onsite")) {
    return { backgroundColor: "#E1F5FE", color: "#0277BD" };
  }
  
  return { backgroundColor: "#FCE4EC", color: "#C2185B" }; // Default remoto
};

/**
 * Obtiene los colores para chips de tipo de contrato
 */
export const getTipoContratoChipColor = (tipoContrato: string): ChipColorStyle => {
  const tipoLower = tipoContrato?.toLowerCase() || "";
  
  if (tipoLower.includes("full") || tipoLower.includes("completo")) {
    return { backgroundColor: "#E0F2F1", color: "#00695C" };
  }
  if (tipoLower.includes("part") || tipoLower.includes("parcial") || tipoLower.includes("medio")) {
    return { backgroundColor: "#E8EAF6", color: "#3949AB" };
  }
  if (tipoLower.includes("pasantía") || tipoLower.includes("pasantia") || tipoLower.includes("intern")) {
    return { backgroundColor: "#FFF3E0", color: "#EF6C00" };
  }
  if (tipoLower.includes("freelance") || tipoLower.includes("independiente")) {
    return { backgroundColor: "#F1F8E9", color: "#558B2F" };
  }
  
  return { backgroundColor: "#E0F2F1", color: "#00695C" }; // Default full-time
};

/**
 * Obtiene los colores para chips de empresa (más neutral)
 */
export const getEmpresaChipColor = (): ChipColorStyle => {
  return { backgroundColor: "#E8F5E9", color: "#2E7D32" };
};

