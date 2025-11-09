/**
 * Utilidades para manejo de fechas en el sistema
 */

/**
 * Parsea una fecha en formato "dd/MM/yyyy" a un objeto Date
 * 
 * @param fechaStr - Fecha en formato "dd/MM/yyyy"
 * @returns Objeto Date
 */
export function parseFechaLatam(fechaStr: string): Date {
  const [dd, mm, yyyy] = fechaStr.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

/**
 * Calcula el tiempo transcurrido desde una fecha hasta ahora
 * 
 * @param fechaStr - Fecha en formato "dd/MM/yyyy" o ISO
 * @returns String con el tiempo transcurrido (ej: "hace 2 días", "hace 1 semana")
 */
export function calcularTiempoTranscurrido(fechaStr?: string): string {
  if (!fechaStr) return "";

  // Si viene en formato dd/MM/yyyy la parseamos manualmente
  const fecha = fechaStr.includes("/")
    ? parseFechaLatam(fechaStr)
    : new Date(fechaStr);

  if (isNaN(fecha.getTime())) return "";

  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();

  // Si es una fecha futura
  if (diffMs < 0) return "próximamente";

  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 1) return "hoy";
  if (diffDias === 1) return "hace 1 día";
  if (diffDias < 7) return `hace ${diffDias} días`;

  const semanas = Math.floor(diffDias / 7);
  if (semanas < 4) return semanas === 1 ? "hace 1 semana" : `hace ${semanas} semanas`;

  const meses = Math.floor(diffDias / 30);
  return meses === 1 ? "hace 1 mes" : `hace ${meses} meses`;
}

/**
 * Calcula la fecha de cierre de una oferta.
 * Si no hay fechaFin, calcula 60 días después de fechaInicio.
 * 
 * @param fechaInicio - Fecha de inicio en formato "dd/MM/yyyy"
 * @param fechaFin - Fecha de fin opcional en formato "dd/MM/yyyy"
 * @returns Fecha de cierre en formato "dd/MM/yyyy"
 */
export function calcularFechaCierre(fechaInicio: string, fechaFin?: string): string {
  // Si hay fechaFin específica, la usamos
  if (fechaFin && fechaFin.trim() !== "") {
    return fechaFin;
  }

  // Si no hay fechaFin, calculamos 60 días después de fechaInicio
  // El formato viene como "dd/MM/yyyy" del backend
  const partes = fechaInicio.split("/");
  if (partes.length !== 3) return fechaInicio;

  const dia = parseInt(partes[0]);
  const mes = parseInt(partes[1]) - 1; // Los meses en JavaScript van de 0-11
  const año = parseInt(partes[2]);

  const fechaInicioDate = new Date(año, mes, dia);
  const fechaCierreDate = new Date(fechaInicioDate);
  fechaCierreDate.setDate(fechaInicioDate.getDate() + 60);

  // Formatear de vuelta a "dd/MM/yyyy"
  const diaCierre = fechaCierreDate.getDate().toString().padStart(2, "0");
  const mesCierre = (fechaCierreDate.getMonth() + 1).toString().padStart(2, "0");
  const añoCierre = fechaCierreDate.getFullYear();

  return `${diaCierre}/${mesCierre}/${añoCierre}`;
}

