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

  async listar(usuarioId: string, filtros: FiltrosListarRepo = {}) {
    return prisma.transaccion.findMany({
      where: {
        usuarioId,
        ...((filtros.desde || filtros.hasta) && {
          fecha: { gte: filtros.desde, lte: filtros.hasta },
        }),
      },
      include: incluirNombres,
      orderBy: [{ fecha: 'desc' }, { creadoEn: 'desc' }],
    })
  },
}
