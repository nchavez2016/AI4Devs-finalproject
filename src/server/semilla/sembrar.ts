import { Prisma } from '@/generated/prisma/client'
import { hashear } from '@/server/auth/password'
import { semillaRepository } from '@/server/repositories/semillaRepository'
import { CUENTAS_REVISOR, REVISOR, movimientosRevisor } from './datos'

/**
 * Deja al usuario revisor con sus cuentas, categorías por defecto y movimientos de ejemplo.
 * `hoy` es el día de referencia (AAAA-MM-DD, Ecuador). Idempotente: repetirlo restablece
 * los mismos datos sin duplicar nada. Devuelve el id del revisor.
 */
export async function sembrar(hoy: string): Promise<string> {
  return semillaRepository.restablecerRevisor({
    nombre: REVISOR.nombre,
    nombreNegocio: REVISOR.nombreNegocio,
    email: REVISOR.email,
    passwordHash: await hashear(REVISOR.password),
    cuentas: CUENTAS_REVISOR.map((c) => ({ ...c, saldoInicial: new Prisma.Decimal(c.saldoInicial) })),
    movimientos: movimientosRevisor(hoy).map((m) => ({
      tipo: m.tipo,
      monto: new Prisma.Decimal(m.monto),
      fecha: new Date(`${m.fecha}T00:00:00Z`),
      cuenta: m.cuenta,
      categoria: m.categoria,
    })),
  })
}
