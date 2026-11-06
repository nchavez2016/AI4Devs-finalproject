import { exigirUsuarioId } from '@/server/auth/sesion'
import { listarCategorias, type ListadoCategorias } from '@/server/categorias/categorias'
import { listarCuentas, type CuentaItem } from '@/server/cuentas/cuentas'
import { esquemaFiltros } from './esquemas'
import {
  listarTransacciones,
  type FiltrosTransacciones,
  type TransaccionItem,
} from './transacciones'

export interface DatosTransacciones {
  transacciones: TransaccionItem[]
  cuentas: CuentaItem[]
  categorias: ListadoCategorias
  filtros: FiltrosTransacciones
}

export async function cargarTransacciones(parametrosDeUrl: unknown): Promise<DatosTransacciones> {
  const usuarioId = await exigirUsuarioId()
  // Un parámetro inválido de la URL se ignora (design f).
  const filtros = esquemaFiltros.parse(parametrosDeUrl ?? {})

  const [transacciones, cuentas, categorias] = await Promise.all([
    listarTransacciones(usuarioId, filtros),
    listarCuentas(usuarioId),
    listarCategorias(usuarioId),
  ])

  return { transacciones, cuentas, categorias, filtros }
}
