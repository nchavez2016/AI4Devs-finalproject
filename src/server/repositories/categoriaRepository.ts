import { prisma } from './prisma'

export const categoriaRepository = {
  async listar(usuarioId: string) {
    return prisma.categoria.findMany({
      where: {
        usuarioId,
        categoriaPadreId: null,
      },
    })
  },
}
