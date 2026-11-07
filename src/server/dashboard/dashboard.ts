import { Prisma } from '@/generated/prisma/client'
import { listarCuentas } from '@/server/cuentas/cuentas'
import { transaccionRepository } from '@/server/repositories/transaccionRepository'
import { limitesPeriodo, type Periodo } from './periodo'

export interface SaldoCuenta {
  cuentaId: string
  nombre: string
  saldo: string
}

export interface ResumenDashboard {
  totalIngresos: string
  totalGastos: string
  balance: string
  saldosPorCuenta: SaldoCuenta[]
}

export async function calcularResumen(
  usuarioId: string,
  periodo: Periodo,
  hoy: string
): Promise<ResumenDashboard> {
  const { desde, hasta } = limitesPeriodo(periodo, hoy)
  const [sumas, cuentas] = await Promise.all([
    transaccionRepository.sumasPorTipo(usuarioId, desde, hasta),
    listarCuentas(usuarioId),
  ])

  let ingresos = new Prisma.Decimal(0)
  let gastos = new Prisma.Decimal(0)
  for (const suma of sumas) {
    const total = suma._sum.monto ?? new Prisma.Decimal(0)
    if (suma.tipo === 'INGRESO') {
      ingresos = ingresos.plus(total)
    } else {
      gastos = gastos.plus(total)
    }
  }

  return {
    totalIngresos: ingresos.toFixed(2),
    totalGastos: gastos.toFixed(2),
    balance: ingresos.minus(gastos).toFixed(2),
    saldosPorCuenta: cuentas.map((c) => ({ cuentaId: c.id, nombre: c.nombre, saldo: c.saldo })),
  }
}
