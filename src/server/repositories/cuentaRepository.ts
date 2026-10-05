import { Prisma, TipoCuenta } from '@/generated/prisma/client'
import { prisma } from './prisma'

export interface DatosCrearCuentaRepo {
  usuarioId: string
  nombre: string
  tipo: TipoCuenta
  saldoInicial: Prisma.Decimal
}

export const cuentaRepository = {
  async crear(datos: DatosCrearCuentaRepo) {
    return prisma.cuenta.create({
      data: {
        usuarioId: datos.usuarioId,
        nombre: datos.nombre,
        tipo: datos.tipo,
        saldoInicial: datos.saldoInicial,
      },
    })
  },

  async listar(usuarioId: string) {
    return prisma.cuenta.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'asc' },
    })
  },
}
