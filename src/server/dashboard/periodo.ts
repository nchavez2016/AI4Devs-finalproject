export type Periodo = 'dia' | 'semana' | 'mes'

/** Límites del período como fechas calendario (medianoche UTC), ambos extremos incluidos. */
export interface LimitesPeriodo {
  desde: Date
  hasta: Date
}

/**
 * Límites del período a partir del día de hoy en Ecuador (AAAA-MM-DD). Solo usa
 * aritmética de calendario en UTC: no depende de la zona horaria del servidor.
 */
export function limitesPeriodo(periodo: Periodo, hoy: string): LimitesPeriodo {
  const [anio, mes, dia] = hoy.split('-').map(Number)

  if (periodo === 'dia') {
    const hoyUtc = new Date(Date.UTC(anio, mes - 1, dia))
    return { desde: hoyUtc, hasta: hoyUtc }
  }

  if (periodo === 'semana') {
    const hoyUtc = new Date(Date.UTC(anio, mes - 1, dia))
    // getUTCDay: 0 = domingo; la semana empieza el lunes.
    const diasDesdeLunes = (hoyUtc.getUTCDay() + 6) % 7
    return {
      desde: new Date(Date.UTC(anio, mes - 1, dia - diasDesdeLunes)),
      hasta: new Date(Date.UTC(anio, mes - 1, dia - diasDesdeLunes + 6)),
    }
  }

  return {
    desde: new Date(Date.UTC(anio, mes - 1, 1)),
    hasta: new Date(Date.UTC(anio, mes, 0)),
  }
}
