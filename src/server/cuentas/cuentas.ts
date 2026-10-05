import { Prisma, TipoCuenta } from '@/generated/prisma/client'
import { cuentaRepository } from '@/server/repositories/cuentaRepository'
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

  const cuenta = await cuentaRepository.crear({
    usuarioId,
    nombre: datos.nombre,
    tipo: datos.tipo,
    saldoInicial,
  })

  return {
    ok: true,
    cuenta: {
      id: cuenta.id,
      nombre: cuenta.nombre,
      tipo: cuenta.tipo,
      saldo: cuenta.saldoInicial.toFixed(2),
      creadoEn: cuenta.creadoEn,
    },
  }
}

export async function listarCuentas(usuarioId: string): Promise<CuentaItem[]> {
  const cuentas = await cuentaRepository.listar(usuarioId)
  return cuentas.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    saldo: c.saldoInicial.toFixed(2),
    creadoEn: c.creadoEn,
  }))
}
