import { Prisma, TipoMovimiento } from '@/generated/prisma/client'
import { prisma } from './prisma'

export class NombreDuplicadoError extends Error {
  constructor() {
    super('Ya existe una categoría con ese nombre')
    this.name = 'NombreDuplicadoError'
  }
}

export interface DatosCrearCategoriaRepo {
  usuarioId: string
  nombre: string
  tipo: TipoMovimiento
}

export const categoriaRepository = {
  async crear(datos: DatosCrearCategoriaRepo) {
    try {
      return await prisma.categoria.create({
        data: {
          usuarioId: datos.usuarioId,
          nombre: datos.nombre,
          tipo: datos.tipo,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NombreDuplicadoError()
      }

      throw error
    }
  },

  async buscarPorId(usuarioId: string, id: string) {
    return prisma.categoria.findFirst({
      where: { id, usuarioId },
    })
  },

  /** Categorías del usuario con esos identificadores (incluye subcategorías). */
  async listarPorIds(usuarioId: string, ids: string[]) {
    return prisma.categoria.findMany({
      where: { usuarioId, id: { in: ids } },
      select: { id: true, nombre: true },
    })
  },

  async listar(usuarioId: string) {
    return prisma.categoria.findMany({
      where: {
        usuarioId,
        categoriaPadreId: null,
      },
    })
  },
}
