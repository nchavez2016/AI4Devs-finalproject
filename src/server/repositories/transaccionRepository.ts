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

  async listar(usuarioId: string) {
    return prisma.transaccion.findMany({
      where: { usuarioId },
      include: incluirNombres,
    })
  },
}
