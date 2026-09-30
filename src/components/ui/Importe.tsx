export type TipoImporte = 'ingreso' | 'gasto' | 'saldo'

const formateadorMoneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
})

export function formatearImporte(valor: string, tipo: TipoImporte): string {
  const formateado = formateadorMoneda.format(valor as unknown as number)
  if (tipo === 'ingreso') {
    return `+${formateado}`
  }
  if (tipo === 'gasto') {
    return `\u2212${formateado}`
  }
  if (tipo === 'saldo') {
    return formateado
  }
  return ''
}
