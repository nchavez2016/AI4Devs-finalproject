import { TipoMovimiento } from '@/generated/prisma/client'
import { categoriaRepository } from '@/server/repositories/categoriaRepository'

export interface CategoriaItem {
  id: string
  nombre: string
  tipo: TipoMovimiento
  categoriaPadreId: string | null
  creadoEn: Date
}

export interface ListadoCategorias {
  ingreso: CategoriaItem[]
  gasto: CategoriaItem[]
}

function mapearCategoria(c: {
  id: string
  nombre: string
  tipo: TipoMovimiento
  categoriaPadreId: string | null
  creadoEn: Date
}): CategoriaItem {
  return {
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    categoriaPadreId: c.categoriaPadreId,
    creadoEn: c.creadoEn,
  }
}

export async function listarCategorias(
  usuarioId: string
): Promise<ListadoCategorias> {
  const categorias = await categoriaRepository.listar(usuarioId)

  const ingreso = categorias
    .filter((c) => c.tipo === TipoMovimiento.INGRESO)
    .map(mapearCategoria)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const gasto = categorias
    .filter((c) => c.tipo === TipoMovimiento.GASTO)
    .map(mapearCategoria)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  return { ingreso, gasto }
}
