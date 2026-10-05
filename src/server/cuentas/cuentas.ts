import { Prisma, TipoCuenta } from '@/generated/prisma/client'
import {
  cuentaRepository,
  NombreDuplicadoError,
} from '@/server/repositories/cuentaRepository'
import { agruparErroresPorCampo } from '@/server/validacion'
import { esquemaCrearCuenta } from './esquemas'

export interface CuentaItem {
  id: string
  nombre: string
  tipo: TipoCuenta
  saldo: string
  creadoEn: Date
}

export type ResultadoCrearCuenta =
  | {
      ok: true
      cuenta: CuentaItem
    }
  | {
      ok: false
      errores: Record<string, string[]>
    }

function mapearCuenta(c: {
  id: string
  nombre: string
  tipo: TipoCuenta
  saldoInicial: Prisma.Decimal
  creadoEn: Date
}): CuentaItem {
  return {
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    saldo: c.saldoInicial.toFixed(2),
    creadoEn: c.creadoEn,
  }
}

export async function crearCuenta(
  usuarioId: string,
  datosSinValidar: unknown
): Promise<ResultadoCrearCuenta> {
  const validacion = esquemaCrearCuenta.safeParse(datosSinValidar)
  if (!validacion.success) {
    return {
      ok: false,
      errores: agruparErroresPorCampo(validacion.error),
    }
  }

  const datos = validacion.data
  const saldoInicial = new Prisma.Decimal(datos.saldoInicial)

  let cuenta
  try {
    cuenta = await cuentaRepository.crear({
      usuarioId,
      nombre: datos.nombre,
      tipo: datos.tipo,
      saldoInicial,
    })
  } catch (error) {
    if (error instanceof NombreDuplicadoError) {
      return {
        ok: false,
        errores: { nombre: ['Ya tienes una cuenta con ese nombre'] },
      }
    }

    throw error
  }

  return {
    ok: true,
    cuenta: mapearCuenta(cuenta),
  }
}

export async function listarCuentas(usuarioId: string): Promise<CuentaItem[]> {
  const cuentas = await cuentaRepository.listar(usuarioId)
  return cuentas.map(mapearCuenta)
}

export async function obtenerCuenta(
  usuarioId: string,
  id: string
): Promise<CuentaItem | null> {
  const cuenta = await cuentaRepository.buscarPorId(usuarioId, id)
  if (!cuenta) {
    return null
  }

  return mapearCuenta(cuenta)
}
