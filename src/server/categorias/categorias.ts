import { TipoMovimiento } from '@/generated/prisma/client'
import {
  categoriaRepository,
  NombreDuplicadoError,
} from '@/server/repositories/categoriaRepository'
import { agruparErroresPorCampo } from '@/server/validacion'
import { esquemaCrearCategoria } from './esquemas'

export interface CategoriaItem {
  id: string
  nombre: string
  tipo: TipoMovimiento
  categoriaPadreId: string | null
  creadoEn: Date
}

export type ResultadoCrearCategoria =
  | {
      ok: true
      categoria: CategoriaItem
    }
  | {
      ok: false
      errores: Record<string, string[]>
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

export async function crearCategoria(
  usuarioId: string,
  datosSinValidar: unknown
): Promise<ResultadoCrearCategoria> {
  const validacion = esquemaCrearCategoria.safeParse(datosSinValidar)
  if (!validacion.success) {
    return {
      ok: false,
      errores: agruparErroresPorCampo(validacion.error),
    }
  }

  const datos = validacion.data
  const tipo = datos.tipo as TipoMovimiento

  let categoria
  try {
    categoria = await categoriaRepository.crear({
      usuarioId,
      nombre: datos.nombre,
      tipo,
    })
  } catch (error) {
    if (error instanceof NombreDuplicadoError) {
      const etiqueta = tipo === TipoMovimiento.INGRESO ? 'ingreso' : 'gasto'
      return {
        ok: false,
        errores: {
          nombre: [`Ya tienes una categoría de ${etiqueta} con ese nombre`],
        },
      }
    }

    throw error
  }

  return {
    ok: true,
    categoria: mapearCategoria(categoria),
  }
}
