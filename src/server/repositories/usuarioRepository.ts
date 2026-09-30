import { Prisma } from '@/generated/prisma/client'
import { CATEGORIAS_POR_DEFECTO } from '@/server/auth/categoriasPorDefecto'
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
  async buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } })
  },

  async crear(datos: DatosCrearUsuario) {
    try {
      return await prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
          data: {
            nombre: datos.nombre,
            nombreNegocio: datos.nombreNegocio,
            email: datos.email,
            passwordHash: datos.passwordHash,
          },
        })

        await tx.categoria.createMany({
          data: CATEGORIAS_POR_DEFECTO.map((categoria) => ({
            usuarioId: usuario.id,
            nombre: categoria.nombre,
            tipo: categoria.tipo,
          })),
        })

        return usuario
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailDuplicadoError()
      }

      throw error
    }
  },
}
