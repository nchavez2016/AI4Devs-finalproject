import { Prisma, TipoMovimiento } from '@/generated/prisma/client'
import { prisma } from './prisma'

export interface DatosCrearTransaccionRepo {
  usuarioId: string
  cuentaId: string
  categoriaId: string
  tipo: TipoMovimiento
  monto: Prisma.Decimal
  fecha: Date
  descripcion: string | null
}

export interface FiltrosListarRepo {
  desde?: Date
  hasta?: Date
  tipo?: TipoMovimiento
  cuentaId?: string
}

const incluirNombres = {
  cuenta: { select: { id: true, nombre: true } },
  categoria: { select: { id: true, nombre: true } },
} as const

export const transaccionRepository = {
  async crear(datos: DatosCrearTransaccionRepo) {
    return prisma.transaccion.create({
      data: {
        usuarioId: datos.usuarioId,
        cuentaId: datos.cuentaId,
        categoriaId: datos.categoriaId,
        tipo: datos.tipo,
        monto: datos.monto,
        fecha: datos.fecha,
        descripcion: datos.descripcion,
      },
      include: incluirNombres,
    })
  },

  /** Indica si el usuario tiene al menos una transacción, en cualquier fecha. */
  async existeAlguna(usuarioId: string) {
    const transaccion = await prisma.transaccion.findFirst({
      where: { usuarioId },
      select: { id: true },
    })
    return transaccion !== null
  },

  /** Suma de montos por tipo de las transacciones del usuario entre dos fechas, ambas incluidas. */
  async sumasPorTipo(usuarioId: string, desde: Date, hasta: Date) {
    return prisma.transaccion.groupBy({
      by: ['tipo'],
      where: { usuarioId, fecha: { gte: desde, lte: hasta } },
      _sum: { monto: true },
    })
  },

  /** Suma de los gastos del usuario por categoría entre dos fechas, ambas incluidas. */
  async sumasGastoPorCategoria(usuarioId: string, desde: Date, hasta: Date) {
    return prisma.transaccion.groupBy({
      by: ['categoriaId'],
      where: { usuarioId, tipo: 'GASTO', fecha: { gte: desde, lte: hasta } },
      _sum: { monto: true },
    })
  },

  async listar(usuarioId: string, filtros: FiltrosListarRepo = {}) {
    return prisma.transaccion.findMany({
      where: {
        usuarioId,
        tipo: filtros.tipo,
        cuentaId: filtros.cuentaId,
        ...((filtros.desde || filtros.hasta) && {
          fecha: { gte: filtros.desde, lte: filtros.hasta },
        }),
      },
      include: incluirNombres,
      orderBy: [{ fecha: 'desc' }, { creadoEn: 'desc' }],
    })
  },
}
