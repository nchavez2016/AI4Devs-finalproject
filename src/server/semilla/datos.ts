import { TipoCuenta, TipoMovimiento } from '@/generated/prisma/enums'

/** Datos fijos del usuario revisor (design.md, decisión b: seed mínimo). */

export const REVISOR = {
  nombre: 'Revisor',
  nombreNegocio: 'Negocio de prueba',
  email: 'revisor@cuadre.test',
  // Contraseña de prueba pública, documentada en readme.md y docs/despliegue.md.
  password: 'Revisor2026!',
} as const

export interface CuentaSemilla {
  nombre: string
  tipo: TipoCuenta
  saldoInicial: string
}

export interface MovimientoSemilla {
  tipo: TipoMovimiento
  monto: string
  /** AAAA-MM-DD */
  fecha: string
  cuenta: string
  categoria: string
}

export const CUENTAS_REVISOR: CuentaSemilla[] = [
  { nombre: 'Banco Pichincha', tipo: TipoCuenta.BANCO, saldoInicial: '500.00' },
  { nombre: 'Caja chica', tipo: TipoCuenta.EFECTIVO, saldoInicial: '300.00' },
]

/**
 * Movimientos del revisor relativos a `hoy` (AAAA-MM-DD, día de Ecuador): cuatro el día 1 del
 * mes en curso y uno el día 15 del mes anterior.
 */
export function movimientosRevisor(hoy: string): MovimientoSemilla[] {
  const [anio, mes] = hoy.split('-').map(Number)
  const primeroDelMes = `${hoy.slice(0, 7)}-01`
  const anioAnterior = mes === 1 ? anio - 1 : anio
  const mesAnterior = mes === 1 ? 12 : mes - 1
  const quinceDelMesAnterior = `${anioAnterior}-${String(mesAnterior).padStart(2, '0')}-15`

  return [
    { tipo: TipoMovimiento.INGRESO, monto: '1200.00', fecha: primeroDelMes, cuenta: 'Banco Pichincha', categoria: 'Ventas' },
    { tipo: TipoMovimiento.GASTO, monto: '400.00', fecha: primeroDelMes, cuenta: 'Banco Pichincha', categoria: 'Arriendo' },
    { tipo: TipoMovimiento.GASTO, monto: '150.75', fecha: primeroDelMes, cuenta: 'Caja chica', categoria: 'Insumos' },
    { tipo: TipoMovimiento.GASTO, monto: '20.25', fecha: primeroDelMes, cuenta: 'Caja chica', categoria: 'Transporte' },
    { tipo: TipoMovimiento.INGRESO, monto: '800.00', fecha: quinceDelMesAnterior, cuenta: 'Banco Pichincha', categoria: 'Ventas' },
  ]
}
