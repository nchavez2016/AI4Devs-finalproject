import { Prisma } from '@/generated/prisma/client'
import { transaccionRepository } from '@/server/repositories/transaccionRepository'
import { limitesPeriodo, type Periodo } from './periodo'

export interface ResumenDashboard {
  totalIngresos: string
  totalGastos: string
  balance: string
}

export async function calcularResumen(
  usuarioId: string,
  periodo: Periodo,
  hoy: string
): Promise<ResumenDashboard> {
  const { desde, hasta } = limitesPeriodo(periodo, hoy)
  const sumas = await transaccionRepository.sumasPorTipo(usuarioId, desde, hasta)

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
  }
}
