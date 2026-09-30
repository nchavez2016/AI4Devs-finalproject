export type TipoImporte = 'ingreso' | 'gasto' | 'saldo'

const formateadorMoneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
})

export function formatearImporte(valor: string, tipo: TipoImporte): string {
  const tieneSignoMenos = valor.startsWith('-')
  const valorAbsoluto = tieneSignoMenos ? valor.slice(1) : valor
  const esCero = /^0*(\.0*)?$/.test(valorAbsoluto)
  const esNegativo = tieneSignoMenos && !esCero
  const formateado = formateadorMoneda.format(valorAbsoluto as Intl.StringNumericLiteral)

  if (esCero) {
    return formateado
  }
  if (tipo === 'ingreso') {
    return `+${formateado}`
  }
  if (tipo === 'gasto' || (tipo === 'saldo' && esNegativo)) {
    return `\u2212${formateado}`
  }
  if (tipo === 'saldo') {
    return formateado
  }
  return ''
}

export interface ImporteProps {
  valor: string
  tipo: TipoImporte
}

export function Importe({ valor, tipo }: ImporteProps) {
  const formateado = formatearImporte(valor, tipo)
  const etiquetaSr = tipo === 'ingreso' ? 'Ingreso' : tipo === 'gasto' ? 'Gasto' : null

  return (
    <span>
      {etiquetaSr && <span className="sr-only">{etiquetaSr}</span>}
      <span>{formateado}</span>
    </span>
  )
}
