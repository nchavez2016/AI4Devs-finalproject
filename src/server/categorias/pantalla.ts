import { exigirUsuarioId } from '@/server/auth/sesion'
import { listarCategorias, type ListadoCategorias } from './categorias'

export type DatosCategorias = ListadoCategorias

export async function cargarCategorias(): Promise<DatosCategorias> {
  const usuarioId = await exigirUsuarioId()

  return listarCategorias(usuarioId)
}
