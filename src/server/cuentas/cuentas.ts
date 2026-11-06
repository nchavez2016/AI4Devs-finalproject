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

interface Movimientos {
  ingresos: Prisma.Decimal
  gastos: Prisma.Decimal
}

/** Saldo actual = saldo inicial + ingresos − gastos (design e). */
export function calcularSaldo(
  saldoInicial: Prisma.Decimal,
  ingresos: Prisma.Decimal,
  gastos: Prisma.Decimal
): Prisma.Decimal {
  return saldoInicial.plus(ingresos).minus(gastos)
}

function mapearCuenta(
  c: {
    id: string
    nombre: string
    tipo: TipoCuenta
    saldoInicial: Prisma.Decimal
    creadoEn: Date
  },
  movimientos: Movimientos
): CuentaItem {
  return {
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    saldo: calcularSaldo(c.saldoInicial, movimientos.ingresos, movimientos.gastos).toFixed(2),
    creadoEn: c.creadoEn,
  }
}

async function movimientosPorCuenta(usuarioId: string): Promise<Map<string, Movimientos>> {
  const sumas = await cuentaRepository.sumasPorCuenta(usuarioId)
  const porCuenta = new Map<string, Movimientos>()

  for (const suma of sumas) {
    const actual = porCuenta.get(suma.cuentaId) ?? {
      ingresos: new Prisma.Decimal(0),
      gastos: new Prisma.Decimal(0),
    }
    const total = suma._sum.monto ?? new Prisma.Decimal(0)
    if (suma.tipo === 'INGRESO') {
      actual.ingresos = actual.ingresos.plus(total)
    } else {
      actual.gastos = actual.gastos.plus(total)
    }
    porCuenta.set(suma.cuentaId, actual)
  }

  return porCuenta
}

const SIN_MOVIMIENTOS: Movimientos = {
  ingresos: new Prisma.Decimal(0),
  gastos: new Prisma.Decimal(0),
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
    cuenta: mapearCuenta(cuenta, SIN_MOVIMIENTOS),
  }
}

export async function listarCuentas(usuarioId: string): Promise<CuentaItem[]> {
  const cuentas = await cuentaRepository.listar(usuarioId)
  const movimientos = await movimientosPorCuenta(usuarioId)
  return cuentas.map((c) => mapearCuenta(c, movimientos.get(c.id) ?? SIN_MOVIMIENTOS))
}

export async function obtenerCuenta(
  usuarioId: string,
  id: string
): Promise<CuentaItem | null> {
  const cuenta = await cuentaRepository.buscarPorId(usuarioId, id)
  if (!cuenta) {
    return null
  }

  const movimientos = await movimientosPorCuenta(usuarioId)
  return mapearCuenta(cuenta, movimientos.get(cuenta.id) ?? SIN_MOVIMIENTOS)
}
