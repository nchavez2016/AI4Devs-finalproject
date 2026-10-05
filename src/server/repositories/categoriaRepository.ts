import { TipoMovimiento } from '@/generated/prisma/client'
import { prisma } from './prisma'

export interface DatosCrearCategoriaRepo {
  usuarioId: string
  nombre: string
  tipo: TipoMovimiento
}

export const categoriaRepository = {
  async crear(datos: DatosCrearCategoriaRepo) {
    return prisma.categoria.create({
      data: {
        usuarioId: datos.usuarioId,
        nombre: datos.nombre,
        tipo: datos.tipo,
      },
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
