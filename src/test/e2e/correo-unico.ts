import { randomUUID } from 'node:crypto'

/** Correo único por ejecución, en un dominio reservado para pruebas (RFC 2606). */
export function correoUnico(): string {
  return `e2e-${Date.now()}-${randomUUID().slice(0, 8)}@e2e.cuadre.test`
}
