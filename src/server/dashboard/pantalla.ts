import { auth } from '@/auth'
import { exigirUsuarioId } from '@/server/auth/sesion'
import { hoyEnEcuador } from '@/server/fechas'
import { transaccionRepository } from '@/server/repositories/transaccionRepository'
import { calcularResumen, type ResumenDashboard } from './dashboard'
import { esquemaParametrosDashboard } from './esquemas'
import type { Periodo } from './periodo'

export interface DatosDashboard {
  nombreNegocio: string
  periodo: Periodo
  /** Si el usuario tiene alguna transacción, en cualquier fecha (distingue los dos vacíos). */
  hayTransacciones: boolean
  resumen: ResumenDashboard
}

export async function cargarDashboard(parametrosDeUrl: unknown): Promise<DatosDashboard> {
  const usuarioId = await exigirUsuarioId()
  const session = await auth()
  const { periodo } = esquemaParametrosDashboard.parse(parametrosDeUrl ?? {})
  const hoy = hoyEnEcuador()

  const [resumen, hayTransacciones] = await Promise.all([
    calcularResumen(usuarioId, periodo, hoy),
    transaccionRepository.existeAlguna(usuarioId),
  ])

  return {
    nombreNegocio: session?.user?.nombreNegocio ?? '',
    periodo,
    hayTransacciones,
    resumen,
  }
}
