import { cargarTransacciones } from '@/server/transacciones/pantalla'
import { ContenidoTransacciones } from './ContenidoTransacciones'

export default async function TransaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const datos = await cargarTransacciones(await searchParams)

  return <ContenidoTransacciones {...datos} />
}
