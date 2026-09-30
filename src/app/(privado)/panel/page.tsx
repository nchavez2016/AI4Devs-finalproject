import { cargarPanel } from '@/server/panel'
import { ContenidoPanel } from './ContenidoPanel'

export default async function PanelPage() {
  const datos = await cargarPanel()

  return <ContenidoPanel {...datos} />
}
