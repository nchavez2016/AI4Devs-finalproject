const formatoHoy = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Guayaquil',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Día de hoy en Ecuador (AAAA-MM-DD), sea cual sea la zona horaria del servidor. */
export function hoyEnEcuador(): string {
  return formatoHoy.format(new Date())
}
