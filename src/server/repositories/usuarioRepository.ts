import { Prisma } from '@/generated/prisma/client'
import { prisma } from './prisma'

export class EmailDuplicadoError extends Error {
  constructor() {
    super('El email ya está registrado')
    this.name = 'EmailDuplicadoError'
  }
}

interface DatosCrearUsuario {
  nombre: string
  nombreNegocio: string
  email: string
  passwordHash: string
}

export const usuarioRepository = {
  async crear(datos: DatosCrearUsuario) {
    try {
      return await prisma.usuario.create({
        data: {
          nombre: datos.nombre,
          nombreNegocio: datos.nombreNegocio,
          email: datos.email,
          passwordHash: datos.passwordHash,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailDuplicadoError()
      }

      throw error
    }
  },
}
