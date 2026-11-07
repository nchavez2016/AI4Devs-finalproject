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

const formateadorPartes = new Intl.DateTimeFormat('es-EC', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

function partesFecha(fecha: Date) {
  const parts = formateadorPartes.formatToParts(fecha)
  const diaSemana = parts.find((p) => p.type === 'weekday')?.value.replace(/\./g, '') ?? ''
  const dia = parts.find((p) => p.type === 'day')?.value ?? ''
  const mes = parts.find((p) => p.type === 'month')?.value.replace(/\./g, '') ?? ''
  return { diaSemana, dia, mes }
}

export function textoRangoPeriodo(periodo: Periodo, limites: LimitesPeriodo): string {
  const desde = partesFecha(limites.desde)
  const hasta = partesFecha(limites.hasta)

  if (periodo === 'dia') {
    return `${desde.diaSemana} ${desde.dia} ${desde.mes}`
  }

  if (periodo === 'semana') {
    const parteDesde =
      desde.mes === hasta.mes
        ? `${desde.diaSemana} ${desde.dia}`
        : `${desde.diaSemana} ${desde.dia} ${desde.mes}`
    return `${parteDesde} – ${hasta.diaSemana} ${hasta.dia} ${hasta.mes}`
  }

  return `${desde.dia} – ${hasta.dia} ${hasta.mes}`
}
