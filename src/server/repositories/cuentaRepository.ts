import { Prisma, TipoCuenta } from '@/generated/prisma/client'
import { prisma } from './prisma'

export class NombreDuplicadoError extends Error {
  constructor() {
    super('Ya tienes una cuenta con ese nombre')
    this.name = 'NombreDuplicadoError'
  }
}

export interface DatosCrearCuentaRepo {
  usuarioId: string
  nombre: string
  tipo: TipoCuenta
  saldoInicial: Prisma.Decimal
}

export const cuentaRepository = {
  async crear(datos: DatosCrearCuentaRepo) {
    try {
      return await prisma.cuenta.create({
        data: {
          usuarioId: datos.usuarioId,
          nombre: datos.nombre,
          tipo: datos.tipo,
          saldoInicial: datos.saldoInicial,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NombreDuplicadoError()
      }

      throw error
    }
  },

  async listar(usuarioId: string) {
    return prisma.cuenta.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'asc' },
    })
  },
}
