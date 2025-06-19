// Funciones de formateo básicas
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR').format(date)
} 