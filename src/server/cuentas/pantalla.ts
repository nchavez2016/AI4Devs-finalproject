import { exigirUsuarioId } from '@/server/auth/sesion'
import { listarCuentas, type CuentaItem } from './cuentas'

export interface DatosCuentas {
  cuentas: CuentaItem[]
}

export async function cargarCuentas(): Promise<DatosCuentas> {
  const usuarioId = await exigirUsuarioId()
  const cuentas = await listarCuentas(usuarioId)

  return { cuentas }
}
