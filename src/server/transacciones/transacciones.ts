import { Prisma, TipoMovimiento } from '@/generated/prisma/client'
import { transaccionRepository } from '@/server/repositories/transaccionRepository'
import { agruparErroresPorCampo } from '@/server/validacion'
import { esquemaFiltros, esquemaRegistrarTransaccion } from './esquemas'

export interface TransaccionItem {
  id: string
  tipo: TipoMovimiento
  monto: string
  fecha: string
  descripcion: string | null
  cuenta: { id: string; nombre: string }
  categoria: { id: string; nombre: string }
  creadoEn: Date
}

export type ResultadoRegistrarTransaccion =
  | {
      ok: true
      transaccion: TransaccionItem
    }
  | {
      ok: false
      errores: Record<string, string[]>
    }

function mapearTransaccion(t: {
  id: string
  tipo: TipoMovimiento
  monto: Prisma.Decimal
  fecha: Date
  descripcion: string | null
  cuenta: { id: string; nombre: string }
  categoria: { id: string; nombre: string }
  creadoEn: Date
}): TransaccionItem {
  return {
    id: t.id,
    tipo: t.tipo,
    monto: t.monto.toFixed(2),
    fecha: t.fecha.toISOString().slice(0, 10),
    descripcion: t.descripcion,
    cuenta: t.cuenta,
    categoria: t.categoria,
    creadoEn: t.creadoEn,
  }
}

export async function registrarTransaccion(
  usuarioId: string,
  datosSinValidar: unknown
): Promise<ResultadoRegistrarTransaccion> {
  const validacion = esquemaRegistrarTransaccion.safeParse(datosSinValidar)
  if (!validacion.success) {
    return {
      ok: false,
      errores: agruparErroresPorCampo(validacion.error),
    }
  }

  const datos = validacion.data
  const transaccion = await transaccionRepository.crear({
    usuarioId,
    cuentaId: datos.cuentaId,
    categoriaId: datos.categoriaId,
    tipo: datos.tipo,
    monto: new Prisma.Decimal(datos.monto),
    fecha: new Date(`${datos.fecha}T00:00:00Z`),
    descripcion: datos.descripcion,
  })

  return { ok: true, transaccion: mapearTransaccion(transaccion) }
}

export interface FiltrosTransacciones {
  /** Fecha inicial AAAA-MM-DD, incluida. */
  desde?: string
  /** Fecha final AAAA-MM-DD, incluida. */
  hasta?: string
  tipo?: TipoMovimiento
  cuentaId?: string
}

export async function listarTransacciones(
  usuarioId: string,
  filtrosSinValidar: unknown = {}
): Promise<TransaccionItem[]> {
  const filtros: FiltrosTransacciones = esquemaFiltros.parse(filtrosSinValidar ?? {})
  const transacciones = await transaccionRepository.listar(usuarioId, {
    desde: filtros.desde ? new Date(`${filtros.desde}T00:00:00Z`) : undefined,
    hasta: filtros.hasta ? new Date(`${filtros.hasta}T00:00:00Z`) : undefined,
    tipo: filtros.tipo,
    cuentaId: filtros.cuentaId,
  })
  return transacciones.map(mapearTransaccion)
}
