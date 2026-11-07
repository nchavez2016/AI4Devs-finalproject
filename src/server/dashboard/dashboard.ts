import { Prisma } from '@/generated/prisma/client'
import { listarCuentas } from '@/server/cuentas/cuentas'
import { categoriaRepository } from '@/server/repositories/categoriaRepository'
import { transaccionRepository } from '@/server/repositories/transaccionRepository'
import { limitesPeriodo, type Periodo } from './periodo'

/** Categorías de gasto que muestra el dashboard (design 0.5). */
const MAXIMO_CATEGORIAS = 5

export interface SaldoCuenta {
  cuentaId: string
  nombre: string
  saldo: string
}

export interface CategoriaGasto {
  categoria: string
  total: string
}

export interface ResumenDashboard {
  totalIngresos: string
  totalGastos: string
  balance: string
  saldosPorCuenta: SaldoCuenta[]
  topCategoriasGasto: CategoriaGasto[]
}

export async function calcularResumen(
  usuarioId: string,
  periodo: Periodo,
  hoy: string
): Promise<ResumenDashboard> {
  const { desde, hasta } = limitesPeriodo(periodo, hoy)
  const [sumas, cuentas, sumasPorCategoria] = await Promise.all([
    transaccionRepository.sumasPorTipo(usuarioId, desde, hasta),
    listarCuentas(usuarioId),
    transaccionRepository.sumasGastoPorCategoria(usuarioId, desde, hasta),
  ])
  const categorias = await categoriaRepository.listarPorIds(
    usuarioId,
    sumasPorCategoria.map((s) => s.categoriaId)
  )
  const nombres = new Map(categorias.map((c) => [c.id, c.nombre]))
  const topCategoriasGasto = sumasPorCategoria
    .map((s) => ({
      categoria: nombres.get(s.categoriaId) ?? '',
      total: s._sum.monto ?? new Prisma.Decimal(0),
    }))
    .sort((a, b) => b.total.comparedTo(a.total) || a.categoria.localeCompare(b.categoria, 'es'))
    .slice(0, MAXIMO_CATEGORIAS)
    .map((c) => ({ categoria: c.categoria, total: c.total.toFixed(2) }))

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
    topCategoriasGasto,
  }
}
