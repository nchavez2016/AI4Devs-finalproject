import type { FiltrosTransacciones } from '@/server/transacciones/transacciones'

export function contarFiltrosActivos(filtros: FiltrosTransacciones): number {
  return [filtros.desde, filtros.hasta, filtros.tipo, filtros.cuentaId].filter(Boolean).length
}

export function hayFiltrosActivos(filtros: FiltrosTransacciones): boolean {
  return contarFiltrosActivos(filtros) > 0
}

const formatoMes = new Intl.DateTimeFormat('es-EC', { timeZone: 'UTC', month: 'long' })

function aFecha(fecha: string): Date {
  return new Date(`${fecha}T00:00:00Z`)
}

// Frase del vacío por filtro (estados.md, 9.1). Un rango dentro de un mismo mes se dice
// "del 1 al 15 de septiembre"; el resto de combinaciones, de forma general.
export function mensajeSinResultados(filtros: FiltrosTransacciones): string {
  if (filtros.desde && filtros.hasta) {
    const desde = aFecha(filtros.desde)
    const hasta = aFecha(filtros.hasta)
    if (
      desde.getUTCFullYear() === hasta.getUTCFullYear() &&
      desde.getUTCMonth() === hasta.getUTCMonth()
    ) {
      return `No hay movimientos del ${desde.getUTCDate()} al ${hasta.getUTCDate()} de ${formatoMes.format(hasta)}.`
    }
  }

  return 'No hay movimientos con estos filtros.'
}
