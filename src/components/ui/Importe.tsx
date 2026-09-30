export type TipoImporte = 'ingreso' | 'gasto' | 'saldo'

const formateadorMoneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
})

function analizarValor(valor: string) {
  const tieneSignoMenos = valor.startsWith('-')
  const valorAbsoluto = tieneSignoMenos ? valor.slice(1) : valor
  const esCero = /^0*(\.0*)?$/.test(valorAbsoluto)
  const esNegativo = tieneSignoMenos && !esCero
  return { valorAbsoluto, esCero, esNegativo }
}

function obtenerClaseColor(valor: string, tipo: TipoImporte): string {
  if (tipo === 'ingreso') {
    return 'text-ingreso'
  }
  if (tipo === 'gasto') {
    return 'text-gasto'
  }
  const { esCero, esNegativo } = analizarValor(valor)
  if (esCero) {
    return 'text-muted-foreground'
  }
  if (esNegativo) {
    return 'text-negativo'
  }
  return 'text-foreground'
}

export function formatearImporte(valor: string, tipo: TipoImporte): string {
  const { valorAbsoluto, esCero, esNegativo } = analizarValor(valor)
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

export type TamanoImporte = 'cuerpo' | 'importe-resumen' | 'importe-principal'

const clasesTamano: Record<TamanoImporte, string> = {
  cuerpo: 'text-cuerpo',
  'importe-resumen': 'text-importe-resumen',
  'importe-principal': 'text-importe-principal',
}

export interface ImporteProps {
  valor: string
  tipo: TipoImporte
  tamano?: TamanoImporte
}

export function Importe({ valor, tipo, tamano = 'cuerpo' }: ImporteProps) {
  const formateado = formatearImporte(valor, tipo)
  const etiquetaSr = tipo === 'ingreso' ? 'Ingreso' : tipo === 'gasto' ? 'Gasto' : null
  const claseColor = obtenerClaseColor(valor, tipo)
  const claseTamano = clasesTamano[tamano]
  const className = [claseColor, claseTamano].filter(Boolean).join(' ')

  return (
    <span className={className}>
      {etiquetaSr && <span className="sr-only">{etiquetaSr}</span>}
      <span>{formateado}</span>
    </span>
  )
}
