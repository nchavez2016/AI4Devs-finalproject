import { cargarDashboard } from '@/server/dashboard/pantalla'
import { ContenidoPanel } from './ContenidoPanel'

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const datos = await cargarDashboard(await searchParams)

  return <ContenidoPanel {...datos} />
}
