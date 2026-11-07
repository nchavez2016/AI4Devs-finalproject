import { Prisma, TipoCuenta, TipoMovimiento } from '@/generated/prisma/client'
import { CATEGORIAS_POR_DEFECTO } from '@/server/auth/categoriasPorDefecto'
import { prisma } from './prisma'

export interface DatosRevisorRepo {
  nombre: string
  nombreNegocio: string
  email: string
  passwordHash: string
  cuentas: { nombre: string; tipo: TipoCuenta; saldoInicial: Prisma.Decimal }[]
  movimientos: {
    tipo: TipoMovimiento
    monto: Prisma.Decimal
    fecha: Date
    cuenta: string
    categoria: string
  }[]
}

export const semillaRepository = {
  /**
   * Deja al usuario revisor exactamente con los datos recibidos: upsert por email y, filtrando
   * siempre por su `usuarioId`, borra y recrea sus movimientos, cuentas y categorías. No toca
   * filas de ningún otro usuario.
   */
  async restablecerRevisor(datos: DatosRevisorRepo): Promise<string> {
    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.upsert({
        where: { email: datos.email },
        update: {
          nombre: datos.nombre,
          nombreNegocio: datos.nombreNegocio,
          passwordHash: datos.passwordHash,
        },
        create: {
          nombre: datos.nombre,
          nombreNegocio: datos.nombreNegocio,
          email: datos.email,
          passwordHash: datos.passwordHash,
        },
      })
      const usuarioId = usuario.id

      await tx.transaccion.deleteMany({ where: { usuarioId } })
      await tx.cuenta.deleteMany({ where: { usuarioId } })
      // Las subcategorías se borran antes que sus padres (onDelete: Restrict).
      await tx.categoria.deleteMany({ where: { usuarioId, categoriaPadreId: { not: null } } })
      await tx.categoria.deleteMany({ where: { usuarioId } })

      await tx.categoria.createMany({
        data: CATEGORIAS_POR_DEFECTO.map((c) => ({ usuarioId, nombre: c.nombre, tipo: c.tipo })),
      })
      await tx.cuenta.createMany({
        data: datos.cuentas.map((c) => ({ usuarioId, ...c })),
      })

      const cuentas = await tx.cuenta.findMany({ where: { usuarioId } })
      const categorias = await tx.categoria.findMany({ where: { usuarioId } })
      const idCuenta = new Map(cuentas.map((c) => [c.nombre, c.id]))
      const idCategoria = new Map(categorias.map((c) => [`${c.tipo}:${c.nombre}`, c.id]))

      await tx.transaccion.createMany({
        data: datos.movimientos.map((m) => ({
          usuarioId,
          cuentaId: idCuenta.get(m.cuenta)!,
          categoriaId: idCategoria.get(`${m.tipo}:${m.categoria}`)!,
          tipo: m.tipo,
          monto: m.monto,
          fecha: m.fecha,
        })),
      })

      return usuarioId
    })
  },
}
