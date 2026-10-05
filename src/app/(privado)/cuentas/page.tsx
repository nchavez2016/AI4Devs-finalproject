import { cargarCuentas } from '@/server/cuentas/pantalla'
import { ContenidoCuentas } from './ContenidoCuentas'

export default async function CuentasPage() {
  const datos = await cargarCuentas()

  return <ContenidoCuentas {...datos} />
}
